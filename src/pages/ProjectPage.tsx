import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getAdjacentProjects, getProject } from "../data/projects";
import Nav from "../components/Nav";
import ProjectFullScrub from "../components/ProjectFullScrub";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const { prev, next } = getAdjacentProjects(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen bg-void font-body text-ink">
      <Nav variant="project" />

      <main className="relative z-10">
        {/* Hero text */}
        <section className="relative overflow-hidden pt-28 md:pt-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,108,255,0.1),transparent_55%)]"
          />

          <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-10 md:px-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Link
                to="/"
                state={{ scrollTo: "portfolio" }}
                className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] md:px-5 md:text-xs"
              >
                <ArrowLeft
                  className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 md:size-[1.15rem]"
                  strokeWidth={1.75}
                />
                Все проекты
              </Link>

              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs">
                <span className="h-px w-9 bg-vio" />
                {project.cat} · {project.year}
              </p>

              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h1 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-semibold uppercase leading-[0.98]">
                  {project.title}
                </h1>
                <p className="text-gradient-neon font-display text-3xl font-semibold md:text-4xl">
                  {project.result}
                </p>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute md:text-lg">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-mute md:text-xs">
                <span>Клиент · <span className="text-ink">{project.client}</span></span>
                <span>Срок · <span className="text-ink">{project.time}</span></span>
                <span>Сайт · <span className="text-ink">{project.url}</span></span>
              </div>
            </motion.div>
          </div>
        </section>

        <ProjectFullScrub
          src={project.full}
          url={project.url}
          title={project.title}
        />

        {/* Metrics — как Stats на главной: 4 колонки с разделителями */}
        <section className="border-y border-white/[0.07] bg-void px-5 md:px-10">
          <div className="relative mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE }}
                  className={`px-3 py-10 text-center md:py-14 ${
                    i !== 0 ? "border-l border-white/[0.07]" : ""
                  } ${i >= 2 ? "max-lg:border-t max-lg:[&:nth-child(3)]:border-l-0" : ""}`}
                >
                  <p className="text-gradient-neon font-display text-3xl font-semibold md:text-5xl">
                    {m.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute md:text-[11px]">
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge / Solution */}
        <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,229,255,0.04),transparent_50%)]"
          />
          <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute">
                <span className="h-px w-9 bg-pink-neon" /> Задача
              </p>
              <h2 className="font-display text-2xl font-semibold uppercase leading-tight md:text-3xl">
                С чем пришли
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">
                {project.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute">
                <span className="h-px w-9 bg-cyan-neon" /> Решение
              </p>
              <h2 className="font-display text-2xl font-semibold uppercase leading-tight md:text-3xl">
                Что сделали
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">
                {project.solution}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Highlights */}
        <section className="relative overflow-hidden border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,108,255,0.06),transparent_50%)]"
          />
          <div className="relative mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-12 md:mb-16"
            >
              <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute">
                <span className="h-px w-9 bg-vio" /> Лучшие моменты
              </p>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-semibold uppercase leading-[1.02]">
                Что сработало{" "}
                <span className="text-stroke">сильнее всего</span>
              </h2>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {project.highlights.map((h, i) => (
                <motion.article
                  key={h.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="flex flex-col rounded-2xl border border-white/[0.08] bg-void-2/80 p-6 md:p-7"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-vio">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {h.metric && (
                    <p className="text-gradient-neon mt-5 font-display text-3xl font-semibold">
                      {h.metric}
                    </p>
                  )}
                  <h3 className="mt-4 font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">
                    {h.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">
                    {h.text}
                  </p>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        {project.quote && (
          <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-24">
            <motion.blockquote
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mx-auto max-w-[900px] text-center"
            >
              <p className="font-display text-[clamp(1.3rem,3vw,2.2rem)] font-medium leading-snug text-ink">
                «{project.quote.text}»
              </p>
              <footer className="mt-8">
                <p className="font-display text-sm font-semibold text-ink">
                  {project.quote.author}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  {project.quote.role}
                </p>
              </footer>
            </motion.blockquote>
          </section>
        )}

        {/* Next / CTA */}
        <section className="border-t border-white/[0.07] px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-stretch md:justify-between">
            {prev && (
              <Link
                to={`/project/${prev.slug}`}
                className="group flex flex-1 flex-col justify-between rounded-2xl border border-white/[0.08] bg-void-2/60 p-6 transition-colors hover:border-vio/40 md:p-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  ← Предыдущий
                </p>
                <div className="mt-6">
                  <p className="font-display text-xl font-semibold uppercase text-ink md:text-2xl">
                    {prev.title}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {prev.cat}
                  </p>
                </div>
              </Link>
            )}

            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              className="group flex flex-1 flex-col items-start justify-between rounded-2xl border border-dashed border-white/20 p-6 transition-colors hover:border-vio md:p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                Следующий кейс
              </p>
              <div className="mt-6">
                <p className="font-display text-xl font-semibold uppercase leading-tight text-ink md:text-2xl">
                  Может быть — <span className="text-gradient-neon">ваш</span>?
                </p>
                <span className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-void transition-colors group-hover:bg-vio group-hover:text-ink">
                  Связаться со мной
                </span>
              </div>
            </Link>

            {next && (
              <Link
                to={`/project/${next.slug}`}
                className="group flex flex-1 flex-col justify-between rounded-2xl border border-white/[0.08] bg-void-2/60 p-6 text-right transition-colors hover:border-vio/40 md:p-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  Следующий →
                </p>
                <div className="mt-6">
                  <p className="font-display text-xl font-semibold uppercase text-ink md:text-2xl">
                    {next.title}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {next.cat}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
