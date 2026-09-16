import { isLabCrawler } from "@/lib/labCrawler";

/**
 * Сбор статистики посещений: просмотры страниц, время на странице,
 * глубина скролла и клики по элементам с атрибутом data-track.
 *
 * События уходят пачками на /api/track.php. Куки не ставятся: посетитель
 * определяется на сервере по необратимому хэшу IP и User-Agent.
 */

const ENDPOINT = "/api/track.php";
const SESSION_KEY = "dh_session";
const REFERRER_KEY = "dh_referrer";
const UTM_KEY = "dh_utm_source";
const FLUSH_DELAY = 3000;
const MAX_QUEUE = 30;

type EventType = "pageview" | "click" | "duration" | "scroll" | "form";

type QueuedEvent = {
  type: EventType;
  path: string;
  label?: string;
  value?: number;
};

let queue: QueuedEvent[] = [];
let flushTimer: number | null = null;
let started = false;

/** Текущая страница и накопленное на ней активное время */
let currentPath = "";
let activeSince = 0;
let activeMs = 0;
let maxScroll = 0;

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function sessionId(): string {
  const store = storage();
  const existing = store?.getItem(SESSION_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

  store?.setItem(SESSION_KEY, id);

  return id;
}

/** Реферер и utm_source запоминаются один раз за сессию — на первом заходе */
function sessionOrigin(): { referrer: string; utmSource: string } {
  const store = storage();
  let referrer = store?.getItem(REFERRER_KEY);
  let utmSource = store?.getItem(UTM_KEY);

  if (referrer === null || referrer === undefined) {
    referrer = document.referrer || "";
    store?.setItem(REFERRER_KEY, referrer);
  }

  if (utmSource === null || utmSource === undefined) {
    utmSource = new URLSearchParams(window.location.search).get("utm_source") ?? "";
    store?.setItem(UTM_KEY, utmSource);
  }

  return { referrer, utmSource };
}

function isTrackable(path: string): boolean {
  return !path.startsWith("/admin");
}

function send(events: QueuedEvent[], useBeacon: boolean): void {
  if (events.length === 0 || isLabCrawler()) return;

  const { referrer, utmSource } = sessionOrigin();
  const payload = JSON.stringify({
    session: sessionId(),
    referrer,
    utmSource,
    events,
  });

  if (useBeacon && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon(ENDPOINT, blob)) return;
  }

  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // статистика не должна влиять на работу сайта
  });
}

function flush(useBeacon = false): void {
  if (flushTimer !== null) {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }

  const events = queue;
  queue = [];
  send(events, useBeacon);
}

function enqueue(event: QueuedEvent): void {
  if (!isTrackable(event.path)) return;

  queue.push(event);

  if (queue.length >= MAX_QUEUE) {
    flush();
    return;
  }

  if (flushTimer === null) {
    flushTimer = window.setTimeout(() => flush(), FLUSH_DELAY);
  }
}

function scrollPercent(): number {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  if (total <= 0) return 100;

  const percent = ((window.scrollY || doc.scrollTop || 0) / total) * 100;

  return Math.max(0, Math.min(100, Math.round(percent)));
}

function pauseTimer(): void {
  if (activeSince === 0) return;

  activeMs += Date.now() - activeSince;
  activeSince = 0;
}

function resumeTimer(): void {
  if (activeSince === 0) activeSince = Date.now();
}

/**
 * Отправляет накопленные метрики страницы: активное время и глубину скролла.
 * Вызывается при уходе со страницы и при сворачивании вкладки, поэтому время
 * может уйти несколькими отрезками — на сервере они суммируются по сессии.
 */
function flushPageMetrics(): void {
  if (!currentPath) return;

  pauseTimer();

  const seconds = Math.round(activeMs / 1000);
  if (seconds > 0) {
    enqueue({ type: "duration", path: currentPath, value: seconds });
  }
  if (maxScroll > 0) {
    enqueue({ type: "scroll", path: currentPath, value: maxScroll });
  }

  activeMs = 0;
  maxScroll = 0;
}

export function trackPageview(path: string): void {
  if (isLabCrawler()) return;
  if (path === currentPath) return;

  flushPageMetrics();

  currentPath = path;
  activeMs = 0;
  maxScroll = scrollPercent();
  if (document.visibilityState === "visible") resumeTimer();

  enqueue({ type: "pageview", path });
}

export function trackClick(label: string, path = currentPath): void {
  const clean = label.trim().slice(0, 80);
  if (!clean) return;

  enqueue({ type: "click", path: path || window.location.pathname, label: clean });
}

export function trackFormSubmit(label = "submit"): void {
  enqueue({
    type: "form",
    path: currentPath || window.location.pathname,
    label,
  });
  flush();
}

export function initAnalytics(): () => void {
  if (started || isLabCrawler()) return () => {};
  started = true;

  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const trackable = target.closest<HTMLElement>("[data-track]");
    const label = trackable?.dataset.track;
    if (label) trackClick(label);
  };

  const onScroll = () => {
    const percent = scrollPercent();
    if (percent > maxScroll) maxScroll = percent;
  };

  // Вкладку могут закрыть из свёрнутого состояния (частый случай на мобильных),
  // поэтому метрики отправляем уже при уходе из вкладки
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      flushPageMetrics();
      flush(true);
    } else {
      resumeTimer();
    }
  };

  const onHide = () => {
    flushPageMetrics();
    flush(true);
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onHide);

  return () => {
    started = false;
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onHide);
    flush(true);
  };
}
