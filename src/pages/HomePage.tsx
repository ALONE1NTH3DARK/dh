import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import { ResultChapter, IncludedChapter } from "../components/Chapters";
import Portfolio from "../components/Portfolio";
import SolidSections, { Services, Stats, Process } from "../components/SolidSections";
import Pricing from "../components/Pricing";
import { lenisRef, scrollToId } from "../lib/scrollState";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

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
        <Stats />
        <ResultChapter />
        <Portfolio />
        <IncludedChapter />
        <Process />
        <Pricing />
        <SolidSections />
      </main>
    </div>
  );
}
