import {
  parseContactPayload,
  parseTurnstileToken,
  sendContactToTelegram,
  verifyTurnstileToken,
} from "../server/sendContactToTelegram";

export const config = {
  runtime: "edge",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!token || !chatId || !turnstileSecret) {
    return json({ ok: false, error: "Server is not configured" }, 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const payload = parseContactPayload(body);
  if (!payload) {
    return json({ ok: false, error: "Name and contact are required" }, 400);
  }

  const turnstileToken = parseTurnstileToken(body);
  if (!turnstileToken) {
    return json({ ok: false, error: "Turnstile token missing" }, 400);
  }

  const remoteip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    undefined;

  const turnstileOk = await verifyTurnstileToken(
    turnstileToken,
    turnstileSecret,
    remoteip
  );
  if (!turnstileOk) {
    return json({ ok: false, error: "Turnstile verification failed" }, 403);
  }

  const result = await sendContactToTelegram(payload, { token, chatId });
  if (!result.ok) {
    return json({ ok: false, error: "Failed to deliver message" }, 502);
  }

  return json({ ok: true });
}
