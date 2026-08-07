"use client";
import { useLang } from "@/contexts/LangContext";
import { focusIcons, FOCUS_ICON_PROPS } from "@/components/icons/FocusIcons";

export default function FocusSection() {
  const { lang, t } = useLang();
  return (
    <section className="bg-white section-y">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

          {/* Left — title */}
          <div className="flex-shrink-0 flex items-stretch gap-5">
            <div>
              <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: "#E88800" }}>
                {t.focus.label}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.focus.title}</h2>
            </div>
          </div>

          {/* Right — 4 cards */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {t.focus.items.map((item, i) => {
              const Icon = focusIcons[i];
              return (
              <div key={i} className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                  <Icon {...FOCUS_ICON_PROPS} />
                </div>
                <div>
                  <div className="text-[#080d1e] font-semibold text-sm">{item.title}</div>
                  {lang === "KR" && (
                    <div className="text-xs text-[#9ca3af] mb-2">{item.enTitle}</div>
                  )}
                  <p className="text-[#6b7280] text-xs leading-relaxed break-keep">{item.desc}</p>
                </div>
              </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
