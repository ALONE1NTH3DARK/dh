import { motion } from "framer-motion";
import { Check, Clock3, Star } from "lucide-react";
import { scrollToId } from "../lib/scrollState";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLANS = [
  {
    name: "Лэндинг",
    price: "100 000",
    time: "2 недели",
    desc: "Продающая воронка под конкретный продукт или услугу: структура, дизайн, тексты и интеграции за один проект.",
    features: [
      "Стратегия и воронка продаж",
      "Копирайтинг до 8 блоков",
      "Реклама и аналитика",
      "A/B-тестирование",
      "Интеграции с CRM",
      "Понятные сроки окупаемости",
    ],
    popular: false,
  },
  {
    name: "Сайт",
    price: "200 000",
    time: "1 месяц",
    desc: "Многостраничный корпоративный сайт с контентом, разделами и детальным продвижением в поиске.",
    features: [
      "До 12 страниц",
      "Разделы: услуги, кейсы, о компании",
      "Расширенная SEO-настройка",
      "Управление контентом",
      "Обучение вашей команды",
      "Гарантии в договоре",
    ],
    popular: true,
  },
  {
    name: "Интернет-магазин",
    price: "400 000",
    time: "2 месяца",
    desc: "Полноценный e-commerce под ключ: каталог, корзина, оплата, доставка и автоматизация заявок.",
    features: [
      "Каталог + корзина + оплата",
      "Импорт и синхронизация товаров",
      "Онлайн-оплата Stripe / YooKassa",
      "Логистика и уведомления",
      "Аналитика продаж",
      "30 дней поддержки в подарок",
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,108,255,0.06),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="mb-12 text-center md:mb-16">
          <p className="mb-4 mx-auto flex w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute/90 md:text-xs">
            <span className="h-px w-9 bg-vio" /> Прозрачные цены
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-semibold uppercase leading-[1.02]">
            Сколько <span className="text-gradient-warm">стоит результат</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-mute md:text-base">
            Вы точно видите, за что платите. Никаких скрытых доплат — смета фиксируется в договоре до старта работ.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={0.08 * i}>
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-1.5 ${
                  plan.popular
                    ? "border-vio/45 bg-gradient-to-b from-vio/[0.09] via-void-2 to-void-2 shadow-[0_20px_60px_rgba(124,108,255,0.14)]"
                    : "border-white/[0.08] bg-void-2"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-gradient-to-r from-vio to-pink-neon px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                    <Star className="size-2.5" /> выбирают
                  </span>
                )}

                <div className="mb-4 flex items-center gap-2">
                  <Clock3 className="size-4 text-cyan-neon" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {plan.time}
                  </span>
                </div>

                <h3 className="font-display text-base font-medium uppercase tracking-wide text-ink md:text-lg">
                  {plan.name}
                </h3>

                <p className="mb-5 mt-4 text-gradient-warm font-display text-3xl font-semibold leading-none md:text-4xl">
                  {plan.price}
                </p>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-mute">
                  {plan.desc}
                </p>

                <ul className="mb-7 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink/80">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-cyan-neon" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollToId("#contact")}
                  className={`group/btn mt-auto flex items-center justify-center gap-2 rounded-full py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-vio to-pink-neon text-ink shadow-[0_0_25px_rgba(124,108,255,0.35)] hover:shadow-[0_0_40px_rgba(124,108,255,0.55)]"
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
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-mute/70 md:text-sm">
            Рассрочка и оплата поэтапно после согласования макетов. Первые 5 клиентов
            этого месяца получают хостинг на год в подарок.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
