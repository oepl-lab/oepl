"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { Publication } from "@/types/content";
import { createId } from "@/lib/data/ids";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

const emptyPub = (): Publication => ({
  id: "",
  year: new Date().getFullYear(),
  month: 1,
  day: 1,
  type: "Journal",
  title: "",
  titleKo: "",
  authors: "",
  journal: "",
  volume: "",
  doi: "",
});

export default function AdminPublicationsPage() {
  const { t } = useLang();
  const { content, upsertPublication, deletePublication } = useContent();
  const [draft, setDraft] = useState<Publication | null>(null);

  return (
    <>
      <AdminPageHeader title={t.admin.publications} onAdd={() => setDraft(emptyPub())} addLabel={t.admin.add} />
      <AdminTable headers={[t.admin.colDate, t.admin.colTitle, ""]}>
        {content.publications.map((item) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{item.year}.{String(item.month).padStart(2, "0")}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.titleKo || item.title}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => { if (confirm(t.admin.confirmDelete)) deletePublication(item.id); }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={!!draft}
        title={draft?.id ? t.admin.edit : t.admin.add}
        onClose={() => setDraft(null)}
        onSubmit={() => { if (draft) { upsertPublication({ ...draft, id: draft.id || createId() }); setDraft(null); } }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Year"><input type="number" className={inputClass} value={draft.year} onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })} /></Field>
              <Field label="Month"><input type="number" className={inputClass} value={draft.month} onChange={(e) => setDraft({ ...draft, month: Number(e.target.value) })} /></Field>
              <Field label="Day"><input type="number" className={inputClass} value={draft.day} onChange={(e) => setDraft({ ...draft, day: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Type">
              <select className={inputClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Publication["type"] })}>
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
              </select>
            </Field>
            <Field label="Title (EN)"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Title (KR)"><input className={inputClass} value={draft.titleKo} onChange={(e) => setDraft({ ...draft, titleKo: e.target.value })} /></Field>
            <Field label="Authors"><input className={inputClass} value={draft.authors} onChange={(e) => setDraft({ ...draft, authors: e.target.value })} /></Field>
            <Field label="Journal"><input className={inputClass} value={draft.journal} onChange={(e) => setDraft({ ...draft, journal: e.target.value })} /></Field>
            <Field label="Volume"><input className={inputClass} value={draft.volume} onChange={(e) => setDraft({ ...draft, volume: e.target.value })} /></Field>
            <Field label="DOI"><input className={inputClass} value={draft.doi} onChange={(e) => setDraft({ ...draft, doi: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
