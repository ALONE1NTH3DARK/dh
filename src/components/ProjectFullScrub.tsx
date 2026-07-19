import { useEffect, useRef } from "react";

type Props = {
  src: string;
  url: string;
  title: string;
};

/** Sticky-рамка: пока листаете страницу, длинный *-full.jpg прокручивается внутри */
export default function ProjectFullScrub({ src, url, title }: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    const thumb = thumbRef.current;
    if (!wrap || !frame || !img || !thumb) return;

    let raf = 0;

    const measureAndPaint = () => {
      const frameH = frame.clientHeight;
      const imgH = img.offsetHeight;
      const maxScroll = Math.max(1, imgH - frameH);

      wrap.style.height = `${window.innerHeight + maxScroll}px`;

      const total = wrap.offsetHeight - window.innerHeight;
      const rect = wrap.getBoundingClientRect();
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      img.style.transform = `translate3d(0, ${-p * maxScroll}px, 0)`;

      const thumbH = Math.max(36, Math.min(frameH, (frameH / imgH) * frameH));
      const thumbTravel = Math.max(0, frameH - thumbH);
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${p * thumbTravel}px, 0)`;
    };

    const loop = () => {
      measureAndPaint();
      raf = requestAnimationFrame(loop);
    };

    const onLoad = () => measureAndPaint();
    img.addEventListener("load", onLoad);
    window.addEventListener("resize", measureAndPaint);
    measureAndPaint();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measureAndPaint);
    };
  }, [src]);

  return (
    <section ref={wrapRef} className="relative bg-void">
      <div className="sticky top-0 flex min-h-screen items-center py-20 md:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
          <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2 shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 md:px-5">
              <div className="flex gap-1.5">
                <span className="size-2 rounded-full bg-pink-neon/70" />
                <span className="size-2 rounded-full bg-amber-neon/70" />
                <span className="size-2 rounded-full bg-cyan-neon/70" />
              </div>
              <span className="rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-mute md:text-[10px]">
                {url}
              </span>
            </div>

            <div className="relative flex">
              <div
                ref={frameRef}
                className="relative h-[62vh] w-full overflow-hidden sm:h-[68vh] lg:h-[72vh]"
              >
                <img
                  ref={imgRef}
                  src={src}
                  alt={`Сайт ${title}`}
                  className="absolute left-0 top-0 w-full will-change-transform"
                  draggable={false}
                />
              </div>

              <div
                aria-hidden
                className="relative w-2.5 shrink-0 border-l border-white/[0.07] bg-white/[0.03]"
              >
                <div
                  ref={thumbRef}
                  className="absolute inset-x-0.5 top-0 rounded-full bg-gradient-to-b from-vio to-cyan-neon will-change-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
