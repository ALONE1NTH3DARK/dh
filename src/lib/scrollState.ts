import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToId(id: string) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(id, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
}
