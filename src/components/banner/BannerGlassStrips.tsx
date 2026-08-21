export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

/** Figma Frame 175 — per-column glass (gradient + backdrop blur on each strip) */
export const glassStripStyle = {
  background:
    "linear-gradient(-90deg, rgba(255,255,255,0.008) 20%, rgba(40,40,40,0.093) 75.758%, rgba(255,255,255,0.008) 123.64%)",
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

/** Figma Frame 179 — page banner glass (last stop 0.002) */
export const pageBannerGlassStripStyle = {
  background:
    "linear-gradient(-90deg, rgba(255,255,255,0.008) 20%, rgba(40,40,40,0.093) 75.758%, rgba(255,255,255,0.002) 123.64%)",
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

type GlassStripStyle = typeof glassStripStyle | typeof pageBannerGlassStripStyle;

function GlassStripRow({
  count,
  stripStyle,
}: {
  count: number;
  stripStyle: GlassStripStyle;
}) {
  const stripWidth = 100 / count;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-full shrink-0"
          style={{
            width: `calc(${stripWidth}% + 1px)`,
            marginRight: i < count - 1 ? -1 : 0,
            ...stripStyle,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function BannerGlassStrips({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "page";
}) {
  const stripStyle =
    variant === "page" ? pageBannerGlassStripStyle : glassStripStyle;

  return (
    <>
      <div
        className={`absolute inset-0 flex pointer-events-none md:hidden ${className ?? ""}`}
        aria-hidden
      >
        <GlassStripRow count={GLASS_STRIP_COUNT_MOBILE} stripStyle={stripStyle} />
      </div>
      <div
        className={`absolute inset-0 hidden md:flex pointer-events-none ${className ?? ""}`}
        aria-hidden
      >
        <GlassStripRow count={GLASS_STRIP_COUNT_DESKTOP} stripStyle={stripStyle} />
      </div>
    </>
  );
}
