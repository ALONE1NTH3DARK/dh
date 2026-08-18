import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { scrollToId } from "../lib/scrollState";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/darkhorse_webagency" },
  { label: "Telegram", href: "https://t.me/darkhorse_webagency" },
  { label: "WhatsApp", href: "https://wa.me/77070701337" },
];

/** Подгоняет текст ровно по ширине контейнера. */
function FitWidthWordmark({
  text,
  className = "text-gradient-neon uppercase tracking-[-0.04em]",
}: {
  text: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    const fit = () => {
      el.style.transform = "none";
      el.style.fontSize = "100px";
      const measured = el.scrollWidth;
      const available = box.clientWidth;
      if (measured <= 0 || available <= 0) return;
      el.style.fontSize = `${(available / measured) * 100}px`;
    };

    fit();
    void document.fonts?.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [text]);

  return (
    <span ref={boxRef} className="block w-full overflow-hidden">
      <span
        ref={textRef}
        className={`block whitespace-nowrap font-display font-bold leading-none ${className}`}
      >
        {text}
      </span>
    </span>
  );
}

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className="relative z-20 overflow-hidden bg-void pt-16 md:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(color-mix(in srgb, var(--color-ink) 8%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 8%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
        }}
      />
      {/* Как хедер: max-w-[1600px] + px-5/md:px-10 — от логотипа до «Связаться» */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
        {/* Бейдж + описание */}
        <div className="relative z-30 max-w-md">
          <div className="relative inline-grid">
            <a
              href="tel:+77070701337"
              data-track="Футер — Телефон"
              className="z-10 col-start-1 row-start-1 w-[0] min-w-full translate-y-[8px] leading-[0.7]"
            >
              <FitWidthWordmark
                text="+7 70 70 70 13 37"
                className="text-[#AF5] tracking-[-0.05em]"
              />
            </a>
            <div className="group relative col-start-1 row-start-2">
              <button
                type="button"
                className="bg-gradient-to-br from-[#AF5] via-[#9ef07a] to-[#5fe3ff] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#06040a] transition-opacity duration-200 group-hover:opacity-90 md:text-xs"
                aria-haspopup="menu"
                aria-label="Соцсети @DARKHORSE_WEBAGENCY"
              >
                @DARKHORSE_WEBAGENCY
              </button>

              <div
                role="menu"
                className="invisible absolute left-0 top-full z-40 pt-1.5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              >
                <div className="min-w-[10.5rem] overflow-hidden border border-[#AF5]/80 bg-void py-0.5 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                  {SOCIAL.map((item) => (
                    <a
                      key={item.label}
                      role="menuitem"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#AF5] transition-colors hover:bg-gradient-to-r hover:from-[#AF5] hover:via-[#9ef07a] hover:to-[#5fe3ff] hover:text-[#06040a] light:text-[#06040a]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-mute md:text-base">
            Веб разработка любой сложности. Сайты под ключ, которые продают, пока
            вы занимаетесь бизнесом.
          </p>
        </div>

        {/* Wordmark */}
        <div className="relative mt-6 md:mt-8">
          <Link
            to="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                scrollToId("#top");
              }
            }}
            className="block w-full"
            aria-label="DARKHORSE — на главную"
          >
            <FitWidthWordmark text="Darkhorse" />
          </Link>
        </div>

        {/* Низ */}
        <div className="relative z-10 mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-6 text-center md:mt-10 md:flex-row md:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            © {new Date().getFullYear()} Darkhorse · Все права защищены
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:justify-end">
            <a
              href="mailto:hello@darkhorse.kz"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              Написать на почту
            </a>
            <span className="text-mute/50" aria-hidden>
              •
            </span>
            <Link
              to="/privacy"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              Политика конфиденциальности
            </Link>
            <span className="text-mute/50" aria-hidden>
              •
            </span>
            <a
              href="/sitemap.xml"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              Карта сайта
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
