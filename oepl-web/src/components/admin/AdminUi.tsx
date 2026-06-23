"use client";

import { btnDangerClass, btnGhostClass, btnPrimaryClass } from "./form-styles";

export function AdminPageHeader({
  title,
  onAdd,
  addLabel,
}: {
  title: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#080d1e]">{title}</h1>
      <button type="button" onClick={onAdd} className={btnPrimaryClass} style={{ background: "#E88800" }}>
        {addLabel}
      </button>
    </div>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminRowActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit} className={btnGhostClass}>
        {editLabel}
      </button>
      <button type="button" onClick={onDelete} className={btnDangerClass}>
        {deleteLabel}
      </button>
    </div>
  );
}

export function AdminModal({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel,
  cancelLabel,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  cancelLabel: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-[#080d1e] mb-4">{title}</h2>
        <div className="flex flex-col gap-4">{children}</div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className={btnGhostClass}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onSubmit} className={btnPrimaryClass} style={{ background: "#E88800" }}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#374151]">{label}</span>
      {children}
    </label>
  );
}
