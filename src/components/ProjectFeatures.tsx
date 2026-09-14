import { useState } from "react";
import { motion } from "framer-motion";
import type { ProjectFeature } from "../data/projects";
import { useT } from "../i18n/useT";
import ProjectAtmosphere from "./ProjectAtmosphere";
import SectionLabel from "./SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Слот под gif: до 400×300, на мобиле сжимается по ширине контейнера */
function MediaSlot({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(false);
  const fileName = src.split("/").pop() ?? "1.gif";

  return (
    <div className="relative aspect-[4/3] w-full max-w-[min(100%,400px)] overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2">
      <img
        src={src}
        alt={alt}
        width={400}
        height={300}
        className={`absolute inset-0 h-full w-full object-cover ${ok ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setOk(true)}
        onError={() => setOk(false)}
      />
      {!ok && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-white/10 px-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            {fileName}
          </span>
          <span className="break-all text-center font-mono text-[9px] text-mute/50">
            {src.replace(/^\//, "public/")}
          </span>
          <span className="font-mono text-[9px] text-mute/40">до 400 × 300</span>
        </div>
      )}
    </div>
  );
}

type Props = { features: ProjectFeature[]; slug: string };

/**
 * Секция фишек только на странице кейса (/project/:slug).
 * Сколько фич в данных — столько рядов. Чередование: текст|картинка → картинка|текст.
 */
export default function ProjectFeatures({ features, slug }: Props) {
  const t = useT();
  if (!features?.length) return null;

  return (
    <section className="relative overflow-hidden bg-void px-5 py-20 md:px-10 md:py-28">
      <ProjectAtmosphere slug={slug} section={2} dim />
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-16 md:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <SectionLabel center>{t.project.featuresLabel}</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.2rem)] font-semibold uppercase leading-[1.20] text-pretty">
            {t.project.featuresTitle}<span className="text-stroke">{t.project.featuresStroke}</span>{" "}
            <span className="text-gradient-neon">{t.project.featuresAccent}</span>
          </h2>
        </motion.div>

        {features.map((f, i) => {
          const mediaLeft = i % 2 === 1;
          return (
            <motion.div
              key={`${f.title}-${i}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: 0.04 * i, ease: EASE }}
              className={`grid min-w-0 items-center gap-8 lg:gap-14 ${
                mediaLeft ? "lg:grid-cols-[2fr_3fr]" : "lg:grid-cols-[3fr_2fr]"
              }`}
            >
              <div className={`min-w-0 ${mediaLeft ? "lg:order-2" : "lg:order-1"}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-vio">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-mute md:text-lg">
                  {f.text}
                </p>
                {f.tech?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {f.tech.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`flex min-w-0 w-full ${mediaLeft ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end"}`}
              >
                <MediaSlot src={f.media} alt={f.title} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
