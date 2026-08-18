import { createHash, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Plugin } from "vite";

/**
 * Локальная копия PHP-аналитики (public/api/*.php) на node:sqlite.
 * Нужна только для разработки: на хостинге запросы обслуживает PHP.
 * Схема таблиц и SQL отчётов совпадают с public/api/lib/reports.php.
 */

const EVENT_TYPES = ["pageview", "click", "duration", "scroll", "form"];
const MAX_EVENTS_PER_REQUEST = 40;
const MAX_BODY_BYTES = 64 * 1024;
const SESSION_COOKIE = "dh_admin_dev";

type TrackEvent = {
  type?: unknown;
  path?: unknown;
  label?: unknown;
  value?: unknown;
};

type Range = { days: number; from: string; to: string };

const databases = new Map<string, DatabaseSync>();
const adminSessions = new Set<string>();

export function openDb(dbPath: string): DatabaseSync {
  const cached = databases.get(dbPath);
  if (cached) return cached;

  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  databases.set(dbPath, db);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      day TEXT NOT NULL,
      hour TEXT NOT NULL,
      type TEXT NOT NULL,
      visitor TEXT NOT NULL,
      session TEXT NOT NULL,
      path TEXT NOT NULL,
      label TEXT,
      value INTEGER,
      source TEXT,
      referrer TEXT,
      device TEXT,
      country TEXT
    )
  `);
  db.exec("CREATE INDEX IF NOT EXISTS idx_events_day ON events(day)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_events_type_day ON events(type, day)");

  return db;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("body_too_large"));
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    req.on("end", () => resolvePromise(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function dayInZone(date: Date, timeZone: string): { day: string; hour: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = get("hour") === "24" ? "00" : get("hour");

  return { day: `${get("year")}-${get("month")}-${get("day")}`, hour };
}

function shiftDay(day: string, offset: number): string {
  const shifted = new Date(`${day}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + offset);

  return shifted.toISOString().slice(0, 10);
}

function text(value: unknown, limit: number): string {
  if (typeof value !== "string") return "";

  return value.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, limit);
}

function normalizePath(input: string): string {
  const path = (input.split("?")[0] ?? "").split("#")[0] ?? "";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;

  return (trimmed || "/").slice(0, 180);
}

function detectDevice(ua: string): string {
  const value = ua.toLowerCase();
  if (/ipad|tablet|kindle/.test(value)) return "tablet";
  if (/mobi|iphone|android/.test(value)) return "mobile";

  return "desktop";
}

function detectSource(referrer: string, utmSource: string, selfHost: string): string {
  if (utmSource) return utmSource.toLowerCase().slice(0, 40);
  if (!referrer) return "direct";

  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }

  if (!host || host === selfHost || host === `www.${selfHost}`) return "direct";

  const known: Record<string, string> = {
    google: "google",
    yandex: "yandex",
    bing: "bing",
    duckduckgo: "duckduckgo",
    instagram: "instagram",
    "t.me": "telegram",
    telegram: "telegram",
    "wa.me": "whatsapp",
    whatsapp: "whatsapp",
    facebook: "facebook",
    youtube: "youtube",
    tiktok: "tiktok",
    "vk.com": "vk",
    linkedin: "linkedin",
    "mail.ru": "mail.ru",
  };

  for (const [needle, label] of Object.entries(known)) {
    if (host.includes(needle)) return label;
  }

  return host.replace(/^www\./, "");
}

function isBot(ua: string): boolean {
  const value = ua.toLowerCase();
  if (!value) return true;

  return /bot|crawl|spider|slurp|headless|phantom|lighthouse|pagespeed|monitor|curl|wget/.test(
    value
  );
}

function visitorId(req: IncomingMessage, salt: string): string {
  const ip = req.socket.remoteAddress ?? "";
  const ua = String(req.headers["user-agent"] ?? "");

  return createHash("sha256").update(`${salt}|${ip}|${ua}`).digest("hex").slice(0, 16);
}

function buildRange(days: number, timeZone: string): Range {
  const safeDays = Math.max(1, Math.min(90, days));
  const to = dayInZone(new Date(), timeZone).day;

  return { days: safeDays, from: shiftDay(to, -(safeDays - 1)), to };
}

function query<T = Record<string, unknown>>(
  database: DatabaseSync,
  sql: string,
  range: Range
): T[] {
  return database.prepare(sql).all(range.from, range.to) as T[];
}

function num(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0) || 0;
}

export function buildReport(database: DatabaseSync, days: number, timeZone: string) {
  const range = buildRange(days, timeZone);

  const base =
    query(
      database,
      `SELECT
         COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS pageviews,
         COUNT(DISTINCT visitor) AS visitors,
         COUNT(DISTINCT session) AS sessions,
         COUNT(CASE WHEN type = 'form' AND label = 'submit' THEN 1 END) AS leads,
         COUNT(CASE WHEN type = 'click' THEN 1 END) AS clicks
       FROM events
       WHERE day BETWEEN ? AND ?`,
      range
    )[0] ?? {};

  const time =
    query(
      database,
      `SELECT COALESCE(SUM(value), 0) AS total_seconds, COUNT(DISTINCT session) AS timed_sessions
       FROM events
       WHERE type = 'duration' AND day BETWEEN ? AND ?`,
      range
    )[0] ?? {};

  const bounce =
    query(
      database,
      `SELECT COUNT(*) AS sessions, COUNT(CASE WHEN views = 1 THEN 1 END) AS single_view
       FROM (
         SELECT session, COUNT(*) AS views
         FROM events
         WHERE type = 'pageview' AND day BETWEEN ? AND ?
         GROUP BY session
       )`,
      range
    )[0] ?? {};

  const sessions = num(base.sessions);
  const timedSessions = num(time.timed_sessions);
  const bounceSessions = num(bounce.sessions);
  const leads = num(base.leads);

  const pageViews = query(
    database,
    `SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
     FROM events
     WHERE type = 'pageview' AND day BETWEEN ? AND ?
     GROUP BY path
     ORDER BY views DESC
     LIMIT 40`,
    range
  );

  // Время приходит отрезками: складываем их и делим на число сессий
  const durations = new Map<string, number>();
  for (const row of query(
    database,
    `SELECT path, SUM(value) AS total, COUNT(DISTINCT session) AS sessions
     FROM events
     WHERE type = 'duration' AND day BETWEEN ? AND ?
     GROUP BY path`,
    range
  )) {
    const sessionCount = num(row.sessions);
    durations.set(
      String(row.path),
      sessionCount > 0 ? Math.round(num(row.total) / sessionCount) : 0
    );
  }

  // Глубина скролла: максимум за сессию, затем среднее по сессиям
  const scrolls = new Map<string, number>();
  for (const row of query(
    database,
    `SELECT path, AVG(best) AS avg_scroll FROM (
       SELECT path, session, MAX(value) AS best
       FROM events
       WHERE type = 'scroll' AND day BETWEEN ? AND ?
       GROUP BY path, session
     ) GROUP BY path`,
    range
  )) {
    scrolls.set(String(row.path), Math.round(num(row.avg_scroll)));
  }

  const clicks = query(
    database,
    `SELECT label, path, COUNT(*) AS clicks, COUNT(DISTINCT visitor) AS visitors
     FROM events
     WHERE type = 'click' AND label IS NOT NULL AND label != '' AND day BETWEEN ? AND ?
     GROUP BY label, path
     ORDER BY clicks DESC
     LIMIT 40`,
    range
  );

  const breakdown = (column: "source" | "device" | "country") =>
    query(
      database,
      `SELECT COALESCE(NULLIF(${column}, ''), '—') AS name,
              COUNT(*) AS views,
              COUNT(DISTINCT visitor) AS visitors
       FROM events
       WHERE type = 'pageview' AND day BETWEEN ? AND ?
       GROUP BY name
       ORDER BY views DESC
       LIMIT 20`,
      range
    ).map((row) => ({
      name: String(row.name ?? "—"),
      views: num(row.views),
      visitors: num(row.visitors),
    }));

  const hourly = range.days === 1;
  const buckets = new Map<string, { views: number; visitors: number }>();
  for (const row of query(
    database,
    hourly
      ? `SELECT hour AS bucket,
                COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS views,
                COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE day BETWEEN ? AND ? GROUP BY hour`
      : `SELECT day AS bucket,
                COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS views,
                COUNT(DISTINCT visitor) AS visitors
         FROM events WHERE day BETWEEN ? AND ? GROUP BY day`,
    range
  )) {
    buckets.set(String(row.bucket), {
      views: num(row.views),
      visitors: num(row.visitors),
    });
  }

  const timeline: { bucket: string; label: string; views: number; visitors: number }[] = [];

  if (hourly) {
    for (let hour = 0; hour < 24; hour++) {
      const key = String(hour).padStart(2, "0");
      timeline.push({
        bucket: key,
        label: `${key}:00`,
        views: buckets.get(key)?.views ?? 0,
        visitors: buckets.get(key)?.visitors ?? 0,
      });
    }
  } else {
    let cursor = range.from;
    while (cursor <= range.to) {
      const [, month, day] = cursor.split("-");
      timeline.push({
        bucket: cursor,
        label: `${day}.${month}`,
        views: buckets.get(cursor)?.views ?? 0,
        visitors: buckets.get(cursor)?.visitors ?? 0,
      });
      cursor = shiftDay(cursor, 1);
    }
  }

  return {
    ok: true,
    range,
    totals: {
      pageviews: num(base.pageviews),
      visitors: num(base.visitors),
      sessions,
      clicks: num(base.clicks),
      leads,
      avgSessionSeconds:
        timedSessions > 0 ? Math.round(num(time.total_seconds) / timedSessions) : 0,
      bounceRate:
        bounceSessions > 0
          ? Math.round((num(bounce.single_view) / bounceSessions) * 1000) / 10
          : 0,
      conversionRate: sessions > 0 ? Math.round((leads / sessions) * 1000) / 10 : 0,
    },
    timeline,
    pages: pageViews.map((row) => {
      const path = String(row.path ?? "/");

      return {
        path,
        views: num(row.views),
        visitors: num(row.visitors),
        avgSeconds: durations.get(path) ?? 0,
        avgScroll: scrolls.get(path) ?? 0,
      };
    }),
    clicks: clicks.map((row) => ({
      label: String(row.label ?? ""),
      path: String(row.path ?? "/"),
      clicks: num(row.clicks),
      visitors: num(row.visitors),
    })),
    sources: breakdown("source"),
    devices: breakdown("device"),
    countries: breakdown("country"),
  };
}

function readCookie(req: IncomingMessage, name: string): string {
  const header = req.headers.cookie ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }

  return "";
}

export function analyticsDevApi(env: Record<string, string>): Plugin {
  const timeZone = env.ANALYTICS_TIMEZONE || "Asia/Almaty";
  const password = env.ADMIN_PASSWORD || "admin";
  const salt = env.ANALYTICS_HASH_SALT || "darkhorse-dev";
  const dbPath = resolve(process.cwd(), ".analytics-dev/analytics.sqlite");

  return {
    name: "analytics-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        const route = url.replace(/\.php$/, "");

        if (!["/api/track", "/api/stats", "/api/admin-session"].includes(route)) {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        const database = openDb(dbPath);
        const isAuthed = adminSessions.has(readCookie(req, SESSION_COOKIE));

        if (route === "/api/admin-session") {
          if (req.method === "GET") {
            sendJson(res, 200, { ok: true, authenticated: isAuthed, configured: true });
            return;
          }

          const body = JSON.parse((await readBody(req).catch(() => "{}")) || "{}");

          if (body.action === "logout") {
            adminSessions.delete(readCookie(req, SESSION_COOKIE));
            res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`);
            sendJson(res, 200, { ok: true, authenticated: false });
            return;
          }

          if (String(body.password ?? "") !== password) {
            sendJson(res, 401, { ok: false, error: "invalid_password" });
            return;
          }

          const token = randomUUID();
          adminSessions.add(token);
          res.setHeader(
            "Set-Cookie",
            `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`
          );
          sendJson(res, 200, { ok: true, authenticated: true });
          return;
        }

        if (route === "/api/stats") {
          if (!isAuthed) {
            sendJson(res, 401, { ok: false, error: "unauthorized" });
            return;
          }

          const days = Number(new URL(req.url ?? "", "http://localhost").searchParams.get("days"));
          sendJson(res, 200, buildReport(database, [1, 7, 30].includes(days) ? days : 7, timeZone));
          return;
        }

        // /api/track
        if (req.method !== "POST") {
          sendJson(res, 405, { ok: false, error: "Method not allowed" });
          return;
        }

        const ua = String(req.headers["user-agent"] ?? "");
        if (isBot(ua)) {
          res.statusCode = 204;
          res.end();
          return;
        }

        try {
          const body = JSON.parse((await readBody(req)) || "{}");
          const events: TrackEvent[] = Array.isArray(body.events)
            ? body.events.slice(0, MAX_EVENTS_PER_REQUEST)
            : [];

          const visitor = visitorId(req, salt);
          const now = Math.floor(Date.now() / 1000);
          const { day, hour } = dayInZone(new Date(), timeZone);
          const referrer = text(body.referrer, 300);
          const source = detectSource(
            referrer,
            text(body.utmSource, 40),
            String(req.headers.host ?? "").split(":")[0] ?? ""
          );
          const insert = database.prepare(
            `INSERT INTO events
              (ts, day, hour, type, visitor, session, path, label, value, source, referrer, device, country)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          );

          for (const event of events) {
            const type = text(event.type, 20);
            if (!EVENT_TYPES.includes(type)) continue;

            const path = normalizePath(String(event.path ?? "/"));
            if (path.startsWith("/admin")) continue;

            let value: number | null = null;
            if (typeof event.value === "number" && Number.isFinite(event.value)) {
              const rounded = Math.round(event.value);
              value =
                type === "duration"
                  ? Math.max(0, Math.min(3600, rounded))
                  : type === "scroll"
                    ? Math.max(0, Math.min(100, rounded))
                    : Math.max(0, rounded);
            }

            if ((type === "duration" || type === "scroll") && (value === null || value <= 0)) {
              continue;
            }

            insert.run(
              now,
              day,
              hour,
              type,
              visitor,
              text(body.session, 40) || visitor,
              path,
              text(event.label, 80) || null,
              value,
              source,
              referrer || null,
              detectDevice(ua),
              // Локально страна недоступна — на хостинге её отдаёт PHP
              null
            );
          }
        } catch {
          // аналитика не должна ломать дев-сервер
        }

        res.statusCode = 204;
        res.end();
      });
    },
  };
}
