import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AtSign,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLocale } from "@/lib/locale";
import { trackFormSubmit } from "@/lib/analytics";
import { submitContact } from "@/lib/submitContact";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionLabel from "@/components/ui/SectionLabel";
import TurnstileField from "@/components/ui/TurnstileField";
import { EASE } from "@/lib/motion";

const INPUT_CLASS =
  "w-full border-b border-white/15 bg-transparent py-4 text-base text-ink outline-none transition-colors placeholder:text-mute/55 focus:border-vio";

export default function Contact() {
  const t = useT();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const sendBrief = async (form: HTMLFormElement, token: string) => {
    if (sending || submitted) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      project: String(data.get("project") || "").trim(),
      message: String(data.get("message") || "").trim(),
      turnstileToken: token,
    };

    setSending(true);
    setError(null);

    try {
      const delivered = await submitContact(payload);

      if (!delivered) {
        throw new Error("delivery_failed");
      }

      setSubmitted(true);
      trackFormSubmit();
      form.reset();
      setShowCaptcha(false);
      setTurnstileToken(null);
    } catch {
      setError(t.contact.error);
      setTurnstileToken(null);
      setTurnstileReset((value) => value + 1);
    } finally {
      setSending(false);
    }
  };

  const onCaptchaToken = (token: string | null) => {
    setTurnstileToken(token);
    if (!token || !formRef.current || sending || submitted) return;
    void sendBrief(formRef.current, token);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || submitted) return;

    const form = event.currentTarget;

    if (!turnstileToken) {
      setShowCaptcha(true);
      setError(null);
      return;
    }

    void sendBrief(form, turnstileToken);
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.07] bg-void px-5 py-24 md:px-10 md:py-32">
      <SectionAtmosphere tone="vio" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <SectionLabel className="mb-5">{t.contact.label}</SectionLabel>

          <h2 className="font-display text-[clamp(2.2rem,5.2vw,3.4rem)] font-semibold uppercase leading-[1.20]">
            <span className="block text-ink">{t.contact.title1}</span>
            <span className="block text-gradient-warm">{t.contact.title2}</span>
          </h2>

          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mute">
            {t.contact.lead}
          </p>

          <div className="mt-9 space-y-8">
            <a
              href="tel:+77070701337"
              data-track="Контакты — Телефон"
              className="group flex items-center gap-5"
            >
              <Phone className="size-5 shrink-0 text-cyan-neon" />
              <span className="min-w-0">
                <span className="block font-mono text-[14px] uppercase tracking-[1.4px] text-mute">
                  {t.contact.phone}
                </span>
                <span className="mt-1 block font-display text-[21px] font-medium leading-8 tracking-[-0.8px] text-ink">
                  +7 (707) 070-13-37
                </span>
              </span>
            </a>

            {/*
            <div className="flex items-center gap-5">
              <Clock3 className="size-5 shrink-0 text-cyan-neon" />
              <span className="min-w-0">
                <span className="block font-mono text-[14px] uppercase tracking-[1.4px] text-mute">
                  На связи
                </span>
                <span className="mt-1 block font-display text-lg font-medium text-ink md:text-xl">
                  Пн–Пт, 10:00–20:00
                  <span className="text-mute"> (UTC+5)</span>
                </span>
              </span>
            </div>
            */}

            <div className="flex items-start gap-5">
              <Share2 className="mt-0.5 size-5 shrink-0 text-cyan-neon" />
              <span className="min-w-0">
                <span className="block font-mono text-[14px] uppercase tracking-[1.4px] text-mute">
                  {t.contact.messengers}
                </span>
                <div className="mt-4 flex flex-col items-start gap-3">
                  <a
                    href="https://t.me/darkhorse_webagency"
                    target="_blank"
                    rel="noreferrer"
                    data-track="Контакты — Telegram"
                    className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all hover:border-vio hover:bg-vio/15"
                  >
                    <Send className="size-4 text-vio" /> Telegram
                  </a>
                  <a
                    href="https://wa.me/77070701337"
                    target="_blank"
                    rel="noreferrer"
                    data-track="Контакты — WhatsApp"
                    className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all hover:border-cyan-neon hover:bg-cyan-neon/10"
                  >
                    <MessageCircle className="size-4 text-cyan-neon" /> WhatsApp
                  </a>
                  <a
                    href="https://instagram.com/darkhorse_webagency"
                    target="_blank"
                    rel="noreferrer"
                    data-track="Контакты — Instagram"
                    className="group flex items-center gap-2.5 rounded-full border border-white/15 px-5 py-3 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-ink transition-all hover:border-pink-neon hover:bg-pink-neon/10"
                  >
                    <AtSign className="size-4 text-pink-neon" /> Instagram
                  </a>
                </div>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
          className="self-center rounded-3xl border border-white/10 bg-void-2/85 p-6 shadow-[var(--card-shadow)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">
                {t.contact.write}
              </h3>
              <p className="mt-2 text-sm text-mute">{t.contact.replyIn}</p>
            </div>
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7ee9c4] light:text-[#0c8a62] sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-[#7ee9c4] light:bg-[#0c8a62]" /> {t.contact.online}
            </span>
          </div>

          <form key={locale} ref={formRef} onSubmit={submit} className="space-y-3">
            <div className="grid gap-x-6 md:grid-cols-2">
              <label>
                <span className="font-mono text-[14px] uppercase tracking-[1.4px] text-mute">{t.contact.name}</span>
                <input className={INPUT_CLASS} name="name" required maxLength={100} placeholder={t.contact.namePlaceholder} />
              </label>
              <label>
                <span className="font-mono text-[14px] uppercase tracking-[1.4px] text-mute">{t.contact.phoneLabel}</span>
                <input className={INPUT_CLASS} name="contact" required maxLength={100} placeholder="+7 000 000 00 00" />
              </label>
            </div>

            <label className="block pt-4">
              <span className="font-mono text-[14px] uppercase tracking-[1.4px] text-mute">{t.contact.message}</span>
              <textarea className={`${INPUT_CLASS} min-h-28 resize-none`} name="message" maxLength={2000} placeholder={t.contact.messagePlaceholder} />
            </label>

            <label className="block pt-4">
              <span className="font-mono text-[14px] uppercase tracking-[1.4px] text-mute">{t.contact.replyVia}</span>
              <select className={`${INPUT_CLASS} appearance-none`} name="project" defaultValue={t.contact.viaTelegram}>
                <option className="bg-void-2" value={t.contact.viaTelegram}>{t.contact.viaTelegram}</option>
                <option className="bg-void-2" value={t.contact.viaWhatsApp}>{t.contact.viaWhatsApp}</option>
                <option className="bg-void-2" value={t.contact.viaCall}>{t.contact.viaCall}</option>
              </select>
            </label>

            {showCaptcha ? (
              <div className="pt-5">
                <p className="mb-3 font-mono text-[14px] uppercase tracking-[1.4px] text-mute">
                  {t.contact.captcha}
                </p>
                <TurnstileField
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={onCaptchaToken}
                  resetSignal={turnstileReset}
                />
              </div>
            ) : null}

            {error ? (
              <p className="pt-2 text-sm text-pink-neon" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-mute/75">
                {t.contact.privacyBefore}
                <br />
                <Link
                  to="/privacy"
                  className="underline underline-offset-2 transition-colors hover:text-ink"
                >
                  {t.contact.privacyLink}
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={sending || submitted}
                data-track="Форма — Отправить сообщение"
                className="group flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-vio to-pink-neon px-7 py-4 font-mono text-[14px] font-semibold uppercase tracking-[2px] text-[#f2efff] transition-all hover:shadow-[0_0_45px_rgba(124,108,255,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitted ? t.contact.sent : sending ? t.contact.sending : showCaptcha && !turnstileToken ? t.contact.waiting : t.contact.send}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
