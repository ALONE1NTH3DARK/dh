import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** По центру (как у «Что вы получаете») */
  center?: boolean;
  /** Цвет линии перед текстом */
  lineClassName?: string;
};

/** Единый лейбл секции: линия + mono 14px */
export default function SectionLabel({
  children,
  className,
  center = false,
  lineClassName = "bg-vio",
}: Props) {
  if (center) {
    // Линия абсолютно слева — текст остаётся строго по центру контейнера
    return (
      <p
        data-reveal="plain"
        className={cn(
          "relative mx-auto mb-4 w-fit max-w-full text-pretty text-center font-mono text-[13px] uppercase tracking-[1.4px] text-mute/90 sm:text-[14px] sm:tracking-[2px]",
          className
        )}
      >
        <span
          data-reveal-line="right"
          className={cn(
            "absolute top-1/2 right-full mr-3 h-px w-9 -translate-y-1/2",
            lineClassName
          )}
          aria-hidden
        />
        {children}
      </p>
    );
  }

  return (
    <p
      data-reveal="plain"
      className={cn(
        "mb-4 flex max-w-full min-w-0 items-center gap-3 font-mono text-[13px] uppercase tracking-[1.4px] text-mute/90 sm:text-[14px] sm:tracking-[2px]",
        className
      )}
    >
      <span data-reveal-line className={cn("h-px w-9 shrink-0", lineClassName)} aria-hidden />
      {children}
    </p>
  );
}
