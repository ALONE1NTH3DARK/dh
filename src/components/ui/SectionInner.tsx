import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function SectionInner({
  children,
  className,
  width = "page",
}: {
  children: ReactNode;
  className?: string;
  width?: "page" | "wide";
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        width === "wide" ? "max-w-[1600px]" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
