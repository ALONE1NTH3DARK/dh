import { gsap } from "gsap";

/**
 * Появление секций: GSAP рисует кадры, IntersectionObserver решает когда.
 * ScrollTrigger здесь не подходит — портфолио меняет высоту секции на ходу,
 * и его триггеры пришлось бы пересчитывать на каждом кадре ленты.
 *
 * Язык движения разный по типу блока: заголовки выходят из маски,
 * карточки приезжают слева направо одним каскадом,
 * кадр открывается шторкой. Один и тот же fade-up на всём — дешёвый шаблон.
 */

export type RevealFrom = "up" | "left" | "right" | "fold" | "fade";

/** Дистанция короткая, кривая длинная: движение читается как доводка. */
const SHIFT = 22;
const STAGGER = 0.12;
export const EASE = "expo.out";

/** Текст выходит из-под маски, блоки — нет: clip-path режет тени карточек. */
const MASKED_TAGS = new Set(["H1", "H2", "H3", "H4", "P", "BLOCKQUOTE"]);

/**
 * Отрицательные отступы по вертикали — запас для выносных элементов и
 * -webkit-text-stroke, иначе маска срезает контур букв.
 */
export const CLIP_HIDDEN = "inset(106% 0% -6% 0%)";
export const CLIP_SHOWN = "inset(-6% 0% -6% 0%)";
const MEDIA_CLIP_HIDDEN = "inset(108% 0% -8% 0%)";
const MEDIA_CLIP_SHOWN = "inset(-4% 0% -4% 0%)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Однократный вход в кадр. Возвращает отписку. */
export function onEnter(el: Element, play: () => void): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      io.disconnect();
      play();
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
  );
  io.observe(el);
  return () => io.disconnect();
}

function children(el: Element): HTMLElement[] {
  return [...el.children].filter((node): node is HTMLElement => node instanceof HTMLElement);
}

/**
 * Что именно едет. Каскад по детям, а не блоком целиком — иначе секция
 * выезжает одной плитой, и это сразу читается как шаблон.
 */
function targets(root: HTMLElement): { items: HTMLElement[]; self: boolean } {
  if (root.dataset.reveal === "self") return { items: [root], self: true };

  const groups = [...root.querySelectorAll<HTMLElement>("[data-reveal-group]")];
  const grouped = groups.flatMap(children);
  if (grouped.length > 0) return { items: grouped, self: false };

  const direct = children(root);
  if (direct.length > 0) return { items: direct, self: false };

  return { items: [root], self: true };
}

function isMasked(el: HTMLElement): boolean {
  const mode = el.dataset.reveal;
  if (mode === "mask") return true;
  if (mode === "plain") return false;
  return MASKED_TAGS.has(el.tagName);
}

function fromOf(el: HTMLElement, root: HTMLElement): RevealFrom {
  const value = el.dataset.revealFrom || root.dataset.revealFrom;
  if (value === "left" || value === "right" || value === "fold" || value === "fade") return value;
  return "up";
}

function hiddenVars(el: HTMLElement, from: RevealFrom): gsap.TweenVars {
  if (isMasked(el)) {
    return {
      opacity: 0,
      y: SHIFT * 0.7,
      rotateX: 8,
      clipPath: CLIP_HIDDEN,
      transformPerspective: 900,
      transformOrigin: "50% 100%",
    };
  }

  if (from === "fade") {
    return { opacity: 0 };
  }
  if (from === "left") {
    return { opacity: 0, x: -42, y: 14, rotate: -1.1 };
  }
  if (from === "right") {
    return { opacity: 0, x: 42, y: 14, rotate: 1.1 };
  }
  if (from === "fold") {
    return {
      opacity: 0,
      y: 40,
      rotateX: 8,
      scale: 0.975,
      transformPerspective: 1100,
      transformOrigin: "50% 92%",
    };
  }

  return { opacity: 0, y: SHIFT };
}

function shownVars(el: HTMLElement, from: RevealFrom): gsap.TweenVars {
  /** opacity оставляем инлайном: иначе CSS `.dh-anim [data-reveal-root]` снова спрячет блок. */
  const duration = isMasked(el)
    ? 1.18
    : from === "fold"
      ? 1.12
      : from === "fade"
        ? 0.7
        : from === "up"
          ? 0.96
          : 1.05;

  if (isMasked(el)) {
    return {
      opacity: 1,
      y: 0,
      rotateX: 0,
      clipPath: CLIP_SHOWN,
      duration,
      clearProps: "clipPath,transform",
    };
  }

  if (from === "fade") {
    return { opacity: 1, duration };
  }

  if (from === "left" || from === "right") {
    return { opacity: 1, x: 0, y: 0, rotate: 0, duration, clearProps: "transform" };
  }
  if (from === "fold") {
    return { opacity: 1, y: 0, rotateX: 0, scale: 1, duration, clearProps: "transform" };
  }

  return { opacity: 1, y: 0, duration, clearProps: "transform" };
}

/** Прячет содержимое до входа в кадр. Вызывать до первого кадра. */
export function armReveal(root: HTMLElement): void {
  const { items, self } = targets(root);
  if (!self) gsap.set(root, { opacity: 1 });
  if (root.dataset.revealFrom === "fold") gsap.set(root, { perspective: 1100 });

  for (const el of items) {
    gsap.set(el, hiddenVars(el, fromOf(el, root)));
  }

  gsap.set(root.querySelectorAll("[data-reveal-line]"), { scaleX: 0 });
  gsap.set(root.querySelectorAll("[data-reveal-media]"), {
    scale: 1.06,
    clipPath: MEDIA_CLIP_HIDDEN,
  });
  gsap.set(root.querySelectorAll("[data-reveal-pop]"), { scale: 0.86, opacity: 0 });
}

/** Собственно вход. `clearProps` transform — чтобы не мешал hover и sticky. */
export function playReveal(root: HTMLElement, delay = 0): gsap.core.Timeline {
  const tl = gsap.timeline({ delay, defaults: { ease: EASE } });
  const { items } = targets(root);

  items.forEach((el, i) => {
    const from = fromOf(el, root);
    const at = i * STAGGER;
    tl.to(el, shownVars(el, from), at);
  });

  const lines = [...root.querySelectorAll<HTMLElement>("[data-reveal-line]")];
  for (const line of lines) {
    tl.to(
      line,
      {
        scaleX: 1,
        duration: 0.95,
        transformOrigin: line.dataset.revealLine === "right" ? "right center" : "left center",
        clearProps: "transform",
      },
      0.1
    );
  }

  const media = [...root.querySelectorAll<HTMLElement>("[data-reveal-media]")];
  for (const el of media) {
    const owner = items.findIndex((item) => item.contains(el));
    tl.to(
      el,
      {
        scale: 1,
        clipPath: MEDIA_CLIP_SHOWN,
        duration: 1.35,
        ease: "power3.out",
        clearProps: "transform,clipPath",
      },
      (owner >= 0 ? owner : 0) * STAGGER + 0.06
    );
  }

  const pops = [...root.querySelectorAll<HTMLElement>("[data-reveal-pop]")];
  pops.forEach((el, i) => {
    const owner = items.findIndex((item) => item.contains(el));
    tl.to(
      el,
      { scale: 1, opacity: 1, duration: 0.85, clearProps: "transform" },
      (owner >= 0 ? owner : i) * STAGGER + 0.26
    );
  });

  return tl;
}

/** Вход шапки: сверху, коротко, без маски — иначе логотип «плывёт». */
export function playNavIn(root: HTMLElement): gsap.core.Timeline | null {
  const bits = [...root.querySelectorAll<HTMLElement>("[data-nav-in]")];
  if (bits.length === 0) return null;

  if (prefersReducedMotion()) {
    gsap.set(bits, { opacity: 1 });
    return null;
  }

  gsap.set(bits, { opacity: 0, y: -14 });
  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.08 });
  tl.to(bits, {
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.045,
    clearProps: "transform",
  });
  return tl;
}

/** Мгновенно показать: reduced motion и всё, что не должно анимироваться. */
export function skipReveal(root: HTMLElement): void {
  const { items, self } = targets(root);
  if (!self) gsap.set(root, { opacity: 1 });
  gsap.set(items, { opacity: 1, clearProps: "transform,clipPath" });
  gsap.set(root.querySelectorAll("[data-reveal-line]"), { scaleX: 1, clearProps: "transform" });
  gsap.set(root.querySelectorAll("[data-reveal-media]"), {
    opacity: 1,
    clearProps: "transform,clipPath",
  });
  gsap.set(root.querySelectorAll("[data-reveal-pop]"), { opacity: 1, clearProps: "transform" });
}
