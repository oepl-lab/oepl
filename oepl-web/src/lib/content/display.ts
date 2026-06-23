import type { Lang } from "@/i18n/translations";
import type { NewsItem } from "@/types/content";

export function newsDisplay(item: NewsItem, lang: Lang) {
  return {
    badge: item.badge,
    date: item.date,
    title: lang === "KR" ? item.titleKr : item.titleEn,
    excerpt: lang === "KR" ? item.excerptKr : item.excerptEn,
  };
}
