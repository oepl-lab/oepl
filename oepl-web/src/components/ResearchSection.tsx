"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

type ResearchItem = { tag: string; title: string; desc: string };

const RESEARCH_ORDER = ["OSCs", "PSCs", "Metal Ink", "OFET"] as const;

function sortResearchItems(items: ResearchItem[]) {
  return [...items].sort(
    (a, b) =>
      RESEARCH_ORDER.indexOf(a.tag as (typeof RESEARCH_ORDER)[number]) -
      RESEARCH_ORDER.indexOf(b.tag as (typeof RESEARCH_ORDER)[number])
  );
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E88800]/15 text-[#E88800] border border-[#E88800]/30 w-fit">
      {tag}
    </span>
  );
}

function FeaturedCard({ item }: { item: ResearchItem }) {
  return (
    <div className="card-hover relative overflow-hidden rounded-2xl border border-gray-200 bg-white h-full flex flex-col group transition-opacity duration-300">
      <div className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300" />
      <div className="relative flex-1 min-h-[260px] lg:min-h-[300px] bg-gray-100" />
      <div className="relative z-10 p-6 flex flex-col gap-2">
        <TagBadge tag={item.tag} />
        <h3 className="text-[#080d1e] font-bold text-lg leading-snug">{item.title}</h3>
        <p className="text-[#6b7280] text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

function CompactCard({
  item,
  onSelect,
}: {
  item: ResearchItem;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="card-hover relative flex flex-1 min-h-0 h-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 cursor-pointer group hover:border-[#E88800]/40 transition-colors"
    >
      <div className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300 rounded-2xl" />
      <div className="relative shrink-0 w-[72px] min-h-[72px] rounded-xl bg-gray-100 self-stretch" />
      <div className="relative flex flex-col justify-center gap-1.5 min-w-0 py-0.5">
        <TagBadge tag={item.tag} />
        <h3 className="text-[#080d1e] font-bold text-sm leading-snug line-clamp-2">{item.title}</h3>
        <p className="text-[#6b7280] text-xs leading-relaxed line-clamp-2">{item.desc}</p>
      </div>
    </div>
  );
}

function MobileCard({ item }: { item: ResearchItem }) {
  return (
    <div className="card-hover relative overflow-hidden rounded-2xl border border-gray-200 bg-white group">
      <div className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300" />
      <div className="relative w-full h-36 bg-gray-100" />
      <div className="relative z-10 p-4 flex flex-col gap-2">
        <TagBadge tag={item.tag} />
        <h3 className="text-[#080d1e] font-bold text-sm leading-snug">{item.title}</h3>
        <p className="text-[#6b7280] text-[11px] line-clamp-2">{item.desc}</p>
      </div>
    </div>
  );
}

export default function ResearchSection() {
  const { lang, t } = useLang();
  const items = sortResearchItems(t.research.items);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = items[featuredIndex] ?? items[0];

  useEffect(() => {
    setFeaturedIndex(0);
  }, [lang]);

  return (
    <section id="research" className="bg-[#f9fafb] section-y border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">{t.research.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">
              {t.research.title}
            </h2>
          </div>
          <Link
            href="/about#research"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.research.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:hidden">
          {items.map((item) => (
            <MobileCard key={item.tag} item={item} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-5 items-stretch min-h-0">
          <div className="min-h-0 h-full">
            <FeaturedCard key={featured.tag} item={featured} />
          </div>
          <div className="flex flex-col gap-5 h-full min-h-0">
            {items.map((item, index) =>
              index === featuredIndex ? null : (
                <CompactCard
                  key={item.tag}
                  item={item}
                  onSelect={() => setFeaturedIndex(index)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
