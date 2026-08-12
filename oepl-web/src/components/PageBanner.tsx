import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

type Props = {
  title: string;
};

export default function PageBanner({ title }: Props) {
  return (
    <section className="page-banner relative flex min-h-[200px] items-center justify-center overflow-hidden bg-[#1a1a1a] pt-16">
      <div className="page-banner__atmosphere absolute inset-0 pointer-events-none" aria-hidden />
      <div className="page-banner-glow page-banner-glow--wide absolute inset-0 pointer-events-none" aria-hidden />
      <div className="page-banner-glow page-banner-glow--center absolute inset-0 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BannerGlassStrips />
      </div>
      <h1 className="relative z-10 px-6 text-center text-[48px] font-bold leading-[1.1] text-white">
        {title}
      </h1>
    </section>
  );
}
