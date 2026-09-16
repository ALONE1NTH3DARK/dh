import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useT } from "../i18n/useT";
import DigitalCardPhone from "./DigitalCardPhone";
import SectionAtmosphere from "./SectionAtmosphere";
import SectionLabel from "./SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DigitalCardGift() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="digital-card"
      className="relative overflow-hidden border-y border-white/[0.07] bg-void"
    >
      {open && <SectionAtmosphere tone="amber" fadeTop={false} />}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="digital-card-panel"
        data-track="Визитка — Раскрыть секцию"
        className={`group relative z-10 flex w-full items-center gap-4 bg-transparent px-5 py-4 text-left transition-colors duration-300 md:px-14 md:py-5 ${
          open ? "justify-end" : "justify-between hover:bg-white/[0.03]"
        }`}
      >
        {!open && (
        <span className="flex min-w-0 items-center gap-3 md:gap-5">
          <span
            className="hidden h-px w-9 shrink-0 bg-vio sm:block"
            aria-hidden
          />
          <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[2px] text-mute/90 md:inline md:text-[14px]">
            {t.digitalCard.kicker}
          </span>
          <span className="hidden h-3 w-px shrink-0 bg-white/15 md:block" aria-hidden />
          <span className="min-w-0 text-pretty font-display text-[15px] font-semibold uppercase leading-snug tracking-[0.04em] md:text-[17px] md:leading-none">
            <span className="text-ink">{t.digitalCard.title}{" "}</span>
            <span className="text-gradient-warm max-md:block">{t.digitalCard.gift}</span>
          </span>
        </span>
        )}

        <span className="flex shrink-0 items-center gap-3">
          <span className="hidden shrink-0 whitespace-nowrap font-mono text-[14px] font-semibold uppercase tracking-[2px] text-mute transition-colors group-hover:text-ink max-md:!hidden md:inline">
            {open ? t.digitalCard.close : t.digitalCard.open}
          </span>
          <span className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-all duration-300 group-hover:border-vio/60 group-hover:bg-vio/15 group-hover:shadow-[0_0_28px_rgba(124,108,255,0.25)]">
            <ChevronDown
              className={`size-4 transition-transform duration-400 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="digital-card-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="relative px-5 pb-24 pt-8 md:px-10 md:pb-32 md:pt-10">
              <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                <Reveal>
                  <SectionLabel>{t.digitalCard.kicker}</SectionLabel>

                  <h2 className="font-display text-[clamp(2.25rem,5.5vw,3.6rem)] font-semibold uppercase leading-[1.20] text-pretty">
                    <span className="text-ink">{t.digitalCard.title} </span>
                    <span className="text-gradient-neon whitespace-nowrap">{t.digitalCard.gift}</span>
                  </h2>

                  <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-mute">
                    {t.digitalCard.lead}
                  </p>

                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mute/70">
                    {t.digitalCard.note}
                  </p>

                  <Link
                    to="/digital-cards"
                    data-track="Визитка — Подробнее и примеры"
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)]"
                  >
                    {t.digitalCard.more}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Reveal>

                <Reveal
                  delay={0.12}
                  className="hidden justify-center md:flex lg:justify-end"
                >
                  <DigitalCardPhone />
                </Reveal>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
