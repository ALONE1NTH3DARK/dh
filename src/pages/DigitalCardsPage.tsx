import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Link2, QrCode, Share2, Smartphone, Sparkles, Zap } from "lucide-react";
import { useT } from "../i18n/useT";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import DigitalCardPhone from "../components/DigitalCardPhone";
import SectionAtmosphere from "../components/SectionAtmosphere";
import SectionLabel from "../components/SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;

const WHY_ICONS = [Smartphone, Sparkles, Zap] as const;
const CHIP_ICONS = [QrCode, Link2, Share2] as const;

const GALLERY = [
  { id: 1, h: "h-56 md:h-64" },
  { id: 2, h: "h-72 md:h-80" },
  { id: 3, h: "h-48 md:h-56" },
  { id: 4, h: "h-64 md:h-72" },
  { id: 5, h: "h-80 md:h-96" },
  { id: 6, h: "h-52 md:h-60" },
  { id: 7, h: "h-60 md:h-72" },
  { id: 8, h: "h-60 md:h-72" },
  { id: 9, h: "h-72 md:h-80" },
];

export default function DigitalCardsPage() {
  const t = useT();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-void font-body text-ink">
      <Nav variant="project" />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 md:pt-32">
          <SectionAtmosphere tone="cyan" grid />

          <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 pb-16 md:px-10 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Link
                to="/"
                state={{ scrollTo: "digital-card" }}
                className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-cyan-neon/60 hover:bg-cyan-neon/10 md:px-5"
              >
                <ArrowLeft
                  className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
                  strokeWidth={1.75}
                />
                {t.cards.back}
              </Link>

              <SectionLabel>
                {t.cards.label}
              </SectionLabel>

              <h1 className="max-w-3xl font-display text-[clamp(2.55rem,7vw,4.6rem)] font-semibold uppercase leading-[1.20] text-pretty">
                {t.cards.title}
                <span className="text-gradient-neon">{t.cards.titleAccent}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute md:text-lg">
                {t.cards.lead}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="hidden justify-center md:flex lg:justify-end"
            >
              <DigitalCardPhone />
            </motion.div>
          </div>
        </section>

        {/* What */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid w-full max-w-[1100px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionLabel>{t.cards.whatLabel}</SectionLabel>
              <h2 className="mt-0 font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
                {t.cards.whatTitle}
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-mute md:text-lg">
              <p>{t.cards.whatP1}</p>
              <p>{t.cards.whatP2}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {t.cards.chips.map((label, i) => {
                  const Icon = CHIP_ICONS[i];
                  return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
                  >
                    <Icon className="size-3.5 text-cyan-neon" />
                    {label}
                  </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="border-t border-white/[0.07] bg-void-2/40 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <SectionLabel>{t.cards.whyLabel}</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              {t.cards.whyTitle}
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {t.cards.why.map((item, i) => {
                const Icon = WHY_ICONS[i];
                return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="rounded-2xl border border-white/[0.08] bg-void/60 p-6 md:p-7"
                >
                  <Icon className="mb-4 size-5 text-cyan-neon" />
                  <h3 className="font-display text-base font-medium text-ink md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute md:text-[15px]">
                    {item.text}
                  </p>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <SectionLabel>{t.cards.howLabel}</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              {t.cards.howTitle}
            </h2>

            <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
              {t.cards.how.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="relative border-t border-white/10 pt-6"
                >
                  <span className="font-mono text-xs text-vio">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-base font-medium text-ink md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute md:text-[15px]">
                    {step.text}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <SectionLabel>{t.cards.galleryLabel}</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              {t.cards.galleryTitle}
            </h2>
            <p className="mt-4 max-w-lg text-base text-mute">
              {t.cards.galleryLead}
            </p>

            <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {GALLERY.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, delay: 0.04 * i, ease: EASE }}
                  className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-void-2 ${item.h}`}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,rgba(124,108,255,0.12),transparent_55%),linear-gradient(340deg,rgba(95,227,255,0.08),transparent_40%)]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
                      Placeholder
                    </span>
                    <span className="font-display text-sm font-medium text-ink/70">
                      {t.cards.example} 0{item.id}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="font-display text-[clamp(1.95rem,5vw,2.8rem)] font-semibold uppercase leading-[1.20]">
              {t.cards.ctaTitle}
              <span className="text-gradient-neon">{t.cards.ctaAccent}</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-mute">
              {t.cards.ctaText}
            </p>
            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              data-track="Визитки — Обсудить проект"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_40px_rgba(124,108,255,0.45)]"
            >
              {t.cards.discuss}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
