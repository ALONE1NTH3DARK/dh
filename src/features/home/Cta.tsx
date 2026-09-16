import { useT } from "@/i18n/useT";
import { scrollToId } from "@/lib/scrollState";
import Reveal from "@/components/ui/Reveal";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Cta() {
  const t = useT();

  return (
    <section id="cta" className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="dual" grid />

      <div className="relative mx-auto max-w-[900px] text-center">
        <Reveal>
          <SectionLabel center className="mb-8">
            {t.cta.label}
          </SectionLabel>
          <h2 className="font-display text-[clamp(2.55rem,7vw,5.4rem)] font-semibold uppercase leading-[1.20] text-pretty">
            {t.cta.title1}
            <br />
            <span className="text-stroke">{t.cta.titleStroke}</span>{" "}
            <span className="text-gradient-neon">{t.cta.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            {t.cta.text}
          </p>
        </Reveal>

        <Reveal delay={0.12} from="fold" className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToId("#contact")}
            data-track="Финал — Оставить заявку"
            className="group flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_50px_rgba(124,108,255,0.5)]"
          >
            {t.cta.apply}
          </button>
          <button
            onClick={() => scrollToId("#portfolio")}
            data-track="Финал — Ещё раз к работам"
            className="rounded-full border border-white/15 px-8 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-white/50 hover:bg-white/5"
          >
            {t.cta.again}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
