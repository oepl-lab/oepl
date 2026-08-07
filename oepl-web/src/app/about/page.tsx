"use client";
import { useState } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import ResearchAreaCard from "@/components/ResearchAreaCard";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import BrandIdentitySection from "@/components/BrandIdentitySection";
import { formatPatentDate } from "@/lib/content/display";
import { FileText } from "lucide-react";

export default function AboutPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.about.banner}</h1>
          </div>
        </section>

        {/* 연구 분야 소개 */}
        <section id="research" className="section-y bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="section-label mb-1">{t.about.researchLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.about.researchTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 items-start">
              {t.about.areas.map((area) => (
                <ResearchAreaCard
                  key={area.tag}
                  area={area}
                  expanded={expandedTag === area.tag}
                  onToggle={() => setExpandedTag((prev) => (prev === area.tag ? null : area.tag))}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 특허 소개 */}
        <section id="patents" className="section-y bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="section-label mb-1">{t.about.patentLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.about.patentTitle}</h2>
            </div>

            <div className="flex flex-col gap-4">
              {content.patents.map((patent) => {
                const isRegistered = patent.status === "registered";
                return (
                  <div
                    key={patent.id}
                    className="rounded-2xl bg-white border border-gray-100 p-6 flex gap-5 items-start hover:border-[#E88800]/40 transition-colors group"
                  >
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: isRegistered ? "rgba(232,136,0,0.1)" : "#f3f4f6" }}
                    >
                      <FileText size={18} style={{ color: isRegistered ? "#E88800" : "#9ca3af" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: isRegistered ? "rgba(232,136,0,0.1)" : "#f3f4f6",
                            color: isRegistered ? "#E88800" : "#6b7280",
                            border: `1px solid ${isRegistered ? "rgba(232,136,0,0.25)" : "#e5e7eb"}`,
                          }}
                        >
                          {isRegistered ? t.about.patentStatusRegistered : t.about.patentStatusPending}
                        </span>
                        <span className="text-[10px] text-[#9ca3af] font-mono">{patent.number}</span>
                        <span className="text-[10px] text-[#9ca3af]">{formatPatentDate(patent.date)}</span>
                      </div>

                      <h3 className="font-semibold text-sm text-[#080d1e] leading-snug mb-2 group-hover:text-[#E88800] transition-colors">
                        {lang === "KR" ? patent.title : patent.titleEn}
                      </h3>
                      <p className="text-xs text-[#6b7280]">{patent.inventors}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <BrandIdentitySection />

      </main>
      <FooterCTA />
    </>
  );
}
