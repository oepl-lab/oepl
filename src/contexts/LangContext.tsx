"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { translations } from "@/i18n/translations";
import type { Lang } from "@/i18n/translations";

const LANG_STORAGE_KEY = "oepl-lang";
const DEFAULT_LANG: Lang = "EN";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "KR" || stored === "EN" ? stored : DEFAULT_LANG;
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.KR;
}

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: translations.EN,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore quota / private mode errors
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
