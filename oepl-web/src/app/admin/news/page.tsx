"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { NewsItem } from "@/types/content";
import { createId } from "@/lib/data/ids";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

const emptyNews = (): NewsItem => ({
  id: "",
  badge: "News",
  date: "",
  titleKr: "",
  titleEn: "",
  excerptKr: "",
  excerptEn: "",
});

export default function AdminNewsPage() {
  const { t } = useLang();
  const { content, upsertNews, deleteNews } = useContent();
  const [draft, setDraft] = useState<NewsItem | null>(null);

  return (
    <>
      <AdminPageHeader title={t.admin.news} onAdd={() => setDraft(emptyNews())} addLabel={t.admin.add} />
      <AdminTable headers={[t.admin.colDate, t.admin.colTitle, ""]}>
        {content.news.map((item) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{item.date}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.titleKr}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteNews(item.id); }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={!!draft}
        title={draft?.id ? t.admin.edit : t.admin.add}
        onClose={() => setDraft(null)}
        onSubmit={() => { if (draft) { upsertNews({ ...draft, id: draft.id || createId() }); setDraft(null); } }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Badge"><input className={inputClass} value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} /></Field>
            <Field label={t.admin.colDate}><input className={inputClass} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
            <Field label="Title (KR)"><input className={inputClass} value={draft.titleKr} onChange={(e) => setDraft({ ...draft, titleKr: e.target.value })} /></Field>
            <Field label="Title (EN)"><input className={inputClass} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></Field>
            <Field label="Excerpt (KR)"><textarea className={inputClass} rows={3} value={draft.excerptKr} onChange={(e) => setDraft({ ...draft, excerptKr: e.target.value })} /></Field>
            <Field label="Excerpt (EN)"><textarea className={inputClass} rows={3} value={draft.excerptEn} onChange={(e) => setDraft({ ...draft, excerptEn: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
