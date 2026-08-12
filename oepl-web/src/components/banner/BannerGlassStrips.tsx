export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

const glassStripGradient =
  "repeating-linear-gradient(-90deg, rgba(255,255,255,0.008) 0, rgba(40,40,40,0.093) 50%, rgba(255,255,255,0.008) 100%)";

const glassStripFilter = {
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

function GlassStripLayer({ count }: { count: number }) {
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

export default function BannerGlassStrips() {
  return (
    <>
      <div className="md:hidden absolute inset-0">
        <GlassStripLayer count={GLASS_STRIP_COUNT_MOBILE} />
      </div>
      <div className="hidden md:block absolute inset-0">
        <GlassStripLayer count={GLASS_STRIP_COUNT_DESKTOP} />
      </div>
    </>
  );
}
