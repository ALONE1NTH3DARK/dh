import { Link } from "react-router-dom";
import LegalLayout from "@/features/legal/LegalLayout";
import { localizeProjects } from "@/data/projects";
import { useT } from "@/i18n/useT";
import { useLocale } from "@/lib/locale";

const linkClass =
  "text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-vio";

export default function SitemapPage() {
  const t = useT();
  const locale = useLocale();
  const projects = localizeProjects(locale);

  return (
    <LegalLayout label={t.legal.sitemapLabel} title={t.legal.sitemapTitle}>
      <p>{t.legal.sitemapIntro}</p>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold uppercase leading-snug text-ink md:text-xl">
          {t.legal.sections}
        </h2>
        <ul className="space-y-2">
          {t.legal.sitemapItems.map((item) => (
            <li key={"scrollTo" in item ? `${item.to}-${item.scrollTo}` : item.to}>
              <Link
                to={item.to}
                state={"scrollTo" in item ? { scrollTo: item.scrollTo } : undefined}
                className={linkClass}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold uppercase leading-snug text-ink md:text-xl">
          {t.legal.cases}
        </h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link to={`/project/${project.slug}`} className={linkClass}>
                {project.title}
              </Link>
              <span className="text-mute/70"> — {project.cat}</span>
            </li>
          ))}
        </ul>
      </section>
    </LegalLayout>
  );
}
