import { useCallback, useEffect, useRef, useState, type TransitionEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Send, Star } from "lucide-react";
import SectionLabel from "./SectionLabel";

const REVIEWS = [
  {
    name: "Александр Громов",
    role: "Основатель Noir Boutique",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
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
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=85",
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
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=85",
    metric: "+90%",
    metricLabel: "целевых обращений за квартал",
    quote:
      "DARKHORSE полностью переосмыслили подачу проектов. Теперь заказчики приходят уже готовыми обсуждать дорогой дизайн-проект — уровень доверия вырос моментально. Рекомендую.",
    project: "Корпоративный сайт · 4 недели",
    rating: 5,
  },
  {
    name: "Анна Лебедева",
    role: "Владелица Umami",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=85",
    metric: "+210%",
    metricLabel: "бронирований через сайт",
    quote:
      "Раньше брони шли только через Instagram и телефон — хаос. Новый сайт закрыл вопрос за неделю: гости сами выбирают стол, а мы видим загрузку зала. Команда DARKHORSE слышит бизнес, а не просто «рисует красиво».",
    project: "Ресторан · 5 недель",
    rating: 5,
  },
  {
    name: "Игорь Савельев",
    role: "Основатель Beyond Travel",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=85",
    metric: "−40%",
    metricLabel: "стоимость заявки из рекламы",
    quote:
      "Квиз маршрута и чистая подача направлений подняли качество лидов. Менеджеры тратят меньше времени на «просто посмотреть», а средний чек вырос. Запуск без сюрпризов по срокам — редкость на рынке.",
    project: "Туризм · 6 недель",
    rating: 4.5,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 6000;
const CARD_MAX = 680;
const GAP = 28;
const N = REVIEWS.length;
const SLIDE_MS = 850;
const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Testimonials() {
  // Три копии ленты: после последнего слайда едем на клон первого, затем
  // без анимации возвращаемся в среднюю копию — визуально петля бесконечная.
  const [offset, setOffset] = useState(N);
  const [animate, setAnimate] = useState(true);
  const [cardW, setCardW] = useState(CARD_MAX);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const offsetRef = useRef(offset);
  offsetRef.current = offset;
  const step = cardW + GAP;
  const index = mod(offset, N);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (lockRef.current) return;
      lockRef.current = true;
      setOffset((p) => p + 1);
    }, INTERVAL);
  }, []);

  useEffect(() => {
    const syncWidth = () => {
      setCardW(Math.min(CARD_MAX, Math.max(280, window.innerWidth - 48)));
    };
    syncWidth();
    window.addEventListener("resize", syncWidth);
    return () => window.removeEventListener("resize", syncWidth);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (animate) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setAnimate(true);
        lockRef.current = false;
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate, offset]);

  const slideTo = (next: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setOffset(next);
    resetTimer();
  };

  const go = (d: number) => slideTo(offsetRef.current + d);

  const goTo = (i: number) => {
    const current = mod(offsetRef.current, N);
    if (i === current) return;
    const forward = (i - current + N) % N;
    const backward = (current - i + N) % N;
    slideTo(
      forward <= backward ? offsetRef.current + forward : offsetRef.current - backward
    );
  };

  const onTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    const current = offsetRef.current;
    if (current < N || current >= 2 * N) {
      setAnimate(false);
      setOffset(N + mod(current, N));
      return;
    }
    lockRef.current = false;
  };

  const trackX = `calc(50vw - ${cardW / 2}px - ${offset * step}px)`;

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t border-white/[0.07] bg-void py-20 md:py-24"
    >
      <div className="relative mx-auto mb-12 w-full max-w-[1200px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <SectionLabel>Отзывы</SectionLabel>
            <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20]">
              Клиенты <span className="text-gradient-warm">говорят</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 md:pb-1">
            <span className="font-display text-2xl font-semibold text-ink md:text-3xl">
              4.6
            </span>
            <div>
              <span className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-neon text-amber-neon"
                  />
                ))}
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                средняя оценка
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative w-full">
        <div
          className="flex items-stretch"
          onTransitionEnd={onTrackTransitionEnd}
          style={{
            gap: GAP,
            width: "max-content",
            transform: `translate3d(${trackX}, 0, 0)`,
            transition: animate ? `transform ${SLIDE_MS}ms ${EASE_CSS}` : "none",
          }}
        >
          {Array.from({ length: N * 3 }, (_, p) => {
            const review = REVIEWS[p % N];
            // Активность по отзыву, а не по клону: при бесшовном сбросе ленты
            // центральная карточка не монтируется заново и не делает fade-in.
            const isActive = p % N === index;
            return (
              <button
                key={`${p}-${review.name}`}
                type="button"
                onClick={() => !isActive && goTo(p % N)}
                aria-label={
                  isActive
                    ? `Отзыв: ${review.name}`
                    : `Открыть отзыв ${review.name}`
                }
                className="shrink-0 text-left transition-opacity duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: cardW,
                  opacity: isActive ? 1 : 0.32,
                }}
              >
                <ReviewCard review={review} dimmed={!isActive} />
              </button>
            );
          })}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent md:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent md:w-28"
        />
      </div>

      <div
        className="relative mx-auto mt-8 flex w-full items-center justify-between px-5"
        style={{ maxWidth: CARD_MAX }}
      >
        <div className="flex gap-1.5">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Отзыв ${i + 1}`}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${
                i === index ? "w-6 bg-vio" : "w-1.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Назад"
            className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-all duration-300 hover:border-vio hover:bg-vio/20"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Вперёд"
            className="grid size-10 place-items-center rounded-full border border-white/15 text-ink transition-all duration-300 hover:border-vio hover:bg-vio/20"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex w-full max-w-[1200px] flex-col items-center gap-5 px-5 md:px-10">
        <p className="text-center text-[15px] text-mute">
          Будем благодарны если вы оставите отзыв о нашем сотрудничестве.
        </p>
        <a
          href="https://t.me/darkhorse_webagency"
          target="_blank"
          rel="noreferrer"
          data-track="Отзывы — Оставить отзыв"
          className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
        >
          <Send className="size-4" />
          Оставить отзыв
        </a>
      </div>
    </section>
  );
}

type Review = (typeof REVIEWS)[number];

function ReviewCard({
  review,
  dimmed = false,
}: {
  review: Review;
  dimmed?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full min-h-[340px] flex-col rounded-3xl border p-6 transition-[border-color,box-shadow] duration-500 md:min-h-[380px] md:p-8 ${
        dimmed
          ? "border-white/[0.06] bg-void-2"
          : "border-white/10 bg-void-2 shadow-[var(--card-shadow)]"
      }`}
    >
      <Quote
        className={`absolute right-7 top-7 size-12 text-white/[0.05] transition-opacity duration-500 md:size-14 ${
          dimmed ? "opacity-0" : "opacity-100"
        }`}
      />

      <div>
        <p className="text-gradient-neon font-display text-3xl font-semibold md:text-4xl">
          {review.metric}
        </p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.21em] text-mute">
          {review.metricLabel}
        </p>
      </div>

      <blockquote
        className={`mt-6 flex-1 text-md font-light leading-[1.75] ${
          dimmed ? "text-ink/55" : "text-ink/88"
        }`}
      >
        «{review.quote}»
      </blockquote>

      <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
        <img
          src={review.avatar}
          alt={dimmed ? "" : review.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`size-12 shrink-0 rounded-full object-cover ${
            dimmed ? "opacity-70" : "border border-vio/35"
          }`}
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-sm font-semibold text-ink">
            {review.name}
          </h4>
          <p className="mt-0.5 font-mono text-xs text-mute">{review.role}</p>
        </div>
        <span
          className="ml-auto flex shrink-0 gap-0.5"
          aria-label={`Оценка ${review.rating} из 5`}
        >
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
          return (
            <Star key={i} className="size-3.5 fill-amber-neon text-amber-neon" />
          );
        }
        if (fill <= 0) {
          return <Star key={i} className="size-3.5 text-white/20" />;
        }
        return (
          <span key={i} className="relative size-3.5">
            <Star className="absolute inset-0 size-3.5 text-white/20" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="size-3.5 fill-amber-neon text-amber-neon" />
            </span>
          </span>
        );
      })}
    </>
  );
}
