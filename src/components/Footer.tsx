import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useT } from "../i18n/useT";
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

    const raf = requestAnimationFrame(() => {
      fit();
      void document.fonts?.ready.then(fit);
    });

    const ro = new ResizeObserver(fit);
    ro.observe(box);
    const parent = box.parentElement;
    if (parent) ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
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
  const t = useT();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className="relative z-20 overflow-hidden bg-void pt-16 md:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06] light:bg-black/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] light:opacity-[0.08]"
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
        <div className="relative z-30 flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
          <div className="min-w-0 flex-1">
            <Link
              to="/"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  scrollToId("#top");
                }
              }}
              className="block w-full"
              aria-label={t.footer.home}
            >
              <FitWidthWordmark text="Darkhorse" />
            </Link>
          </div>

          <div className="shrink-0 md:text-right">
            <a
              href="tel:+77070701337"
              data-track="Футер — Телефон"
              className="block font-display text-[25px] font-bold leading-none tracking-[-0.05em] text-ink"
            >
              +7 70 70 70 13 37
            </a>

            <div className="group relative mt-1">
              <button
                type="button"
                className="bg-ink px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-void md:text-xs"
                aria-haspopup="menu"
                aria-label={t.footer.social}
              >
                @DARKHORSE_WEBAGENCY
              </button>

              <div
                role="menu"
                className="invisible absolute right-0 top-full z-40 min-w-full opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              >
                <div className="border border-ink/20 bg-void-2 py-0.5 light:border-black/10">
                  {SOCIAL.map((item) => (
                    <a
                      key={item.label}
                      role="menuitem"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track={`Футер — ${item.label}`}
                      className="block px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-void"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-2 text-[15px] text-mute/45 light:text-mute/70">
              {t.footer.tagline}
            </p>
          </div>
        </div>

        {/* Низ */}
        <div className="relative z-10 mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-6 text-center light:border-black/[0.06] md:mt-10 md:flex-row md:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            © {new Date().getFullYear()} Darkhorse · {t.footer.rights}
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:justify-end">
            <a
              href="mailto:hello@darkhorse.kz"
              data-track="Футер — Почта"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              {t.footer.email}
            </a>
            <span className="text-mute/50" aria-hidden>
              •
            </span>
            <Link
              to="/privacy"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              {t.footer.privacy}
            </Link>
            <span className="text-mute/50" aria-hidden>
              •
            </span>
            <Link
              to="/sitemap"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-ink"
            >
              {t.footer.sitemap}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
