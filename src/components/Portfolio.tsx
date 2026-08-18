import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MoveDown } from "lucide-react";
import { PROJECTS } from "../data/projects";
import { lenisRef, readSvh, scrollToId } from "../lib/scrollState";
import SectionLabel from "./SectionLabel";

const SLIDE_W = "group flex h-full w-[86vw] shrink-0 md:h-auto md:w-[46vw] xl:w-[36vw]";
const SLIDE_CARD =
  "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2 shadow-[var(--card-shadow)] transition-[border-color,box-shadow] duration-500 group-hover:border-vio/40 group-hover:shadow-[var(--card-shadow-hover)]";
const SLIDE_CHROME =
  "flex h-8 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 md:h-10 md:px-5";
const SLIDE_MEDIA =
  "relative min-h-0 flex-1 overflow-hidden md:h-[38vh] md:flex-none xl:h-[46vh]";
const SLIDE_FOOTER =
  "flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-t border-white/[0.07] px-4 md:h-[5.25rem] md:px-5";

function SlideChrome({ label, showArrow = true }: { label: string; showArrow?: boolean }) {
  return (
    <div className={`${SLIDE_CHROME} justify-between`}>
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-pink-neon/70" />
          <span className="size-2 rounded-full bg-amber-neon/70" />
          <span className="size-2 rounded-full bg-cyan-neon/70" />
        </span>
        <span className="truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-mute md:text-[10px]">
          {label}
        </span>
      </span>
      {showArrow ? (
        <ArrowUpRight className="size-3.5 shrink-0 text-white/25 transition-colors duration-300 group-hover:text-white/45 md:size-4" />
      ) : null}
    </div>
  );
}

/** Финальный слайд: статичный кадр и призыв обсудить новый сайт */
function NextCaseSlide() {
  return (
    <div className={SLIDE_W}>
      <button
        type="button"
        onClick={() => scrollToId("#contact")}
        data-track="Портфолио — Заказать сайт"
        className={`${SLIDE_CARD} p-0 text-left font-[inherit]`}
      >
        <SlideChrome label="your.site" showArrow={false} />

        <div className={SLIDE_MEDIA}>
          <img
            src="/projects/atelier-nord/preview.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/25" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 xl:p-7">
            <p className="font-display text-[clamp(1.85rem,3.4vw,3.15rem)] font-bold leading-[1.20] tracking-tight text-ink">
              Следующий сайт может быть{" "}
              <span className="text-gradient-neon">ваш?</span>
            </p>
            <p className="mt-3 max-w-[16rem] text-base leading-snug text-ink/75">
              Обсудим ваш новый сайт — от идеи до запуска.
            </p>
          </div>
        </div>

        <div className="flex h-[4.5rem] shrink-0 items-center justify-start border-t border-white/[0.07] px-4 md:h-[5.25rem] md:px-5">
          <span className="shrink-0 rounded-full bg-ink px-5 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 group-hover:bg-vio group-hover:text-ink group-hover:shadow-[0_0_32px_rgba(124,108,255,0.4)] md:px-6 md:py-3">
            Заказать сайт
          </span>
        </div>
      </button>
    </div>
  );
}

/** Липкая секция: вертикальный скролл двигает работы горизонтально.
 *  Движение 1:1 от скролла — та же скорость/остановка, что у Lenis на всём сайте. */
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dims = useRef<{ over: number; svh: number; offsets: number[]; widths: number[] }>({
    over: 0,
    svh: 0,
    offsets: [],
    widths: [],
  });
  const lastIdx = useRef(-1);

  useEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const measure = () => {
      const over = Math.max(0, track.scrollWidth - window.innerWidth);
      const svh = readSvh();
      dims.current.over = over;
      dims.current.svh = svh;
      dims.current.offsets = slideRefs.current.map((el) => (el ? el.offsetLeft : 0));
      dims.current.widths = slideRefs.current.map((el) => (el ? el.offsetWidth : 0));
      // 1:1 — вертикальный ход секции = горизонтальный ход ленты.
      // svh, not innerHeight: URL-bar show/hide must not resize the page.
      const nextH = `${svh + over}px`;
      if (sec.style.height !== nextH) {
        sec.style.height = nextH;
        lenisRef.current?.resize();
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    const loop = () => {
      const rect = sec.getBoundingClientRect();
      const vh = dims.current.svh || window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const x = -p * dims.current.over;
      track.style.transform = `translate3d(${x}px, 0, 0)`;

      const { offsets, widths } = dims.current;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < offsets.length; i++) {
        const center = Math.abs(
          x + offsets[i] + widths[i] / 2 - window.innerWidth / 2
        );
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
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="relative z-20 bg-void">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-void">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,108,255,0.05),transparent_50%)]"
        />
        <div className="relative flex items-start justify-between px-5 pt-20 md:px-14 md:pt-28">
          <div>
            <SectionLabel>Портфолио</SectionLabel>
            <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-semibold uppercase leading-[1.20]">
              Последние <span className="text-gradient-warm">проекты</span>
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm leading-relaxed text-mute md:mt-5 md:text-base">
              Скролл вниз двигает ленту
              <MoveDown className="size-3.5 shrink-0 animate-bounce" strokeWidth={2} />
            </p>
          </div>
          <div className="hidden items-center gap-4 pt-8 md:flex">
            <span className="font-display text-4xl font-semibold text-ink">
              <span ref={counterRef}>01</span>
              <span className="text-mute/60 text-2xl"> / {String(PROJECTS.length).padStart(2, "0")}</span>
            </span>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-stretch pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-4 md:items-center md:pb-0 md:pt-0">
          <div ref={trackRef} className="flex h-full w-max items-stretch gap-[4vw] px-5 will-change-transform md:h-auto md:items-center md:px-14">
            {PROJECTS.map((pr, i) => (
              <div
                key={pr.slug}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className={SLIDE_W}
              >
                <Link
                  to={`/project/${pr.slug}`}
                  data-track={`Портфолио — Кейс ${pr.title}`}
                  className={SLIDE_CARD}
                >
                  <SlideChrome label={pr.url} />

                  <div className={SLIDE_MEDIA}>
                    <img
                      src={pr.preview}
                      alt={`Сайт ${pr.title}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className={SLIDE_FOOTER}>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-medium tracking-wide text-ink md:text-lg">
                        {pr.title}
                      </p>
                      <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.22em] text-mute">
                        {pr.cat}
                        <span className="hidden md:inline"> · {pr.time}</span>
                      </p>
                    </div>
                    <span className="text-stroke-ghost shrink-0 font-display text-3xl font-semibold leading-none tracking-tight md:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            <NextCaseSlide />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-void to-transparent md:w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-void to-transparent md:w-10" />
        </div>
      </div>
    </section>
  );
}
