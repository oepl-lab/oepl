"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AlumniMember,
  GalleryItem,
  NewsItem,
  Patent,
  Professor,
  Publication,
  ResearcherMember,
  SiteContent,
} from "@/types/content";
import { createId } from "@/lib/data/ids";
import { seedContent } from "@/lib/data/seed";
import { fetchSiteContent, persistSiteContent } from "@/lib/data/repository";

interface ContentContextValue {
  content: SiteContent;
  ready: boolean;
  saving: boolean;
  resetToSeed: () => Promise<void>;
  upsertNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  upsertPublication: (item: Publication) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  upsertGallery: (item: GalleryItem) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
  upsertPatent: (item: Patent) => Promise<void>;
  deletePatent: (id: string) => Promise<void>;
  updateProfessor: (professor: Professor) => Promise<void>;
  upsertResearcher: (group: "postdocs" | "gradStudents", item: ResearcherMember) => Promise<void>;
  deleteResearcher: (group: "postdocs" | "gradStudents", id: string) => Promise<void>;
  upsertAlumni: (group: "phdAlumni" | "msAlumni", item: AlumniMember) => Promise<void>;
  deleteAlumni: (group: "phdAlumni" | "msAlumni", id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(seedContent);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteContent()
      .then(setContent)
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback(async (next: SiteContent) => {
    setContent(next);
    setSaving(true);
    try {
      await persistSiteContent(next);
    } catch (err) {
      console.error("[ContentContext] persist failed", err);
      alert("저장에 실패했습니다. 로그인 상태를 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }, []);

  const withCurrent = useCallback(
    (fn: (current: SiteContent) => SiteContent) => {
      setContent((prev) => {
        const next = fn(prev);
        void persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetToSeed = useCallback(async () => {
    const next = structuredClone(seedContent);
    await persist(next);
  }, [persist]);

  const upsertNews = useCallback(async (item: NewsItem) => {
    withCurrent((current) => {
      const exists = current.news.some((n) => n.id === item.id);
      const news = exists
        ? current.news.map((n) => (n.id === item.id ? item : n))
        : [{ ...item, id: item.id || createId() }, ...current.news];
      return { ...current, news };
    });
  }, [withCurrent]);

  const deleteNews = useCallback(async (id: string) => {
    withCurrent((current) => ({
      ...current,
      news: current.news.filter((n) => n.id !== id),
    }));
  }, [withCurrent]);

  const upsertPublication = useCallback(async (item: Publication) => {
    withCurrent((current) => {
      const exists = current.publications.some((p) => p.id === item.id);
      const publications = exists
        ? current.publications.map((p) => (p.id === item.id ? item : p))
        : [{ ...item, id: item.id || createId() }, ...current.publications];
      return { ...current, publications };
    });
  }, [withCurrent]);

  const deletePublication = useCallback(async (id: string) => {
    withCurrent((current) => ({
      ...current,
      publications: current.publications.filter((p) => p.id !== id),
    }));
  }, [withCurrent]);

  const upsertGallery = useCallback(async (item: GalleryItem) => {
    withCurrent((current) => {
      const exists = current.gallery.some((g) => g.id === item.id);
      const gallery = exists
        ? current.gallery.map((g) => (g.id === item.id ? item : g))
        : [{ ...item, id: item.id || createId() }, ...current.gallery];
      return { ...current, gallery };
    });
  }, [withCurrent]);

  const deleteGallery = useCallback(async (id: string) => {
    withCurrent((current) => ({
      ...current,
      gallery: current.gallery.filter((g) => g.id !== id),
    }));
  }, [withCurrent]);

  const upsertPatent = useCallback(async (item: Patent) => {
    withCurrent((current) => {
      const exists = current.patents.some((p) => p.id === item.id);
      const patents = exists
        ? current.patents.map((p) => (p.id === item.id ? item : p))
        : [{ ...item, id: item.id || createId() }, ...current.patents];
      return { ...current, patents };
    });
  }, [withCurrent]);

  const deletePatent = useCallback(async (id: string) => {
    withCurrent((current) => ({
      ...current,
      patents: current.patents.filter((p) => p.id !== id),
    }));
  }, [withCurrent]);

  const updateProfessor = useCallback(async (professor: Professor) => {
    withCurrent((current) => ({
      ...current,
      members: { ...current.members, professor },
    }));
  }, [withCurrent]);

  const upsertResearcher = useCallback(async (group: "postdocs" | "gradStudents", item: ResearcherMember) => {
    withCurrent((current) => {
      const list = current.members[group];
      const exists = list.some((m) => m.id === item.id);
      const nextList = exists
        ? list.map((m) => (m.id === item.id ? item : m))
        : [{ ...item, id: item.id || createId() }, ...list];
      return { ...current, members: { ...current.members, [group]: nextList } };
    });
  }, [withCurrent]);

  const deleteResearcher = useCallback(async (group: "postdocs" | "gradStudents", id: string) => {
    withCurrent((current) => ({
      ...current,
      members: { ...current.members, [group]: current.members[group].filter((m) => m.id !== id) },
    }));
  }, [withCurrent]);

  const upsertAlumni = useCallback(async (group: "phdAlumni" | "msAlumni", item: AlumniMember) => {
    withCurrent((current) => {
      const list = current.members[group];
      const exists = list.some((m) => m.id === item.id);
      const nextList = exists
        ? list.map((m) => (m.id === item.id ? item : m))
        : [{ ...item, id: item.id || createId() }, ...list];
      return { ...current, members: { ...current.members, [group]: nextList } };
    });
  }, [withCurrent]);

  const deleteAlumni = useCallback(async (group: "phdAlumni" | "msAlumni", id: string) => {
    withCurrent((current) => ({
      ...current,
      members: { ...current.members, [group]: current.members[group].filter((m) => m.id !== id) },
    }));
  }, [withCurrent]);

  const value = useMemo(
    () => ({
      content,
      ready,
      saving,
      resetToSeed,
      upsertNews,
      deleteNews,
      upsertPublication,
      deletePublication,
      upsertGallery,
      deleteGallery,
      upsertPatent,
      deletePatent,
      updateProfessor,
      upsertResearcher,
      deleteResearcher,
      upsertAlumni,
      deleteAlumni,
    }),
    [
      content,
      ready,
      saving,
      resetToSeed,
      upsertNews,
      deleteNews,
      upsertPublication,
      deletePublication,
      upsertGallery,
      deleteGallery,
      upsertPatent,
      deletePatent,
      updateProfessor,
      upsertResearcher,
      deleteResearcher,
      upsertAlumni,
      deleteAlumni,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
