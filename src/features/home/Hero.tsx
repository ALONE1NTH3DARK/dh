import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { useT } from "@/i18n/useT";
import { scrollToId } from "@/lib/scrollState";
import HeroBackground from "@/features/home/HeroBackground";
import ProjectVideoPlayer from "@/features/project/ProjectVideoPlayer";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE } from "@/lib/motion";
import {
  EASE as GSAP_EASE,
  prefersReducedMotion,
} from "@/lib/reveal";

const useStageEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const CTA_PRIMARY =
  "group flex items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)] md:px-7 md:py-4";
const CTA_GHOST =
  "rounded-full border border-white/15 px-6 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] md:px-7 md:py-4";

export default function Hero() {
  const t = useT();
  const [watching, setWatching] = useState(false);
  const [isMd, setIsMd] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /**
   * Вход первого экрана: блоки по очереди выезжают снизу.
   * Строки заголовка едут так же, но ещё проявляются из размытия.
   */
  useStageEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const pick = (name: string) => stage.querySelector<HTMLElement>(`[data-hero-in="${name}"]`);
    const lines = [...stage.querySelectorAll<HTMLElement>("[data-hero-line]")];
    const rule = stage.querySelector<HTMLElement>("[data-reveal-line]");
    const label = pick("label");
    const play = pick("play");
    const lead = pick("lead");
    const cta = pick("cta");
    const parts = [label, play, lead, cta].filter((el): el is HTMLElement => el !== null);

    if (prefersReducedMotion()) {
      gsap.set([...lines, ...parts], { opacity: 1, filter: "none" });
      return;
    }

    const rise = 44;

    gsap.set(lines, {
      opacity: 0,
      y: rise,
      filter: "blur(20px)",
    });
    gsap.set(parts, { opacity: 0, y: rise });
    if (rule) gsap.set(rule, { scaleX: 0 });

    // clearProps без opacity: инлайн-прозрачность держит содержимое видимым
    // поверх стартового правила в CSS.
    const tl = gsap.timeline({ defaults: { ease: GSAP_EASE } });
    if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.98, clearProps: "transform" }, 0.06);
    if (play) tl.to(play, { opacity: 1, y: 0, duration: 0.98, clearProps: "transform" }, 0.1);
    if (rule) {
      tl.to(rule, { scaleX: 1, duration: 1, transformOrigin: "left center" }, 0.12);
    }
    tl.to(
      lines,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.28,
        stagger: 0.13,
        clearProps: "transform,filter",
      },
      0.16
    );
    if (lead) tl.to(lead, { opacity: 1, y: 0, duration: 1.08, clearProps: "transform" }, 0.58);
    if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 1.08, clearProps: "transform" }, 0.72);

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!watching) return;
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.7) setWatching(false);
      },
      { threshold: [0.7] }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [watching]);

  return (
    <section ref={sectionRef} id="top" className="relative min-h-dvh overflow-hidden">
      <HeroBackground />

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          watching
            ? { opacity: 0, scale: 0.85 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: watching ? 0.35 : 0.8, delay: watching ? 0 : 0.55, ease: EASE }}
        onClick={() => setWatching(true)}
        data-track="Герой — Смотреть шоурил"
        aria-label={t.hero.watchVideo}
        className={`absolute left-5 top-1/2 z-20 hidden size-16 -translate-y-1/2 place-items-center rounded-full bg-ink text-void shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-colors hover:bg-vio hover:text-ink light:shadow-[0_10px_28px_rgba(24,21,31,0.12)] md:grid ${
          watching ? "pointer-events-none" : ""
        }`}
      >
        <Play className="size-6 translate-x-px fill-current" strokeWidth={1.75} />
      </motion.button>

      {/* Плеер выезжает слева на ~50% */}
      <motion.div
        className="absolute inset-y-0 left-0 z-20 grid h-full w-full place-items-center px-5 pb-20 pt-28 md:w-1/2 md:px-8 md:pb-24 md:pt-32"
        initial={false}
        animate={{ x: watching ? "0%" : "-100%" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="w-full">
          <div className="mb-5 flex w-full items-center justify-between md:hidden">
            <h3 className="flex min-w-0 flex-1 items-center gap-3 font-display text-[21px] font-medium uppercase leading-8 tracking-[-0.8px]">
              <span className="h-px w-9 shrink-0 bg-vio" aria-hidden />
              <span className="min-w-0 break-words">{t.hero.presentation}</span>
            </h3>
            <button
              type="button"
              onClick={() => setWatching(false)}
              data-track="Герой — Назад с шоурила"
              aria-label={t.hero.backToHero}
              className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-void shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-colors hover:bg-vio hover:text-ink light:shadow-[0_10px_28px_rgba(24,21,31,0.12)]"
            >
              <ArrowRight className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-void-2 shadow-[0_40px_100px_rgba(0,0,0,0.45)] light:shadow-[0_18px_40px_rgba(24,21,31,0.12),0_36px_88px_rgba(24,21,31,0.14)]">
            {watching ? (
              <ProjectVideoPlayer src="/video.mp4" title={t.hero.videoTitle} autoPlay volume />
            ) : null}
          </div>
          <p className="mt-5 w-full text-center text-[19px] leading-snug text-mute">
            {t.hero.reelCaption}
          </p>
          <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={() => {
                setWatching(false);
                scrollToId("#portfolio");
              }}
              data-track="Шоурил — Смотреть работы"
              className={CTA_PRIMARY}
            >
              {t.hero.watchWork}
            </button>
            <button
              type="button"
              onClick={() => {
                setWatching(false);
                scrollToId("#contact");
              }}
              data-track="Шоурил — Обсудить проект"
              className={CTA_GHOST}
            >
              {t.hero.discuss}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Главный экран уезжает вправо на ~50% */}
      <motion.div
        ref={stageRef}
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col items-center justify-center px-5 pb-20 pt-28 text-center md:items-start md:px-10 md:pb-24 md:pt-32 md:text-left"
        initial={false}
        animate={{ x: watching ? (isMd ? "50%" : "100%") : "0%" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="mb-6 flex w-full items-center justify-between md:mb-8 md:justify-start">
          <div data-hero-in="label" data-reveal-hide>
            <SectionLabel className="mb-0">{t.hero.agency}</SectionLabel>
          </div>
          <button
            type="button"
            data-hero-in="play"
            data-reveal-hide
            onClick={() => setWatching(true)}
            data-track="Герой — Смотреть шоурил"
            aria-label={t.hero.watchVideo}
            className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-void shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-colors hover:bg-vio hover:text-ink light:shadow-[0_10px_28px_rgba(24,21,31,0.12)] md:hidden"
          >
            <Play className="size-5 translate-x-px fill-current" strokeWidth={1.75} />
          </button>
        </div>

        <h1 className="font-display text-[clamp(2.2rem,6.4vw,5rem)] font-semibold uppercase leading-[1.20] tracking-tight">
          <span data-hero-line data-reveal-hide className="block text-ink">
            {t.hero.line1}
          </span>
          <span data-hero-line data-reveal-hide className="block">
            <span className="text-ink">{t.hero.line2Before}</span>
            <span className="text-stroke">{t.hero.line2Stroke}</span>
          </span>
          <span
            data-hero-line
            data-reveal-hide
            className="text-gradient-hero mx-auto block w-fit md:mx-0"
          >
            {t.hero.line3}
          </span>
        </h1>

        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-7">
          <p
            data-hero-in="lead"
            data-reveal-hide
            className="max-w-[36rem] text-[19px] leading-relaxed text-mute"
          >
            {t.hero.lead}
            <span className="mt-1 block text-ink">
              {t.hero.leadAccent}
            </span>
          </p>

          <div
            data-hero-in="cta"
            data-reveal-hide
            className="flex max-w-full flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <button
              type="button"
              onClick={() => scrollToId("#portfolio")}
              data-track="Герой — Смотреть работы"
              className={CTA_PRIMARY}
            >
              {t.hero.watchWork}
            </button>
            <button
              type="button"
              onClick={() => scrollToId("#contact")}
              data-track="Герой — Обсудить проект"
              className={CTA_GHOST}
            >
              {t.hero.discuss}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          watching
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        transition={{ duration: watching ? 0.8 : 0.35, delay: watching ? 0.4 : 0, ease: EASE }}
        onClick={() => setWatching(false)}
        data-track="Герой — Назад с шоурила"
        aria-label={t.hero.backToHero}
        aria-hidden={!watching}
        tabIndex={watching ? 0 : -1}
        className={`fixed right-4 top-1/2 z-[120] hidden size-14 -translate-y-1/2 place-items-center rounded-full bg-ink text-void shadow-[0_8px_28px_rgba(0,0,0,0.18)] transition-colors hover:bg-vio hover:text-ink light:shadow-[0_8px_24px_rgba(24,21,31,0.1)] md:right-5 md:grid md:size-16 ${
          watching ? "" : "pointer-events-none"
        }`}
      >
        <ChevronRight className="size-6 md:size-7" strokeWidth={1.75} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: watching ? 0 : 1, y: watching ? 12 : 0 }}
        transition={{ duration: 0.8, delay: watching ? 0 : 0.88, ease: EASE }}
        className="pointer-events-none absolute inset-x-5 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] z-10 hidden justify-center md:inset-x-10 md:bottom-7 md:flex"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-px overflow-hidden bg-white/15">
            <span className="animate-scroll-dash absolute inset-0 bg-gradient-to-b from-cyan-neon to-vio" />
          </div>
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-mute">
            {t.hero.scroll1}
            <br />
            {t.hero.scroll2}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
