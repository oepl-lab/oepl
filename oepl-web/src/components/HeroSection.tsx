"use client";

import { useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

const GLOW_LERP = 0.1;

const HERO_INSET =
  "mx-auto flex w-full max-w-7xl flex-1 items-center px-10 sm:px-12 md:px-16 lg:px-20 xl:px-24";

/** Figma Ellipse 63 — 336×315 @ (857, 357) on 1440×900 */
const FIGMA_GLOW = {
  width: 336,
  height: 315,
  blur: 75,
  minWidth: 240,
} as const;

const FIGMA_GLOW_DEFAULT = {
  x: (857 + 336 / 2) / 1440,
  y: (357 + 315 / 2) / 900,
} as const;

function HeroGlow() {
  return (
    <div
      data-hero-glow
      className="hero-glow-ellipse pointer-events-none"
      aria-hidden
    />
  );
}

type HeroCopyProps = {
  subtitle: string;
  title: string;
  btn1: string;
  btn2: string;
};

function HeroCopy({
  subtitle,
  title,
  btn1,
  btn2,
}: HeroCopyProps) {
  return (
    <div className="hero-copy w-full">
      <p className="mb-3 text-base font-medium leading-normal text-white md:mb-4 md:text-lg">
        {subtitle}
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/oepl-wordmark.svg"
        alt="OEPL"
        className="mb-3 h-auto w-full max-w-[200px] sm:max-w-[240px] md:mb-4 md:max-w-[300px]"
        draggable={false}
      />

      <h1 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:mb-10 md:text-3xl md:leading-snug">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/about#research"
          className="group inline-flex items-center rounded-full bg-white text-sm font-semibold text-[#0a0a0a] glow-box-orange transition-colors hover:bg-[#E88800] hover:text-white"
          style={{
            padding: "var(--spacing-300) var(--spacing-600)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {btn1}
          <ArrowRight
            size={14}
            aria-hidden
            className="size-0 shrink-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:size-[14px] group-hover:opacity-100"
          />
        </a>
        <a
          href="/publication"
          className="group inline-flex items-center rounded-full border border-white bg-transparent text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#0a0a0a] hover:glow-box-orange active:border-[#E88800] active:bg-[#E88800] active:text-white"
          style={{
            padding: "var(--spacing-300) var(--spacing-600)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {btn2}
          <ArrowRight
            size={14}
            aria-hidden
            className="size-0 shrink-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:size-[14px] group-hover:opacity-100"
          />
        </a>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef({ ...FIGMA_GLOW_DEFAULT });
  const currentRef = useRef({ ...FIGMA_GLOW_DEFAULT });
  const rafRef = useRef<number | undefined>(undefined);

  const animate = useCallback(() => {
    const section = sectionRef.current;
    if (section) {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * GLOW_LERP;
      cur.y += (tgt.y - cur.y) * GLOW_LERP;
      section.querySelectorAll<HTMLElement>("[data-hero-glow]").forEach((el) => {
        el.style.left = `${cur.x * 100}%`;
        el.style.top = `${cur.y * 100}%`;
      });
      section.style.setProperty("--hero-glow-x", `${cur.x * 100}%`);
      section.style.setProperty("--hero-glow-y", `${cur.y * 100}%`);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    const section = sectionRef.current;
    if (!section) return;

    section.style.setProperty(
      "--hero-glow-x",
      `${FIGMA_GLOW_DEFAULT.x * 100}%`,
    );
    section.style.setProperty(
      "--hero-glow-y",
      `${FIGMA_GLOW_DEFAULT.y * 100}%`,
    );

    const syncGlowSize = () => {
      const sectionWidth = section.getBoundingClientRect().width;
      const scaled = FIGMA_GLOW.width * (sectionWidth / 1440);
      const maxW = FIGMA_GLOW.width;
      const glowW = Math.min(maxW, Math.max(FIGMA_GLOW.minWidth, scaled));
      const glowH = glowW * (FIGMA_GLOW.height / FIGMA_GLOW.width);
      section.style.setProperty("--hero-glow-w", `${glowW}px`);
      section.style.setProperty("--hero-glow-h", `${glowH}px`);
      section.style.setProperty("--hero-glow-rx", `${glowW / 2}px`);
      section.style.setProperty("--hero-glow-ry", `${glowH / 2}px`);
    };

    syncGlowSize();
    const observer = new ResizeObserver(syncGlowSize);
    observer.observe(section);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [animate]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetRef.current = {
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    };
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="hero-section relative flex flex-col overflow-hidden bg-white pt-16"
    >
      <div
        className="hero-section__gradient absolute inset-x-0 top-16 bottom-0 pointer-events-none"
        aria-hidden
      />

      <HeroGlow />

      <div className="absolute inset-x-0 top-16 bottom-0 z-[2] pointer-events-none">
        <BannerGlassStrips />
      </div>

      <div className={`relative z-10 ${HERO_INSET}`}>
        <HeroCopy
          subtitle={t.hero.subtitle}
          title={t.hero.title}
          btn1={t.hero.btn1}
          btn2={t.hero.btn2}
        />
      </div>
    </section>
  );
}
