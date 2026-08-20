"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  fetchLogoMark,
  LOGO_DRAW_SEQUENCE,
  LOGO_FILL,
  LOGO_LETTER_CLIPS,
  LOGO_MARK_SRC,
  LOGO_MASK_STROKE_WIDTH,
  LOGO_STROKE_SCALE,
  LOGO_SUBTITLE_CLIP,
  LOGO_SUBTITLE_FILL,
  LOGO_SUBTITLE_FILL_DARK,
  logoStrokeDrawTiming,
  drawOffsetAtPoint,
  pathLengthAtPoint,
  type ParsedLogoMark,
} from "@/components/brand/logo-paths";

type Props = {
  className?: string;
  playToken?: number;
  darkMode?: boolean;
};

type CancelFn = () => void;

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function setRectClip(
  el: SVGRectElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("width", String(Math.max(0, width)));
  el.setAttribute("height", String(Math.max(0, height)));
}

function runSubtitleAnimation(el: SVGRectElement, delayMs: number): CancelFn {
  let frame = 0;
  let cancelled = false;
  const { x, y, width, height } = LOGO_SUBTITLE_CLIP;

  const start = () => {
    const t0 = performance.now();
    const durationMs = 1400;

    const tick = (now: number) => {
      if (cancelled) return;
      const raw = Math.min(Math.max((now - t0) / durationMs, 0), 1);
      setRectClip(el, x, y, width * ease(raw), height);
      if (raw < 1) frame = requestAnimationFrame(tick);
      else setRectClip(el, x, y, width, height);
    };

    frame = requestAnimationFrame(tick);
  };

  setRectClip(el, x, y, 0, height);
  const delayTimer = window.setTimeout(start, delayMs);

  return () => {
    cancelled = true;
    window.clearTimeout(delayTimer);
    cancelAnimationFrame(frame);
  };
}

export default function AnimatedLogoMark({
  className,
  playToken = 0,
  darkMode = false,
}: Props) {
  const reactId = useId().replace(/:/g, "");
  const rootRef = useRef<SVGSVGElement>(null);
  const [logo, setLogo] = useState<ParsedLogoMark | null>(null);
  const [usePngFallback, setUsePngFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLogoMark()
      .then((parsed) => {
        if (!cancelled) {
          setLogo(parsed);
          setUsePngFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled) setUsePngFallback(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (usePngFallback) return;

    const root = rootRef.current;
    if (!root || !logo) return;

    const maskEls = LOGO_DRAW_SEQUENCE.map(
      ({ id }) => root.querySelector(`#logo-mask-${id}`) as SVGGeometryElement | null,
    ).filter(Boolean) as SVGGeometryElement[];

    const fillEls = LOGO_DRAW_SEQUENCE.map(
      ({ id }) => root.querySelector(`#logo-fill-${id}`) as SVGPathElement | null,
    ).filter(Boolean) as SVGPathElement[];

    const subtitleClipEl = root.querySelector(
      "#logo-clip-shape-subtitle",
    ) as SVGRectElement | null;

    const lengths = maskEls.map((el) => el.getTotalLength());
    const { durations, delays } = logoStrokeDrawTiming(lengths);
    const subtitleDelay =
      LOGO_DRAW_SEQUENCE.length > 0
        ? (delays[LOGO_DRAW_SEQUENCE.length - 1] ?? 0) +
          (durations[LOGO_DRAW_SEQUENCE.length - 1] ?? 0) +
          0.08
        : 0;

    const cancels: CancelFn[] = [];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealFill = (fillEl: SVGPathElement) => {
      fillEl.removeAttribute("mask");
    };

    if (prefersReducedMotion) {
      fillEls.forEach(revealFill);
      if (subtitleClipEl) {
        setRectClip(
          subtitleClipEl,
          LOGO_SUBTITLE_CLIP.x,
          LOGO_SUBTITLE_CLIP.y,
          LOGO_SUBTITLE_CLIP.width,
          LOGO_SUBTITLE_CLIP.height,
        );
      }
      return;
    }

    maskEls.forEach((el, i) => {
      el.classList.remove("brand-draw-stroke", "brand-draw-stroke-offset");
      const length = lengths[i];
      const step = LOGO_DRAW_SEQUENCE[i];
      const reverse = step?.reverse ?? false;

      el.style.strokeDasharray = `${length}`;
      el.style.setProperty("--draw-duration", `${durations[i]}s`);
      el.style.setProperty("--draw-delay", `${delays[i]}s`);

      if (step?.drawStart && !step.drawPath) {
        const startAt = pathLengthAtPoint(el, step.drawStart.x, step.drawStart.y);
        const direction = step.drawDirection ?? "forward";
        const { initialOffset, endOffset } = drawOffsetAtPoint(
          length,
          startAt,
          direction,
        );
        el.style.strokeDashoffset = `${initialOffset}`;
        el.style.setProperty("--draw-end-offset", `${endOffset}`);
      } else {
        el.style.removeProperty("--draw-end-offset");
        el.style.strokeDashoffset = reverse ? `${-length}` : `${length}`;
      }
    });

    fillEls.forEach((fillEl, i) => {
      const step = LOGO_DRAW_SEQUENCE[i];
      if (!step) return;
      fillEl.setAttribute("mask", `url(#${reactId}-mask-${step.id})`);

      let ended = false;
      const onEnd = () => {
        if (ended) return;
        ended = true;
        revealFill(fillEl);
      };
      const maskEl = maskEls[i];
      if (!maskEl) return;
      maskEl.removeEventListener("animationend", onEnd);
      maskEl.addEventListener("animationend", onEnd, { once: true });
      const fallbackTimer = window.setTimeout(
        onEnd,
        ((delays[i] ?? 0) + (durations[i] ?? 0)) * 1000 + 120,
      );
      cancels.push(() => {
        window.clearTimeout(fallbackTimer);
      });
    });

    if (subtitleClipEl) {
      cancels.push(runSubtitleAnimation(subtitleClipEl, subtitleDelay * 1000));
    }

    void root.getBoundingClientRect();
    maskEls.forEach((el, i) => {
      const step = LOGO_DRAW_SEQUENCE[i];
      el.classList.add(
        step?.drawStart && !step.drawPath
          ? "brand-draw-stroke-offset"
          : "brand-draw-stroke",
      );
    });

    return () => cancels.forEach((cancel) => cancel());
  }, [playToken, logo, darkMode, usePngFallback, reactId]);

  if (usePngFallback) {
    const src = darkMode ? LOGO_MARK_SRC.dark : LOGO_MARK_SRC.fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={`${playToken}-${darkMode ? "dark" : "light"}`}
        src={src}
        alt="OEPL Logo Mark"
        className={`brand-reveal-image w-full h-auto object-contain ${className ?? ""}`}
      />
    );
  }

  if (!logo) {
    return (
      <svg
        viewBox="0 0 2428 956"
        fill="none"
        aria-hidden="true"
        className={className}
      />
    );
  }

  const scaleTransform = `scale(${LOGO_STROKE_SCALE.sx} ${LOGO_STROKE_SCALE.sy})`;
  const subtitleFill = darkMode ? LOGO_SUBTITLE_FILL_DARK : LOGO_SUBTITLE_FILL;

  return (
    <svg
      ref={rootRef}
      viewBox={logo.viewBox}
      fill="none"
      aria-label="OEPL Logo Mark"
      className={`w-full h-auto block ${className ?? ""}`}
    >
      <defs>
        {LOGO_DRAW_SEQUENCE.map((step) => (
          <clipPath
            key={`clip-${step.id}`}
            id={`${reactId}-clip-${step.id}`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={LOGO_LETTER_CLIPS[step.id].x}
              y={LOGO_LETTER_CLIPS[step.id].y}
              width={LOGO_LETTER_CLIPS[step.id].width}
              height={LOGO_LETTER_CLIPS[step.id].height}
            />
          </clipPath>
        ))}

        {LOGO_DRAW_SEQUENCE.map((step) => (
          <mask
            key={`mask-${step.id}`}
            id={`${reactId}-mask-${step.id}`}
            maskUnits="userSpaceOnUse"
          >
            <g transform={scaleTransform}>
              <path
                id={`logo-mask-${step.id}`}
                d={logo.drawPaths[step.id]}
                fill="none"
                stroke="white"
                strokeWidth={LOGO_MASK_STROKE_WIDTH}
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
            </g>
          </mask>
        ))}

        <clipPath
          id={`${reactId}-clip-subtitle`}
          clipPathUnits="userSpaceOnUse"
        >
          <rect
            id="logo-clip-shape-subtitle"
            x={LOGO_SUBTITLE_CLIP.x}
            y={LOGO_SUBTITLE_CLIP.y}
            width={0}
            height={LOGO_SUBTITLE_CLIP.height}
          />
        </clipPath>
      </defs>

      {LOGO_DRAW_SEQUENCE.map((step) => (
        <path
          key={step.id}
          id={`logo-fill-${step.id}`}
          d={logo.fills[step.id]}
          fill={LOGO_FILL}
          clipPath={`url(#${reactId}-clip-${step.id})`}
          mask={`url(#${reactId}-mask-${step.id})`}
        />
      ))}

      <g key={playToken} id="subtitle" clipPath={`url(#${reactId}-clip-subtitle)`}>
        <path d={logo.subtitle} fill={subtitleFill} />
      </g>
    </svg>
  );
}
