import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, MoveDown } from "lucide-react";
import { localizeProjects, type ProjectKind } from "@/data/projects";
import { useT } from "@/i18n/useT";
import { useLocale } from "@/lib/locale";
import { lenisRef, readSvh, scrollToId, scrollToY, scrollY } from "@/lib/scrollState";
import { cn } from "@/lib/cn";
import SectionLabel from "@/components/ui/SectionLabel";

const FILTERS: readonly ProjectKind[] = [
  "latest",
  "landing",
  "site",
  "shop",
  "blog",
];

const SLIDE_W = "group flex h-full w-[86vw] shrink-0 md:h-auto md:w-[46vw] xl:w-[36vw]";
const SLIDE_CARD =
  "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2 shadow-[var(--card-shadow)] transition-[border-color,box-shadow] duration-500 group-hover:border-vio/40 group-hover:shadow-[var(--card-shadow-hover)]";
const SLIDE_CHROME =
  "flex h-8 shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 md:h-10 md:px-5";
const SLIDE_MEDIA =
  "relative min-h-0 flex-1 overflow-hidden md:h-[38vh] md:flex-none xl:h-[46vh]";
const SLIDE_FOOTER =
  "flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-t border-white/[0.07] px-4 md:h-[5.25rem] md:px-5";

function PortfolioFilters({
  filter,
  labels,
  ariaLabel,
  onChange,
}: {
  filter: ProjectKind;
  labels: Record<ProjectKind, string>;
  ariaLabel: string;
  onChange: (id: ProjectKind) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    };
    place();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  const pick = (id: ProjectKind) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <>
      <div ref={rootRef} className="relative shrink-0 md:hidden">
        <button
          ref={btnRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          data-track={`Портфолио — Фильтр ${labels[filter]}`}
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-1.5 text-sm leading-relaxed text-ink"
        >
          {labels[filter]}
          <ChevronDown
            className={cn("size-4 shrink-0 text-mute transition-transform duration-200", open && "rotate-180")}
            strokeWidth={1.75}
          />
        </button>
        {open ? (
          <div
            role="menu"
            aria-label={ariaLabel}
            style={{ top: menuPos.top, right: menuPos.right }}
            className="fixed z-[80] min-w-[13.5rem] rounded-2xl border border-white/15 bg-void/90 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl light:shadow-[0_12px_32px_rgba(24,21,31,0.12)]"
          >
            {FILTERS.map((id) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  data-track={`Портфолио — Фильтр ${labels[id]}`}
                  onClick={() => pick(id)}
                  className={cn(
                    "flex w-full rounded-xl px-3 py-2.5 text-left text-sm leading-relaxed transition-colors",
                    active ? "bg-ink text-void" : "text-mute hover:bg-white/[0.06] hover:text-ink",
                  )}
                >
                  {labels[id]}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <nav aria-label={ariaLabel} className="hidden md:block">
        <div className="flex w-max items-center md:ml-auto md:w-auto md:flex-wrap md:justify-end">
          {FILTERS.map((id, i) => {
            const active = filter === id;
            return (
              <span key={id} className="flex items-center">
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="px-2 font-mono text-[12px] text-mute md:px-2.5"
                  >
                    ·
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-pressed={active}
                  data-track={`Портфолио — Фильтр ${labels[id]}`}
                  onClick={() => onChange(id)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap text-sm leading-relaxed transition-colors md:text-base",
                    active ? "font-medium text-ink" : "text-mute hover:text-ink",
                  )}
                >
                  {labels[id]}
                </button>
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}

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
  const t = useT();

  return (
    <div className={SLIDE_W}>
      <button
        type="button"
        onClick={() => scrollToId("#contact")}
        data-track="Портфолио — Заказать сайт"
        className={`${SLIDE_CARD} p-0 text-left font-[inherit]`}
      >
        <SlideChrome label={t.portfolio.nextLabel} showArrow={false} />

        <div className={SLIDE_MEDIA}>
          <img
            src="/projects/next/preview-dark.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top light:hidden"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/projects/next/preview-light.webp"
            alt=""
            className="absolute inset-0 hidden h-full w-full object-cover object-top light:block"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 xl:p-7">
            <p className="font-display text-[clamp(1.85rem,3.4vw,3.15rem)] font-bold leading-[1.20] tracking-tight text-ink">
              {t.portfolio.nextTitle}
              <span className="text-gradient-neon">{t.portfolio.nextAccent}</span>
            </p>
            <p className="mt-3 max-w-[28rem] text-[21px] leading-snug text-ink/75">
              {t.portfolio.nextText1}
              <br />
              {t.portfolio.nextText2}
            </p>
          </div>
        </div>

        <div className="flex h-[4.5rem] shrink-0 items-center justify-start border-t border-white/[0.07] px-4 md:h-[5.25rem] md:px-5">
          <span className="shrink-0 rounded-full bg-ink px-5 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 group-hover:bg-vio group-hover:text-ink group-hover:shadow-[0_0_32px_rgba(124,108,255,0.4)] md:px-6 md:py-3">
            {t.portfolio.order}
          </span>
        </div>
      </button>
    </div>
  );
}

/** Липкая секция: вертикальный скролл двигает работы горизонтально.
 *  Движение 1:1 от скролла — та же скорость/остановка, что у Lenis на всём сайте. */
export default function Portfolio() {
  const t = useT();
  const locale = useLocale();
  const projects = localizeProjects(locale);
  const [filter, setFilter] = useState<ProjectKind>("latest");
  const visibleProjects = useMemo(
    () => projects.filter((p) => p.kinds.includes(filter)),
    [filter, projects],
  );
  const visibleKey = visibleProjects.map((p) => p.slug).join("|");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef(filter);

  const counterRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dims = useRef<{ over: number; svh: number; offsets: number[]; widths: number[] }>({
    over: 0,
    svh: 0,
    offsets: [],
    widths: [],
  });
  const lastIdx = useRef(-1);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const filterChanged = filterRef.current !== filter;
    filterRef.current = filter;
    slideRefs.current.length = visibleProjects.length;
    lastIdx.current = -1;
    if (counterRef.current) {
      counterRef.current.textContent = visibleProjects.length ? "01" : "00";
    }

    const y = scrollY();
    const top = sec.getBoundingClientRect().top + y;
    const inSection = y + 8 >= top && y < top + sec.offsetHeight;
    if (filterChanged && inSection) {
      // Pin to the start before the reel shortens, otherwise a sparse
      // filter drops the user into the next section.
      track.style.transform = "translate3d(0px, 0, 0)";
      scrollToY(top, 0);
    }

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
        // Lenis.resize() snaps animatedScroll → actualScroll and kills
        // in-flight smoothing. Skip while the user is scrolling; Lenis
        // already updates its limit via its own ResizeObserver.
        const lenis = lenisRef.current;
        if (lenis && (!lenis.isScrolling || filterChanged)) lenis.resize();
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    let running = false;
    const loop = () => {
      if (!running) return;
      const rect = sec.getBoundingClientRect();
      const vh = dims.current.svh || window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const x = -p * dims.current.over;
      track.style.transform = `translate3d(${x}px, 0, 0)`;

      const n = visibleProjects.length;
      const projIdx = n <= 0 ? 0 : n === 1 ? 1 : 1 + Math.round(p * (n - 1));
      if (counterRef.current && lastIdx.current !== projIdx) {
        lastIdx.current = projIdx;
        counterRef.current.textContent = String(projIdx).padStart(2, "0");
      }

      raf = requestAnimationFrame(loop);
    };

    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        setRunning(Boolean(entry?.isIntersecting) && document.visibilityState === "visible");
      },
      { rootMargin: "20% 0px" }
    );
    io.observe(sec);

    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      const onScreen = sec.getBoundingClientRect().bottom > 0 && sec.getBoundingClientRect().top < window.innerHeight;
      setRunning(visible && onScreen);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      setRunning(false);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [filter, visibleKey, visibleProjects.length]);

  return (
    <section id="portfolio" ref={sectionRef} className="relative z-20 bg-void">
      <div className="sticky top-0 flex h-svh min-h-0 flex-col overflow-hidden bg-void">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,108,255,0.05),transparent_50%)]"
        />
        <div className="relative z-20 px-5 pt-24 md:px-14 md:pt-32">
          <div className="flex items-start justify-between gap-6">
            <div>
              <SectionLabel>{t.portfolio.label}</SectionLabel>
              <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-semibold uppercase leading-[1.20]">
                {t.portfolio.titleBefore}<span className="text-gradient-warm">{t.portfolio.titleAccent}</span>
              </h2>
            </div>
            <div className="hidden items-center gap-4 pt-8 md:flex">
              <span className="font-display text-4xl font-semibold text-ink">
                <span ref={counterRef}>01</span>
                <span className="text-mute/60 text-2xl"> / {String(visibleProjects.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 md:mt-5 md:gap-8">
            <p className="flex min-w-0 items-center gap-2 text-sm leading-relaxed text-mute md:text-base">
              {t.portfolio.scrollHint}
              <MoveDown className="size-3.5 shrink-0 animate-bounce" strokeWidth={2} />
            </p>
            <PortfolioFilters
              filter={filter}
              labels={t.portfolio.filters}
              ariaLabel={t.portfolio.filterLabel}
              onChange={setFilter}
            />
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-stretch pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-4 md:items-center md:pb-0 md:pt-0">
          <div ref={trackRef} className="flex h-full w-max items-stretch gap-[4vw] px-5 will-change-transform md:h-auto md:items-center md:px-14">
            {visibleProjects.map((pr, i) => (
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
                      alt={`${t.portfolio.siteAlt} ${pr.title}`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
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
