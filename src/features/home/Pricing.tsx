import { Check, Clock3 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionLabel from "@/components/ui/SectionLabel";
import { useT } from "@/i18n/useT";
import { scrollToId } from "@/lib/scrollState";

export default function Pricing() {
  const t = useT();

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="dual" />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="mb-12 text-center md:mb-16">
          <SectionLabel center>{t.pricing.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            {t.pricing.titleBefore}<span className="text-gradient-neon">{t.pricing.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-mute md:text-base">
            {t.pricing.subtitle}
          </p>
        </Reveal>

        <Reveal from="left">
        <div data-reveal-group className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...t.pricing.plans].map((plan, i) => {
            const popular = i === 1;
            return (
              <div
                key={plan.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-void-2 p-6 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)]"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-cyan-neon" />
                    <span className="font-mono text-[14px] uppercase tracking-[2px] text-mute">
                      {plan.time}
                    </span>
                  </div>
                  {popular && (
                    <span
                      data-reveal-pop
                      className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-void"
                    >
                      {t.pricing.popular}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-medium uppercase tracking-wide text-ink md:text-lg">
                  {plan.name}
                </h3>

                <p className="mb-5 mt-4 text-gradient-warm font-display text-3xl font-semibold leading-none md:text-4xl">
                  {plan.price}
                </p>

                <p className="mb-6 text-base leading-relaxed text-mute">
                  {plan.desc}
                </p>

                <ul className="mb-7 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/80">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-cyan-neon" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollToId("#contact")}
                  data-track={`Цены — Заказать · ${plan.name}`}
                  className={`flex items-center justify-center rounded-full py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] transition-all duration-300 ${
                    popular
                      ? "bg-ink text-void hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
                      : "border border-white/15 text-ink hover:border-vio hover:bg-vio/15"
                  }`}
                >
                  {t.pricing.order}
                </button>
              </div>
            );
          })}
        </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="mx-auto max-w-lg text-[17px] leading-relaxed text-mute/70">
            {t.pricing.footer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
