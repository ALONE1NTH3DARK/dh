import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionLabel from "@/components/ui/SectionLabel";
import { useT } from "@/i18n/useT";
import { EASE } from "@/lib/motion";

function SpoilerButton({
  open,
  controls,
  label,
  onToggle,
}: {
  open: boolean;
  controls: string;
  label: string;
  onToggle: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? t.clients.collapse : t.clients.expand}
      data-track={`${label} — ${open ? "Свернуть" : "Открыть"}`}
      className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] md:hidden"
    >
      <ChevronDown
        className={`size-4 transition-transform duration-400 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function SpoilerCopy({
  id,
  open,
  className,
  children,
}: {
  id: string;
  open: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="hidden space-y-4 md:block">{children}</div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden md:hidden"
          >
            <div className="space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------- для кого я работаю -------------------- */
export function ResultChapter() {
  const t = useT();
  const [clientsOpen, setClientsOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);

  return (
    <section id="clients" className="relative bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="cyan" dots />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-16 md:gap-24">
        {/* 1/3 заголовок · 2/3 текст */}
        <Reveal className="grid md:gap-8 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-1">
            <SectionLabel>{t.clients.label}</SectionLabel>
            <div className="flex items-start justify-between gap-4">
              <h2 className="min-w-0 flex-1 font-display text-[clamp(1.9rem,4.2vw,2.55rem)] font-semibold uppercase leading-[1.20] text-pretty">
                <span className="text-ink">{t.clients.title1}</span>
                <br />
                <span className="text-gradient-neon">{t.clients.title2}</span>
              </h2>
              <SpoilerButton
                open={clientsOpen}
                controls="clients-copy"
                label="Для кого я работаю"
                onToggle={() => setClientsOpen((value) => !value)}
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
              {t.clients.lead}
            </p>
          </div>

          <SpoilerCopy
            id="clients-copy"
            open={clientsOpen}
            className={`text-[19px] leading-relaxed text-mute lg:col-span-2 ${
              clientsOpen ? "mt-8 md:mt-0" : ""
            }`}
          >
            <p>{t.clients.p1}</p>
            <p>{t.clients.p2}</p>
            <p>{t.clients.p3}</p>
          </SpoilerCopy>
        </Reveal>

        {/* 2/3 текст · 1/3 заголовок справа */}
        <Reveal delay={0.08} className="grid md:gap-8 lg:grid-cols-3 lg:gap-16">
          <SpoilerCopy
            id="format-copy"
            open={formatOpen}
            className={`order-2 text-[19px] leading-relaxed text-mute lg:order-1 lg:col-span-2 ${
              formatOpen ? "mt-8 md:mt-0" : ""
            }`}
          >
            <p>{t.clients.f1}</p>
            <p>{t.clients.f2}</p>
            <p>{t.clients.f3}</p>
          </SpoilerCopy>

          <div className="order-1 lg:order-2 lg:col-span-1 lg:text-right">
            <SectionLabel className="lg:flex-row-reverse">{t.clients.formatLabel}</SectionLabel>
            <div className="flex items-start justify-between gap-4 lg:justify-end">
              <h2 className="min-w-0 flex-1 font-display text-[clamp(1.9rem,4.2vw,2.55rem)] font-semibold uppercase leading-[1.20]">
                <span className="text-ink">{t.clients.formatTitle1}</span>
                <span className="text-gradient-neon">{t.clients.formatTitle2}</span>
              </h2>
              <SpoilerButton
                open={formatOpen}
                controls="format-copy"
                label="Формат работы"
                onToggle={() => setFormatOpen((value) => !value)}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-mute lg:ml-auto lg:max-w-xs">
              {t.clients.formatLead}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- о нас -------------------- */
export function AboutChapter() {
  const t = useT();

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32"
    >
      <SectionAtmosphere tone="dual" />

      <div className="relative mx-auto w-full max-w-[1200px]">
        <Reveal className="mx-auto w-full max-w-[1200px] overflow-visible text-center">
          <SectionLabel center>{t.about.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            <span className="text-ink">{t.about.title1}</span>
            <br />
            <span className="text-gradient-neon">{t.about.title2}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-void-2/90 via-void to-void px-6 py-10 md:px-12 md:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(7rem,22vw,16rem)] font-bold leading-none text-white/[0.035]"
            >
              DH
            </div>

            <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
              <div className="text-center lg:text-left">
                <p className="font-mono text-[14px] uppercase tracking-[2px] text-[#8a8494]">
                  {t.about.experience}
                </p>
                <p className="mt-2 font-display text-[clamp(3.5rem,9vw,6.5rem)] font-bold leading-[0.9] text-gradient-warm">
                  7+
                </p>
                <p className="mt-3 font-display text-[14px] font-bold uppercase tracking-[2px] text-gradient-warm">
                  {t.about.years}
                </p>
              </div>

              <div className="max-w-xl border-white/[0.1] lg:border-l lg:pl-10">
                <p className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
                  {t.about.quote}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute md:text-base">
                  {t.about.text}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mt-8 md:mt-10">
          <div className="mx-auto grid max-w-5xl gap-8 text-center md:grid-cols-3 md:gap-8 md:text-left">
            {t.about.points.map((point, i) => (
              <div key={point}>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  {point}
                </h3>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

