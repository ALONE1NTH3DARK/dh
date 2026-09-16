import {
  AtSign,
  Globe,
  Mail,
  MessageCircle,
  QrCode,
  Send,
  Share2,
} from "lucide-react";
import { useT } from "@/i18n/useT";
import { cn } from "@/lib/cn";

function ActionChip({
  icon: Icon,
  label,
  color,
  className = "",
}: {
  icon: typeof Send;
  label: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-[#ffffff]/15",
        className
      )}
    >
      <Icon className={`size-4 ${color}`} />
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#f2efff]">
        {label}
      </span>
    </span>
  );
}

/** Ширина как у кнопки в ряду из 3 (gap-1.5) */
const CHIP_W = "w-[calc((100%-0.75rem)/3)]";

function DigitalCardScreen() {
  const t = useT();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0e0a16]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(124,108,255,0.35),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(95,227,255,0.18),transparent_45%)]"
      />

      <div className="absolute inset-x-2.5 top-2.5 z-30 flex items-start justify-between">
        <span
          aria-label={t.cardPhone.share}
          className="grid size-8 place-items-center rounded-full border border-[#ffffff]/15 bg-black/35 text-[#f2efff] backdrop-blur-sm"
        >
          <Share2 className="size-3.5" />
        </span>
        <span
          aria-label={t.cardPhone.qr}
          className="grid size-8 place-items-center rounded-full border border-[#ffffff]/15 bg-black/35 text-[#f2efff] backdrop-blur-sm"
        >
          <QrCode className="size-3.5" />
        </span>
      </div>

      <div className="relative flex h-full flex-1 flex-col justify-between px-3.5 pb-3.5 pt-12">
        <div className="flex flex-col items-center">
          <div className="mb-2.5 grid size-[4.75rem] place-items-center overflow-hidden rounded-full border border-[#ffffff]/20 bg-gradient-to-br from-[#7c6cff]/80 to-[#5fe3ff]/50 shadow-[0_12px_40px_rgba(124,108,255,0.35)]">
            <span className="font-display text-2xl font-semibold text-[#f2efff]">А</span>
          </div>

          <div className="text-center">
            <p className="font-display text-lg font-semibold leading-tight text-[#f2efff]">
              Анна Волкова
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#9a92b8]">
              Art Director · Studio Nova
            </p>
          </div>

          <p className="mt-2.5 text-center text-[12px] leading-snug text-[#9a92b8]">
            {t.cardPhone.bio}
          </p>
        </div>

        <div className="rounded-xl border border-[#ffffff]/[0.08] bg-[#ffffff]/[0.04] px-3.5 py-2.5 text-center backdrop-blur-sm">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#9a92b8]">
            {t.cardPhone.phone}
          </p>
          <p className="mt-0.5 text-[14px] text-[#f2efff]">+7 987 654-32-10</p>
        </div>

        <span className="block w-full rounded-full bg-gradient-to-br from-[#7c6cff]/80 to-[#5fe3ff]/50 py-2.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f2efff]">
          {t.cardPhone.save}
        </span>

        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            <ActionChip icon={Send} label="Telegram" color="text-[#7c6cff]" />
            <ActionChip icon={MessageCircle} label="WhatsApp" color="text-[#5fe3ff]" />
            <ActionChip icon={AtSign} label="Instagram" color="text-[#ff5ca8]" />
          </div>
          <div className="flex justify-center gap-1.5">
            <ActionChip
              icon={Mail}
              label={t.cardPhone.mail}
              color="text-[#ffb35c]"
              className={CHIP_W}
            />
            <ActionChip
              icon={Globe}
              label={t.cardPhone.site}
              color="text-[#AF5]"
              className={CHIP_W}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Мокап iPhone с примером электронной визитки */
export default function DigitalCardPhone({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "theme-lock-dark relative mx-auto w-full max-w-[min(100%,360px)] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[310px]",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,140,60,0.12),rgba(124,108,255,0.14),transparent_65%)] blur-3xl md:-inset-8 light:bg-[radial-gradient(circle,rgba(255,179,92,0.16),rgba(124,108,255,0.1),transparent_70%)]"
      />

      <div className="relative rounded-[2.4rem] border border-[#ffffff]/15 bg-[#1a1524] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.65)] md:rounded-[2.6rem] light:shadow-[0_18px_48px_rgba(24,21,31,0.1)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#ffffff]/[0.06] bg-[#06040a] md:rounded-[2.15rem]">
          <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-6 w-[92px] -translate-x-1/2 rounded-full bg-black" />

          <div className="aspect-[9/19.2] w-full">
            <DigitalCardScreen />
          </div>
        </div>

        <span
          aria-hidden
          className="absolute -left-[2px] top-28 h-8 w-[2px] rounded-l-sm bg-[#ffffff]/20"
        />
        <span
          aria-hidden
          className="absolute -left-[2px] top-40 h-12 w-[2px] rounded-l-sm bg-[#ffffff]/20"
        />
        <span
          aria-hidden
          className="absolute -right-[2px] top-36 h-16 w-[2px] rounded-r-sm bg-[#ffffff]/20"
        />
      </div>
    </div>
  );
}
