import { getProject, PROJECTS, localizeProject } from "../data/projects";
import type { Locale } from "./locale";

export const SITE = {
  origin: "https://darkhorse.kz",
  name: "DARKHORSE WEBAGENCY",
  shortName: "DARKHORSE",
  email: "hello@darkhorse.kz",
  phone: "+77070701337",
  locale: "ru_KZ",
  language: "ru-KZ",
  defaultOgPath: "/og.jpg",
  logoPath: "/logo-512.png",
  sameAs: [
    "https://instagram.com/darkhorse_webagency",
    "https://t.me/darkhorse_webagency",
    "https://wa.me/77070701337",
  ],
} as const;

const HOME = {
  ru: {
    title: "Веб-студия DARKHORSE — продающие сайты под ключ",
    description:
      "Создаём современные сайты под ключ: стратегия, дизайн, разработка и рост конверсии. Веб-агентство DARKHORSE — сайты, где эстетика работает на заявки.",
    ogAlt: "DARKHORSE — продающие сайты под ключ",
    catalog: "Услуги веб-студии DARKHORSE",
    services: ["Сайт под ключ", "Дизайн и брендинг сайта", "Поддержка и развитие сайта"],
    knowsAbout: [
      "Разработка сайтов",
      "Дизайн сайтов",
      "Интернет-магазины",
      "Лендинги",
      "Веб-приложения",
    ],
  },
  en: {
    title: "DARKHORSE web studio — conversion-focused websites",
    description:
      "We build modern websites end to end: strategy, design, development and conversion growth. DARKHORSE — sites where aesthetics drive inquiries.",
    ogAlt: "DARKHORSE — conversion-focused websites",
    catalog: "DARKHORSE web studio services",
    services: ["Turnkey website", "Site design and branding", "Support and growth"],
    knowsAbout: [
      "Website development",
      "Website design",
      "Online stores",
      "Landing pages",
      "Web applications",
    ],
  },
} as const;

const COPY = {
  ru: {
    adminTitle: "Статистика · DARKHORSE",
    cardsTitle: "Электронная визитка к сайту — DARKHORSE",
    cardsDescription:
      "Цифровая визитка в фирменном стиле — в подарок к каждому сайту от веб-студии DARKHORSE. QR, контакты и мессенджеры в одном экране.",
    cardsAlt: "Электронная визитка DARKHORSE",
    privacyTitle: "Политика конфиденциальности — DARKHORSE",
    privacyDescription:
      "Политика конфиденциальности веб-студии DARKHORSE: мы не продаём и не передаём персональные данные третьим лицам и соблюдаем законодательство Республики Казахстан.",
    privacyAlt: "Политика конфиденциальности DARKHORSE",
    sitemapTitle: "Карта сайта — DARKHORSE",
    sitemapDescription:
      "Карта сайта DARKHORSE: главная, услуги, портфолио, кейсы, электронная визитка и политика конфиденциальности.",
    sitemapAlt: "Карта сайта DARKHORSE",
    projectTitle: (title: string) => `${title} — кейс веб-студии DARKHORSE`,
    projectDescription: (summary: string, cat: string, result: string) =>
      `${summary} ${cat} от DARKHORSE. Результат: ${result}.`,
    projectAlt: (title: string) => `${title} — сайт от DARKHORSE`,
    notFoundTitle: "404 — страница не найдена · DARKHORSE",
  },
  en: {
    adminTitle: "Analytics · DARKHORSE",
    cardsTitle: "Digital business card with your website — DARKHORSE",
    cardsDescription:
      "A branded digital business card — included with every website from DARKHORSE. QR, contacts and messengers on one screen.",
    cardsAlt: "DARKHORSE digital business card",
    privacyTitle: "Privacy policy — DARKHORSE",
    privacyDescription:
      "DARKHORSE privacy policy: we do not sell or share personal data with third parties and we comply with the laws of the Republic of Kazakhstan.",
    privacyAlt: "DARKHORSE privacy policy",
    sitemapTitle: "Sitemap — DARKHORSE",
    sitemapDescription:
      "DARKHORSE sitemap: home, services, portfolio, case studies, digital business card and privacy policy.",
    sitemapAlt: "DARKHORSE sitemap",
    projectTitle: (title: string) => `${title} — a DARKHORSE case study`,
    projectDescription: (summary: string, cat: string, result: string) =>
      `${summary} ${cat} by DARKHORSE. Result: ${result}.`,
    projectAlt: (title: string) => `${title} — a website by DARKHORSE`,
    notFoundTitle: "404 — page not found · DARKHORSE",
  },
} as const;

const HOME_TITLE = HOME.ru.title;
const INDEX_ROBOTS = "index, follow, max-image-preview:large";
const NOINDEX = "noindex, nofollow";

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: "website" | "article";
  ogImage: string;
  ogImageAlt: string;
  jsonLd: unknown;
};

function absUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = SITE.origin.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function canonicalFor(pathname: string): string {
  if (pathname === "/") return `${SITE.origin}/`;
  return `${SITE.origin}${pathname.replace(/\/$/, "")}`;
}

function organizationJsonLd(locale: Locale = "ru") {
  const copy = HOME[locale];
  return {
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${SITE.origin}/#organization`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: `${SITE.origin}/`,
    logo: absUrl(SITE.logoPath),
    image: absUrl(SITE.defaultOgPath),
    email: SITE.email,
    telephone: SITE.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KZ",
    },
    areaServed: [
      { "@type": "Country", name: "Kazakhstan" },
      { "@type": "Country", name: "Russia" },
    ],
    sameAs: [...SITE.sameAs],
    knowsAbout: [...copy.knowsAbout],
  };
}

function websiteJsonLd(locale: Locale = "ru") {
  return {
    "@type": "WebSite",
    "@id": `${SITE.origin}/#website`,
    url: `${SITE.origin}/`,
    name: SITE.name,
    inLanguage: locale === "en" ? "en" : SITE.language,
    publisher: { "@id": `${SITE.origin}/#organization` },
  };
}

function webPageJsonLd(
  seo: {
    title: string;
    description: string;
    canonical: string;
  },
  locale: Locale = "ru"
) {
  return {
    "@type": "WebPage",
    "@id": `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    inLanguage: locale === "en" ? "en" : SITE.language,
    isPartOf: { "@id": `${SITE.origin}/#website` },
    about: { "@id": `${SITE.origin}/#organization` },
  };
}

function graph(nodes: unknown[], locale: Locale = "ru") {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(locale), websiteJsonLd(locale), ...nodes],
  };
}

function page(
  partial: Omit<PageSeo, "jsonLd"> & { jsonLdNodes?: unknown[]; locale?: Locale }
): PageSeo {
  const { jsonLdNodes = [], locale = "ru", ...rest } = partial;
  return {
    ...rest,
    jsonLd: graph(
      [
        webPageJsonLd(
          {
            title: rest.title,
            description: rest.description,
            canonical: rest.canonical,
          },
          locale
        ),
        ...jsonLdNodes,
      ],
      locale
    ),
  };
}

export function getPageSeo(pathname: string, locale: Locale = "ru"): PageSeo {
  const path = pathname.replace(/\/$/, "") || "/";
  const home = HOME[locale];
  const copy = COPY[locale];

  if (path === "/admin") {
    return page({
      title: copy.adminTitle,
      description: home.description,
      canonical: canonicalFor("/admin"),
      robots: NOINDEX,
      ogType: "website",
      ogImage: absUrl(SITE.defaultOgPath),
      ogImageAlt: home.ogAlt,
      locale,
    });
  }

  if (path === "/") {
    return page({
      title: home.title,
      description: home.description,
      canonical: canonicalFor("/"),
      robots: INDEX_ROBOTS,
      ogType: "website",
      ogImage: absUrl(SITE.defaultOgPath),
      ogImageAlt: home.ogAlt,
      locale,
      jsonLdNodes: [
        {
          "@type": "OfferCatalog",
          name: home.catalog,
          itemListElement: home.services.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      ],
    });
  }

  if (path === "/digital-cards") {
    return page({
      title: copy.cardsTitle,
      description: copy.cardsDescription,
      canonical: canonicalFor("/digital-cards"),
      robots: INDEX_ROBOTS,
      ogType: "website",
      ogImage: absUrl(SITE.defaultOgPath),
      ogImageAlt: copy.cardsAlt,
      locale,
    });
  }

  if (path === "/privacy") {
    return page({
      title: copy.privacyTitle,
      description: copy.privacyDescription,
      canonical: canonicalFor("/privacy"),
      robots: INDEX_ROBOTS,
      ogType: "website",
      ogImage: absUrl(SITE.defaultOgPath),
      ogImageAlt: copy.privacyAlt,
      locale,
    });
  }

  if (path === "/sitemap") {
    return page({
      title: copy.sitemapTitle,
      description: copy.sitemapDescription,
      canonical: canonicalFor("/sitemap"),
      robots: INDEX_ROBOTS,
      ogType: "website",
      ogImage: absUrl(SITE.defaultOgPath),
      ogImageAlt: copy.sitemapAlt,
      locale,
    });
  }

  const projectMatch = path.match(/^\/project\/([^/]+)$/);
  if (projectMatch) {
    const raw = getProject(projectMatch[1]);
    const project = raw ? localizeProject(raw, locale) : raw;
    if (project) {
      return page({
        title: copy.projectTitle(project.title),
        description: copy.projectDescription(project.summary, project.cat, project.result),
        canonical: canonicalFor(path),
        robots: INDEX_ROBOTS,
        ogType: "article",
        ogImage: absUrl(project.preview),
        ogImageAlt: copy.projectAlt(project.title),
        locale,
        jsonLdNodes: [
          {
            "@type": "Article",
            headline: project.title,
            description: project.summary,
            image: absUrl(project.preview),
            author: { "@id": `${SITE.origin}/#organization` },
            publisher: { "@id": `${SITE.origin}/#organization` },
            mainEntityOfPage: { "@id": `${canonicalFor(path)}#webpage` },
          },
        ],
      });
    }
  }

  return page({
    title: copy.notFoundTitle,
    description: home.description,
    canonical: canonicalFor(path),
    robots: "noindex, follow",
    ogType: "website",
    ogImage: absUrl(SITE.defaultOgPath),
    ogImageAlt: SITE.name,
    locale,
  });
}

export function ogLocaleFor(locale: Locale = "ru"): string {
  return locale === "en" ? "en_US" : SITE.locale;
}

export function getPublicPaths(): string[] {
  return [
    "/",
    "/digital-cards",
    ...PROJECTS.map((project) => `/project/${project.slug}`),
    "/privacy",
    "/sitemap",
  ];
}

export function renderSitemapXml(): string {
  const urls = getPublicPaths().map((path) => {
    const loc = canonicalFor(path);
    const priority =
      path === "/"
        ? "1.0"
        : path === "/digital-cards"
          ? "0.8"
          : path.startsWith("/project/")
            ? "0.7"
            : "0.4";
    const changefreq = path === "/" ? "weekly" : "monthly";
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderSeoHead(seo: PageSeo): string {
  const imageType = seo.ogImage.endsWith(".webp")
    ? "image/webp"
    : seo.ogImage.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

  return [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="${escapeAttr(seo.robots)}" />`,
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
    `<meta property="og:type" content="${seo.ogType}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(seo.ogImage)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(seo.ogImageAlt)}" />`,
    `<meta property="og:image:type" content="${imageType}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(seo.ogImage)}" />`,
    `<script type="application/ld+json" id="json-ld">${JSON.stringify(seo.jsonLd)}</script>`,
  ].join("\n    ");
}

export { HOME_TITLE, INDEX_ROBOTS };
