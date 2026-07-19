import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToId } from "../lib/scrollState";
import { cn } from "../utils/cn";
import BrandMark from "./BrandMark";

const LINKS = [
  { label: "Результат", id: "result" },
  { label: "Портфолио", id: "portfolio" },
  { label: "Цены", id: "pricing" },
  { label: "Процесс", id: "process" },
  { label: "Отзывы", id: "reviews" },
  { label: "Контакты", id: "contact" },
];

type NavProps = {
  variant?: "home" | "project";
};

export default function Nav({ variant = "home" }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isProject = variant === "project";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || open
            ? "border-b border-white/[0.06] bg-void/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <button
            onClick={goHome}
            className="group flex items-center gap-2.5"
            aria-label="На главную"
          >
            <BrandMark interactive />
            <span className="font-display text-sm font-semibold tracking-[0.22em] text-ink">
              DARKHORSE<sup className="text-[8px] text-mute">®</sup>
            </span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => goSection(l.id)}
                className="group relative font-mono text-[11px] uppercase tracking-[0.12em] text-mute transition-colors duration-300 hover:text-ink md:text-xs"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-vio to-cyan-neon transition-all duration-400 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isProject ? (
              <Link
                to="/"
                state={{ scrollTo: "contact" }}
                className="group hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-void sm:flex md:px-5 md:py-2.5"
              >
                Связаться со мной
              </Link>
            ) : (
              <button
                onClick={() => goSection("contact")}
                className="group hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-void sm:flex md:px-5 md:py-2.5"
              >
                Связаться со мной
              </button>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-colors hover:border-vio hover:bg-vio/15 md:hidden"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
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
            className="fixed inset-0 z-40 bg-void/90 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col justify-center gap-2 px-8 pt-20"
            >
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                  onClick={() => goSection(l.id)}
                  className="border-b border-white/[0.06] py-5 text-left font-display text-2xl font-medium uppercase tracking-wide text-ink transition-colors hover:text-vio"
                >
                  {l.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                onClick={() => goSection("contact")}
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void"
              >
                Связаться со мной
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
