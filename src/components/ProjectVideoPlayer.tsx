import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useT } from "../i18n/useT";

type Props = {
  src: string;
  title: string;
  autoPlay?: boolean;
  volume?: boolean;
};

export default function ProjectVideoPlayer({
  src,
  title,
  autoPlay = false,
  volume: showVolume = false,
}: Props) {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const volBarRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const draggingVolRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setProgress(0);
    if (autoPlay) return;
    setPlaying(false);
    videoRef.current?.load();
  }, [src, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : level;
  }, [level, muted]);

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
  }, []);

  const paintPreviewFrame = () => {
    if (autoPlay) return;
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

  const setVolumeFromClientX = (clientX: number) => {
    const bar = volBarRef.current;
    const video = videoRef.current;
    if (!bar || !video) return;
    const rect = bar.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setMuted(false);
    setLevel(p);
    video.volume = p;
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden rounded-b-2xl [clip-path:inset(0_round_0_0_1rem_1rem)] [transform:translateZ(0)]"
    >
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-label={`${t.player.recording} ${title}`}
        className="absolute inset-0 h-full w-full rounded-b-2xl bg-void-2 object-cover object-top"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={paintPreviewFrame}
        onCanPlay={() => {
          paintPreviewFrame();
          if (autoPlay) void videoRef.current?.play().catch(() => {});
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
        <source src={`${src}#t=0.001`} type="video/mp4" />
      </video>

      <div className={`absolute inset-0 z-[1] ${playing ? "" : "bg-void/20"}`}>
        {!playing ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={t.player.play}
            className="absolute inset-0 z-[1] grid place-items-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-ink text-void shadow-[0_0_40px_rgba(124,108,255,0.35)] transition-[transform,background-color,color] duration-300 hover:scale-105 hover:bg-vio hover:text-ink md:size-[4.5rem]">
              <Play className="size-6 translate-x-px fill-current md:size-7" strokeWidth={1.75} />
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 z-[1]" onClick={toggle} />
        )}

        <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center gap-3 px-3 py-3 md:px-4 md:py-3.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? t.player.pause : t.player.play}
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
            aria-label={t.player.seek}
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

          {showVolume ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMuted((on) => !on)}
                aria-label={muted || level === 0 ? t.player.unmute : t.player.mute}
                className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:text-vio md:size-10"
              >
                {muted || level === 0 ? (
                  <VolumeX className="size-4" strokeWidth={1.75} />
                ) : (
                  <Volume2 className="size-4" strokeWidth={1.75} />
                )}
              </button>
              <div
                ref={volBarRef}
                role="slider"
                tabIndex={0}
                aria-label={t.player.volume}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round((muted ? 0 : level) * 100)}
                className="group flex h-8 w-16 cursor-pointer items-center md:w-20"
                onPointerDown={(event) => {
                  draggingVolRef.current = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setVolumeFromClientX(event.clientX);
                }}
                onPointerMove={(event) => {
                  if (!draggingVolRef.current) return;
                  setVolumeFromClientX(event.clientX);
                }}
                onPointerUp={() => {
                  draggingVolRef.current = false;
                }}
                onPointerCancel={() => {
                  draggingVolRef.current = false;
                }}
                onKeyDown={(event) => {
                  const step = 0.1;
                  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setMuted(false);
                    setLevel((v) => Math.min(1, v + step));
                  }
                  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                    event.preventDefault();
                    setLevel((v) => Math.max(0, v - step));
                  }
                }}
              >
                <div className="relative h-1.5 w-full rounded-full bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-ink"
                    style={{ width: `${(muted ? 0 : level) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
