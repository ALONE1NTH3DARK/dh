import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MoveDown } from "lucide-react";
import { PROJECTS } from "../data/projects";
import { scrollToId } from "../lib/scrollState";

/** Липкая секция: вертикальный скролл двигает работы горизонтально */
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dims = useRef<{ over: number; offsets: number[]; widths: number[] }>({
    over: 0,
    offsets: [],
    widths: [],
  });
  const lastIdx = useRef(-1);

  useEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const measure = () => {
      dims.current.over = track.scrollWidth - window.innerWidth;
      dims.current.offsets = slideRefs.current.map((el) => (el ? el.offsetLeft : 0));
      dims.current.widths = slideRefs.current.map((el) => (el ? el.offsetWidth : 0));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    let raf = 0;
    const loop = () => {
      const rect = sec.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const x = -p * dims.current.over;
      track.style.transform = `translate3d(${x}px, 0, 0)`;

      // внутренний параллакс изображений
      const { offsets, widths } = dims.current;
      for (let i = 0; i < offsets.length; i++) {
        const img = imgRefs.current[i];
        if (!img) continue;
        const center = x + offsets[i] + widths[i] / 2 - window.innerWidth / 2;
        const lim = widths[i] * 0.07;
        const t = Math.max(-lim, Math.min(lim, -center * 0.03));
        img.style.transform = `translate3d(${t}px, 0, 0) scale(1.18)`;
      }

      // счётчик ближайшего проекта
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < offsets.length; i++) {
        if (!imgRefs.current[i]) continue;
        const center = Math.abs(x + offsets[i] + widths[i] / 2 - window.innerWidth / 2);
        if (center < bestDist) {
          bestDist = center;
          best = i;
        }
      }
      const projIdx = Math.min(best, PROJECTS.length - 1) + 1;
      if (counterRef.current && lastIdx.current !== projIdx) {
        lastIdx.current = projIdx;
        counterRef.current.textContent = String(projIdx).padStart(2, "0");
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="relative z-20 h-[430vh] bg-void">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,108,255,0.05),transparent_50%)]"
        />

        {/* шапка секции */}
        <div className="relative flex items-end justify-between px-5 pt-24 md:px-14 md:pt-28">
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs">
              <span className="h-px w-9 bg-vio" /> Портфолио
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3.6rem)] font-semibold uppercase leading-none">
              Последние <span className="text-gradient-neon">работы</span>
            </h2>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="font-display text-4xl font-semibold text-ink">
              <span ref={counterRef}>01</span>
              <span className="text-mute/60 text-2xl"> / {String(PROJECTS.length).padStart(2, "0")}</span>
            </span>
          </div>
        </div>

        {/* горизонтальный трек */}
        <div className="relative flex min-h-0 flex-1 items-center">
          <div ref={trackRef} className="flex w-max items-center gap-[4vw] px-[6vw] will-change-transform">
            {/* вступительная карточка */}
            <div className="w-[70vw] shrink-0 md:w-[30vw]">
              <p className="text-stroke-ghost select-none font-display text-[clamp(5rem,10vw,9rem)] font-bold leading-none">
                07—25
              </p>
              <p className="mt-6 max-w-xs text-base leading-relaxed text-mute md:text-lg">
                Каждый проект — это цифры после запуска, а не просто красивая
                картинка. Вот пять свежих историй.
              </p>
              <p className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                <MoveDown className="size-3.5 animate-bounce" />
                скролл вниз двигает ленту
              </p>
            </div>

            {/* проекты */}
            {PROJECTS.map((pr, i) => (
              <div
                key={pr.slug}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="group w-[86vw] shrink-0 md:w-[64vw] xl:w-[52vw]"
              >
                <Link
                  to={`/project/${pr.slug}`}
                  className="block overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-colors duration-500 group-hover:border-vio/50"
                >
                  {/* рамка браузера */}
                  <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 md:px-5">
                    <div className="flex gap-1.5">
                      <span className="size-2 rounded-full bg-pink-neon/70" />
                      <span className="size-2 rounded-full bg-amber-neon/70" />
                      <span className="size-2 rounded-full bg-cyan-neon/70" />
                    </div>
                    <span className="rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-mute md:text-[10px]">
                      {pr.url}
                    </span>
                  </div>

                  {/* скриншот */}
                  <div className="relative h-[30vh] overflow-hidden sm:h-[38vh] xl:h-[46vh]">
                    <img
                      ref={(el) => {
                        imgRefs.current[i] = el;
                      }}
                      src={pr.preview}
                      alt={`Сайт ${pr.title}`}
                      className="absolute inset-0 h-full w-full object-cover will-change-transform"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* подпись */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] px-4 py-4 md:px-5 md:py-5">
                    <div className="min-w-0">
                      <p className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-vio">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate font-display text-sm font-medium uppercase tracking-wide text-ink md:text-lg">
                          {pr.title}
                        </span>
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-mute md:text-[10px]">
                        {pr.cat} · {pr.time}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-cyan-neon/30 bg-cyan-neon/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-neon md:px-4 md:text-[10px]">
                      {pr.result}
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            {/* финальная карточка CTA */}
            <div className="w-[80vw] shrink-0 md:w-[40vw]">
              <button
                onClick={() => scrollToId("#contact")}
                className="group relative flex h-64 w-full flex-col items-start justify-between overflow-hidden rounded-2xl border border-dashed border-white/20 p-7 text-left transition-all duration-500 hover:border-vio md:h-72 md:p-9"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
                  Следующий кейс
                </p>
                <div>
                  <p className="font-display text-2xl font-semibold uppercase leading-tight text-ink md:text-3xl">
                    Может быть — <span className="text-gradient-neon">ваш</span>?
                  </p>
                  <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-void transition-all duration-300 group-hover:bg-vio group-hover:text-ink group-hover:shadow-[0_0_40px_rgba(124,108,255,0.5)]">
                    Обсудить проект
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* затемнение краёв */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-void to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-void to-transparent md:w-32" />
        </div>
      </div>
    </section>
  );
}
