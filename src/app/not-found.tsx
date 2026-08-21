"use client";

import Link from "next/link";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { useLang } from "@/contexts/LangContext";

export default function NotFound() {
  const { t, lang } = useLang();
  const copy = t.notFoundPage;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[#f9fafb] flex items-center justify-center px-6 pt-16 pb-20">
        <section className="w-full max-w-lg text-center">
          <p className="text-7xl sm:text-8xl font-bold text-[#E88800]/20 leading-none mb-4">404</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#080d1e] mb-3 flex items-baseline justify-center gap-1 flex-wrap">
            <span>{copy.title}</span>
            {lang === "KR" && (
              <span className="text-base sm:text-lg font-normal text-[#9ca3af]">{copy.titleEn}</span>
            )}
          </h1>
          <p className="text-sm text-[#6b7280] leading-relaxed">{copy.desc}</p>
          {lang === "KR" && (
            <p className="text-xs text-[#9ca3af] mt-2 leading-relaxed">{copy.descEn}</p>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#E88800" }}
          >
            {copy.backHome}
          </Link>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
