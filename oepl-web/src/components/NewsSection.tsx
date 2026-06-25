"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { latestNewsId, newsDisplay, sortNewsItems } from "@/lib/content/display";
import type { NewsItem } from "@/types/content";
import NewsNewBadge from "@/components/news/NewsNewBadge";
import NewsPinnedBadge from "@/components/news/NewsPinnedBadge";

const HOME_NEWS_LIMIT = 4;
const CAROUSEL_MIN_ITEMS = 3;
const SLIDE_GAP_PX = 20;

function NewsCard({
  item,
  lang,
  latestId,
  labels,
}: {
  item: NewsItem;
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: { badgePinned: string; badgeNew: string; readMore: string };
}) {
  const display = newsDisplay(item, lang);

  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[#E88800]/40"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E88800]/15 text-[#E88800] border border-[#E88800]/30 truncate">
          {display.type}
        </span>
        <span className="text-xs text-[#9ca3af] shrink-0">{display.date}</span>
      </div>
      <h3 className="text-[#080d1e] font-semibold text-sm leading-snug line-clamp-2 flex flex-wrap items-center gap-1.5 mb-2 group-hover:text-[#E88800] transition-colors">
        {item.pinned && <NewsPinnedBadge label={labels.badgePinned} />}
        {item.id === latestId && <NewsNewBadge label={labels.badgeNew} />}
        <span className="min-w-0">{display.title}</span>
      </h3>
      <p className="text-[#6b7280] text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
        {display.detail}
      </p>
      <div className="flex items-center gap-1 text-xs font-semibold text-[#E88800]">
        {labels.readMore} <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function NewsDots({
  count,
  activeIndex = 0,
  onSelect,
}: {
  count: number;
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex;
        const className = "rounded-full transition-all";
        const style = {
          width: active ? 20 : 8,
          height: 8,
          background: active ? "#E88800" : "#d1d5db",
        };

        if (onSelect) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={className}
              style={style}
              aria-label={`Go to news slide ${i + 1}`}
              aria-current={active ? "true" : undefined}
            />
          );
        }

        return (
          <span
            key={i}
            className={className}
            style={style}
            aria-hidden={!active}
          />
        );
      })}
    </div>
  );
}

function NewsStaticGrid({
  items,
  lang,
  latestId,
  labels,
}: {
  items: NewsItem[];
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: { badgePinned: string; badgeNew: string; readMore: string };
}) {
  return (
    <>
      <div className={`grid gap-5 ${items.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {items.map((item) => (
          <NewsCard key={item.id} item={item} lang={lang} latestId={latestId} labels={labels} />
        ))}
      </div>
      <NewsDots count={1} />
    </>
  );
}

function NewsCarousel({
  items,
  lang,
  latestId,
  labels,
}: {
  items: NewsItem[];
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: { badgePinned: string; badgeNew: string; readMore: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);

  const pageCount = Math.max(1, items.length - slidesPerView + 1);
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < pageCount - 1;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const perView = window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
    const width = (track.clientWidth - SLIDE_GAP_PX * (perView - 1)) / perView;

    setSlidesPerView(perView);
    setSlideWidth(Math.max(0, width));
    setActiveIndex((prev) => Math.min(prev, Math.max(0, items.length - perView)));
  }, [items.length]);

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || slideWidth <= 0) return;

    const step = slideWidth + SLIDE_GAP_PX;
    const index = Math.min(pageCount - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    setActiveIndex(index);
  }, [pageCount, slideWidth]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncActiveIndex();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure, syncActiveIndex]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track || slideWidth <= 0) return;

    const nextIndex = Math.min(pageCount - 1, Math.max(0, index));
    const step = slideWidth + SLIDE_GAP_PX;
    track.scrollTo({ left: step * nextIndex, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }

  return (
    <div>
      <div className="relative px-4 sm:px-6 md:px-8">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={!canPrev}
          className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-9 rounded-full border border-gray-200 bg-white text-[#6b7280] shadow-md transition-colors hover:border-[#E88800]/40 hover:text-[#E88800] disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous news"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={!canNext}
          className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-9 rounded-full border border-gray-200 bg-white text-[#6b7280] shadow-md transition-colors hover:border-[#E88800]/40 hover:text-[#E88800] disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next news"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={trackRef}
          onScroll={syncActiveIndex}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{ gap: SLIDE_GAP_PX }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="snap-start shrink-0"
              style={slideWidth > 0 ? { width: slideWidth } : { width: "100%" }}
            >
              <NewsCard item={item} lang={lang} latestId={latestId} labels={labels} />
            </div>
          ))}
        </div>
      </div>

      <NewsDots count={pageCount} activeIndex={activeIndex} onSelect={scrollToIndex} />
    </div>
  );
}

function NewsList({
  items,
  lang,
  latestId,
  labels,
}: {
  items: NewsItem[];
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: { badgePinned: string; badgeNew: string; readMore: string };
}) {
  if (items.length < CAROUSEL_MIN_ITEMS) {
    return <NewsStaticGrid items={items} lang={lang} latestId={latestId} labels={labels} />;
  }

  return <NewsCarousel items={items} lang={lang} latestId={latestId} labels={labels} />;
}

export default function NewsSection() {
  const { lang, t } = useLang();
  const { content } = useContent();

  const { latestId, items } = useMemo(() => {
    const sorted = sortNewsItems(content.news);
    return { latestId: latestNewsId(content.news), items: sorted.slice(0, HOME_NEWS_LIMIT) };
  }, [content.news]);

  const labels = {
    badgePinned: t.news.badgePinned,
    badgeNew: t.news.badgeNew,
    readMore: t.news.readMore,
  };

  return (
    <section id="news" className="section-y section-anchor bg-[#f9fafb] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label mb-1">{t.news.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.news.title}</h2>
          </div>
          <Link
            href="/news"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.news.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E88800]/30 bg-white px-6 py-12 text-center">
            <Newspaper size={40} strokeWidth={1.5} className="mx-auto mb-4 text-[#E88800]/50" aria-hidden />
            <p className="text-base font-medium text-[#374151] mb-5">{t.news.empty}</p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E88800] hover:underline"
            >
              {t.news.more}
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <NewsList items={items} lang={lang} latestId={latestId} labels={labels} />
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/news" className="btn-more">
            {t.news.more} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
