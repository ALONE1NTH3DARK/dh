import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { analyticsDevApi } from "./server/analyticsDevApi";
import {
  allowContactIpRate,
  CONTACT_MAX_BODY,
  parseContactPayload,
  parseTurnstileToken,
  sendContactToTelegram,
  verifyTurnstileToken,
} from "./server/sendContactToTelegram";

function readBody(req: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > maxBytes) {
        req.destroy();
        reject(new Error("too large"));
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
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

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          send(405, { ok: false, error: "Method not allowed" });
          return;
        }

        const token = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;
        const turnstileSecret = env.TURNSTILE_SECRET_KEY;

        if (!token || !chatId || !turnstileSecret) {
          send(500, { ok: false, error: "Server is not configured" });
          return;
        }

        try {
          const raw = await readBody(req, CONTACT_MAX_BODY);
          const body = JSON.parse(raw);
          const payload = parseContactPayload(body);
          const turnstileToken = parseTurnstileToken(body);

          if (!payload) {
            send(400, { ok: false, error: "Name and contact are required" });
            return;
          }

          if (!turnstileToken) {
            send(400, { ok: false, error: "Turnstile token missing" });
            return;
          }

          const forwardedCf = req.headers["cf-connecting-ip"];
          const remoteip =
            (typeof forwardedCf === "string" ? forwardedCf.split(",")[0]?.trim() : undefined) ||
            req.socket.remoteAddress;

          const turnstileOk = await verifyTurnstileToken(
            turnstileToken,
            turnstileSecret,
            remoteip
          );

          if (!turnstileOk) {
            send(403, { ok: false, error: "Turnstile verification failed" });
            return;
          }

          if (!allowContactIpRate(remoteip || "unknown")) {
            send(429, { ok: false, error: "Too many requests" });
            return;
          }

          const result = await sendContactToTelegram(payload, { token, chatId });

          if (!result.ok) {
            send(502, { ok: false, error: "Failed to deliver message" });
            return;
          }

          send(200, { ok: true });
        } catch (error) {
          if (error instanceof Error && error.message === "too large") {
            send(413, { ok: false, error: "Payload too large" });
            return;
          }
          send(400, { ok: false, error: "Invalid JSON" });
        }
      });
    },
  };
}

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), contactApiPlugin(env), analyticsDevApi(env)],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
    appType: "spa",
    ssr: {
      noExternal: ["react-router", "react-router-dom", "framer-motion", "lenis"],
    },
  };
});
