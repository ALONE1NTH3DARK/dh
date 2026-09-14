import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useT } from "../i18n/useT";
import { setLocale, useLocale, type Locale } from "../lib/locale";
import { scrollToId } from "../lib/scrollState";
import { setTheme, useTheme } from "../lib/theme";
import { cn } from "../utils/cn";
import BrandMark from "./BrandMark";

type NavProps = {
  variant?: "home" | "project";
};

export default function Nav({ variant = "home" }: NavProps) {
  const t = useT();
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 40
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isProject = variant === "project";
  const LINKS = t.nav.links;

  useEffect(() => {
    const syncScrolled = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setScrolled(y > 40);
    };

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });
    // Lenis / restore scroll: catch mid-page load after layout
    const raf = requestAnimationFrame(syncScrolled);
    const timeout = window.setTimeout(syncScrolled, 50);

    return () => {
      window.removeEventListener("scroll", syncScrolled);
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goSection = (id: string) => {
    setOpen(false);
    if (isProject) {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    scrollToId(`#${id}`);
  };

  const goHome = () => {
    setOpen(false);
    if (isProject) {
      navigate("/");
      return;
    }
    scrollToId("#top");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] pt-[env(safe-area-inset-top,0px)]">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 border-b border-white/[0.06] bg-void/70 backdrop-blur-xl transition-opacity duration-500",
            scrolled || open || isProject ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <button
            onClick={goHome}
            className="group flex items-center gap-1.5"
            aria-label={t.nav.home}
          >
            <BrandMark interactive />
            <span className="font-display text-[17px] font-bold tracking-[2px] text-ink">
              DARKHORSE
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => goSection(l.id)}
                data-track={`Меню — ${l.label}`}
                className="group relative font-mono text-[14px] font-semibold uppercase tracking-[2px] text-mute transition-colors duration-300 hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-vio to-cyan-neon transition-all duration-400 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LocaleToggle />
            <ThemeToggle />
            {isProject ? (
              <Link
                to="/"
                state={{ scrollTo: "contact" }}
                data-track="Хедер — Связаться с нами"
                className="group hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] max-md:!hidden md:flex md:px-5 md:py-2.5"
              >
                {t.nav.contact}
              </Link>
            ) : (
              <button
                onClick={() => goSection("contact")}
                data-track="Хедер — Связаться с нами"
                className="group hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-vio/60 hover:bg-vio/15 hover:shadow-[0_0_28px_rgba(124,108,255,0.25)] max-md:!hidden md:flex md:px-5 md:py-2.5"
              >
                {t.nav.contact}
              </button>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-colors hover:border-vio hover:bg-vio/15 md:hidden"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-void/90 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col justify-center gap-2 px-8 pt-[calc(5rem+env(safe-area-inset-top,0px))]"
            >
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                  onClick={() => goSection(l.id)}
                  className="border-b border-white/[0.06] py-5 text-left font-display text-2xl font-medium uppercase tracking-[2px] text-ink transition-colors hover:text-vio"
                >
                  {l.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                onClick={() => goSection("contact")}
                data-track="Мобильное меню — Связаться с нами"
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void"
              >
                {t.nav.contact}
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LocaleToggle() {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const pick = (next: Locale) => {
    if (next !== locale) setLocale(next);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = [
    { code: "ru" as const, label: t.nav.localeRu },
    { code: "en" as const, label: t.nav.localeEn },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        data-track="Хедер — Язык"
        className={cn(
          "flex size-10 appearance-none items-center justify-center p-0 rounded-full border border-white/15 font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-ink transition-colors hover:border-vio hover:bg-vio/15",
          open && "border-vio bg-vio/15"
        )}
        aria-label={t.nav.locale}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="block leading-none -me-[0.14em] supports-[not(-moz-appearance:none)]:translate-y-px">
          {locale}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t.nav.locale}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-[calc(100%+8px)] z-[110] min-w-[10.5rem] rounded-2xl border border-white/15 bg-void/90 p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl light:shadow-[0_12px_32px_rgba(24,21,31,0.12)]"
          >
            {options.map((option) => {
              const active = locale === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  role="menuitem"
                  onClick={() => pick(option.code)}
                  data-track={`Хедер — Язык ${option.code.toUpperCase()}`}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "bg-ink text-void"
                      : "text-mute hover:bg-white/[0.06] hover:text-ink"
                  )}
                >
                  <span>{option.label}</span>
                  <span className="tracking-[0.18em]">{option.code}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeToggle() {
  const t = useT();
  const theme = useTheme();
  const toLight = theme !== "light";
  const actionLabel = toLight ? t.nav.enableLight : t.nav.enableDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      data-track={toLight ? "Хедер — Светлая тема" : "Хедер — Тёмная тема"}
      aria-label={actionLabel}
      title={actionLabel}
      className="hidden h-10 items-center rounded-full border border-white/15 p-[3px] transition-colors hover:border-vio md:flex"
    >
      {(
        [
          { code: "light" as const, Icon: Sun },
          { code: "dark" as const, Icon: Moon },
        ] as const
      ).map(({ code, Icon }) => (
        <span
          key={code}
          aria-hidden
          className={cn(
            "pointer-events-none grid h-full min-w-[2.05rem] place-items-center rounded-full px-2 transition-colors duration-300",
            theme === code ? "bg-ink text-void" : "text-mute"
          )}
        >
          <Icon className="size-4" />
        </span>
      ))}
    </button>
  );
}
