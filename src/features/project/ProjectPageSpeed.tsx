import { animate, motion, useInView } from "framer-motion";
import { Gauge } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import { EASE } from "@/lib/motion";

type PageSpeedScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

const GAUGE_R = 46;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

function InsightGauge({
  score,
  label,
  delay = 0,
  gradId,
}: {
  score: number;
  label: string;
  delay?: number;
  gradId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, score, {
      duration: 1.7,
      delay,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, score, delay]);

  return (
    <div ref={ref} className="flex flex-col items-center px-2 py-3 md:py-4">
      <div className="relative flex size-[7.5rem] items-center justify-center md:size-[8.25rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,179,92,0.28)_0%,rgba(255,92,168,0.16)_42%,transparent_68%)] blur-xl"
        />
        <svg
          viewBox="0 0 120 120"
          className="relative size-[6.25rem] -rotate-90 md:size-[6.75rem]"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb35c" />
              <stop offset="100%" stopColor="#ff5ca8" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r={GAUGE_R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={GAUGE_R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={GAUGE_C}
            initial={{ strokeDashoffset: GAUGE_C }}
            animate={
              inView
                ? { strokeDashoffset: GAUGE_C * (1 - score / 100) }
                : { strokeDashoffset: GAUGE_C }
            }
            transition={{ duration: 1.7, delay, ease: EASE }}
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 grid place-items-center font-display text-2xl font-semibold text-ink md:text-3xl">
          {n}
        </span>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
        {label}
      </p>
    </div>
  );
}

type Props = {
  scores: PageSpeedScores;
  /** Уникальный префикс для SVG gradient id (slug проекта) */
  idPrefix: string;
  projectTitle?: string;
};

/** PageSpeed Insights на странице кейса — цифры задаются в data/projects */
export default function ProjectPageSpeed({
  scores,
  idPrefix,
  projectTitle,
}: Props) {
  const t = useT();
  const labels = [
    { key: "performance" as const, label: t.pagespeed.performance },
    { key: "accessibility" as const, label: t.pagespeed.accessibility },
    { key: "bestPractices" as const, label: t.pagespeed.bestPractices },
    { key: "seo" as const, label: t.pagespeed.seo },
  ];

  return (
    <section className="relative bg-void px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-end gap-5 md:grid-cols-[1fr_1.05fr] md:gap-12">
          <h2 className="font-display text-[clamp(1.8rem,4.2vw,2.4rem)] font-semibold uppercase leading-[1.20]">
            <span className="text-ink">{t.pagespeed.title1}</span>{" "}
            <br />
            <span className="text-gradient-warm">{t.pagespeed.title2}</span>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-mute md:ml-auto md:text-right md:text-[15px]">
            {t.pagespeed.lead}
            {projectTitle ? (
              <>
                {" "}
                {t.pagespeed.forProject} <span className="text-ink/80">{projectTitle}</span>.
              </>
            ) : (
              ` ${t.pagespeed.forThis}`
            )}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4">
          {labels.map((item, i) => (
            <div key={item.key} className="relative">
              {i > 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-1/2 hidden h-[80%] w-px -translate-y-1/2 bg-white/[0.07] lg:block"
                />
              )}
              <InsightGauge
                score={scores[item.key]}
                label={item.label}
                gradId={`${idPrefix}-psi-${i}`}
                delay={0.1 * i}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center md:mt-8">
          <p className="inline-flex max-w-full items-start gap-2.5 rounded-full border border-white/15 px-4 py-2.5 text-[12px] leading-snug text-mute sm:items-center sm:gap-3 sm:px-6 sm:py-3 sm:text-[15px] sm:leading-none">
            <Gauge
              className="mt-0.5 size-3.5 shrink-0 text-amber-neon sm:mt-0 sm:size-4"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="min-w-0 text-pretty">
              {t.pagespeed.footer}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
