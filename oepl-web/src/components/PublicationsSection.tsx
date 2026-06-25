"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { publicationSortKey } from "@/lib/content/display";
import PublicationCard from "@/components/publications/PublicationCard";

export default function PublicationsSection() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const publications = [...content.publications]
    .sort((a, b) => publicationSortKey(b) - publicationSortKey(a))
    .slice(0, 3);

  return (
    <section id="publications" className="bg-white section-y">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label mb-1">{t.publications.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.publications.title}</h2>
          </div>
          <Link
            href="/publication"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.publications.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} lang={lang} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/publication" className="btn-more">
            {t.publications.more} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
