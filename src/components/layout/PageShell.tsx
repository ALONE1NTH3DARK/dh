import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import BackToTop from "@/components/layout/BackToTop";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

export default function PageShell({
  variant = "home",
  backToTop,
  backToTopKey,
  className,
  wash,
  children,
}: {
  variant?: "home" | "project";
  backToTop?: string | boolean;
  backToTopKey?: string;
  className?: string;
  wash?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative bg-void font-body text-ink", className)}>
      {wash}
      <Nav variant={variant} />
      {children}
      <Footer />
      {backToTop ? (
        <BackToTop
          key={backToTopKey}
          track={typeof backToTop === "string" ? backToTop : undefined}
        />
      ) : null}
    </div>
  );
}
