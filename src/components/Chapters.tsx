import { motion } from "framer-motion";
import type { ReactNode } from "react";
import SectionAtmosphere from "./SectionAtmosphere";
import SectionLabel from "./SectionLabel";

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

/* -------------------- для кого я работаю -------------------- */
export function ResultChapter() {
  return (
    <section id="clients" className="relative bg-void px-5 py-16 md:px-10 md:py-24">
      <SectionAtmosphere tone="cyan" dots />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-16 md:gap-24">
        {/* 1/3 заголовок · 2/3 текст */}
        <Reveal className="grid gap-8 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-1">
            <SectionLabel>Для кого я работаю</SectionLabel>
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,2.55rem)] font-semibold uppercase leading-[1.20] text-pretty">
              <span className="text-ink">Не для всех.</span>
              <br />
              <span className="text-gradient-neon">Для тех, кому нужен результат</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mute">
              Беру проекты, где сайт — инструмент роста, а не галочка в чек-листе.
            </p>
          </div>

          <div className="space-y-4 text-[19px] leading-relaxed text-mute lg:col-span-2">
            <p>
              Чаще всего работаю с владельцами услуг и локального бизнеса: салоны,
              клиники, образование, ремонт, B2B. Им нужен стабильный канал заявок —
              от первого экрана до формы, с оффером и доверием на виду.
            </p>
            <p>
              Второй фокус — специалисты с личным брендом: коучи, консультанты,
              юристы. Сайт должен говорить ясно с первой секунды: кто вы, чем
              полезны и как с вами связаться — без визуального шума.
            </p>
            <p>
              Беру и запуски: стартапам и новым направлениям нужен быстрый
              убедительный лендинг, чтобы проверить спрос. Короткий цикл, гибкая
              структура под гипотезы, метрики сразу после релиза.
            </p>
          </div>
        </Reveal>

        {/* 2/3 текст · 1/3 заголовок справа */}
        <Reveal delay={0.08} className="grid gap-8 lg:grid-cols-3 lg:gap-16">
          <div className="order-2 space-y-4 text-[19px] leading-relaxed text-mute lg:order-1 lg:col-span-2">
            <p>
              Отдельно люблю камерные штуки: свадебные веб-приглашения,
              мини-лендинги к событию, подарочные страницы. Маленький продукт —
              но с атмосферой, RSVP, картой и деталями, которые запоминают.
            </p>
            <p>
              Не берусь за «сайт ради галочки» и проекты без готовности решать
              задачу продаж. Если важны только картинки без смысла и метрик —
              это не ко мне.
            </p>
            <p>
              Если узнаёте себя в одном из этих сценариев — напишите. Разберём
              задачу за 30 минут и скажем, имеет ли смысл идти дальше.
            </p>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-1 lg:text-right">
            <SectionLabel className="lg:flex-row-reverse">Формат работы</SectionLabel>
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,2.55rem)] font-semibold uppercase leading-[1.20]">
              <span className="text-ink">Четыре </span>
              <span className="text-gradient-neon">направления</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mute lg:ml-auto lg:max-w-xs">
              С ними получается сильнее всего — и по дизайну, и по цифрам после
              запуска.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- о нас -------------------- */
export function AboutChapter() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32"
    >
      <SectionAtmosphere tone="dual" />

      <div className="relative mx-auto w-full max-w-[1200px]">
        <Reveal className="mx-auto w-full max-w-[1200px] overflow-visible text-center">
          <SectionLabel center>Команда</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.6rem)] font-semibold uppercase leading-[1.20]">
            <span className="text-ink">Маленькая команда</span>
            <br />
            <span className="text-gradient-neon">Большой опыт</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-void-2/90 via-void to-void px-6 py-10 md:px-12 md:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(7rem,22vw,16rem)] font-bold leading-none text-white/[0.035]"
            >
              DH
            </div>

            <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
              <div className="text-center lg:text-left">
                <p className="font-mono text-[14px] uppercase tracking-[2px] text-[#8a8494]">
                  опыт
                </p>
                <p className="mt-2 font-display text-[clamp(3.5rem,9vw,6.5rem)] font-bold leading-[0.9] text-gradient-warm">
                  7+
                </p>
                <p className="mt-3 font-display text-[14px] font-bold uppercase tracking-[2px] text-gradient-warm">
                  лет практики
                </p>
              </div>

              <div className="max-w-xl border-white/[0.1] lg:border-l lg:pl-10">
                <p className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
                  Мы берём мало проектов — и доводим каждый до результата.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mute md:text-base">
                  Без бюрократии и лишних слоёв. Решения быстрые, а качество —
                  на совести тех, кто реально рисует, пишет и запускает.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mt-8 md:mt-10">
          <div className="mx-auto grid max-w-5xl gap-8 text-center md:grid-cols-3 md:gap-8 md:text-left">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio">
                01
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                Сплоченная команда умеющая решать самые сложные задачи
              </h3>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio">
                02
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                Продуманный и уникальный дизайн для каждого проекта
              </h3>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-vio">
                03
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                Понятное общение с заказчиком на всём этапе разработки
              </h3>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

