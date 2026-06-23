"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";

export default function LoginPage() {
  const { t } = useLang();
  const l = t.login;
  const { login, isAuthenticated, loading, useSupabase } = useAuth();
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const ok = await login(id, password);
    setSubmitting(false);
    if (ok) {
      router.replace("/admin");
    } else {
      setError(l.error);
    }
  }

  if (loading || isAuthenticated) {
    return null;
  }

  const accountLabel = useSupabase ? l.emailLabel : l.idLabel;
  const accountPlaceholder = useSupabase ? l.emailPlaceholder : l.idPlaceholder;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{l.banner}</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-md mx-auto px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#080d1e] mb-2">{l.heading}</h2>
              <p className="text-sm text-[#6b7280] leading-relaxed">{l.desc}</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col gap-5"
            >
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="login-id" className="text-xs font-semibold text-[#374151]">
                  {accountLabel}
                </label>
                <input
                  id="login-id"
                  type={useSupabase ? "email" : "text"}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={accountPlaceholder}
                  autoComplete={useSupabase ? "email" : "username"}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#080d1e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#E88800]/60 focus:ring-2 focus:ring-[#E88800]/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-xs font-semibold text-[#374151]">
                  {l.passwordLabel}
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={l.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#080d1e] placeholder:text-[#9ca3af] outline-none transition-colors focus:border-[#E88800]/60 focus:ring-2 focus:ring-[#E88800]/10"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 cursor-pointer disabled:opacity-60"
                style={{ background: "#E88800" }}
              >
                {l.submit}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#9ca3af]">
              <Link href="/" className="hover:text-[#E88800] transition-colors">
                {l.backHome}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
