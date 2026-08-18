type Overlay = "mesh" | "beam" | "haze" | "rings" | "drift" | "veil" | "none";

type Scheme = {
  primary: string;
  secondary: string;
  accent?: string;
};

/** Палитры только для страниц кейсов — разные по проектам и секциям */
const SCHEMES: Scheme[] = [
  {
    primary:
      "bg-[radial-gradient(ellipse_at_82%_8%,rgba(124,108,255,0.2),transparent_52%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_8%_92%,rgba(95,227,255,0.09),transparent_48%)]",
    accent:
      "bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,92,168,0.05),transparent_42%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_18%_12%,rgba(95,227,255,0.16),transparent_50%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_92%_78%,rgba(124,108,255,0.12),transparent_48%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_12%_78%,rgba(255,92,168,0.14),transparent_50%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_88%_18%,rgba(255,179,92,0.09),transparent_46%)]",
    accent:
      "bg-[radial-gradient(ellipse_at_60%_40%,rgba(124,108,255,0.07),transparent_44%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_70%_0%,rgba(255,179,92,0.12),transparent_48%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_20%_100%,rgba(124,108,255,0.11),transparent_50%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_40%_20%,rgba(124,108,255,0.15),transparent_48%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_100%_70%,rgba(95,227,255,0.1),transparent_46%)]",
    accent:
      "bg-[radial-gradient(ellipse_at_0%_50%,rgba(255,92,168,0.06),transparent_40%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_95%_40%,rgba(95,227,255,0.13),transparent_50%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_5%_20%,rgba(255,92,168,0.1),transparent_48%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_55%_100%,rgba(124,108,255,0.14),transparent_52%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_0%_0%,rgba(255,179,92,0.08),transparent_45%)]",
  },
  {
    primary:
      "bg-[radial-gradient(ellipse_at_30%_50%,rgba(95,227,255,0.1),transparent_55%)]",
    secondary:
      "bg-[radial-gradient(ellipse_at_85%_10%,rgba(255,92,168,0.09),transparent_48%)]",
    accent:
      "bg-[radial-gradient(ellipse_at_70%_90%,rgba(124,108,255,0.08),transparent_42%)]",
  },
];

const OVERLAYS: Overlay[] = [
  "mesh",
  "beam",
  "haze",
  "rings",
  "drift",
  "veil",
  "none",
  "beam",
];

function hashSlug(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function OverlayLayer({ kind }: { kind: Overlay }) {
  switch (kind) {
    case "mesh":
      return (
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(242,239,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(242,239,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 40% 30%, black 12%, transparent 68%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 40% 30%, black 12%, transparent 68%)",
          }}
        />
      );
    case "beam":
      return (
        <div className="absolute inset-0 bg-[linear-gradient(118deg,transparent_32%,rgba(95,227,255,0.04)_48%,rgba(124,108,255,0.035)_52%,transparent_70%)]" />
      );
    case "haze":
      return (
        <>
          <div className="absolute -left-[10%] top-[20%] size-[26rem] rounded-full bg-pink-neon/[0.055] blur-[100px]" />
          <div className="absolute -right-[5%] bottom-[10%] size-[20rem] rounded-full bg-amber-neon/[0.05] blur-[90px]" />
        </>
      );
    case "rings":
      return (
        <div
          className="absolute left-1/2 top-1/2 size-[min(90vw,42rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.28]"
          style={{
            background:
              "repeating-radial-gradient(circle at center, transparent 0 42px, rgba(242,239,255,0.03) 42px 43px)",
            maskImage: "radial-gradient(circle, black 18%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 18%, transparent 70%)",
          }}
        />
      );
    case "drift":
      return (
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(124,108,255,0.045)_0%,transparent_35%,transparent_65%,rgba(95,227,255,0.035)_100%)]" />
      );
    case "veil":
      return (
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-18deg, transparent 0 14px, rgba(242,239,255,0.025) 14px 15px)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 70%, transparent)",
          }}
        />
      );
    case "none":
    default:
      return null;
  }
}

type Props = {
  slug: string;
  /** Индекс секции — сдвигает схему внутри одного кейса */
  section?: number;
  /** Более тёмный фон — градиенты слабее */
  dim?: boolean;
  className?: string;
};

/** Атмосфера секции на странице проекта: градиент + лёгкий оверлей */
export default function ProjectAtmosphere({
  slug,
  section = 0,
  dim = false,
  className = "",
}: Props) {
  const h = hashSlug(slug);
  const scheme = SCHEMES[(h + section) % SCHEMES.length];
  const overlay = OVERLAYS[(h + section * 3) % OVERLAYS.length];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className={`absolute inset-0 ${dim ? "opacity-45" : ""} ${scheme.primary}`} />
      <div className={`absolute inset-0 ${dim ? "opacity-40" : ""} ${scheme.secondary}`} />
      {scheme.accent && (
        <div className={`absolute inset-0 ${dim ? "opacity-35" : ""} ${scheme.accent}`} />
      )}

      <div className={dim ? "opacity-50" : ""}>
        <OverlayLayer kind={overlay} />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_38%,var(--sheen)_50%,transparent_62%)]" />
      <div
        className={`absolute inset-0 ${
          dim
            ? "bg-[radial-gradient(ellipse_at_center,transparent_28%,var(--vignette)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_42%,var(--vignette)_100%)]"
        }`}
      />
      <div
        className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent ${
          dim ? "from-void/90" : "from-void/70"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent ${
          dim ? "from-void/85" : "from-void/60"
        }`}
      />
      {dim && <div className="absolute inset-0 bg-void/35" />}
    </div>
  );
}

/** Мягкий полностраничный фон кейса — чуть разный у каждого slug */
export function ProjectPageWash({ slug }: { slug: string }) {
  const h = hashSlug(slug);
  const scheme = SCHEMES[h % SCHEMES.length];
  const overlay = OVERLAYS[(h + 2) % OVERLAYS.length];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-40 ${scheme.primary}`} />
      <div className={`absolute inset-0 opacity-30 ${scheme.secondary}`} />
      <OverlayLayer kind={overlay === "none" ? "drift" : overlay} />
      <div className="absolute inset-0 bg-void/70" />
    </div>
  );
}
