import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "@/lib/locale";
import { getPageSeo, ogLocaleFor, SITE, type PageSeo } from "@/lib/seo";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function applySeo(seo: PageSeo, locale: "ru" | "en") {
  document.title = seo.title;
  upsertMeta("name", "description", seo.description);
  upsertMeta("name", "robots", seo.robots);
  upsertCanonical(seo.canonical);

  upsertMeta("property", "og:type", seo.ogType);
  upsertMeta("property", "og:locale", ogLocaleFor(locale));
  upsertMeta("property", "og:locale:alternate", ogLocaleFor(locale === "en" ? "ru" : "en"));
  upsertMeta("property", "og:site_name", SITE.name);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:url", seo.canonical);
  upsertMeta("property", "og:image", seo.ogImage);
  upsertMeta("property", "og:image:alt", seo.ogImageAlt);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  upsertMeta("name", "twitter:image", seo.ogImage);

  let jsonLd = document.getElementById("json-ld");
  if (!jsonLd) {
    jsonLd = document.createElement("script");
    jsonLd.id = "json-ld";
    jsonLd.setAttribute("type", "application/ld+json");
    document.head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(seo.jsonLd);
}

export default function Seo() {
  const { pathname } = useLocation();
  const locale = useLocale();

  useEffect(() => {
    applySeo(getPageSeo(pathname, locale), locale);
  }, [pathname, locale]);

  return null;
}
