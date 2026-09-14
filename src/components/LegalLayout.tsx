import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useT } from "../i18n/useT";
import Nav from "./Nav";
import Footer from "./Footer";
import SectionAtmosphere from "./SectionAtmosphere";
import SectionLabel from "./SectionLabel";

const BACK =
  "group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] md:px-5";

export default function LegalLayout({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  const t = useT();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-void font-body text-ink">
      <Nav variant="project" />

      <main className="relative z-10">
        <section className="relative overflow-hidden pt-28 md:pt-32">
          <SectionAtmosphere tone="mist" />

          <div className="relative mx-auto w-full max-w-[1040px] px-5 pb-24 md:px-10 md:pb-32">
            <Link to="/" className={BACK}>
              <ArrowLeft
                className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
                strokeWidth={1.75}
              />
              {t.legal.back}
            </Link>

            <SectionLabel>{label}</SectionLabel>
            <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.4rem)] font-semibold uppercase leading-[1.20] text-pretty">
              {title}
            </h1>

            <div className="mt-10 space-y-8 text-[17px] leading-relaxed text-mute">
              {children}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
