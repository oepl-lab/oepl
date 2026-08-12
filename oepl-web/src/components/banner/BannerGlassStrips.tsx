export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

/** Figma Frame 175 — per-column glass (gradient + backdrop blur on each strip) */
export const glassStripStyle = {
  background:
    "linear-gradient(-90deg, rgba(255,255,255,0.008) 20%, rgba(40,40,40,0.093) 75.758%, rgba(255,255,255,0.008) 123.64%)",
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

function GlassStripRow({ count }: { count: number }) {
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
            ...glassStripStyle,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function BannerGlassStrips({
  className,
}: {
  className?: string;
}) {
  return (
    <>
      <div
        className={`absolute inset-0 flex pointer-events-none md:hidden ${className ?? ""}`}
        aria-hidden
      >
        <GlassStripRow count={GLASS_STRIP_COUNT_MOBILE} />
      </div>
      <div
        className={`absolute inset-0 hidden md:flex pointer-events-none ${className ?? ""}`}
        aria-hidden
      >
        <GlassStripRow count={GLASS_STRIP_COUNT_DESKTOP} />
      </div>
    </>
  );
}
