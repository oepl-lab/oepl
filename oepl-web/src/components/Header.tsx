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

function HeaderLogos({
  priority = false,
  compact = false,
  onLabLogoClick,
}: {
  priority?: boolean;
  compact?: boolean;
  onLabLogoClick?: () => void;
}) {
  const logoClass = compact ? "h-6 w-auto object-contain" : "h-8 w-auto object-contain";
  const dividerClass = compact ? "h-4 w-px bg-gray-200 shrink-0" : "h-6 w-px bg-gray-200 shrink-0";

  return (
    <div className={`flex items-center flex-shrink-0 ${compact ? "gap-2" : "gap-3"}`}>
      <a
        href="https://www.ulsan.ac.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
        aria-label="University of Ulsan"
      >
        <Image
          src="/ulsan-university-logo.png"
          alt="University of Ulsan"
          width={180}
          height={48}
          className={logoClass}
          priority={priority}
        />
      </a>
      <span className={dividerClass} aria-hidden />
      <Link href="/" className="flex-shrink-0" onClick={onLabLogoClick}>
        <Image
          src="/oepl-logo.png"
          alt="OEPL — Organic Electronic Physics Laboratory"
          width={132}
          height={44}
          className={logoClass}
          priority={priority}
        />
      </Link>
    </div>
  );
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
      <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <HeaderLogos priority />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-5 2xl:gap-7 min-w-0 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-[#6b7280] hover:text-[#080d1e] text-base xl:text-[17px] 2xl:text-[18px] font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E88800] group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </nav>

        {/* Desktop controls */}
        <div className="hidden lg:flex items-center gap-3 justify-self-end flex-shrink-0">
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
          className="lg:hidden justify-self-end text-[#6b7280] hover:text-[#080d1e] transition-colors"
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
            className="lg:hidden fixed inset-0 z-[60] bg-black/50"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            id="mobile-nav"
            className="lg:hidden fixed inset-y-0 right-0 z-[70] flex w-[320px] max-w-[85vw] flex-col justify-between bg-white px-8 pt-7 pb-12 shadow-[-4px_0_12px_rgba(0,0,0,0.1)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex w-full flex-col gap-10 min-h-0">
              <div className="flex w-full items-center justify-between shrink-0">
                <HeaderLogos compact onLabLogoClick={() => setMobileOpen(false)} />
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
                      className={`text-base font-medium transition-colors ${
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

              <div className="flex items-center gap-2" aria-label="Switch language">
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
