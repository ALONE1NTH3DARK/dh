import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Александр Громов",
    role: "Основатель Noir Boutique",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
    metric: "+148%",
    metricLabel: "онлайн-продаж за первый месяц",
    quote:
      "Сайт окупается ежедневно. Конверсия выросла с 1,8% до 4,2%, а клиенты отдельно отмечают дизайн. DARKHORSE уложились в три недели без единой задержки — это впечатляет.",
    project: "E-commerce · 3 недели",
    rating: 5,
  },
  {
    name: "Екатерина Соколова",
    role: "CMO Pulse Finance",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=85",
    metric: "×3",
    metricLabel: "больше заявок с первого дня",
    quote:
      "Новая подача цифр сработала и на клиентов, и на инвесторов. Стоимость привлечения снизилась на 35%, а продукт наконец выглядит на уровне лидеров рынка. Заявки идут круглосуточно.",
    project: "Финтех · 8 недель",
    rating: 4.5,
  },
  {
    name: "Михаил Вершинин",
    role: "Главный архитектор Atelier Nord",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=85",
    metric: "+90%",
    metricLabel: "целевых обращений за квартал",
    quote:
      "DARKHORSE полностью переосмыслили подачу проектов. Теперь заказчики приходят уже готовыми обсуждать дорогой дизайн-проект — уровень доверия вырос моментально. Рекомендую.",
    project: "Корпоративный сайт · 4 недели",
    rating: 5,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const INTERVAL = 5000;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx((p) => mod(p + 1, REVIEWS.length));
    }, INTERVAL);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const go = (d: number) => {
    setDir(d);
    setIdx((p) => mod(p + d, REVIEWS.length));
    resetTimer();
  };

  const cur = REVIEWS[idx];
  const prevR = REVIEWS[mod(idx - 1, REVIEWS.length)];
  const nextR = REVIEWS[mod(idx + 1, REVIEWS.length)];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? "55%" : "-55%" }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? "-55%" : "55%" }),
  };

  const sideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,108,255,0.05),transparent_50%)]"
      />

      <div className="relative mx-auto mb-12 w-full max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute/90 md:text-xs">
              <span className="h-px w-9 bg-vio" /> Истории успеха
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-semibold uppercase leading-[1.02]">
              Отзывы <span className="text-stroke">клиентов</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 md:pb-1">
            <span className="font-display text-2xl font-semibold text-gradient-neon">4.9</span>
            <div>
              <span className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-neon text-amber-neon" />
                ))}
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                средняя оценка
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Три одинаковых по ширине карточки; боковые выглядывают за край и обрезаются */}
      <div className="relative mx-auto w-full max-w-[760px]">
        <div className="relative">
          {/* ← левая — тот же размер, частично за краем */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий отзыв"
            className="pointer-events-auto absolute inset-y-0 left-0 hidden w-full max-w-[760px] -translate-x-[calc(100%+1.5rem)] cursor-pointer text-left opacity-35 transition-opacity duration-300 hover:opacity-55 xl:block xl:-translate-x-[calc(100%+2rem)]"
          >
            <div className="relative grid h-full overflow-x-hidden rounded-3xl">
              <AnimatePresence mode="sync" custom={dir} initial={false}>
                <motion.div
                  key={prevR.name}
                  custom={dir}
                  variants={sideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: EASE }}
                  className="col-start-1 row-start-1 h-full w-full"
                >
                  <ReviewCard review={prevR} dimmed fade="right" />
                </motion.div>
              </AnimatePresence>
            </div>
          </button>

          {/* центральная — grid + sync: высота не схлопывается, низ рамки не режется */}
          <div className="relative z-10 -my-1 overflow-x-hidden py-1">
            <div className="grid">
              <AnimatePresence mode="sync" custom={dir} initial={false}>
                <motion.div
                  key={cur.name}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  className="col-start-1 row-start-1 w-full"
                >
                  <ReviewCard review={cur} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* → правая */}
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий отзыв"
            className="pointer-events-auto absolute inset-y-0 right-0 hidden w-full max-w-[760px] translate-x-[calc(100%+1.5rem)] cursor-pointer text-left opacity-35 transition-opacity duration-300 hover:opacity-55 xl:block xl:translate-x-[calc(100%+2rem)]"
          >
            <div className="relative grid h-full overflow-x-hidden rounded-3xl">
              <AnimatePresence mode="sync" custom={dir} initial={false}>
                <motion.div
                  key={nextR.name}
                  custom={dir}
                  variants={sideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: EASE }}
                  className="col-start-1 row-start-1 h-full w-full"
                >
                  <ReviewCard review={nextR} dimmed fade="left" />
                </motion.div>
              </AnimatePresence>
            </div>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDir(i > idx ? 1 : -1);
                  setIdx(i);
                  resetTimer();
                }}
                aria-label={`Отзыв ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === idx
                    ? "w-6 bg-gradient-to-r from-vio to-cyan-neon"
                    : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Назад"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-all hover:border-vio hover:bg-vio/20"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Вперёд"
              className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-all hover:border-vio hover:bg-vio/20"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
        98% клиентов рекомендуют DARKHORSE партнёрам и коллегам
      </p>
    </section>
  );
}

type Review = (typeof REVIEWS)[number];

function ReviewCard({
  review,
  dimmed = false,
  fade,
}: {
  review: Review;
  dimmed?: boolean;
  fade?: "left" | "right";
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 backdrop-blur-xl md:p-8 ${
        dimmed
          ? "border-white/[0.07] bg-void-2/60"
          : "border-white/10 bg-void-2/85 shadow-2xl"
      }`}
    >
      {fade && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 z-10 w-2/3 rounded-3xl ${
            fade === "left"
              ? "left-0 bg-gradient-to-r from-void/95 to-transparent"
              : "right-0 bg-gradient-to-l from-void/95 to-transparent"
          }`}
        />
      )}

      {!dimmed && (
        <Quote className="absolute right-7 top-7 size-12 text-white/[0.05] md:size-14" />
      )}

      <div>
        <p className="text-gradient-neon font-display text-3xl font-semibold md:text-4xl">
          {review.metric}
        </p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.21em] text-mute">
          {review.metricLabel}
        </p>
      </div>

      <blockquote
        className={`mt-6 flex-1 text-base font-light leading-[1.75] md:text-lg ${
          dimmed ? "text-ink/65" : "text-ink/88"
        }`}
      >
        «{review.quote}»
      </blockquote>

      <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
        <img
          src={review.avatar}
          alt={dimmed ? "" : review.name}
          className={`size-12 shrink-0 rounded-full object-cover ${
            dimmed ? "opacity-80" : "border border-vio/35"
          }`}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-sm font-semibold text-ink">{review.name}</h4>
          <p className="mt-0.5 font-mono text-xs text-mute">{review.role}</p>
        </div>
        <span className="ml-auto flex shrink-0 gap-0.5" aria-label={`Оценка ${review.rating} из 5`}>
          <StarRow rating={review.rating} />
        </span>
      </div>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        if (fill >= 1) {
          return <Star key={i} className="size-3.5 fill-amber-neon text-amber-neon" />;
        }
        if (fill <= 0) {
          return <Star key={i} className="size-3.5 text-white/20" />;
        }
        return (
          <span key={i} className="relative size-3.5">
            <Star className="absolute inset-0 size-3.5 text-white/20" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-3.5 fill-amber-neon text-amber-neon" />
            </span>
          </span>
        );
      })}
    </>
  );
}
