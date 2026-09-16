import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import LegalLayout from "@/features/legal/LegalLayout";
import { useT } from "@/i18n/useT";
import { SITE } from "@/lib/seo";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-semibold uppercase leading-snug text-ink md:text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(name|host|short|email)\}/g, (_, key: string) => vars[key] ?? "");
}

function WithEmail({
  template,
  vars,
}: {
  template: string;
  vars: { name: string; host: string; short: string; email: string };
}) {
  const prepared = fill(template, { ...vars, email: "{email}" });
  const parts = prepared.split("{email}");
  if (parts.length === 1) return <>{prepared}</>;
  return (
    <>
      {parts[0]}
      <a
        href={`mailto:${vars.email}`}
        className="text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-vio"
      >
        {vars.email}
      </a>
      {parts.slice(1).join(vars.email)}
    </>
  );
}

export default function PrivacyPage() {
  const t = useT();
  const vars = {
    name: SITE.name,
    host: SITE.origin.replace("https://", ""),
    short: SITE.shortName,
    email: SITE.email,
  };

  return (
    <LegalLayout label={t.legal.privacyLabel} title={t.legal.privacyTitle}>
      <p>{fill(t.legal.privacyIntro, vars)}</p>

      <Block title={t.legal.whoTitle}>
        <p>
          <WithEmail template={t.legal.whoText} vars={vars} />
        </p>
      </Block>

      <Block title={t.legal.notTitle}>
        <p>{t.legal.notText}</p>
      </Block>

      <Block title={t.legal.formTitle}>
        <p>{t.legal.formText}</p>
      </Block>

      <Block title={t.legal.techTitle}>
        <p>{t.legal.techText}</p>
      </Block>

      <Block title={t.legal.cookieTitle}>
        <p>{t.legal.cookieText}</p>
      </Block>

      <Block title={t.legal.rightsTitle}>
        <p>{fill(t.legal.rightsText, vars)}</p>
      </Block>

      <Block title={t.legal.changesTitle}>
        <p>{t.legal.changesText}</p>
      </Block>

      <p>
        <Link
          to="/sitemap"
          className="text-ink underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-vio"
        >
          {t.legal.sitemapLink}
        </Link>
      </p>
    </LegalLayout>
  );
}
