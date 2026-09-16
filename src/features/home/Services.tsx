import { HeartHandshake, Rocket, Settings, Sparkles } from "lucide-react";
import { useT } from "@/i18n/useT";
import Reveal from "@/components/ui/Reveal";
import SectionAtmosphere from "@/components/ui/SectionAtmosphere";
import SectionInner from "@/components/ui/SectionInner";
import SectionLabel from "@/components/ui/SectionLabel";
import turnkeyImg from "@/assets/services/turnkey.webp";
import turnkeyLightImg from "@/assets/services/turnkey-light.webp";
import brandImg from "@/assets/services/brand.webp";
import brandLightImg from "@/assets/services/brand-light.webp";
import supportImg from "@/assets/services/support.webp";
import supportLightImg from "@/assets/services/support-light.webp";

const SERVICE_META = [
  { icon: Rocket, image: turnkeyImg, lightImage: turnkeyLightImg },
  { icon: Settings, image: brandImg, lightImage: brandLightImg },
  { icon: HeartHandshake, image: supportImg, lightImage: supportLightImg },
];

function Marquee() {
  const t = useT();
  const items = t.services.marquee;
  const half = (
    <div className="flex shrink-0 items-center">
      {items.concat(items).map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-8 font-display text-[32px] font-semibold uppercase tracking-tight md:px-10 ${
              i % 2 === 0 ? "text-ink" : "text-stroke"
            }`}
          >
            {item}
          </span>
          <Sparkles className="size-4 text-vio md:size-5" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-void py-6 md:py-8">
      <div aria-hidden className="section-band opacity-70" />
      <div className="animate-marquee relative flex w-max">
        {half}
        {half}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}

export default function Services() {
  const t = useT();
  const services = t.services.items.map((item, i) => ({
    ...item,
    ...SERVICE_META[i],
  }));

  return (
    <>
      <section id="services" className="relative overflow-hidden bg-void px-5 py-24 md:px-10 md:py-32">
        <SectionAtmosphere tone="vio" />

        <SectionInner>
          <Reveal className="mb-12 text-center md:mb-16">
            <SectionLabel center>{t.services.label}</SectionLabel>
            <h2 className="font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-semibold uppercase leading-[1.20] text-pretty">
              {t.services.titleBefore}
              <span className="text-stroke">{t.services.titleStroke}</span>{" "}
              <span className="text-gradient-neon">{t.services.titleAccent}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
              {t.services.subtitle}
            </p>
          </Reveal>

          <Reveal from="left">
            <div data-reveal-group className="grid gap-8 md:grid-cols-3">
            {services.map((s) => (
                <div
                  key={s.title}
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-void-2 shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_40px_rgba(124,108,255,0.18)]"
                >
                  <div className="relative">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={s.image}
                        alt=""
                        data-reveal-media
                        className="h-full w-full object-cover light:hidden"
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src={s.lightImage}
                        alt=""
                        data-reveal-media
                        className="hidden h-full w-full object-cover light:block"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div
                      data-reveal-pop
                      className="absolute bottom-0 left-10 z-10 grid size-12 translate-y-1/2 place-items-center rounded-full bg-void-2 shadow-[0_6px_16px_rgba(0,0,0,0.22)] light:shadow-[0_6px_16px_rgba(24,21,31,0.1)] md:left-12 md:size-[3.25rem]"
                    >
                      <s.icon className="size-5 text-cyan-neon" strokeWidth={1.75} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-10 pb-6 pt-9 md:px-12 md:pb-7 md:pt-10">
                    <h3 className="font-display text-sm font-medium uppercase tracking-wide text-ink md:text-base">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[17px] leading-relaxed text-mute">{s.text}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-vio">
                        {s.tag}
                      </span>
                    </div>
                  </div>
                </div>
            ))}
            </div>
          </Reveal>
        </SectionInner>
      </section>
      <Marquee />
    </>
  );
}
