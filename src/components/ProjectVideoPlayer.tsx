import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  src: string;
  title: string;
};

export default function ProjectVideoPlayer({ src, title }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wantPlayRef = useRef(false);
  const draggingRef = useRef(false);
  const [loadSrc, setLoadSrc] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoadSrc(true);
      },
      { rootMargin: "280px 0px", threshold: 0.01 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadSrc) return;
    video.load();
  }, [loadSrc, src]);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [loadSrc]);

  const paintPreviewFrame = () => {
    const video = videoRef.current;
    if (!video || !video.paused) return;
    if (video.currentTime > 0.05) return;
    try {
      video.currentTime = 0.001;
    } catch {
      // Firefox may throw if not seekable yet
    }
  };

  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    const video = videoRef.current;
    if (!bar || !video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const rect = bar.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = p * video.duration;
    setProgress(p);
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!loadSrc) {
      wantPlayRef.current = true;
      setLoadSrc(true);
      return;
    }
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <video
        ref={videoRef}
        playsInline
        preload={loadSrc ? "auto" : "none"}
        controls={false}
        disablePictureInPicture
        aria-label={`Запись сайта ${title}`}
        className="absolute inset-0 h-full w-full bg-void-2 object-cover object-top"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={paintPreviewFrame}
        onCanPlay={() => {
          paintPreviewFrame();
          if (!wantPlayRef.current) return;
          wantPlayRef.current = false;
          void videoRef.current?.play().catch(() => {});
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(1);
        }}
        onTimeUpdate={(event) => {
          if (draggingRef.current) return;
          const el = event.currentTarget;
          if (!el.duration) return;
          setProgress(el.currentTime / el.duration);
        }}
      >
        {loadSrc ? <source src={`${src}#t=0.001`} type="video/mp4" /> : null}
      </video>

      <div
        className={`absolute inset-0 z-[1] flex flex-col ${playing ? "" : "bg-void/20"}`}
      >
        {!playing ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Смотреть"
            className="grid min-h-0 flex-1 place-items-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-ink text-void shadow-[0_0_40px_rgba(124,108,255,0.35)] transition-[transform,background-color,color] duration-300 hover:scale-105 hover:bg-vio hover:text-ink md:size-[4.5rem]">
              <Play className="size-6 translate-x-px fill-current md:size-7" strokeWidth={1.75} />
            </span>
          </button>
        ) : (
          <div className="min-h-0 flex-1" onClick={toggle} />
        )}

        <div className="flex items-center gap-3 px-3 py-3 md:px-4 md:py-3.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Пауза" : "Смотреть"}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-void transition-colors hover:bg-vio hover:text-ink md:size-10"
          >
            {playing ? (
              <Pause className="size-3.5 fill-current md:size-4" strokeWidth={1.75} />
            ) : (
              <Play className="size-3.5 translate-x-px fill-current md:size-4" strokeWidth={1.75} />
            )}
          </button>

          <div
            ref={barRef}
            role="slider"
            tabIndex={0}
            aria-label="Перемотка"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="group flex h-8 flex-1 cursor-pointer items-center"
            onPointerDown={(event) => {
              draggingRef.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              seekFromClientX(event.clientX);
            }}
            onPointerMove={(event) => {
              if (!draggingRef.current) return;
              seekFromClientX(event.clientX);
            }}
            onPointerUp={() => {
              draggingRef.current = false;
            }}
            onPointerCancel={() => {
              draggingRef.current = false;
            }}
            onKeyDown={(event) => {
              const video = videoRef.current;
              if (!video?.duration) return;
              const step = event.shiftKey ? 5 : 2;
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + step);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - step);
              }
            }}
          >
            <div className="relative h-1.5 w-full rounded-full bg-white/15 transition-[height] group-hover:h-2">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-vio to-cyan-neon"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
