import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import { ResultChapter, AboutChapter } from "../components/Chapters";
import Portfolio from "../components/Portfolio";
import DigitalCardGift from "../components/DigitalCardGift";
import SolidSections, { Services, Process } from "../components/SolidSections";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { lenisRef, scrollToId } from "../lib/scrollState";
import { isLabCrawler } from "../lib/labCrawler";

function pinHomeToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  lenisRef.current?.scrollTo(0, { immediate: true });
}

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (isLabCrawler()) return;

    if (!window.location.hash) pinHomeToTop();

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;
    const t = window.setTimeout(() => scrollToId(`#${scrollTo}`), 100);
    return () => clearTimeout(t);
  }, [location.state, location.key]);

  return (
    <div className="relative bg-void font-body text-ink">
      <Nav />

      <main className="relative z-10">
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <DigitalCardGift />
        <AboutChapter />
        <ResultChapter />
        <Pricing />
        <SolidSections />
      </main>

      <Footer />
      <BackToTop track="Главная — Наверх" />
    </div>
  );
}
