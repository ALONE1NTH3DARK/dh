import { motion } from "framer-motion";
import {
  Gauge,
  HeartHandshake,
  Layers,
  PenTool,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { scrollToId } from "../lib/scrollState";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import BrandMark from "./BrandMark";

const EASE = [0.16, 1, 0.3, 1] as const;

/* общий контейнер для секций */
function SectionInner({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto w-full max-w-[1200px]">{children}</div>;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-14% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- marquee ---------- */
const MARQUEE_ITEMS = ["Заявки", "Продажи", "Дизайн", "Скорость", "Доверие", "Рост"];

function Marquee() {
  const half = (
    <div className="flex shrink-0 items-center">
      {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-8 font-display text-3xl font-semibold uppercase tracking-tight md:px-10 md:text-5xl ${
              i % 2 === 0 ? "text-ink" : "text-stroke"
            }`}
          >
            {item}
          </span>
          <Sparkles className="size-4 text-vio md:size-5" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] py-6 md:py-8">
      <div className="animate-marquee flex w-max">
        {half}
        {half}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}

/* ---------- услуги ---------- */
const SERVICES = [
  {
    icon: Rocket,
    title: "Продающий сайт под ключ",
    text: "Стратегия, дизайн, тексты, запуск. Вы только утверждаете — остальное делаем мы.",
    tag: "от 3 недель",
  },
  {
    icon: PenTool,
    title: "Фирменный стиль",
    text: "Логотип, цвета и шрифты, которые клиенты запоминают и узнают вас среди конкурентов.",
    tag: "по запросу",
  },
  {
    icon: HeartHandshake,
    title: "Поддержка и рост",
    text: "Правки, новые разделы, отчёты по заявкам. Сайт живёт и развивается вместе с бизнесом.",
    tag: "30 дней бесплатно",
  },
];

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,108,255,0.06),transparent_55%)]"
      />

      <SectionInner>
        <Reveal className="mb-12 text-center md:mb-16">
          <p className="mb-4 mx-auto flex w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute/90 md:text-xs">
            <span className="h-px w-9 bg-vio" /> Что вы получаете
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-semibold uppercase leading-[1.02]">
            Больше, <span className="text-stroke">чем сайт</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
            Мы продаём не часы разработчиков, а результат: клиентов, заявки и спокойствие владельца бизнеса.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={0.08 * (i + 1)}>
              <div className="group relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-void-2 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-vio/40 hover:shadow-[0_20px_50px_rgba(124,108,255,0.12)] md:p-7">
                <s.icon className="mb-7 size-5 text-cyan-neon" />
                <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{s.text}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-vio">{s.tag}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionInner>
    </section>
  );
}

/* ---------- цифры ---------- */
const STATS = [
  { value: "×2.4", label: "рост конверсии" },
  { value: "120+", label: "проектов запущено" },
  { value: "< 1 с", label: "загрузка страниц" },
  { value: "93%", label: "клиентов возвращаются" },
];

export function Stats() {
  return (
    <section className="border-y border-white/[0.07] bg-void px-5 md:px-10">
      <SectionInner>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={0.06 * i}
              className={`px-3 py-10 text-center md:py-14 ${
                i !== 0 ? "border-l border-white/[0.07]" : ""
              } ${i >= 2 ? "max-lg:border-t max-lg:[&:nth-child(3)]:border-l-0" : ""}`}
            >
              <p className="text-gradient-neon font-display text-3xl font-semibold md:text-5xl">{s.value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute md:text-[11px]">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </SectionInner>
    </section>
  );
}

/* ---------- процесс ---------- */
const STEPS = [
  {
    num: "01",
    title: "Знакомство",
    text: "Бесплатная консультация на 30 минут: разбираем задачу, называем точную цену и срок. Без обязательств.",
  },
  {
    num: "02",
    title: "Концепт за 3 дня",
    text: "Первый экран и структура продаж — вы видите будущий сайт до оплаты полной стоимости.",
  },
  {
    num: "03",
    title: "Производство",
    text: "Демо каждую неделю: вы смотрите сайт вживую и вносите пожелания на любом этапе.",
  },
  {
    num: "04",
    title: "Запуск и результат",
    text: "Подключаем аналитику и рекламу. Первые заявки — уже в первую неделю после релиза.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,108,255,0.05),transparent_50%)]"
      />

      <SectionInner>
        <Reveal className="mb-12 md:mb-16">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute/90 md:text-xs">
            <span className="h-px w-9 bg-pink-neon" /> Как всё происходит
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-semibold uppercase leading-[1.02]">
            Легко для вас,
            <br />
            <span className="text-gradient-neon">честно для нас</span>
          </h2>
        </Reveal>

        <div className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <span className="pointer-events-none absolute left-0 top-5 hidden h-px w-full bg-gradient-to-r from-vio/50 via-white/10 to-pink-neon/50 xl:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={0.09 * i} className="relative">
              <span className="relative z-10 mb-7 grid size-11 place-items-center rounded-full border border-vio/40 bg-void font-mono text-[11px] text-vio shadow-[0_0_20px_rgba(124,108,255,0.18)]">
                {s.num}
              </span>
              <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mute">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.18} className="mt-12">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-white/[0.07] bg-void-2 px-6 py-5 md:px-8">
            {[
              { icon: Gauge, text: "Гарантия сроков в договоре" },
              { icon: TrendingUp, text: "Гарантия конверсии выше 3%" },
              { icon: HeartHandshake, text: "30 дней правок бесплатно" },
            ].map((g) => (
              <p key={g.text} className="flex items-center gap-2.5 text-sm text-ink/85">
                <g.icon className="size-4 shrink-0 text-cyan-neon" />
                {g.text}
              </p>
            ))}
          </div>
        </Reveal>
      </SectionInner>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,108,255,0.08),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-[900px] text-center">
        <Reveal>
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs">
            Бесплатная консультация · 30 минут
          </p>
          <h2 className="font-display text-[clamp(2.2rem,6vw,5.4rem)] font-semibold uppercase leading-[1.05]">
            Ваш сайт уже
            <br />
            <span className="text-stroke">мог бы</span>{" "}
            <span className="text-gradient-neon">продавать</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            Расскажите о бизнесе — через 3 дня покажем концепт первого экрана и
            назовём точную цену. Никакого спама и навязчивых звонков.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToId("#contact")}
            className="group flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_50px_rgba(124,108,255,0.5)]"
          >
            Оставить заявку
          </button>
          <button
            onClick={() => scrollToId("#portfolio")}
            className="rounded-full border border-white/15 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:border-white/50 hover:bg-white/5"
          >
            Ещё раз к работам
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-white/[0.07] px-5 pb-8 pt-14 md:px-10">
      <SectionInner>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          {/* лого + подпись — слева */}
          <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-display text-sm font-semibold tracking-[0.22em]">
                DARKHORSE<sup className="text-[8px] text-mute">®</sup>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-mute">
              Веб-студия полного цикла. Создаём сайты, которые продают, пока вы занимаетесь бизнесом.
            </p>
          </div>

          {/* служебное меню — справа */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 md:justify-end">
            {[
              { label: "Написать на почту", href: "mailto:hello@darkhorse.agency" },
              { label: "Политика конфиденциальности", href: "#privacy" },
              { label: "Условия использования", href: "#terms" },
              { label: "Карта сайта", href: "#sitemap" },
            ].map((l) => (
              l.href.startsWith("mailto")
                ? <a key={l.href} href={l.href} className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink">{l.label}</a>
                : <button key={l.href} onClick={(e) => e.preventDefault()} className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink">{l.label}</button>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            © 2025 DARKHORSE WEBAGENCY
          </p>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            <Layers className="size-3" /> Дизайн · Разработка · Результат
          </p>
        </div>
      </SectionInner>
    </footer>
  );
}

/* ---------- экспорт ---------- */
export default function SolidSections() {
  return (
    <div className="relative z-20 bg-void">
      <Testimonials />
      <Marquee />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}
