import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import PageShell from "@/components/layout/PageShell";
import { AboutChapter, ResultChapter } from "@/features/home/Chapters";
import Contact from "@/features/home/Contact";
import Cta from "@/features/home/Cta";
import DigitalCardGift from "@/features/home/DigitalCardGift";
import Hero from "@/features/home/Hero";
import Portfolio from "@/features/home/Portfolio";
import Pricing from "@/features/home/Pricing";
import Process from "@/features/home/Process";
import Services from "@/features/home/Services";
import Testimonials from "@/features/home/Testimonials";
import { isLabCrawler } from "@/lib/labCrawler";
import { lenisRef, scrollToId } from "@/lib/scrollState";

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
    <PageShell backToTop="Главная — Наверх">
      <main className="relative z-10">
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <DigitalCardGift />
        <AboutChapter />
        <ResultChapter />
        <Pricing />
        <div className="relative z-20 bg-void">
          <Testimonials />
          <Cta />
          <Contact />
        </div>
      </main>
    </PageShell>
  );
}
