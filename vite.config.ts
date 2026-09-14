import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { analyticsDevApi } from "./server/analyticsDevApi";
import {
  parseContactPayload,
  parseTurnstileToken,
  sendContactToTelegram,
  verifyTurnstileToken,
} from "./server/sendContactToTelegram";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function contactApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "contact-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0] ?? "";
        if (path !== "/api/contact" && path !== "/api/contact.php") {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
          return;
        }

        const token = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;
        const turnstileSecret = env.TURNSTILE_SECRET_KEY;

        if (!token || !chatId || !turnstileSecret) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Server is not configured" }));
          return;
        }

        try {
          const raw = await readBody(req);
          const body = JSON.parse(raw);
          const payload = parseContactPayload(body);
          const turnstileToken = parseTurnstileToken(body);

          if (!payload) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ ok: false, error: "Name and contact are required" })
            );
            return;
          }

          if (!turnstileToken) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Turnstile token missing" }));
            return;
          }

          const remoteip =
            (typeof req.headers["x-forwarded-for"] === "string"
              ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
              : undefined) || req.socket.remoteAddress;

          const turnstileOk = await verifyTurnstileToken(
            turnstileToken,
            turnstileSecret,
            remoteip
          );

          if (!turnstileOk) {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ ok: false, error: "Turnstile verification failed" })
            );
            return;
          }

          const result = await sendContactToTelegram(payload, { token, chatId });

          if (!result.ok) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Failed to deliver message" }));
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), contactApiPlugin(env), analyticsDevApi(env)],
    appType: "spa",
    ssr: {
      noExternal: ["react-router", "react-router-dom", "framer-motion", "lenis"],
    },
  };
});
