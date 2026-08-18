const ENDPOINTS = ["/api/contact.php", "/api/contact"] as const;

export type ContactPayload = {
  name: string;
  contact: string;
  project: string;
  message: string;
  turnstileToken: string;
};

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isApiEnvelope(body: unknown): body is { ok: boolean } {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { ok?: unknown }).ok === "boolean"
  );
}

/** PHP hosting answers first; Vercel/static PHP falls through to /api/contact. */
export async function submitContact(payload: ContactPayload): Promise<boolean> {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = parseJson(await res.text());

      if (!isApiEnvelope(body)) continue;
      if (body.ok && res.ok) return true;

      // Real handler rejected the request (validation, captcha, Telegram).
      // Do not retry: Turnstile tokens are single-use.
      return false;
    } catch {
      continue;
    }
  }

  return false;
}
