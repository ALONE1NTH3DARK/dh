type Tone = "vio" | "cyan" | "pink" | "amber" | "dual" | "mist";

const TONES: Record<
  Tone,
  { primary: string; secondary: string; accent?: string }
> = {
  vio: {
    primary:
      "bg-[radial-gradient(ellipse_at_85%_0%,rgba(124,108,255,0.16),transparent_55%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_10%_100%,rgba(95,227,255,0.06),transparent_50%)]",
  },
  cyan: {
    primary:
      "bg-[radial-gradient(ellipse_at_50%_0%,rgba(95,227,255,0.12),transparent_55%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_80%_90%,rgba(124,108,255,0.08),transparent_48%)]",
  },
  pink: {
    primary:
      "bg-[radial-gradient(ellipse_at_0%_80%,rgba(255,92,168,0.11),transparent_52%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_100%_10%,rgba(124,108,255,0.1),transparent_50%)]",
  },
  amber: {
    primary:
      "bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,179,92,0.1),transparent_50%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_15%_90%,rgba(255,92,168,0.07),transparent_48%)]",
  },
  dual: {
    primary:
      "bg-[radial-gradient(ellipse_at_20%_30%,rgba(124,108,255,0.14),transparent_48%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_90%_70%,rgba(95,227,255,0.1),transparent_50%)]",
    accent:
      "bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,92,168,0.06),transparent_45%)]",
  },
  mist: {
    primary:
      "bg-[radial-gradient(ellipse_at_50%_40%,rgba(124,108,255,0.09),transparent_60%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_0%_0%,rgba(242,239,255,0.03),transparent_40%)]",
  },
};

type Props = {
  tone?: Tone;
  /** Тонкая сетка поверх */
  grid?: boolean;
  /** Точки на пересечениях сетки */
  dots?: boolean;
  className?: string;
};

/** Атмосферный фон секции: мягкие пятна + виньетка + опциональная сетка */
export default function SectionAtmosphere({
  tone = "vio",
  grid = false,
  dots = false,
  className = "",
}: Props) {
  const t = TONES[tone];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className={`absolute inset-0 ${t.primary}`} />
      <div className={`absolute inset-0 ${t.secondary}`} />
      {t.accent && <div className={`absolute inset-0 ${t.accent}`} />}

      {/* диагональный блик */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_35%,var(--sheen)_48%,transparent_62%)]" />

      {/* виньетка к краям */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--vignette)_100%)]" />

      {/* мягкие края сверху/снизу */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void/70 to-transparent" />

      {grid && <div className="section-grid absolute inset-0 opacity-[0.35]" />}
      {dots && <div className="section-dots absolute inset-0 opacity-[0.22]" />}
    </div>
  );
}

