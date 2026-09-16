import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageview } from "@/lib/analytics";

/** Живёт внутри роутера и сообщает аналитике о смене страницы */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => initAnalytics(), []);

  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return null;
}
