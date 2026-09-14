import { Route, Routes } from "react-router-dom";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Seo from "./components/Seo";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import DigitalCardsPage from "./pages/DigitalCardsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SitemapPage from "./pages/SitemapPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <>
      <Seo />
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectPage />} />
        <Route path="/digital-cards" element={<DigitalCardsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
