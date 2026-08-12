export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

export const glassStripStyle = {
  background:
    "linear-gradient(-90deg, rgba(255,255,255,0.008) 20%, rgba(40,40,40,0.093) 75.758%, rgba(255,255,255,0.008) 123.64%)",
  backdropFilter: "blur(90px)",
  WebkitBackdropFilter: "blur(90px)",
} as const;

function GlassStripRow({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full flex-1" style={glassStripStyle} />
      ))}
    </>
  );
}

export default function BannerGlassStrips() {
  return (
    <>
      <div className="absolute inset-0 flex pointer-events-none md:hidden" aria-hidden>
        <GlassStripRow count={GLASS_STRIP_COUNT_MOBILE} />
      </div>
      <div className="absolute inset-0 hidden md:flex pointer-events-none" aria-hidden>
        <GlassStripRow count={GLASS_STRIP_COUNT_DESKTOP} />
      </div>
    </>
  );
}
