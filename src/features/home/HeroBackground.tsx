/** Фон героя: background + мягкие большие пятна + фигура справа */
export default function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 z-[1] overflow-hidden">
      <div className="absolute inset-0 bg-[#070f22] light:bg-[#f6f0e6]" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat light:hidden"
        style={{ backgroundImage: "url(/background.webp)" }}
      />

      {/* Тёмная тема: спокойные пятна одним слоем градиентов, без filter: blur */}
      <div
        className="pointer-events-none absolute inset-0 light:hidden"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 62% 78% at 12% 96%, rgba(255,138,61,0.14) 0%, rgba(255,138,61,0.05) 45%, transparent 78%)",
            "radial-gradient(ellipse 52% 58% at 40% 80%, rgba(124,108,255,0.12) 0%, rgba(124,108,255,0.04) 48%, transparent 80%)",
            "radial-gradient(ellipse 46% 46% at 25% 85%, rgba(95,227,255,0.08) 0%, rgba(95,227,255,0.03) 46%, transparent 78%)",
            "radial-gradient(ellipse 40% 50% at 58% 42%, rgba(255,92,168,0.07) 0%, rgba(255,92,168,0.03) 46%, transparent 78%)",
          ].join(", "),
        }}
      />

      {/* Светлая тема: один слой mesh с очень мягким falloff */}
      <div
        className="pointer-events-none absolute -inset-[8%] hidden light:block"
        style={{
          backgroundImage: [
            // персик сверху справа
            "radial-gradient(ellipse 70% 65% at 90% -5%, rgba(255,212,168,0.9) 0%, rgba(255,212,168,0.35) 35%, transparent 72%)",
            // холодный wash слева
            "radial-gradient(ellipse 58% 60% at 5% 20%, rgba(197,205,224,0.5) 0%, rgba(197,205,224,0.18) 40%, transparent 75%)",
            // оранж выше справа
            "radial-gradient(ellipse 78% 72% at 95% 62%, rgba(255,122,40,0.52) 0%, rgba(255,138,61,0.28) 38%, transparent 78%)",
            // мягкий оранж по низу (ниже слева)
            "radial-gradient(ellipse 100% 65% at 38% 100%, rgba(255,179,92,0.48) 0%, rgba(255,179,92,0.22) 42%, transparent 80%)",
            // плотнее у правого низа
            "radial-gradient(ellipse 62% 55% at 82% 88%, rgba(255,138,61,0.4) 0%, rgba(255,138,61,0.16) 40%, transparent 76%)",
            // намёк розового справа внизу
            "radial-gradient(ellipse 55% 48% at 92% 105%, rgba(255,92,168,0.38) 0%, rgba(255,92,168,0.14) 40%, transparent 78%)",
          ].join(", "),
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#070f22]/75 via-[#070f22]/35 to-transparent md:via-[#070f22]/20 light:from-[#f6f0e6]/35 light:via-[#f6f0e6]/6 md:light:via-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070f22]/35 via-transparent to-[#060c1c]/65 light:from-[#f6f0e6]/42 light:via-transparent light:to-transparent" />

      {/* Кривые: только светлая тема */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full text-[#b86a38]/48 light:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          stroke="currentColor"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        >
          {/* провал у x≈430 (30%), сильнее дуга, финиш ~1/2 */}
          <path
            d="M-40 575 C 140 590, 280 720, 430 740 C 700 770, 1100 500, 1540 420"
            strokeWidth="1.15"
            opacity="0.9"
          />
          <path
            d="M-40 588 C 145 610, 290 760, 435 790 C 710 830, 1110 520, 1540 435"
            strokeWidth="0.95"
            opacity="0.55"
          />
          <path
            d="M-40 598 C 150 630, 300 800, 440 840 C 720 890, 1120 545, 1540 450"
            strokeWidth="1.2"
            opacity="0.88"
          />
          <path
            d="M-40 608 C 155 650, 310 840, 445 890 C 730 950, 1130 570, 1540 465"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M-40 616 C 160 670, 320 880, 450 940 C 740 1010, 1140 595, 1540 480"
            strokeWidth="1.25"
            opacity="0.92"
          />
          <path
            d="M-40 624 C 165 690, 330 920, 455 990 C 750 1070, 1150 620, 1540 495"
            strokeWidth="0.9"
            opacity="0.48"
          />
          <path
            d="M-40 632 C 170 710, 340 960, 460 1040 C 760 1130, 1160 645, 1540 510"
            strokeWidth="1.15"
            opacity="0.85"
          />
          <path
            d="M-40 640 C 175 730, 350 1000, 465 1090 C 770 1190, 1170 670, 1540 525"
            strokeWidth="1"
            opacity="0.55"
          />
          <path
            d="M-40 648 C 180 750, 360 1040, 470 1140 C 780 1250, 1180 695, 1540 540"
            strokeWidth="1.2"
            opacity="0.88"
          />
          <path
            d="M-40 656 C 185 770, 370 1080, 475 1190 C 790 1310, 1190 720, 1540 555"
            strokeWidth="0.95"
            opacity="0.5"
          />
          <path
            d="M-40 664 C 190 790, 380 1120, 480 1240 C 800 1370, 1200 745, 1540 570"
            strokeWidth="1.1"
            opacity="0.8"
          />
          <path
            d="M-40 672 C 195 810, 390 1160, 485 1290 C 810 1430, 1210 770, 1540 585"
            strokeWidth="1"
            opacity="0.55"
          />
          <path
            d="M-40 680 C 200 830, 400 1200, 490 1340 C 820 1490, 1220 795, 1540 600"
            strokeWidth="1.05"
            opacity="0.72"
          />
        </g>
      </svg>

      <img
        src="/figure.png"
        alt=""
        className="pointer-events-none absolute right-[-8%] top-[42%] w-[min(72vw,300px)] -translate-y-1/2 select-none md:right-[3%] md:top-1/2 md:w-[min(34vw,400px)] lg:w-[min(32vw,440px)] light:opacity-70"
        draggable={false}
        width={871}
        height={864}
        decoding="async"
      />

      {/* Лёгкий film-grain: только светлая тема */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-[0.11] mix-blend-multiply md:light:block"
      >
        <filter id="dh-hero-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="1"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.55 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#dh-hero-noise)" />
      </svg>
    </div>
  );
}
