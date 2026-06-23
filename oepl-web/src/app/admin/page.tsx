"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { SiteContent } from "@/types/content";

const cards: {
  href: string;
  key: "members" | "publications" | "news" | "gallery" | "patents";
  count: (c: SiteContent) => number;
}[] = [
  {
    href: "/admin/members",
    key: "members",
    count: (c) =>
      c.members.postdocs.length +
      c.members.gradStudents.length +
      c.members.phdAlumni.length +
      c.members.msAlumni.length +
      1,
  },
  { href: "/admin/publications", key: "publications", count: (c) => c.publications.length },
  { href: "/admin/news", key: "news", count: (c) => c.news.length },
  { href: "/admin/gallery", key: "gallery", count: (c) => c.gallery.length },
  { href: "/admin/patents", key: "patents", count: (c) => c.patents.length },
];

export default function AdminDashboardPage() {
  const { t } = useLang();
  const { useSupabase } = useAuth();
  const { content, resetToSeed, saving } = useContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#080d1e] mb-2">{t.admin.dashboard}</h1>
      <p className="text-sm text-[#6b7280] mb-8">{t.admin.dashboardDesc}</p>

      {useSupabase && (
        <div className="rounded-2xl bg-white border border-gray-100 p-6 mb-8">
          <p className="text-sm font-semibold text-[#080d1e] mb-1">{t.admin.seedData}</p>
          <p className="text-xs text-[#6b7280] mb-4">{t.admin.seedDataDesc}</p>
          <button
            type="button"
            disabled={saving}
            onClick={() => { if (confirm(t.admin.seedDataBtn + "?")) void resetToSeed(); }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
            style={{ background: "#E88800" }}
          >
            {saving ? t.admin.saving : t.admin.seedDataBtn}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ href, key, count }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl bg-white border border-gray-100 p-6 hover:border-[#E88800]/40 transition-colors"
          >
            <p className="text-xs text-[#9ca3af] mb-1">{t.admin[key]}</p>
            <p className="text-3xl font-bold text-[#080d1e]">{count(content)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
