"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { headerBtnClass } from "@/components/admin/form-styles";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "About",       href: "/about" },
  { label: "Members",     href: "/members" },
  { label: "Publication", href: "/publication" },
  { label: "News",        href: "/news" },
  { label: "Gallery",     href: "/gallery" },
  { label: "Contact",     href: "/contact" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-200 shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6 relative">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/oepl-logo.png"
            alt="OEPL — Organic Electronic Physics Laboratory"
            width={132}
            height={44}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#6b7280] hover:text-[#080d1e] text-[15px] font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E88800] group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </nav>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className={`${headerBtnClass} !text-sm`}>
            {t.header.login}
          </Link>

          <div className="flex items-center gap-1.5" aria-label="Switch language">
            <Globe size={16} strokeWidth={1.8} className="text-[#6b7280]" />
            <button
              type="button"
              onClick={() => setLang("KR")}
              className={`text-sm font-semibold transition-colors ${
                lang === "KR" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
              }`}
            >
              KO
            </button>
            <span className="text-[#d1d5db] text-sm">|</span>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`text-sm font-semibold transition-colors ${
                lang === "EN" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-[#6b7280] hover:text-[#080d1e] transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Open menu"
        >
          <Menu size={22} aria-hidden />
        </button>
      </div>

      {/* Mobile drawer — Figma 558:460 layout only (overlay + right panel) */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-[60] bg-black/50"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            id="mobile-nav"
            className="md:hidden fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[85vw] flex-col justify-between bg-white px-8 pt-7 pb-12 shadow-[-4px_0_12px_rgba(0,0,0,0.1)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex w-full flex-col gap-10 min-h-0">
              <div className="flex w-full items-center justify-between shrink-0">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Image
                    src="/oepl-logo.png"
                    alt="OEPL — Organic Electronic Physics Laboratory"
                    width={132}
                    height={44}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  className="text-[#6b7280] hover:text-[#080d1e] transition-colors"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} aria-hidden />
                </button>
              </div>

              <nav className="flex w-full flex-col gap-6 overflow-y-auto min-h-0">
                {navLinks.map((link) => {
                  const active = isNavActive(pathname, link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-sm font-medium transition-colors ${
                        active
                          ? "text-[#E88800]"
                          : "text-[#6b7280] hover:text-[#E88800]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <Link
                  href="/login"
                  className={`${headerBtnClass} inline-flex w-full items-center justify-center`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t.header.login}
                </Link>
              </nav>
            </div>

            <div className="flex w-full flex-col gap-6 shrink-0">
              <div className="h-px w-full bg-gray-100" />

              <div className="flex items-center gap-1.5" aria-label="Switch language">
                <Globe size={14} strokeWidth={1.8} className="text-[#6b7280]" />
                <button
                  type="button"
                  onClick={() => setLang("KR")}
                  className={`text-xs font-semibold transition-colors ${
                    lang === "KR" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
                  }`}
                >
                  KO
                </button>
                <span className="text-[#d1d5db] text-xs">|</span>
                <button
                  type="button"
                  onClick={() => setLang("EN")}
                  className={`text-xs font-semibold transition-colors ${
                    lang === "EN" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
                  }`}
                >
                  EN
                </button>
              </div>

              <div className="flex flex-col gap-1 text-xs text-[#9ca3af]">
                <p>Organic Electronic Physics Laboratory</p>
                <a
                  href="mailto:sucho@ulsan.ac.kr"
                  className="transition-colors hover:text-[#E88800]"
                >
                  sucho@ulsan.ac.kr
                </a>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
