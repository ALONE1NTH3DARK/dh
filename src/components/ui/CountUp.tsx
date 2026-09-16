import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { onEnter, prefersReducedMotion } from "@/lib/reveal";

const useArmEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Цифра досчитывается при входе в кадр. В разметку сразу пишем конечное
 * значение — предрендер и поиск видят число, а не ноль.
 */
export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
  delay = 0.25,
  className = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = (n: number) => `${n.toFixed(decimals)}${suffix}`;

  useArmEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const state = { n: 0 };
    el.textContent = text(0);

    let tween: gsap.core.Tween | null = null;
    const stop = onEnter(el, () => {
      tween = gsap.to(state, {
        n: value,
        duration: 1.5,
        delay,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = text(state.n);
        },
      });
    });

    return () => {
      stop();
      tween?.kill();
      el.textContent = text(value);
    };
  }, [value, decimals, suffix, delay]);

  return (
    <span ref={ref} className={className}>
      {text(value)}
    </span>
  );
}
