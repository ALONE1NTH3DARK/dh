import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "@/App";
import { getPageSeo, getPublicPaths, renderSeoHead, renderSitemapXml } from "@/lib/seo";

export function render(url: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export { getPageSeo, getPublicPaths, renderSeoHead, renderSitemapXml };
