import { HeartHandshake } from "lucide-react";
import { useT } from "@/i18n/useT";
import Reveal from "@/components/ui/Reveal";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionInner from "@/components/ui/SectionInner";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Process() {
  const t = useT();
  const steps = t.process.steps;

  return (
    <section id="process" className="relative overflow-hidden border-b border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="pink" dots />

      <SectionInner>
        <Reveal className="mb-12 flex flex-col items-center text-center md:mb-16 md:items-start md:text-left">
          <SectionLabel>{t.process.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            {t.process.titleBefore}
            <span className="text-gradient-neon">{t.process.titleAccent}</span>
          </h2>
        </Reveal>

        <div className="relative">
          <Reveal
            solid
            from="fade"
            className="pointer-events-none absolute left-0 top-5 h-px w-full"
          >
            <span
              data-reveal-line
              className="hidden h-px w-full origin-left bg-gradient-to-r from-vio/50 via-white/10 to-pink-neon/50 xl:block"
            />
          </Reveal>
          <Reveal from="left">
            <div data-reveal-group className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio md:hidden">
                {s.num}
              </p>
              <span
                data-reveal-pop
                className="relative z-10 mb-7 hidden size-11 place-items-center rounded-full border border-vio/40 bg-void font-mono text-[11px] text-vio shadow-[0_0_20px_rgba(124,108,255,0.18)] md:grid"
              >
                {s.num}
              </span>
              <h3 className="mt-2 font-display text-sm font-medium uppercase tracking-wide text-ink md:mt-0 md:text-base">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute md:mt-2.5">{s.text}</p>
            </div>
          ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="mt-12 flex justify-center">
          <p className="inline-flex max-w-full items-start gap-2.5 rounded-full border border-white/15 px-4 py-2.5 text-[17px] leading-snug text-mute sm:items-center sm:gap-3 sm:px-6 sm:py-3 sm:leading-none">
            <HeartHandshake className="mt-0.5 size-3.5 shrink-0 text-amber-neon sm:mt-0 sm:size-4" strokeWidth={1.75} aria-hidden />
            <span className="min-w-0 text-pretty">{t.process.footer}</span>
          </p>
        </Reveal>
      </SectionInner>
    </section>
  );
}
