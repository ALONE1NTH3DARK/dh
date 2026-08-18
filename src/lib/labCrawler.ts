/** PageSpeed Insights / Lighthouse / headless lab runs. */
export function isLabCrawler(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  if (
    /Chrome-Lighthouse|PageSpeed|PTST|GTmetrix|Pingdom|Speed Insights|HeadlessChrome/i.test(
      ua
    )
  ) {
    return true;
  }

  return Boolean(navigator.webdriver);
}
