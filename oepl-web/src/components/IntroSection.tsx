"use client";
import { useLang } from "@/contexts/LangContext";

export default function IntroSection() {
  const { t } = useLang();

  return (
    <section id="about" className="bg-white section-y">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <div className="mb-10">
              <p className="section-label mb-1">{t.intro.label}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#080d1e] mb-4 leading-snug">
                {t.intro.title}
              </h2>
            </div>

            <div>
              <p className="text-lg text-[#E88800] font-medium mb-6 leading-snug">
                {t.intro.tagline}
              </p>
              <div className="space-y-4 text-[#6b7280] text-sm leading-relaxed">
                <p>{t.intro.p1}</p>
                <p>{t.intro.p2}</p>
                <p>{t.intro.p3}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  padding: "var(--spacing-300) var(--spacing-600)",
                  background: "var(--color-brand)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {t.intro.btn1}
              </a>
              <a
                href="/members"
                className="inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all hover:text-[var(--color-neutral-900)]"
                style={{
                  padding: "var(--spacing-300) var(--spacing-600)",
                  border: "1px solid var(--color-neutral-200)",
                  color: "var(--color-neutral-500)",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {t.intro.btn2}
              </a>
            </div>
          </div>

          <div className="rounded-2xl w-full min-h-[280px] sm:min-h-[320px] md:min-h-[420px] flex items-center justify-center bg-gray-100 border border-gray-200 overflow-hidden">
            <span className="text-xs md:text-sm text-gray-400">{t.about.profPhoto}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
