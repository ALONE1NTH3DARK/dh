import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

function HorseshoeIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="64"
      height="64"
      className={className}
      aria-hidden
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 8v8l-3 1l-3.09-5.5c-.26-.46-.99-.23-.91.31L14 21L4 17l1.15-8.06A6.92 6.92 0 0 1 12 3h8l-1.58 2.37C19.36 5.88 20 6.86 20 8"
      />
    </svg>
  );
}

type BrandMarkProps = {
  className?: string;
  /** Вкл. вращение 360° и glow при hover родителя `.group` */
  interactive?: boolean;
};

/** Логотип-марка: подкова на лаймовом градиенте */
export default function BrandMark({ className, interactive = false }: BrandMarkProps) {
  return (
    <span className={cn("relative grid size-8 place-items-center", className)}>
      {interactive && (
        <span
          aria-hidden
          className="absolute inset-[-2px] rounded-xl bg-[#AF5]/60 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 group-hover:blur-lg"
        />
      )}
      <span
        className={cn(
          "relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#AF5] via-[#9ef07a] to-[#5fe3ff]",
          interactive &&
            "transition-transform duration-500 ease-in-out group-hover:rotate-[360deg]"
        )}
      >
        <HorseshoeIcon className="size-6 text-[#06040a]" />
      </span>
    </span>
  );
}
