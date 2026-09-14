import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

function findSsrEntry() {
  const exact = path.join(ssrDir, "entry-server.js");
  if (fs.existsSync(exact)) return exact;
  const files = fs.existsSync(ssrDir)
    ? fs.readdirSync(ssrDir).filter((name) => name.endsWith(".js"))
    : [];
  if (files.length === 1) return path.join(ssrDir, files[0]);
  throw new Error(`SSR bundle not found in ${ssrDir}`);
}

function replaceSeoBlock(html, head) {
  if (html.includes("<!--seo-->") && html.includes("<!--/seo-->")) {
    return html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, () => `<!--seo-->\n    ${head}\n    <!--/seo-->`);
  }
  return html.replace("</head>", () => `    ${head}\n  </head>`);
}

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const mod = await import(pathToFileURL(findSsrEntry()).href);
const { render, getPublicPaths, getPageSeo, renderSeoHead, renderSitemapXml } = mod;

for (const url of [...getPublicPaths(), "/admin"]) {
  const appHtml = render(url);
  const head = renderSeoHead(getPageSeo(url));
  let html = replaceSeoBlock(template, head);
  html = html.replace(
    /<div id="root"><\/div>/,
    () => `<div id="root">${appHtml}</div>`
  );

  const file =
    url === "/"
      ? path.join(dist, "index.html")
      : path.join(dist, url.slice(1), "index.html");

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`prerender ${url} → ${path.relative(root, file)}`);
}

fs.writeFileSync(path.join(dist, "sitemap.xml"), renderSitemapXml());
console.log("prerender sitemap.xml");

fs.rmSync(ssrDir, { recursive: true, force: true });
