import { motion } from "framer-motion";
import {
  Activity,
  Check,
  HeartHandshake,
  MousePointerClick,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-16% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GhostNumber({ value }: { value: string }) {
  return (
    <span
      aria-hidden
      className="text-stroke-ghost pointer-events-none absolute -top-8 right-0 select-none font-display text-[clamp(6rem,16vw,13rem)] font-bold leading-none md:-top-12"
    >
      {value}
    </span>
  );
}

function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-void/55 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}



/* -------------------- секция 2: продающий сайт -------------------- */
const RESULT_FEATURES = [
  {
    icon: MousePointerClick,
    title: "Каждый экран ведёт к заявке",
    text: "Продуманная воронка: от первого экрана до формы — без тупиков и лишних шагов.",
  },
  {
    icon: Smartphone,
    title: "Идеально на любом устройстве",
    text: "70% трафика — со смартфонов. Ваш сайт безупречен везде: телефон, планшет, монитор.",
  },
  {
    icon: TrendingUp,
    title: "SEO с первого дня",
    text: "Скорость загрузки, семантика и мета-теги — вас найдут в поиске без дополнительного бюджета.",
  },
];

export function ResultChapter() {
  return (
    <section id="result" className="relative overflow-hidden bg-void px-5 py-20 md:px-10 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.04),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-[1200px]">
        {/* Заголовок */}
        <Reveal className="text-center">
          <div className="mb-4 mx-auto flex w-fit items-center gap-3">
            <span className="h-px w-9 bg-vio" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs">
              Главный результат
            </span>
          </div>
          <h2 className="font-display text-[clamp(2rem,4.8vw,4.2rem)] font-semibold uppercase leading-[1.02]">
            <span className="text-ink">Сайт, который</span>{" "}
            <span className="text-gradient-neon">продаёт 24/7</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-mute md:text-lg">
            Он не уходит домой вечером и не просит отпуск. Пока вы занимаетесь
            бизнесом — сайт принимает заявки. Даже в три часа ночи.
          </p>
        </Reveal>

        {/* Bento-сетка метрик */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">

          {/* Большая цифра 24/7 — левая колонка на всю высоту */}
          <Reveal className="md:row-span-2">
            <GlassCard className="relative flex h-full flex-col justify-between overflow-hidden p-6 md:p-8 !bg-gradient-to-b from-vio/[0.09] to-void-2/90">
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  <Activity className="size-3.5 text-cyan-neon" /> Непрерывная работа
                </p>
              </div>

              <div className="my-8">
                <p className="font-display text-[clamp(4.5rem,8vw,7rem)] font-bold leading-[0.9] text-gradient-neon">
                  24/7
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/85">
                  ваш продавец работает в выходные, праздники и ночью — без зарплаты и мотивации
                </p>
              </div>

              {/* пульсирующие "заявки" */}
              <div className="space-y-2.5">
                {[
                  { t: "03:47", s: "Заявка из Instagram" },
                  { t: "11:15", s: "Заказ обратного звонка" },
                  { t: "23:02", s: "Рассчёт стоимости" },
                ].map((l, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-cyan-neon" />
                    <span className="font-mono text-[10px] text-cyan-neon">{l.t}</span>
                    <span className="truncate text-xs text-ink/80">{l.s}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          {/* Конверсия */}
          <Reveal delay={0.08}>
            <GlassCard className="p-6 md:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Конверсия</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="font-display text-3xl font-semibold text-ink md:text-4xl">8.4<span className="text-lg text-mute">%</span></p>
                <p className="text-xs text-cyan-neon">▲</p>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "84%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-neon to-pink-neon"
                />
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">вместо средних 2.1% по нише</p>
            </GlassCard>
          </Reveal>

          {/* Рост заявок */}
          <Reveal delay={0.14}>
            <GlassCard className="p-6 md:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Заявки</p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">+212%</p>
              <div className="mt-4">
                <svg viewBox="0 0 120 32" className="w-full">
                  <defs>
                    <linearGradient id="spark2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7c6cff" />
                      <stop offset="100%" stopColor="#5fe3ff" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M2 30 L18 26 L34 28 L50 20 L66 22 L82 12 L98 14 L118 3"
                    fill="none"
                    stroke="url(#spark2)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </svg>
              </div>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">за 3 месяца после запуска</p>
            </GlassCard>
          </Reveal>

          {/* Фичи — полоса внизу справа */}
          <div className="grid gap-4 sm:grid-cols-3 md:col-span-2 md:grid-cols-3">
            {RESULT_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.08 * (i + 1)}>
                <GlassCard className="group flex h-full flex-col justify-between gap-3 p-5 transition-colors duration-300 hover:border-vio/40">
                  <f.icon className="size-4 text-cyan-neon" />
                  <div>
                    <h4 className="text-sm font-medium text-ink">{f.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-mute">{f.text}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Нижняя строка — отзыв */}
        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-col gap-1.5 rounded-2xl border border-white/[0.07] bg-void-2/80 px-6 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <p className="text-sm italic text-ink/80">
              «За первый месяц сайт окупился дважды. Заявки идут даже ночью»
            </p>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              — Артём, студия ремонта
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- секция 3: всё уже включено -------------------- */
const INCLUDED = [
  "SEO-настройка: вас находят в поиске",
  "Мгновенная загрузка — до 1 секунды",
  "Аналитика: видно каждую заявку",
  "Домен, хостинг и SSL — настроим сами",
  "Формы, квизы, онлайн-оплата",
  "30 дней поддержки и правок — бесплатно",
];

export function IncludedChapter() {
  return (
    <section id="included" className="relative flex min-h-screen items-center bg-void px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,79,216,0.05),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <GhostNumber value="02" />

        <Reveal delay={0.15} className="relative order-2 lg:order-1">
          <div className="relative flex flex-col gap-4">
            <GlassCard className="overflow-hidden !bg-void/70">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                  Что входит в проект
                </span>
                <ShieldCheck className="size-4 text-cyan-neon" />
              </div>
              <ul className="flex flex-col gap-3 p-5">
                {INCLUDED.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.5, delay: 0.07 * i, ease: EASE }}
                    className="flex items-center gap-3"
                  >
                    <Check className="size-3.5 shrink-0 text-cyan-neon" strokeWidth={3} />
                    <span className="text-sm text-ink/85">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="!bg-void/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">Оценка Google</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-gradient-warm">100/100</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-mute">быстрее 90% сайтов в нише</p>
                </div>
                <svg viewBox="0 0 80 80" className="size-18 shrink-0 -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <motion.circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="url(#gauge)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    whileInView={{ strokeDashoffset: 8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffb35c" />
                      <stop offset="100%" stopColor="#ff5ca8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </GlassCard>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2 lg:text-right">
          <Reveal>
            <div className="mb-4 flex items-center gap-3 lg:justify-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs lg:order-2">
                Без доплат и сюрпризов
              </span>
              <span className="h-px w-9 bg-amber-neon lg:order-1" />
            </div>
            <h2 className="font-display text-[clamp(1.8rem,4.2vw,3.8rem)] font-semibold uppercase leading-[1.02]">
              <span className="text-ink">Всё уже</span>{" "}
              <span className="text-gradient-warm">включено</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-mute md:text-lg lg:ml-auto">
              Никаких смет, которые растут каждую неделю. Фиксированная цена,
              понятные сроки и полный комплект: от домена до аналитики.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            <Reveal delay={0.12}>
              <GlassCard className="group p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-neon/40">
                <Search className="mb-2.5 size-4.5 text-cyan-neon" />
                <p className="font-medium text-ink">Трафик с первого дня</p>
                <p className="mt-1 text-sm text-mute">Готов к рекламе и поиску.</p>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.2}>
              <GlassCard className="group p-4 transition-all duration-300 hover:-translate-y-1 hover:border-pink-neon/40">
                <HeartHandshake className="mb-2.5 size-4.5 text-pink-neon" />
                <p className="font-medium text-ink">Мы на связи</p>
                <p className="mt-1 text-sm text-mute">Месяц поддержки включён.</p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Chapters() {
  return (
    <>
      <ResultChapter />
      <IncludedChapter />
    </>
  );
}
