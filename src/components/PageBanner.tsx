import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

type Props = {
  title: string;
};

export default function PageBanner({ title }: Props) {
  return (
    <section className="page-banner relative bg-white pt-16">
      <div className="relative flex h-[100px] items-center justify-center overflow-hidden bg-[#1a1a1a] sm:h-[135px]">
        {/* Figma 642:625 @ top 134px — banner-relative top 51.85% */}
        <div
          className="page-banner__ellipse page-banner__ellipse--wide pointer-events-none"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/ellipse-61.svg"
            alt=""
            className="block size-full max-w-none object-fill"
            draggable={false}
          />
        </div>

        {/* Figma 642:628 @ top 97px — banner-relative top 24.44% */}
        <div
          className="page-banner__ellipse page-banner__ellipse--center pointer-events-none"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/ellipse-62.svg"
            alt=""
            className="block size-full max-w-none object-fill"
            draggable={false}
          />
        </div>

        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          <BannerGlassStrips variant="page" />
        </div>

        <h1 className="relative z-10 px-6 text-center text-[28px] font-bold leading-tight text-white md:text-[48px] md:leading-[1.1]">
          {title}
        </h1>
      </div>
    </section>
  );
}
