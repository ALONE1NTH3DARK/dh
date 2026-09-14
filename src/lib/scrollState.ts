import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

const SCROLL_EASE = (t: number) => 1 - Math.pow(1 - t, 4);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollY(): number {
  return lenisRef.current?.scroll ?? window.scrollY;
}

function elementStopTop(el: HTMLElement, y: number): number {
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return Math.max(0, el.getBoundingClientRect().top + y - margin);
}

export function scrollToId(id: string) {
  const el = document.querySelector<HTMLElement>(id);
  if (!el) return;
  scrollToY(elementStopTop(el, scrollY()), 1.6);
}

export function scrollToY(y: number, duration = 1.15) {
  const top = Math.max(0, y);
  const immediate = duration <= 0 || prefersReducedMotion();
  if (lenisRef.current) {
    lenisRef.current.scrollTo(top, immediate ? { immediate: true } : { duration, easing: SCROLL_EASE });
    return;
  }
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}

function stopTops(ids: string[]): number[] {
  const y = scrollY();
  const fromIds = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);
  const els = fromIds.length
    ? fromIds
    : [...document.querySelectorAll<HTMLElement>("main section")];
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
