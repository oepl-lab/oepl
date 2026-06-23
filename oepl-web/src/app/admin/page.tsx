"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, FileText, Images, Newspaper, Users } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { SiteContent } from "@/types/content";

const cards: {
  href: string;
  key: "members" | "publications" | "news" | "gallery" | "patents";
  icon: LucideIcon;
  count: (c: SiteContent) => number;
}[] = [
  {
    href: "/admin/members",
    key: "members",
    icon: Users,
    count: (c) =>
      c.members.postdocs.length +
      c.members.gradStudents.length +
      c.members.phdAlumni.length +
      c.members.msAlumni.length +
      1,
  },
  { href: "/admin/publications", key: "publications", icon: BookOpen, count: (c) => c.publications.length },
  { href: "/admin/news", key: "news", icon: Newspaper, count: (c) => c.news.length },
  { href: "/admin/gallery", key: "gallery", icon: Images, count: (c) => c.gallery.length },
  { href: "/admin/patents", key: "patents", icon: FileText, count: (c) => c.patents.length },
];

export default function AdminDashboardPage() {
  const { t } = useLang();
  const { content } = useContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#080d1e] mb-2">{t.admin.dashboard}</h1>
      <p className="text-sm text-[#6b7280] mb-8">{t.admin.dashboardDesc}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ href, key, icon: Icon, count }) => (
          <Link
            key={href}
            href={href}
            className="card-hover group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:border-[#E88800]/40 flex items-center gap-4"
          >
            <div
              className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300"
              aria-hidden
            />
            <div className="relative z-10 flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#E88800]/10 text-[#E88800] group-hover:bg-[#E88800]/15 transition-colors">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#9ca3af] mb-1">{t.admin[key]}</p>
                <p className="text-3xl font-bold text-[#080d1e] leading-none">{count(content)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
