import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import PageShell from "@/components/layout/PageShell";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionLabel from "@/components/ui/SectionLabel";
import { useT } from "@/i18n/useT";
import { CLIP_HIDDEN, CLIP_SHOWN, EASE, prefersReducedMotion } from "@/lib/reveal";

const useStageEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function NotFoundPage() {
  const t = useT();
  const { pathname } = useLocation();
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * Цифры выходят из-под маски по одной. Параллакс живёт на вложенных
   * спанах, поэтому анимируем только обёртки — иначе clearProps снял бы
   * инлайн-трансформ и мышь перестала бы двигать «404».
   */
  useStageEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const digits = [...stage.querySelectorAll<HTMLElement>("[data-nf-digit]")];
    const copy = [...stage.querySelectorAll<HTMLElement>("[data-nf-in]")];
    const rule = stage.querySelector<HTMLElement>("[data-reveal-line]");

    if (prefersReducedMotion()) {
      gsap.set([...digits, ...copy], { opacity: 1 });
      return;
    }

    gsap.set(digits, { opacity: 0, y: 34, clipPath: CLIP_HIDDEN });
    gsap.set(copy, { opacity: 0, y: 22 });
    if (rule) gsap.set(rule, { scaleX: 0 });

    const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
    if (rule) {
      tl.to(rule, { scaleX: 1, duration: 0.8, transformOrigin: "right center" }, 0);
    }
    tl.to(
      digits,
      { opacity: 1, y: 0, clipPath: CLIP_SHOWN, duration: 1.2, stagger: 0.1, clearProps: "clipPath,transform" },
      0.06
    );
    tl.to(copy, { opacity: 1, y: 0, duration: 1, stagger: 0.07, clearProps: "transform" }, 0.45);

    return () => {
      tl.kill();
    };
  }, []);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    stage.style.setProperty("--mx", `${x}px`);
    stage.style.setProperty("--my", `${y}px`);
    stage.style.setProperty("--gx", `${event.clientX - rect.left}px`);
    stage.style.setProperty("--gy", `${event.clientY - rect.top}px`);
  };

  return (
    <PageShell variant="project" className="min-h-dvh">
      <main
        ref={stageRef}
        onMouseMove={onMove}
        className="relative z-10 flex min-h-dvh flex-col justify-center overflow-hidden px-5 pb-24 pt-28 md:px-10 md:pb-28 md:pt-32"
        style={
          {
            "--mx": "0px",
            "--my": "0px",
            "--gx": "50%",
            "--gy": "40%",
          } as React.CSSProperties
        }
      >
        <SectionAtmosphere tone="dual" grid />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(520px circle at var(--gx) var(--gy), color-mix(in srgb, var(--color-vio) 22%, transparent), transparent 58%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1200px] text-center">
          <div data-nf-in data-reveal-hide>
            <SectionLabel center>{t.notFound.label}</SectionLabel>
          </div>

          <div
            className="mt-2 flex select-none items-center justify-center font-display font-semibold uppercase leading-[0.82] tracking-tight"
            aria-hidden
          >
            <span data-nf-digit data-reveal-hide className="block">
              <span
                className="block text-[clamp(6.4rem,24vw,15rem)] text-ink will-change-transform"
                style={{ transform: "translate3d(var(--mx), var(--my), 0)" }}
              >
                4
              </span>
            </span>

            <span data-nf-digit data-reveal-hide className="block">
              <span
                className="block text-[clamp(6.4rem,24vw,15rem)] text-stroke will-change-transform"
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * -0.45), calc(var(--my) * -0.35), 0)",
                }}
              >
                0
              </span>
            </span>

            <span data-nf-digit data-reveal-hide className="block">
              <span
                className="text-gradient-neon block text-[clamp(6.4rem,24vw,15rem)] will-change-transform"
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 0.55), calc(var(--my) * 0.4), 0)",
                }}
              >
                4
              </span>
            </span>
          </div>

          <h1 className="sr-only">{t.notFound.title}</h1>

          <p
            data-nf-in
            data-reveal-hide
            className="mx-auto mt-8 max-w-lg font-display text-[clamp(1.5rem,3.4vw,2.35rem)] font-medium uppercase leading-[1.20] text-ink"
          >
            {t.notFound.headline}
            <span className="text-gradient-neon">{t.notFound.headlineAccent}</span>
          </p>

          <p
            data-nf-in
            data-reveal-hide
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-mute md:text-lg"
          >
            {t.notFound.text}
          </p>

          <p
            data-nf-in
            data-reveal-hide
            className="mx-auto mt-4 max-w-full truncate font-mono text-[13px] uppercase tracking-[1.4px] text-mute/80"
          >
            {t.notFound.query} · {pathname}
          </p>

          <div
            data-nf-in
            data-reveal-hide
            className="mt-9 flex max-w-full flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/"
              data-track="404 — На главную"
              className="group flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
            >
              {t.notFound.home}
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              data-track="404 — Написать нам"
              className="rounded-full border border-white/15 px-7 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)]"
            >
              {t.notFound.write}
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
