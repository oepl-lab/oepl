"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export default function FooterCTA() {
  const { t } = useLang();
  const addressEnOneLine = t.contact.addressEn.replace(/\n/g, ", ");

  return (
    <footer style={{ backgroundColor: "var(--color-bg)" }}>
      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col md:flex-row gap-10">
          {/* Brand + address */}
          <div className="flex-shrink-0 max-w-full md:max-w-xs">
            <div className="mb-5">
              <Image
                src="/oepl-logo.png"
                alt="OEPL"
                width={110}
                height={36}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <div className="space-y-2.5 text-xs" style={{ color: "var(--color-muted)" }}>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-brand)" }} />
                <span className="md:hidden leading-relaxed">
                  {t.contact.address}
                  <br />
                  <span style={{ color: "var(--color-subtle)" }}>{addressEnOneLine}</span>
                </span>
                <span className="hidden md:inline">
                  (44610) 울산광역시 남구 대학로 93<br />
                  울산대학교 자연과학대학 8호관 8-224호 / 8-228호<br />
                  <span style={{ color: "var(--color-subtle)" }}>
                    93 Daehak-ro, Nam-gu, Ulsan 44610, Korea<br />
                    Bldg. 8, Rm. 8-224 / 8-228, Univ. of Ulsan
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="flex-shrink-0" style={{ color: "var(--color-brand)" }} />
                <span>+82-52-220-2547 (office)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="flex-shrink-0" style={{ color: "var(--color-brand)" }} />
                <a
                  href="mailto:sucho@ulsan.ac.kr"
                  className="transition-colors hover:text-[var(--color-brand)]"
                >
                  sucho@ulsan.ac.kr
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-1 justify-around">
            {Object.entries(t.footer.columns).map(([col, links]) => (
              <div key={col} className="flex-shrink-0">
                <h4
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ color: "var(--color-text)" }}
                >
                  {col}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-[var(--color-text)]"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        <div
          className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-2 text-xs"
          style={{ color: "var(--color-subtle)" }}
        >
          <span className="text-center md:text-left">{t.footer.copyright}</span>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-[10px]">{t.footer.bizNum}</span>
            <Link href="/contact" className="transition-colors hover:text-[var(--color-brand)]">
              {t.footer.contactUs}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
