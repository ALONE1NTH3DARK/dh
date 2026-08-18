import { useEffect, useRef } from "react";
import { isLabCrawler } from "../lib/labCrawler";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    container: string | HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function loadTurnstileScript(): Promise<TurnstileApi> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener(
        "load",
        () => {
          if (window.turnstile) resolve(window.turnstile);
          else reject(new Error("Turnstile failed to load"));
        },
        { once: true }
      );
      existing.addEventListener("error", () => reject(new Error("Turnstile script error")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile failed to load"));
    };
    script.onerror = () => reject(new Error("Turnstile script error"));
    document.head.appendChild(script);
  });
}

type TurnstileFieldProps = {
  siteKey: string;
  onToken: (token: string | null) => void;
  resetSignal?: number;
};

export default function TurnstileField({
  siteKey,
  onToken,
  resetSignal = 0,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (isLabCrawler() || !siteKey) return;

    let cancelled = false;

    const mount = async () => {
      try {
        const turnstile = await loadTurnstileScript();
        if (cancelled || !containerRef.current || widgetIdRef.current) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "normal",
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => onTokenRef.current(null),
          "expired-callback": () => onTokenRef.current(null),
        });
      } catch {
        if (!cancelled) onTokenRef.current(null);
      }
    };

    void mount();

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      widgetIdRef.current = null;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return;
    try {
      window.turnstile.reset(widgetIdRef.current);
    } catch {
      // ignore
    }
    onTokenRef.current(null);
  }, [resetSignal]);

  return <div ref={containerRef} className="min-h-[65px] w-full overflow-hidden" />;
}
