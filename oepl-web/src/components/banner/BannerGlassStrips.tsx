export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

/** Figma per-strip gradient, tiled seamlessly (no flex-column gaps) */
const glassStripGradient =
  "repeating-linear-gradient(-90deg, rgba(255,255,255,0.008) 0, rgba(255,255,255,0.008) 20%, rgba(40,40,40,0.093) 75.758%, rgba(255,255,255,0.008) 100%)";

const glassStripFilter = {
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

function GlassStripPattern({ count }: { count: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: glassStripGradient,
        backgroundSize: `${100 / count}% 100%`,
      }}
      aria-hidden
    />
  );
}

/** Page banners — gradient + blur on one layer (no soft glow behind) */
function PageGlassLayer({ count }: { count: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: glassStripGradient,
        backgroundSize: `${100 / count}% 100%`,
        ...glassStripFilter,
      }}
      aria-hidden
    />
  );
}

/**
 * Hero — Figma-like split:
 * 1) uniform backdrop blur (does not band a soft ellipse)
 * 2) flute stripes as tint overlay only
 */
function HeroGlassLayers({ count }: { count: number }) {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={glassStripFilter}
        aria-hidden
      />
      <GlassStripPattern count={count} />
    </>
  );
}

type BannerGlassStripsProps = {
  variant?: "page" | "hero";
  className?: string;
};

export default function BannerGlassStrips({
  variant = "page",
  className,
}: BannerGlassStripsProps) {
  const Layer = variant === "hero" ? HeroGlassLayers : PageGlassLayer;

  return (
    <>
      <div className={`md:hidden absolute inset-0 ${className ?? ""}`}>
        <Layer count={GLASS_STRIP_COUNT_MOBILE} />
      </div>
      <div className={`hidden md:block absolute inset-0 ${className ?? ""}`}>
        <Layer count={GLASS_STRIP_COUNT_DESKTOP} />
      </div>
    </>
  );
}
