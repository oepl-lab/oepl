"use client";

import { useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

const GLOW_LERP = 0.1;

/** Figma Ellipse 63 — 1.12× (1.4× base minus 20%) */
const FIGMA_GLOW = {
  width: 336,
  height: 315,
  blur: 75,
  minWidth: 240,
  scale: 1.12,
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

function HeroGlowAwareCopy({ subtitle, title, btn1, btn2 }: HeroCopyProps) {
  return (
    <>
      <p className="mb-3 text-base font-medium leading-normal text-[#E88800] md:mb-4 md:text-lg">
        {subtitle}
      </p>

      <div
        className="mb-3 w-full max-w-[200px] sm:max-w-[240px] md:mb-4 md:max-w-[300px] aspect-[460/148]"
        aria-hidden
      />

      <h1 className="mb-8 text-2xl font-bold uppercase tracking-wide text-[#E88800] md:mb-10 md:text-3xl md:leading-snug">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold opacity-0"
          style={{
            padding: "var(--spacing-300) var(--spacing-600)",
            borderRadius: "var(--radius-pill)",
          }}
          aria-hidden
        >
          {btn1}
          <ArrowRight size={14} />
        </span>
        <span
          className="inline-flex items-center rounded-full border border-[#E88800] text-sm font-medium text-[#E88800]"
          style={{
            padding: "var(--spacing-300) var(--spacing-600)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {btn2}
        </span>
      </div>
    </>
  );
}

export default function HeroSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef({ x: 0.61, y: 0.37 });
  const currentRef = useRef({ x: 0.61, y: 0.37 });
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

    section.style.setProperty("--hero-glow-x", "61%");
    section.style.setProperty("--hero-glow-y", "37%");

    const syncGlowSize = () => {
      const sectionWidth = section.getBoundingClientRect().width;
      const scaled =
        FIGMA_GLOW.width * FIGMA_GLOW.scale * (sectionWidth / 1440);
      const maxW = FIGMA_GLOW.width * FIGMA_GLOW.scale;
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
      className="hero-section relative flex min-h-[min(640px,85svh)] flex-col overflow-hidden pt-16"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #e88800 0%, #e88800 4rem, #000 4rem, #e88800 51.923%, #fff 100%)",
        }}
        aria-hidden
      />

      <BannerGlassStrips className="z-[2]" />

      <HeroGlow />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-12 pt-6 md:pb-16 md:pt-8">
        <p className="mb-3 text-base font-medium leading-normal text-white md:mb-4 md:text-lg">
          {t.hero.subtitle}
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/oepl-wordmark.svg"
          alt="OEPL"
          className="mb-3 h-auto w-full max-w-[200px] sm:max-w-[240px] md:mb-4 md:max-w-[300px]"
          draggable={false}
        />

        <h1 className="mb-8 text-2xl font-bold uppercase tracking-wide text-white md:mb-10 md:text-3xl md:leading-snug">
          {t.hero.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/about#research"
            className="inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold text-[#0a0a0a] glow-box-orange transition-opacity hover:opacity-90"
            style={{
              padding: "var(--spacing-300) var(--spacing-600)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {t.hero.btn1}
            <ArrowRight size={14} aria-hidden />
          </a>
          <a
            href="#publications"
            className="inline-flex items-center rounded-full border border-white text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{
              padding: "var(--spacing-300) var(--spacing-600)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {t.hero.btn2}
          </a>
        </div>
      </div>

      <div
        className="hero-glow-text-overlay pointer-events-none absolute inset-0 z-20 flex flex-col pt-16"
        aria-hidden
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-12 pt-6 md:pb-16 md:pt-8">
          <HeroGlowAwareCopy
            subtitle={t.hero.subtitle}
            title={t.hero.title}
            btn1={t.hero.btn1}
            btn2={t.hero.btn2}
          />
        </div>
      </div>
    </section>
  );
}
