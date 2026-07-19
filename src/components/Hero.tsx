import { motion } from "framer-motion";
import { scrollToId } from "../lib/scrollState";
import HeroBackground from "./HeroBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 60, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.2, delay, ease: EASE },
});

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-28 pt-32 md:px-10">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <motion.div {...reveal(0.15)} className="mb-10 flex items-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-vio to-transparent md:w-20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute/80 md:text-xs">
            Веб-студия полного цикла
          </p>
        </motion.div>

        <h1 className="font-display font-semibold uppercase leading-[0.98] tracking-tight">
          <motion.span
            {...reveal(0.3)}
            className="block text-[clamp(2.4rem,7.8vw,7.2rem)] text-ink"
          >
            Сайты,
          </motion.span>
          <motion.span
            {...reveal(0.45)}
            className="text-stroke block text-[clamp(2.4rem,7.8vw,7.2rem)]"
          >
            которые
          </motion.span>
          <motion.span
            {...reveal(0.6)}
            className="text-gradient-neon block text-[clamp(2.4rem,7.8vw,7.2rem)]"
          >
            продают
          </motion.span>
        </h1>

        <div className="mt-14 flex flex-col gap-10 md:mt-20 md:flex-row md:items-end md:justify-between">
          <motion.p {...reveal(0.8)} className="max-w-md text-base leading-relaxed text-mute md:text-lg">
            Вы получаете не «страничку в интернете», а{" "}
            <span className="text-ink">работающий инструмент продаж</span>: современный
            дизайн, мгновенная загрузка и заявки — из поиска, рекламы и соцсетей.
            Под ключ, без забот.
          </motion.p>

          <motion.div {...reveal(0.95)} className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollToId("#portfolio")}
              className="group flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
            >
              Смотреть работы
            </button>
            <button
              onClick={() => scrollToId("#contact")}
              className="rounded-full border border-white/15 px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:border-white/50 hover:bg-white/5"
            >
              Обсудить проект
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.4 }}
        className="pointer-events-none absolute inset-x-5 bottom-7 z-10 flex justify-center md:inset-x-10"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-px overflow-hidden bg-white/15">
            <span className="animate-scroll-dash absolute inset-0 bg-gradient-to-b from-cyan-neon to-vio" />
          </div>
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-mute">
            Листайте
            <br />
            дальше
          </p>
        </div>
      </motion.div>
    </section>
  );
}
