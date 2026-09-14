import { motion } from "framer-motion";
import {
  HeartHandshake,
  Settings,
  Rocket,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "../i18n/useT";
import { scrollToId } from "../lib/scrollState";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import SectionAtmosphere from "./SectionAtmosphere";
import SectionLabel from "./SectionLabel";
import turnkeyImg from "../assets/services/turnkey.webp";
import turnkeyLightImg from "../assets/services/turnkey-light.webp";
import brandImg from "../assets/services/brand.webp";
import brandLightImg from "../assets/services/brand-light.webp";
import supportImg from "../assets/services/support.webp";
import supportLightImg from "../assets/services/support-light.webp";

const EASE = [0.16, 1, 0.3, 1] as const;

/* общий контейнер для секций */
function SectionInner({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto w-full max-w-[1200px]">{children}</div>;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-14% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- marquee ---------- */
function Marquee() {
  const t = useT();
  const items = t.services.marquee;
  const half = (
    <div className="flex shrink-0 items-center">
      {items.concat(items).map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-8 font-display text-[32px] font-semibold uppercase tracking-tight md:px-10 ${
              i % 2 === 0 ? "text-ink" : "text-stroke"
            }`}
          >
            {item}
          </span>
          <Sparkles className="size-4 text-vio md:size-5" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden bg-void py-6 md:py-8">
      <div aria-hidden className="section-band opacity-70" />
      <div className="animate-marquee relative flex w-max">
        {half}
        {half}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}

/* ---------- услуги ---------- */
const SERVICE_META = [
  { icon: Rocket, image: turnkeyImg, lightImage: turnkeyLightImg },
  { icon: Settings, image: brandImg, lightImage: brandLightImg },
  { icon: HeartHandshake, image: supportImg, lightImage: supportLightImg },
];

export function Services() {
  const t = useT();
  const services = t.services.items.map((item, i) => ({
    ...item,
    ...SERVICE_META[i],
  }));

  return (
    <>
    <section id="services" className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="vio" />

      <SectionInner>
        <Reveal className="mb-12 text-center md:mb-16">
          <SectionLabel center>{t.services.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20] text-pretty">
            {t.services.titleBefore}<span className="text-stroke">{t.services.titleStroke}</span>{" "}
            <span className="text-gradient-neon">{t.services.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
            {t.services.subtitle}
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={0.08 * (i + 1)}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-void-2 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)]">
                {/* Картинка + иконка на нижнем краю */}
                <div className="relative">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt=""
                      className="h-full w-full object-cover light:hidden"
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      src={s.lightImage}
                      alt=""
                      className="hidden h-full w-full object-cover light:block"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Затемнение снизу вверх — оставить на случай, если снова понадобится
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void-2 via-transparent to-transparent opacity-80" />
                    */}
                  </div>
                  <div className="absolute bottom-0 left-10 z-10 grid size-12 translate-y-1/2 place-items-center rounded-full bg-void-2 shadow-[0_6px_16px_rgba(0,0,0,0.22)] light:shadow-[0_6px_16px_rgba(24,21,31,0.1)] md:left-12 md:size-[3.25rem]">
                    <s.icon className="size-5 text-cyan-neon" strokeWidth={1.75} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-10 pb-6 pt-9 md:px-12 md:pb-7 md:pt-10">
                  <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[17px] leading-relaxed text-mute">{s.text}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-vio">
                      {s.tag}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionInner>
    </section>
    <Marquee />
    </>
  );
}

/* ---------- процесс ---------- */
export function Process() {
  const t = useT();
  const steps = t.process.steps;

  return (
    <section id="process" className="relative overflow-hidden border-b border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="pink" dots />

      <SectionInner>
        <Reveal className="mb-12 flex flex-col items-center text-center md:mb-16 md:items-start md:text-left">
          <SectionLabel>{t.process.label}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            {t.process.titleBefore}<span className="text-gradient-neon">{t.process.titleAccent}</span>
          </h2>
        </Reveal>

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
          <span className="pointer-events-none absolute left-0 top-5 hidden h-px w-full bg-gradient-to-r from-vio/50 via-white/10 to-pink-neon/50 xl:block" />
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={0.09 * i} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio md:hidden">
                {s.num}
              </p>
              <span className="relative z-10 mb-7 hidden size-11 place-items-center rounded-full border border-vio/40 bg-void font-mono text-[11px] text-vio shadow-[0_0_20px_rgba(124,108,255,0.18)] md:grid">
                {s.num}
              </span>
              <h3 className="mt-2 font-display text-sm font-medium uppercase tracking-wide text-ink md:mt-0 md:text-base">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute md:mt-2.5">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18} className="mt-12 flex justify-center">
          <p className="inline-flex max-w-full items-start gap-2.5 rounded-full border border-white/15 px-4 py-2.5 text-[17px] leading-snug text-mute sm:items-center sm:gap-3 sm:px-6 sm:py-3 sm:leading-none">
            <HeartHandshake className="mt-0.5 size-3.5 shrink-0 text-amber-neon sm:mt-0 sm:size-4" strokeWidth={1.75} aria-hidden />
            <span className="min-w-0 text-pretty">
              {t.process.footer}
            </span>
          </p>
        </Reveal>
      </SectionInner>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
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

        <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

/* ---------- экспорт ---------- */
export default function SolidSections() {
  return (
    <div className="relative z-20 bg-void">
      <Testimonials />
      <CTA />
      <Contact />
    </div>
  );
}
