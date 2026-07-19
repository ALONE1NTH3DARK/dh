import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  AtSign,
  Check,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const INPUT_CLASS =
  "w-full border-b border-white/15 bg-transparent py-4 text-base text-ink outline-none transition-colors placeholder:text-mute/55 focus:border-vio";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Новый проект: ${String(data.get("name") || "Без имени")}`);
    const body = encodeURIComponent(
      [
        `Имя: ${data.get("name") || "-"}`,
        `Телефон / Telegram: ${data.get("contact") || "-"}`,
        `Тип проекта: ${data.get("project") || "-"}`,
        `О задаче: ${data.get("message") || "-"}`,
      ].join("\n")
    );

    setSubmitted(true);
    window.location.href = `mailto:hello@darkhorse.agency?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-20 md:px-10 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,108,255,0.06),transparent_55%)]"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="lg:pt-4"
        >
          <p className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute md:text-xs">
            <span className="h-px w-10 bg-vio" /> Контакты
          </p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-semibold uppercase leading-[1.05] text-ink">
            Всегда на связи
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink md:text-lg">
            Ответим в течение рабочего часа, зададим несколько точных вопросов и
            предложим следующий шаг без навязчивых продаж.
          </p>

          <div className="mt-9 space-y-6">
            <a href="tel:+77070701337" className="group flex items-center gap-5">
              <Phone className="size-5 shrink-0 text-cyan-neon" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Позвонить</span>
                <span className="mt-1 block font-display text-lg font-medium text-ink md:text-xl">+7 (707) 070-13-37</span>
              </span>
            </a>

            <a href="mailto:hello@darkhorse.agency" className="group flex items-center gap-5">
              <Mail className="size-5 shrink-0 text-cyan-neon" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Написать</span>
                <span className="mt-1 block font-display text-sm font-medium text-ink md:text-base">hello@darkhorse.kz</span>
              </span>
            </a>

            <div className="flex items-center gap-5">
              <Clock3 className="size-5 shrink-0 text-cyan-neon" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-mute">На связи</span>
                <span className="mt-1 block text-sm text-ink">Пн-Пт, 10:00-20:00 МСК</span>
              </span>
            </div>
          </div>

          <div className="mt-9 border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">Социальные сети</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://t.me/darkhorse_webagency"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 text-sm text-ink transition-all hover:border-vio hover:bg-vio/15"
              >
                <Send className="size-4 text-vio" /> Telegram
              </a>
              <a
                href="https://wa.me/74951204108"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 text-sm text-ink transition-all hover:border-cyan-neon hover:bg-cyan-neon/10"
              >
                <MessageCircle className="size-4 text-cyan-neon" /> WhatsApp
              </a>
              <a
                href="https://instagram.com/darkhorse_webagency"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 text-sm text-ink transition-all hover:border-pink-neon hover:bg-pink-neon/10"
              >
                <AtSign className="size-4 text-pink-neon" /> Instagram
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          className="self-start rounded-3xl border border-white/10 bg-void-2/85 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-medium uppercase text-ink md:text-xl">Короткий бриф</p>
              <p className="mt-2 text-sm text-mute">Заполнение займёт около двух минут</p>
            </div>
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-neon sm:flex">
              <span className="size-1.5 rounded-full bg-cyan-neon" /> ответим сегодня
            </span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-x-6 md:grid-cols-2">
              <label>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Ваше имя *</span>
                <input className={INPUT_CLASS} name="name" required placeholder="Как к вам обращаться" />
              </label>
              <label>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Телефон или Telegram *</span>
                <input className={INPUT_CLASS} name="contact" required placeholder="+7 999 000-00-00" />
              </label>
            </div>

            <label className="block pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Что нужно сделать</span>
              <select className={`${INPUT_CLASS} appearance-none`} name="project" defaultValue="Продающий сайт">
                <option className="bg-void-2" value="Продающий сайт">Продающий сайт</option>
                <option className="bg-void-2" value="Интернет-магазин">Интернет-магазин</option>
                <option className="bg-void-2" value="Веб-приложение">Веб-приложение</option>
                <option className="bg-void-2" value="Редизайн сайта">Редизайн сайта</option>
                <option className="bg-void-2" value="Пока не знаю">Пока не знаю</option>
              </select>
            </label>

            <label className="block pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Расскажите о задаче</span>
              <textarea className={`${INPUT_CLASS} min-h-28 resize-none`} name="message" placeholder="Цель сайта, сроки, ориентир по бюджету" />
            </label>

            <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-mute/75">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
              </p>
              <button
                type="submit"
                className="group flex shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-vio to-pink-neon px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-all hover:shadow-[0_0_45px_rgba(124,108,255,0.5)]"
              >
                {submitted ? <Check className="size-4" /> : <Send className="size-4" />}
                {submitted ? "Бриф готов" : "Отправить бриф"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}