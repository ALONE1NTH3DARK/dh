export type ContactPayload = {
  name: string;
  contact: string;
  project: string;
  message: string;
};

export const CONTACT_MAX_BODY = 16 * 1024;
export const CONTACT_MAX_NAME = 100;
export const CONTACT_MAX_CONTACT = 100;
export const CONTACT_MAX_PROJECT = 80;
export const CONTACT_MAX_MESSAGE = 2000;
export const CONTACT_RATE_MAX = 5;
export const CONTACT_RATE_WINDOW_MS = 60 * 60 * 1000;

const TURNSTILE_HOSTS = new Set([
  "darkhorse.kz",
  "www.darkhorse.kz",
  "localhost",
  "127.0.0.1",
]);

const contactHits = new Map<string, number[]>();

export function allowContactIpRate(ip: string): boolean {
  const key = ip || "unknown";
  const now = Date.now();
  const prev = (contactHits.get(key) ?? []).filter((stamp) => now - stamp < CONTACT_RATE_WINDOW_MS);
  if (prev.length >= CONTACT_RATE_MAX) {
    contactHits.set(key, prev);
    return false;
  }
  prev.push(now);
  contactHits.set(key, prev);
  return true;
}

export function isAllowedTurnstileHostname(hostname: string | undefined): boolean {
  if (!hostname) return false;
  return TURNSTILE_HOSTS.has(hostname.toLowerCase().split(":")[0] ?? "");
}

export function buildContactMessage(payload: ContactPayload): string {
  return [
    "🆕 Новая заявка с сайта",
    `Имя: ${payload.name || "—"}`,
    `Телефон / Telegram: ${payload.contact || "—"}`,
    `Ответить: ${payload.project || "—"}`,
    `О задаче: ${payload.message || "—"}`,
  ].join("\n");
}

export async function sendContactToTelegram(
  payload: ContactPayload,
  env: { token: string; chatId: string }
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const response = await fetch(
    `https://api.telegram.org/bot${env.token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.chatId,
        text: buildContactMessage(payload),
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, status: response.status, detail };
  }

  return { ok: true };
}

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteip?: string
): Promise<boolean> {
  if (!token || !secret) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  if (!response.ok) return false;

  const result = (await response.json()) as { success?: boolean; hostname?: string };
  return Boolean(result.success) && isAllowedTurnstileHostname(result.hostname);
}

export function parseContactPayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const contact = String(data.contact ?? "").trim();
  const project = String(data.project ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name || !contact) return null;
  if (
    name.length > CONTACT_MAX_NAME ||
    contact.length > CONTACT_MAX_CONTACT ||
    project.length > CONTACT_MAX_PROJECT ||
    message.length > CONTACT_MAX_MESSAGE
  ) {
    return null;
  }

  return { name, contact, project, message };
}

export function parseTurnstileToken(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const data = body as Record<string, unknown>;
  return String(data.turnstileToken ?? data["cf-turnstile-response"] ?? "").trim();
}
