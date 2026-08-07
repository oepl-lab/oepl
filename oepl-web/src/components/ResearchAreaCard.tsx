"use client";

import { researchAreaImage } from "@/lib/content/research-images";

type ResearchArea = {
  tag: string;
  title: string;
  desc: string;
  detail: string;
};

const isEla = (tag: string) => tag === "ELA";

function OverlayContent({ area, detailClassName }: { area: ResearchArea; detailClassName: string }) {
  return (
    <>
      <div className="flex flex-col gap-2 mb-4 shrink-0">
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full w-fit bg-[#E88800]/10 text-[#E88800] border border-[#E88800]/20">
          {area.tag}
        </span>
        <h3 className="font-bold text-sm md:text-base text-[#080d1e] leading-snug">{area.title}</h3>
      </div>
      <div className={detailClassName}>{area.detail}</div>
    </>
  );
}

function CardBody({ area, image }: { area: ResearchArea; image: string | null }) {
  return (
    <>
      <div className="w-full bg-gray-100 h-48 sm:h-52 md:h-60 flex items-center justify-center overflow-hidden shrink-0 border-b border-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full h-full object-contain bg-white" />
        ) : null}
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-2 md:gap-3 flex-1">
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full w-fit bg-[#E88800]/10 text-[#E88800] border border-[#E88800]/20">
          {area.tag}
        </span>
        <h3 className="font-bold text-sm md:text-base text-[#080d1e] leading-snug">{area.title}</h3>
        <p className="text-xs md:text-sm leading-relaxed text-[#6b7280] line-clamp-3">{area.desc}</p>
      </div>
    </>
  );
}

export default function ResearchAreaCard({
  area,
  expanded,
  onToggle,
}: {
  area: ResearchArea;
  expanded: boolean;
  onToggle: () => void;
}) {
  const image = researchAreaImage(area.tag);
  const elaExpanded = expanded && isEla(area.tag);
  const detailClassName = "text-xs md:text-sm leading-relaxed text-[#374151] whitespace-pre-line";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="relative rounded-2xl bg-white border border-gray-100 overflow-hidden flex flex-col hover:border-[#E88800]/40 transition-colors card-hover cursor-pointer group min-h-[280px] md:min-h-[320px]"
    >
      {elaExpanded ? (
        <div className="grid flex-1">
          <div className="col-start-1 row-start-1 flex flex-col invisible pointer-events-none" aria-hidden>
            <CardBody area={area} image={image} />
          </div>
          <div className="col-start-1 row-start-1 z-10 flex min-h-full flex-col bg-white/80 backdrop-blur-md p-5 md:p-6">
            <OverlayContent area={area} detailClassName={detailClassName} />
          </div>
        </div>
      ) : (
        <>
          <CardBody area={area} image={image} />
          {expanded && (
            <div className="absolute inset-0 z-10 flex flex-col bg-white/80 backdrop-blur-md p-5 md:p-6">
              <OverlayContent
                area={area}
                detailClassName={`flex-1 overflow-y-auto ${detailClassName}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
