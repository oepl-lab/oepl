"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users, BookOpen, Newspaper, Images, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { useLang } from "@/contexts/LangContext";

const nav = [
  { href: "/admin", labelKey: "dashboard" as const, icon: LayoutDashboard, exact: true },
  { href: "/admin/members", labelKey: "members" as const, icon: Users },
  { href: "/admin/publications", labelKey: "publications" as const, icon: BookOpen },
  { href: "/admin/news", labelKey: "news" as const, icon: Newspaper },
  { href: "/admin/gallery", labelKey: "gallery" as const, icon: Images },
  { href: "/admin/patents", labelKey: "patents" as const, icon: FileText },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLang();
  const { saving } = useContent();

  function handleLogout() {
    void logout().then(() => router.replace("/login"));
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      <aside className="w-56 flex-shrink-0 bg-[#080d1e] text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs tracking-widest uppercase text-[#E88800] mb-1">OEPL</p>
          <p className="font-semibold text-sm">{t.admin.title}</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ href, labelKey, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active ? "bg-[#E88800] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {t.admin[labelKey]}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
          >
            <LogOut size={16} />
            {t.admin.logout}
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs text-[#9ca3af] hover:text-[#E88800] transition-colors">
            {t.admin.viewSite}
          </Link>
          {saving && (
            <span className="text-xs text-[#E88800]">{t.admin.saving}</span>
          )}
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
