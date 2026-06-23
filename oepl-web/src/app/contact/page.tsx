"use client";
import { useState, type ElementType, type ReactNode } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { useLang } from "@/contexts/LangContext";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

function useCopySection() {
  const [copied, setCopied] = useState(false);

  function notifyCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return { copied, notifyCopied };
}

function Copyable({
  text,
  children,
  className = "",
  onCopied,
  as: Tag = "p",
  ...props
}: {
  text: string;
  children: ReactNode;
  className?: string;
  onCopied: () => void;
  as?: ElementType;
  href?: string;
}) {
  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      onCopied();
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <Tag
      {...props}
      onClick={handleCopy}
      className={`cursor-pointer transition-colors hover:text-[#E88800] ${className}`}
    >
      {children}
    </Tag>
  );
}

function CopiedBadge({ show, label }: { show: boolean; label: string }) {
  return (
    <span
      aria-hidden={!show}
      className={`absolute left-full ml-1 top-1/2 -translate-y-1/2 text-[10px] font-medium whitespace-nowrap pointer-events-none transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ color: "rgba(232, 136, 0, 0.45)" }}
    >
      {label}
    </span>
  );
}

export default function ContactPage() {
  const { lang, t } = useLang();
  const c = t.contact;
  const fullAddressEn = c.addressEn.replace("\n", " ");
  const addressCopy = useCopySection();
  const phoneCopy = useCopySection();
  const emailCopy = useCopySection();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{c.title}</h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">

            {/* Title + description */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#E88800] mb-4 leading-tight">
                {c.heading}
              </h2>
              <p className="text-sm text-[#6b7280] leading-relaxed max-w-lg">
                {lang === "KR"
                  ? "연구실 방문, 공동 연구, 학생 모집 등 궁금하신 사항이 있으시면 언제든지 연락해 주세요."
                  : "We'd love to hear from you. Whether you have questions about research, collaboration, or joining our lab, our team is here to help."}
              </p>
            </div>

            {/* info row — address | phone | email */}
            <div className="flex flex-col md:flex-row gap-16 items-start w-full">

              {/* 주소 — width anchored to one-line Korean address */}
              <div className="grid flex-shrink-0">
                <p aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap text-sm font-semibold pointer-events-none select-none">
                  {c.address}
                </p>
                <div className="col-start-1 row-start-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10">
                      <MapPin size={14} className="text-[#E88800]" />
                    </div>
                    <span className="relative inline-flex items-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">
                        {c.addressLabel}
                      </p>
                      <CopiedBadge show={addressCopy.copied} label={c.copySuccess} />
                    </span>
                  </div>
                  <Copyable
                    as="p"
                    text={lang === "KR" ? c.address : fullAddressEn}
                    onCopied={addressCopy.notifyCopied}
                    className="text-sm font-semibold text-[#080d1e] whitespace-nowrap"
                  >
                    {lang === "KR" ? c.address : c.addressEn.split("\n")[0]}
                  </Copyable>
                  {lang === "KR" ? (
                    <Copyable
                      as="p"
                      text={fullAddressEn}
                      onCopied={addressCopy.notifyCopied}
                      className="text-xs text-[#9ca3af] mt-1 leading-relaxed"
                    >
                      {c.addressEn.split("\n").map((line, i, arr) => (
                        <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                      ))}
                    </Copyable>
                  ) : (
                    <>
                      {c.addressEn.split("\n").slice(1).map((line, i) => (
                        <Copyable
                          key={i}
                          as="p"
                          text={fullAddressEn}
                          onCopied={addressCopy.notifyCopied}
                          className="text-sm font-semibold text-[#080d1e]"
                        >
                          {line}
                        </Copyable>
                      ))}
                      <Copyable
                        as="p"
                        text={c.address}
                        onCopied={addressCopy.notifyCopied}
                        className="text-xs text-[#9ca3af] mt-1 whitespace-nowrap"
                      >
                        {c.address}
                      </Copyable>
                    </>
                  )}
                </div>
              </div>

              {/* 전화 */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10">
                    <Phone size={14} className="text-[#E88800]" />
                  </div>
                  <span className="relative inline-flex items-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">
                      {c.phoneLabel}
                    </p>
                    <CopiedBadge show={phoneCopy.copied} label={c.copySuccess} />
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Copyable
                    as="a"
                    href="tel:+82522202547"
                    text="+82-52-220-2547"
                    onCopied={phoneCopy.notifyCopied}
                    className="text-sm text-[#374151]"
                  >
                    +82-52-220-2547 (office)
                  </Copyable>
                  <Copyable
                    as="a"
                    href="tel:+82522204610"
                    text="+82-52-220-4610"
                    onCopied={phoneCopy.notifyCopied}
                    className="text-sm text-[#374151]"
                  >
                    +82-52-220-4610 (lab)
                  </Copyable>
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10">
                    <Mail size={14} className="text-[#E88800]" />
                  </div>
                  <span className="relative inline-flex items-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">
                      {c.emailLabel}
                    </p>
                    <CopiedBadge show={emailCopy.copied} label={c.copySuccess} />
                  </span>
                </div>
                <Copyable
                  as="a"
                  href="mailto:sucho@ulsan.ac.kr"
                  text="sucho@ulsan.ac.kr"
                  onCopied={emailCopy.notifyCopied}
                  className="text-sm text-[#374151]"
                >
                  sucho@ulsan.ac.kr
                </Copyable>
              </div>

            </div>

            {/* Full-width map */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: 420 }}>
              <iframe
                title="OEPL Location"
                src="https://maps.google.com/maps?q=울산대학교+자연과학대학&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=울산대학교+자연과학대학"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#080d1e] text-white hover:bg-[#E88800] transition-colors shadow-lg"
              >
                {lang === "KR" ? "길찾기" : "Get Directions"}
                <ArrowRight size={13} />
              </a>
            </div>

          </div>
        </section>

      </main>
      <FooterCTA />
    </>
  );
}
