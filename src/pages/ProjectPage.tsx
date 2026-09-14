import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "@/pages/NotFoundPage";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getAdjacentProjects, getProject, localizeProject } from "@/data/projects";
import { useT } from "@/i18n/useT";
import { useLocale } from "@/lib/locale";
import PageShell from "@/components/layout/PageShell";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectAtmosphere, { ProjectPageWash } from "@/features/project/ProjectAtmosphere";
import ProjectFeatures from "@/features/project/ProjectFeatures";
import ProjectFullScrub from "@/features/project/ProjectFullScrub";
import ProjectPageSpeed from "@/features/project/ProjectPageSpeed";
import { EASE } from "@/lib/motion";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const t = useT();
  const locale = useLocale();
  const raw = getProject(slug);
  const { prev: rawPrev, next: rawNext } = getAdjacentProjects(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!raw) {
    return <NotFoundPage />;
  }

  const project = localizeProject(raw, locale);
  const prev = rawPrev ? localizeProject(rawPrev, locale) : null;
  const next = rawNext ? localizeProject(rawNext, locale) : null;

  return (
    <PageShell
      variant="project"
      className="isolate min-h-screen"
      wash={<ProjectPageWash slug={project.slug} />}
      backToTop
      backToTopKey={project.slug}
    >
      <main className="relative z-10">
        {/* Hero text */}
        <section className="relative overflow-hidden pt-24 md:pt-32">
          <ProjectAtmosphere slug={project.slug} section={0} />

          <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-10 md:px-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Link
                to="/"
                state={{ scrollTo: "portfolio" }}
                className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] md:px-5"
              >
                <ArrowLeft
                  className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5 md:size-[1.15rem]"
                  strokeWidth={1.75}
                />
                {t.project.all}
              </Link>

              <SectionLabel>
                {project.cat} · {project.year}
              </SectionLabel>

              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold uppercase leading-[1.20] text-pretty">
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
                <span>
                  {t.project.client} · <span className="text-ink">{project.client}</span>
                </span>
                <span>
                  {t.project.term} · <span className="text-ink">{project.time}</span>
                </span>
                <span>
                  {t.project.site} · <span className="text-ink">{project.url}</span>
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <ProjectFullScrub
          src={project.full}
          url={project.url}
          title={project.title}
          videos={project.videos}
        />

        {/* Challenge / Solution — тёмный блок */}
        <section className="relative bg-void px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-4 lg:grid-cols-2 lg:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="rounded-2xl border border-white/[0.08] bg-void-2/80 p-6 md:p-7"
            >
              <SectionLabel lineClassName="bg-[#ff6a9d]">{t.project.task}</SectionLabel>
              <h2 className="font-display text-2xl font-semibold uppercase leading-snug md:text-3xl">
                {t.project.cameWith}
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
              className="rounded-2xl border border-white/[0.08] bg-void-2/80 p-6 md:p-7"
            >
              <SectionLabel lineClassName="bg-[#8bedab]">{t.project.solution}</SectionLabel>
              <h2 className="font-display text-2xl font-semibold uppercase leading-snug md:text-3xl">
                {t.project.weDid}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">
                {project.solution}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Только на странице кейса — не на главной */}
        <ProjectFeatures features={project.features} slug={project.slug} />

        <ProjectPageSpeed
          scores={project.pagespeed}
          idPrefix={project.slug}
          projectTitle={project.title}
        />

        {/* Highlights — тёмный блок */}
        <section className="relative border-y border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-12 text-center md:mb-16"
            >
              <SectionLabel center>{t.project.highlights}</SectionLabel>
              <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.4rem)] font-semibold uppercase leading-[1.20]">
                {t.project.worked}
                <span className="text-stroke">{t.project.strongest}</span>
              </h2>
            </motion.div>

            {/* Ширина карточки = 1/3 ряда; 1–2 шт. тоже по центру, не растягиваются */}
            <div className="flex flex-wrap justify-center gap-4">
              {project.highlights.map((h, i) => (
                <motion.article
                  key={h.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="flex w-full flex-col md:w-[calc((100%-2rem)/3)] md:shrink-0"
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

            <div className="mt-10 flex flex-wrap justify-center gap-2">
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

        {project.quote?.text.trim() ? (
          <section className="relative bg-void px-5 py-24 md:px-10 md:py-32">
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
        ) : null}

        {/* Next / CTA — тёмная секция, два пятна по бокам */}
        <section className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[12%] top-1/2 size-[22rem] -translate-y-1/2 rounded-full bg-vio/20 blur-[100px]" />
            <div className="absolute -right-[10%] top-1/2 size-[20rem] -translate-y-1/2 rounded-full bg-cyan-neon/15 blur-[100px]" />
          </div>
          <div className="relative mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row md:items-stretch md:justify-between">
            {prev && (
              <Link
                to={`/project/${prev.slug}`}
                className="group relative flex min-h-[11rem] flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] p-6 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)] md:min-h-[13rem] md:p-8"
              >
                <img
                  src={prev.preview}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/45" />
                <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  {t.project.prev}
                </p>
                <div className="relative z-10 mt-6">
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
              data-track="Кейс — Заказать сайт"
              className="group flex flex-1 flex-col items-start justify-between rounded-2xl border border-dashed border-white/20 p-6 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio hover:shadow-[0_0_40px_rgba(124,108,255,0.18)] md:p-8"
            >
              <p className="font-display text-xl font-semibold uppercase leading-tight text-ink md:text-2xl">
                {t.project.nextYours}
                <span className="text-gradient-neon">{t.project.yours}</span>?
              </p>
              <span className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-colors group-hover:bg-vio group-hover:text-ink">
                {t.project.order}
              </span>
            </Link>

            {next && (
              <Link
                to={`/project/${next.slug}`}
                className="group relative flex min-h-[11rem] flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] p-6 text-right shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)] md:min-h-[13rem] md:p-8"
              >
                <img
                  src={next.preview}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/45" />
                <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  {t.project.next}
                </p>
                <div className="relative z-10 mt-6">
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
    </PageShell>
  );
}
