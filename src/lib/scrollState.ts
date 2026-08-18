import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToId(id: string) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(id, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

/** 100svh in px. Stable when the mobile URL bar shows/hides (unlike innerHeight / 100dvh). */
export function readSvh(): number {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;top:0;height:100svh;width:0;pointer-events:none;visibility:hidden";
  document.documentElement.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h || window.innerHeight;
}
