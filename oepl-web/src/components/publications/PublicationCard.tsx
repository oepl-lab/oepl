"use client";

import { ExternalLink } from "lucide-react";
import type { Lang } from "@/i18n/translations";
import type { Publication } from "@/types/content";
import { publicationDoiLink } from "@/types/content";
import { formatPublicationDate } from "@/lib/content/display";

type Props = {
  pub: Publication;
  lang: Lang;
};

export default function PublicationCard({ pub, lang }: Props) {
  const doiHref = publicationDoiLink(pub);
  const pubDate = formatPublicationDate(pub);
  const primaryTitle = lang === "KR" ? pub.titleKo : pub.titleEn;
  const secondaryTitle = lang === "KR" ? pub.titleEn : pub.titleKo;

  return (
    <div className="group rounded-2xl bg-white border border-gray-100 p-6 flex flex-col gap-3 hover:border-[#E88800]/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(232,136,0,0.1)",
              color: "#E88800",
              border: "1px solid rgba(232,136,0,0.25)",
            }}
          >
            {pub.journal}
          </span>
          {pubDate && (
            <span className="text-[10px] font-medium text-[#9ca3af]">{pubDate}</span>
          )}
        </div>
        {doiHref && (
          <a
            href={doiHref}
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#E88800] transition-colors"
          >
            <ExternalLink size={12} />
            DOI
          </a>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-sm leading-snug text-[#080d1e] group-hover:text-[#E88800] transition-colors">
          {primaryTitle}
        </h3>
        {secondaryTitle && (
          <p className="text-sm leading-snug text-[#9ca3af]">{secondaryTitle}</p>
        )}
      </div>

      <div>
        <p className="text-xs text-[#6b7280]">{pub.authors}</p>
        {pub.doi ? (
          doiHref ? (
            <a
              href={doiHref}
              target="_blank"
              rel="noreferrer"
              className="text-xs mt-0.5 text-[#E88800] font-medium hover:underline inline-block"
            >
              {pub.doi}
            </a>
          ) : (
            <p className="text-xs mt-0.5 text-[#E88800] font-medium">{pub.doi}</p>
          )
        ) : null}
      </div>
    </div>
  );
}
