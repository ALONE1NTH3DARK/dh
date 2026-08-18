import { motion } from "framer-motion";
import { Check, Clock3 } from "lucide-react";
import { scrollToId } from "../lib/scrollState";
import SectionAtmosphere from "./SectionAtmosphere";
import SectionLabel from "./SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLANS = [
  {
    name: "Лэндинг",
    price: "100 000 ₸",
    time: "2 недели",
    desc: "Современный одностраничный сайт, который представляет вас, ваши услуги или отдельный продукт.",
    features: [
      "До 12 секций",
      "Копирайтинг и помощь с текстами",
      "Структура и воронка продаж",
      "Интерактивные анимации и эффекты",
      "Формы заявок в Telegram и на e-mail",
      "Аналитика посещаемости сайта",
      "Адаптация под все устройства",
      "30 дней правок после запуска",
    ],
    popular: false,
  },
  {
    name: "Сайт",
    price: "200 000 ₸",
    time: "1 месяц",
    desc: "Многостраничный корпоративный сайт с контентом, разделами и детальным продвижением в поиске.",
    features: [
      "До 12 страниц",
      "Дизайн в фирменном стиле",
      "Копирайтинг и помощь с текстами",
      "Разделы: услуги, кейсы, о компании",
      "Управление контентом",
      "Формы заявок в Telegram и на e-mail",
      "Аналитика посещаемости сайта",
      "Адаптация под все устройства",
      "30 дней правок после запуска",
    ],
    popular: true,
  },
  {
    name: "Интернет-магазин",
    price: "400 000 ₸",
    time: "6 недель",
    desc: "Полноценный e-commerce под ключ: запоминающаяся главная, каталог товаров, корзина с вариантами оплаты.",
    features: [
      "Заполним первые 100 карточек товаров",
      "Уникальная главная страница",
      "Удобный интерфейс управления",
      "Онлайн-оплата картами и Kaspi QR",
      "Уведомления о заказах в Telegram",
      "Аналитика посещаемости сайта",
      "Адаптация под все устройства",
      "30 дней правок после запуска",
    ],
    popular: false,
  },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-14% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="dual" />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="mb-12 text-center md:mb-16">
          <SectionLabel center>Цены</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            Стоимость <span className="text-gradient-neon">результата</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-mute md:text-base">
            Вы точно видите, за что платите. Никаких скрытых доплат — смета фиксируется в договоре до старта работ.
          </p>
        </Reveal>

        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={0.08 * i}>
              <div
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-void-2 p-6 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)]"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-cyan-neon" />
                    <span className="font-mono text-[14px] uppercase tracking-[2px] text-mute">
                      {plan.time}
                    </span>
                  </div>
                  {plan.popular && (
                    <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[1px] text-void">
                      Популярное
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-medium uppercase tracking-wide text-ink md:text-lg">
                  {plan.name}
                </h3>

                <p className="mb-5 mt-4 text-gradient-warm font-display text-3xl font-semibold leading-none md:text-4xl">
                  {plan.price}
                </p>

                <p className="mb-6 text-base leading-relaxed text-mute">
                  {plan.desc}
                </p>

                <ul className="mb-7 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/80">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-cyan-neon" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollToId("#contact")}
                  data-track={`Цены — Заказать · ${plan.name}`}
                  className={`flex items-center justify-center rounded-full py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] transition-all duration-300 ${
                    plan.popular
                      ? "bg-ink text-void hover:bg-vio hover:text-ink hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
                      : "border border-white/15 text-ink hover:border-vio hover:bg-vio/15"
                  }`}
                >
                  Заказать
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="mx-auto max-w-lg text-[17px] leading-relaxed text-mute/70">
            Оплата — после финального результата: когда сайт готов, вы его одобрили
            и он вас полностью устраивает.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
