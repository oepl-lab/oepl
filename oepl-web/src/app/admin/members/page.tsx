"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { AlumniMember, ResearcherMember } from "@/types/content";
import { createId } from "@/lib/data/ids";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

type Tab = "postdocs" | "gradStudents" | "phdAlumni" | "msAlumni";

export default function AdminMembersPage() {
  const { t } = useLang();
  const {
    content,
    updateProfessor,
    upsertResearcher,
    deleteResearcher,
    upsertAlumni,
    deleteAlumni,
  } = useContent();
  const [tab, setTab] = useState<Tab>("postdocs");
  const [researcherDraft, setResearcherDraft] = useState<ResearcherMember | null>(null);
  const [alumniDraft, setAlumniDraft] = useState<AlumniMember | null>(null);
  const prof = content.members.professor;

  const tabs: { id: Tab; label: string }[] = [
    { id: "postdocs", label: t.members.postdocTitle },
    { id: "gradStudents", label: t.members.gradTitle },
    { id: "phdAlumni", label: t.members.phdAlumniTitle },
    { id: "msAlumni", label: t.members.msAlumniTitle },
  ];

  function saveProfessor() {
    updateProfessor(prof);
    alert(t.admin.saved);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl bg-white border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#080d1e] mb-4">{t.members.professorTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name (KR)"><input className={inputClass} value={prof.nameKo} onChange={(e) => updateProfessor({ ...prof, nameKo: e.target.value })} /></Field>
          <Field label="Name (EN)"><input className={inputClass} value={prof.nameEn} onChange={(e) => updateProfessor({ ...prof, nameEn: e.target.value })} /></Field>
          <Field label="Affiliation (KR)"><input className={inputClass} value={prof.affiliationKr} onChange={(e) => updateProfessor({ ...prof, affiliationKr: e.target.value })} /></Field>
          <Field label="Affiliation (EN)"><input className={inputClass} value={prof.affiliationEn} onChange={(e) => updateProfessor({ ...prof, affiliationEn: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} value={prof.email} onChange={(e) => updateProfessor({ ...prof, email: e.target.value })} /></Field>
          <Field label="Scholar URL"><input className={inputClass} value={prof.scholar} onChange={(e) => updateProfessor({ ...prof, scholar: e.target.value })} /></Field>
        </div>
        <button type="button" onClick={saveProfessor} className="mt-4 px-4 py-2 rounded-full text-xs font-semibold text-white cursor-pointer" style={{ background: "#E88800" }}>
          {t.admin.save}
        </button>
      </section>

      <section>
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
              style={{
                background: tab === id ? "#E88800" : "#f9fafb",
                color: tab === id ? "#fff" : "#6b7280",
                border: `1px solid ${tab === id ? "#E88800" : "#e5e7eb"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {(tab === "postdocs" || tab === "gradStudents") && (
          <>
            <AdminPageHeader
              title={tabs.find((x) => x.id === tab)!.label}
              onAdd={() => setResearcherDraft({ id: "", nameKo: "", nameEn: "", degree: tab === "postdocs" ? "박사후연구원" : "석사과정", email: "", fieldKr: "", fieldEn: "" })}
              addLabel={t.admin.add}
            />
            <AdminTable headers={["Name (KR)", "Email", ""]}>
              {content.members[tab].map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium">{item.nameKo}</td>
                  <td className="px-4 py-3 text-xs text-[#9ca3af]">{item.email}</td>
                  <td className="px-4 py-3">
                    <AdminRowActions
                      editLabel={t.admin.edit}
                      deleteLabel={t.admin.delete}
                      onEdit={() => setResearcherDraft({ ...item })}
                      onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteResearcher(tab, item.id); }}
                    />
                  </td>
                </tr>
              ))}
            </AdminTable>
          </>
        )}

        {(tab === "phdAlumni" || tab === "msAlumni") && (
          <>
            <AdminPageHeader
              title={tabs.find((x) => x.id === tab)!.label}
              onAdd={() => setAlumniDraft({ id: "", nameKo: "", nameEn: "", degree: tab === "phdAlumni" ? "박사과정" : "석사과정", year: new Date().getFullYear(), month: 2, affiliationKr: "", affiliationEn: "" })}
              addLabel={t.admin.add}
            />
            <AdminTable headers={["Name (KR)", "Year", ""]}>
              {content.members[tab].map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium">{item.nameKo}</td>
                  <td className="px-4 py-3 text-xs text-[#9ca3af]">{item.year}.{String(item.month).padStart(2, "0")}</td>
                  <td className="px-4 py-3">
                    <AdminRowActions
                      editLabel={t.admin.edit}
                      deleteLabel={t.admin.delete}
                      onEdit={() => setAlumniDraft({ ...item })}
                      onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteAlumni(tab, item.id); }}
                    />
                  </td>
                </tr>
              ))}
            </AdminTable>
          </>
        )}
      </section>

      <AdminModal
        open={!!researcherDraft}
        title={researcherDraft?.id ? t.admin.edit : t.admin.add}
        onClose={() => setResearcherDraft(null)}
        onSubmit={() => {
          if (researcherDraft && (tab === "postdocs" || tab === "gradStudents")) {
            upsertResearcher(tab, { ...researcherDraft, id: researcherDraft.id || createId() });
            setResearcherDraft(null);
          }
        }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {researcherDraft && (
          <>
            <Field label="Name (KR)"><input className={inputClass} value={researcherDraft.nameKo} onChange={(e) => setResearcherDraft({ ...researcherDraft, nameKo: e.target.value })} /></Field>
            <Field label="Name (EN)"><input className={inputClass} value={researcherDraft.nameEn} onChange={(e) => setResearcherDraft({ ...researcherDraft, nameEn: e.target.value })} /></Field>
            <Field label="Degree"><input className={inputClass} value={researcherDraft.degree} onChange={(e) => setResearcherDraft({ ...researcherDraft, degree: e.target.value })} /></Field>
            <Field label="Email"><input className={inputClass} value={researcherDraft.email} onChange={(e) => setResearcherDraft({ ...researcherDraft, email: e.target.value })} /></Field>
            <Field label="Field (KR)"><input className={inputClass} value={researcherDraft.fieldKr} onChange={(e) => setResearcherDraft({ ...researcherDraft, fieldKr: e.target.value })} /></Field>
            <Field label="Field (EN)"><input className={inputClass} value={researcherDraft.fieldEn} onChange={(e) => setResearcherDraft({ ...researcherDraft, fieldEn: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>

      <AdminModal
        open={!!alumniDraft}
        title={alumniDraft?.id ? t.admin.edit : t.admin.add}
        onClose={() => setAlumniDraft(null)}
        onSubmit={() => {
          if (alumniDraft && (tab === "phdAlumni" || tab === "msAlumni")) {
            upsertAlumni(tab, { ...alumniDraft, id: alumniDraft.id || createId() });
            setAlumniDraft(null);
          }
        }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {alumniDraft && (
          <>
            <Field label="Name (KR)"><input className={inputClass} value={alumniDraft.nameKo} onChange={(e) => setAlumniDraft({ ...alumniDraft, nameKo: e.target.value })} /></Field>
            <Field label="Name (EN)"><input className={inputClass} value={alumniDraft.nameEn} onChange={(e) => setAlumniDraft({ ...alumniDraft, nameEn: e.target.value })} /></Field>
            <Field label="Year"><input type="number" className={inputClass} value={alumniDraft.year} onChange={(e) => setAlumniDraft({ ...alumniDraft, year: Number(e.target.value) })} /></Field>
            <Field label="Month"><input type="number" className={inputClass} value={alumniDraft.month} onChange={(e) => setAlumniDraft({ ...alumniDraft, month: Number(e.target.value) })} /></Field>
            <Field label="Affiliation (KR)"><input className={inputClass} value={alumniDraft.affiliationKr} onChange={(e) => setAlumniDraft({ ...alumniDraft, affiliationKr: e.target.value })} /></Field>
            <Field label="Affiliation (EN)"><input className={inputClass} value={alumniDraft.affiliationEn} onChange={(e) => setAlumniDraft({ ...alumniDraft, affiliationEn: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>
    </div>
  );
}
