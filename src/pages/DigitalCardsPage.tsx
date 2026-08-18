import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Link2,
  QrCode,
  Share2,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import DigitalCardPhone from "../components/DigitalCardPhone";
import SectionAtmosphere from "../components/SectionAtmosphere";
import SectionLabel from "../components/SectionLabel";

const EASE = [0.16, 1, 0.3, 1] as const;

const WHY = [
  {
    icon: Smartphone,
    title: "Всегда под рукой",
    text: "Не мнётся, не заканчивается и не теряется в кармане. Ссылка или QR — и контакт уже у клиента.",
  },
  {
    icon: Sparkles,
    title: "В вашем фирменном стиле",
    text: "Цвета, шрифты и тон бренда — визитка выглядит как продолжение сайта, а не шаблон из конструктора.",
  },
  {
    icon: Zap,
    title: "Мгновенный контакт",
    text: "Один тап — звонок, Telegram, сайт или сохранение в телефон. Меньше трения, больше заявок.",
  },
];

const HOW = [
  {
    num: "01",
    title: "Собираем по бренду",
    text: "Берём стиль вашего сайта: палитру, логотип, тон общения — и собираем карточку.",
  },
  {
    num: "02",
    title: "Добавляем контакты",
    text: "Телефон, мессенджеры, сайт, адрес, портфолио — всё, что нужно клиенту в одном экране.",
  },
  {
    num: "03",
    title: "Делитесь ссылкой или QR",
    text: "Отправляете в переписке, ставите на печати или в сторис — карточка открывается мгновенно.",
  },
];

const GALLERY = [
  { id: 1, h: "h-56 md:h-64", label: "Пример 01" },
  { id: 2, h: "h-72 md:h-80", label: "Пример 02" },
  { id: 3, h: "h-48 md:h-56", label: "Пример 03" },
  { id: 4, h: "h-64 md:h-72", label: "Пример 04" },
  { id: 5, h: "h-80 md:h-96", label: "Пример 05" },
  { id: 6, h: "h-52 md:h-60", label: "Пример 06" },
  { id: 7, h: "h-60 md:h-72", label: "Пример 07" },
  { id: 8, h: "h-60 md:h-72", label: "Пример 08" },
  { id: 9, h: "h-72 md:h-80", label: "Пример 09" },
];

export default function DigitalCardsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-void font-body text-ink">
      <Nav variant="project" />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 md:pt-32">
          <SectionAtmosphere tone="cyan" grid />

          <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 px-5 pb-16 md:px-10 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Link
                to="/"
                state={{ scrollTo: "digital-card" }}
                className="group mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all duration-300 hover:border-cyan-neon/60 hover:bg-cyan-neon/10 md:px-5"
              >
                <ArrowLeft
                  className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
                  strokeWidth={1.75}
                />
                На главную
              </Link>

              <SectionLabel>
                Digital business card
              </SectionLabel>

              <h1 className="max-w-3xl font-display text-[clamp(2.55rem,7vw,4.6rem)] font-semibold uppercase leading-[1.20] text-pretty">
                Электронная визитка{" "}
                <span className="text-gradient-neon">в фирменном стиле</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute md:text-lg">
                Цифровая карточка контактов — как сайт в кармане. Один экран с
                вашим брендом: кто вы, чем занимаетесь и как с вами связаться.
                К каждому проекту от DARKHORSE — в подарок.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="hidden justify-center md:flex lg:justify-end"
            >
              <DigitalCardPhone />
            </motion.div>
          </div>
        </section>

        {/* What */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid w-full max-w-[1100px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionLabel>Что это такое</SectionLabel>
              <h2 className="mt-0 font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
                Контакт, который не теряется
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-mute md:text-lg">
              <p>
                Электронная визитка — веб-страница или мини-приложение с вашими
                контактами, оформленное в стиле бренда. Клиент открывает ссылку
                или сканирует QR и сразу видит нужные действия: позвонить,
                написать, перейти на сайт.
              </p>
              <p>
                В отличие от бумажной карточки, её нельзя «забыть дома», а данные
                всегда актуальны — обновили телефон или логотип, и у всех
                клиентов сразу новая версия.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: QrCode, label: "QR-код" },
                  { icon: Link2, label: "Короткая ссылка" },
                  { icon: Share2, label: "Шаринг в один тап" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
                  >
                    <Icon className="size-3.5 text-cyan-neon" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="border-t border-white/[0.07] bg-void-2/40 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <SectionLabel>Почему удобно</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              Меньше трения — больше касаний
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {WHY.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="rounded-2xl border border-white/[0.08] bg-void/60 p-6 md:p-7"
                >
                  <item.icon className="mb-4 size-5 text-cyan-neon" />
                  <h3 className="font-display text-base font-medium text-ink md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute md:text-[15px]">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <SectionLabel>Как это работает</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              Три шага — и визитка у вас
            </h2>

            <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
              {HOW.map((step, i) => (
                <motion.li
                  key={step.num}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="relative border-t border-white/10 pt-6"
                >
                  <span className="font-mono text-xs text-vio">{step.num}</span>
                  <h3 className="mt-3 font-display text-base font-medium text-ink md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute md:text-[15px]">
                    {step.text}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <SectionLabel>Галерея</SectionLabel>
            <h2 className="mt-0 max-w-xl font-display text-[clamp(1.95rem,4.5vw,2.6rem)] font-semibold uppercase leading-[1.20]">
              Примеры визиток
            </h2>
            <p className="mt-4 max-w-lg text-base text-mute">
              Здесь появятся реальные примеры. Пока — плейсхолдеры под будущие
              скриншоты.
            </p>

            <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {GALLERY.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.6, delay: 0.04 * i, ease: EASE }}
                  className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-void-2 ${item.h}`}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,rgba(124,108,255,0.12),transparent_55%),linear-gradient(340deg,rgba(95,227,255,0.08),transparent_40%)]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
                      Placeholder
                    </span>
                    <span className="font-display text-sm font-medium text-ink/70">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.07] px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="font-display text-[clamp(1.95rem,5vw,2.8rem)] font-semibold uppercase leading-[1.20]">
              Хотите такую же{" "}
              <span className="text-gradient-neon">в подарок</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-mute">
              Обсудим ваш сайт — и электронная визитка в фирменном стиле будет
              частью комплекта.
            </p>
            <Link
              to="/"
              state={{ scrollTo: "contact" }}
              data-track="Визитки — Обсудить проект"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-void transition-all duration-300 hover:bg-vio hover:text-ink hover:shadow-[0_0_40px_rgba(124,108,255,0.45)]"
            >
              Обсудить проект
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
