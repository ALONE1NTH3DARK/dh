import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import telegramPlane from "@/assets/telegram-plane.png";
import { useT } from "@/i18n/useT";
import { lenisRef, prevSectionTop, scrollToY, scrollY } from "@/lib/scrollState";
import { cn } from "@/lib/cn";

const TELEGRAM_HREF = "https://t.me/darkhorse_webagency";
const SIZE = 52;
const GAP = 12;
const STACK = SIZE + GAP + SIZE;
const STROKE = 2;
/** Радиус по центру обводки: кольцо целиком внутри круга кнопки */
const C = SIZE / 2;
const R = C - STROKE;
const CIRC = 2 * Math.PI * R;
const SHOW_AFTER = 16;

const FAB_CLASS = [
  "group relative grid size-[52px] place-items-center overflow-visible rounded-full",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vio",
].join(" ");

const FAB_GLASS = [
  "bg-void/75 text-ink shadow-[0_10px_32px_rgb(0_0_0/0.28)] backdrop-blur-xl",
  "light:shadow-[0_10px_36px_rgba(24,21,31,0.08)]",
].join(" ");

const FAB_TELEGRAM = [
  "bg-[linear-gradient(45deg,#7c6cff_0%,#5fe3ff_100%)] text-[#f2efff]",
  "shadow-[0_10px_32px_rgba(124,108,255,0.35)]",
  "light:bg-[linear-gradient(45deg,#7c6cff_0%,#4ab3e4_100%)]",
  "light:shadow-[0_10px_28px_rgba(124,108,255,0.28)]",
].join(" ");

const EXTRA_SECTION_IDS = ["process", "clients", "cta", "gallery"];
const ICON_HOVER = "transition-transform duration-200 ease-out group-hover:scale-125";

function scrollProgress(): number {
  const root = document.documentElement;
  const max = root.scrollHeight - root.clientHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/** Telegram всегда на своём месте; «наверх» прилетает снизу в оставленный слот. */
export default function BackToTop({ track = "Кейс — Наверх" }: { track?: string }) {
  const t = useT();
  const reactId = useId().replace(/:/g, "");
  const gradId = `to-top-grad-${reactId}`;
  const ringRef = useRef<SVGCircleElement>(null);
  const goingTopRef = useRef(false);
  const lastYRef = useRef(0);
  const pendingYRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const visible = phase === "in";
  const sectionIds = ["top", ...t.nav.links.map((link) => link.id), ...EXTRA_SECTION_IDS];

  useEffect(() => {
    let ticking = false;

    const apply = () => {
      ticking = false;
      const p = scrollProgress();
      const ring = ringRef.current;
      if (ring) ring.style.strokeDashoffset = String(CIRC * (1 - p));
      const y = scrollY();
      if (pendingYRef.current != null) {
        if (Math.abs(y - pendingYRef.current) < 16) pendingYRef.current = null;
        else if (y > lastYRef.current + 8) pendingYRef.current = null;
      }
      if (goingTopRef.current && (y <= SHOW_AFTER || y > lastYRef.current + 8)) {
        goingTopRef.current = false;
      }
      lastYRef.current = y;
      if (goingTopRef.current) return;
      const next = y > SHOW_AFTER;
      setPhase((prev) => {
        if (next) return "in";
        if (prev === "idle") return "idle";
        return "out";
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.documentElement);

    let offLenis: (() => void) | undefined;
    let tries = 0;
    const bindLenis = window.setInterval(() => {
      tries += 1;
      const lenis = lenisRef.current;
      if (lenis && !offLenis) {
        lenis.on("scroll", onScroll);
        offLenis = () => lenis.off("scroll", onScroll);
        window.clearInterval(bindLenis);
        return;
      }
      if (tries > 40) window.clearInterval(bindLenis);
    }, 50);

    return () => {
      window.clearInterval(bindLenis);
      offLenis?.();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
    };
  }, []);

  const goPrevSection = () => {
    const y = scrollY();
    const pending = pendingYRef.current;
    const fromY = pending != null && Math.abs(y - pending) < 480 ? pending : y;
    const target = prevSectionTop(fromY, sectionIds);
    pendingYRef.current = target;
    if (target <= SHOW_AFTER) {
      goingTopRef.current = true;
      setPhase((prev) => (prev === "idle" ? "idle" : "out"));
    }
    scrollToY(target);
  };

  return (
    <div
      className="pointer-events-none fixed z-[70] left-5 right-auto bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] md:left-auto md:right-11 md:bottom-11"
    >
      <div className="relative w-[52px] overflow-visible" style={{ height: STACK }}>
        <div className="absolute left-0 top-0 size-[52px] origin-center animate-fab-telegram-enter">
          <a
            href={TELEGRAM_HREF}
            target="_blank"
            rel="noreferrer"
            data-track={track.replace(/Наверх$/, "Telegram")}
            aria-label={t.openTelegram}
            className={cn(FAB_CLASS, FAB_TELEGRAM, "pointer-events-auto")}
          >
            <img
              src={telegramPlane}
              alt=""
              aria-hidden
              className={cn("size-[26px] object-contain", ICON_HOVER)}
            />
          </a>
        </div>
        <div
          className={cn(
            "absolute bottom-0 left-0 size-[52px]",
            phase === "in" && "animate-fab-totop-enter",
            phase === "out" && "animate-fab-totop-exit pointer-events-none",
            phase === "idle" && "pointer-events-none translate-y-20 opacity-0"
          )}
        >
          <button
            type="button"
            onClick={goPrevSection}
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            data-track={track}
            aria-label={t.prevSection}
            className={cn(FAB_CLASS, FAB_GLASS, visible ? "pointer-events-auto" : "pointer-events-none")}
          >
            <svg
              className="pointer-events-none absolute inset-0 block size-full"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              aria-hidden
            >
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c6cff" />
                  <stop offset="100%" stopColor="#5fe3ff" className="light:[stop-color:#2a86b0]" />
                </linearGradient>
              </defs>
              <g transform={`rotate(-90 ${C} ${C})`}>
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={STROKE}
                  className="text-ink/12 light:hidden"
                />
                <circle
                  ref={ringRef}
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke={`url(#${gradId})`}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                />
              </g>
            </svg>
            <ArrowUp className={cn("relative size-5", ICON_HOVER)} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
