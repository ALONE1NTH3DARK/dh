/** Фон героя: background + мягкие большие пятна + фигура справа */
export default function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 z-[1] overflow-hidden">
      <div className="absolute inset-0 bg-[#070f22] light:bg-[#eae6f4]" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat light:opacity-[0.22] light:brightness-125"
        style={{ backgroundImage: "url(/background.webp)" }}
      />

      {/* Большие спокойные градиенты — разнообразие фона, без привязки к UI */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[15%] bottom-[-10%] h-[70%] w-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,138,61,0.14)_0%,transparent_70%)] blur-3xl light:opacity-70" />
        <div className="absolute left-[18%] top-[55%] h-[50%] w-[45%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,108,255,0.12)_0%,transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[5%] left-[5%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(95,227,255,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-[40%] top-[20%] h-[45%] w-[35%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,92,168,0.07)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Читаемость текста слева */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070f22]/75 via-[#070f22]/35 to-transparent md:via-[#070f22]/20 light:from-[#eae6f4]/90 light:via-[#eae6f4]/45 md:light:via-[#eae6f4]/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070f22]/35 via-transparent to-[#060c1c]/65 light:from-[#eae6f4]/40 light:to-[#eae6f4]/75" />

      <img
        src="/figure.png"
        alt=""
        className="pointer-events-none absolute right-[-8%] top-[42%] w-[min(72vw,300px)] -translate-y-1/2 select-none md:right-[3%] md:top-1/2 md:w-[min(34vw,400px)] lg:w-[min(32vw,440px)] light:opacity-80"
        draggable={false}
      />
    </div>
  );
}
