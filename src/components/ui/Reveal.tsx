import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  armReveal,
  onEnter,
  playReveal,
  prefersReducedMotion,
  skipReveal,
  type RevealFrom,
} from "@/lib/reveal";

/** SSR рендерит статику без эффектов — layout-эффект берём только в браузере. */
const useArmEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  as: Tag = "div",
  solid = false,
  from,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Чтобы обёртка не ломала семантику разметки: article, li, blockquote. */
  as?: "div" | "article" | "li" | "blockquote";
  /** Ехать единым блоком, без каскада по детям: длинные тексты, галереи. */
  solid?: boolean;
  /** Откуда приезжает блок. Заголовки внутри всё равно выходят из маски. */
  from?: RevealFrom;
}) {
  const ref = useRef<HTMLElement>(null);

  useArmEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      skipReveal(el);
      return;
    }

    armReveal(el);
    let tl: ReturnType<typeof playReveal> | null = null;
    const stop = onEnter(el, () => {
      tl = playReveal(el, delay);
    });

    return () => {
      stop();
      tl?.kill();
    };
  }, [delay, from, solid]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal-root
      data-reveal={solid ? "self" : undefined}
      data-reveal-from={from}
      style={style}
      className={cn(from === "fold" && "[perspective:1100px]", className)}
    >
      {children}
    </Tag>
  );
}
