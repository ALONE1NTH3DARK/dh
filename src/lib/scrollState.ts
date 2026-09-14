import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

const SCROLL_EASE = (t: number) => 1 - Math.pow(1 - t, 4);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Lenis only on the homepage; ignore a leftover instance after leaving `/`. */
function activeLenis(): Lenis | null {
  const lenis = lenisRef.current;
  if (!lenis) return null;
  if (!document.documentElement.classList.contains("lenis")) {
    lenisRef.current = null;
    return null;
  }
  return lenis;
}

export function scrollY(): number {
  return activeLenis()?.scroll ?? window.scrollY;
}

function elementStopTop(el: HTMLElement, y: number): number {
  return Math.max(0, el.getBoundingClientRect().top + y);
}

export function scrollToId(id: string) {
  const el = document.querySelector<HTMLElement>(id);
  if (!el) return;
  scrollToY(elementStopTop(el, scrollY()), 1.6);
}

export function scrollToY(y: number, duration = 1.15) {
  const top = Math.max(0, y);
  const immediate = duration <= 0 || prefersReducedMotion();
  const lenis = activeLenis();
  if (lenis) {
    lenis.scrollTo(top, immediate ? { immediate: true } : { duration, easing: SCROLL_EASE });
    return;
  }
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

const SKIP_HOP_IDS = new Set(["digital-card"]);

function isHopSection(el: HTMLElement): boolean {
  if (el.dataset.skipHop != null) return false;
  if (SKIP_HOP_IDS.has(el.id)) return false;
  if (el.getBoundingClientRect().height < 120) return false;
  return true;
}

function stopTops(ids: string[]): number[] {
  const y = scrollY();
  const named = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);
  const sections = [...document.querySelectorAll<HTMLElement>("main section")];
  const seen = new Set<HTMLElement>();
  const els: HTMLElement[] = [];
  for (const el of [...named, ...sections]) {
    if (seen.has(el) || !isHopSection(el)) continue;
    seen.add(el);
    els.push(el);
  }
  const tops = els
    .map((el) => elementStopTop(el, y))
    .filter((top) => Number.isFinite(top))
    .sort((a, b) => a - b);
  const unique = [0];
  for (const top of tops) {
    if (top - unique[unique.length - 1] > 48) unique.push(top);
  }
  return unique;
}

/** Предыдущая крупная секция относительно fromY (или 0 — первый экран). */
export function prevSectionTop(fromY: number, ids: string[]): number {
  const tops = stopTops(ids);
  let current = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= fromY + 8) current = i;
  }
  const currentTop = tops[current] ?? 0;
  if (fromY - currentTop > 80) return currentTop;
  return current <= 0 ? 0 : tops[current - 1];
}

/** 100svh in px. Stable when the mobile URL bar shows/hides (unlike innerHeight / 100dvh). */
let svhPx = 0;

export function readSvh(): number {
  if (typeof document === "undefined") return 0;
  if (svhPx) return svhPx;

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;top:0;height:100svh;width:0;pointer-events:none;visibility:hidden";
  document.documentElement.appendChild(probe);
  svhPx = probe.getBoundingClientRect().height || window.innerHeight;
  probe.remove();
  return svhPx;
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    svhPx = 0;
  });
}
