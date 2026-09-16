import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Image, Play } from "lucide-react";
import { useT } from "@/i18n/useT";
import { lenisRef, readSvh } from "@/lib/scrollState";
import ProjectVideoPlayer from "@/features/project/ProjectVideoPlayer";

type Props = {
  src: string;
  url: string;
  title: string;
  videos?: string[];
};

type ActiveMedia = "image" | number;

const switchBtn =
  "grid size-10 place-items-center rounded-full border transition-colors";

/** Sticky-рамка: сначала всегда full-скриншот. Если у проекта есть video —
 *  под окном появляются круглые кнопки, чтобы переключить зону на плеер. */
export default function ProjectFullScrub({ src, url, title, videos = [] }: Props) {
  const t = useT();
  const wrapRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveMedia>("image");

  const showImage = active === "image";
  const videoSrc = typeof active === "number" ? videos[active] : undefined;
  const showSwitcher = videos.length > 0;

  useEffect(() => {
    setActive("image");
  }, [src]);

  useLayoutEffect(() => {
    if (showImage) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.height = "";

    const top =
      window.scrollY + wrap.getBoundingClientRect().top;
    const y = Math.max(0, top);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo({ top: y, behavior: "instant" });
    }
  }, [showImage]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!showImage) return;

    const frame = frameRef.current;
    const img = imgRef.current;
    const thumb = thumbRef.current;
    if (!wrap || !frame || !img || !thumb) return;

    let raf = 0;
    let running = false;
    let svh = readSvh();
    let maxScroll = 1;

    const measure = () => {
      svh = readSvh();
      const frameH = frame.clientHeight;
      const imgH = img.offsetHeight;
      maxScroll = Math.max(1, imgH - frameH);
      wrap.style.height = `${svh + maxScroll}px`;
    };

    const paint = () => {
      const frameH = frame.clientHeight;
      const imgH = img.offsetHeight;
      const total = Math.max(1, wrap.offsetHeight - svh);
      const rect = wrap.getBoundingClientRect();
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      img.style.transform = `translate3d(0, ${-p * maxScroll}px, 0)`;

      const thumbH = Math.max(36, Math.min(frameH, (frameH / Math.max(1, imgH)) * frameH));
      const thumbTravel = Math.max(0, frameH - thumbH);
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${p * thumbTravel}px, 0)`;
    };

    const loop = () => {
      if (!running) return;
      paint();
      raf = requestAnimationFrame(loop);
    };

    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };

    const onLoad = () => {
      measure();
      paint();
    };
    img.addEventListener("load", onLoad);
    window.addEventListener("resize", measure);
    measure();

    const io = new IntersectionObserver(
      ([entry]) => {
        setRunning(Boolean(entry?.isIntersecting) && document.visibilityState === "visible");
      },
      { rootMargin: "20% 0px" }
    );
    io.observe(wrap);

    const onVisibility = () => {
      const rect = wrap.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      setRunning(document.visibilityState === "visible" && onScreen);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      setRunning(false);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      img.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measure);
      wrap.style.height = "";
    };
  }, [src, showImage]);

  return (
    <section ref={wrapRef} className="relative bg-void">
      <div
        className={
          showImage
            ? "sticky top-0 flex min-h-dvh items-center py-20 md:py-24"
            : "flex min-h-dvh items-center py-20 md:py-24"
        }
      >
        <div className="mx-auto w-full max-w-[1400px] px-1.5 md:px-10">
          <div className="isolate overflow-hidden rounded-2xl border border-white/[0.09] bg-void-2 shadow-[0_40px_100px_rgba(0,0,0,0.45)] [transform:translateZ(0)] light:shadow-[0_18px_40px_rgba(24,21,31,0.12),0_36px_88px_rgba(24,21,31,0.14)]">
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 md:px-5">
              <div className="flex shrink-0 gap-1.5">
                <span className="size-2 rounded-full bg-pink-neon/70" />
                <span className="size-2 rounded-full bg-amber-neon/70" />
                <span className="size-2 rounded-full bg-cyan-neon/70" />
              </div>
              <span className="min-w-0 truncate rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[9px] tracking-[0.15em] text-mute md:text-[10px]">
                {url}
              </span>
            </div>

            <div className="relative flex">
              <div
                ref={frameRef}
                className={`relative h-[62vh] w-full overflow-hidden sm:h-[68vh] lg:h-[72vh] ${
                  showImage
                    ? ""
                    : "rounded-b-2xl [clip-path:inset(0_round_0_0_1rem_1rem)]"
                }`}
              >
                {showImage ? (
                  <img
                    ref={imgRef}
                    src={src}
                    alt={`${t.project.siteAlt} ${title}`}
                    className="absolute left-0 top-0 w-full will-change-transform"
                    draggable={false}
                    decoding="async"
                  />
                ) : videoSrc ? (
                  <ProjectVideoPlayer
                    key={videoSrc}
                    src={videoSrc}
                    title={title}
                    autoPlay
                  />
                ) : null}
              </div>

              {showImage && (
                <div
                  aria-hidden
                  className="relative w-2.5 shrink-0 border-l border-white/[0.07] bg-white/[0.03]"
                >
                  <div
                    ref={thumbRef}
                    className="absolute inset-x-0.5 top-0 rounded-full bg-gradient-to-b from-vio to-cyan-neon will-change-transform"
                  />
                </div>
              )}
            </div>
          </div>

          {showSwitcher && (
            <div className="mt-5 flex justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setActive("image")}
                aria-label={t.project.screenshot}
                aria-pressed={showImage}
                className={`${switchBtn} ${
                  showImage
                    ? "border-vio bg-vio/15 text-ink"
                    : "border-white/15 text-ink hover:border-vio hover:bg-vio/15"
                }`}
              >
                <Image className="size-4" strokeWidth={1.75} />
              </button>

              {videos.map((path, index) => {
                const selected = active === index;
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => {
                      if (active !== index) {
                        flushSync(() => setActive(index));
                      }
                      const video = frameRef.current?.querySelector("video");
                      void video?.play().catch(() => {});
                    }}
                    aria-label={`${t.project.video} ${index + 1}`}
                    aria-pressed={selected}
                    className={`${switchBtn} relative ${
                      selected
                        ? "border-vio bg-vio/15 text-ink"
                        : "border-white/15 text-ink hover:border-vio hover:bg-vio/15"
                    }`}
                  >
                    <Play className="size-4 translate-x-px fill-current" strokeWidth={1.75} />
                    {videos.length > 1 ? (
                      <span className="absolute right-1.5 top-1 font-mono text-[8px] leading-none text-ink">
                        {index + 1}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
