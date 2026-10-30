"use client";

import { useState } from "react";
import { X, Check, Copy, FileText, User } from "lucide-react";

interface SelectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryTitle: string;
  selectionData: {
    client_name?: string;
    client_notes?: string;
    total_selected: number;
    submitted_at?: string;
    selected_files: { file_id: string; filename: string }[];
  } | null;
  editorPhone?: string;
}

export default function SelectionDetailModal({
  isOpen,
  onClose,
  galleryTitle,
  selectionData,
}: SelectionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !selectionData) return null;

  const handleCopyFilenames = () => {
    const list = selectionData.selected_files
      .map((f, i) => `${i + 1}. ${f.filename}`)
      .join("\n");
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-border animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-slate-50">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-brand-primary">
              Hasil Seleksi Foto Klien
            </h3>
            <p className="text-xs text-brand-muted truncate max-w-xs">{galleryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Nama Klien</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-brand-violet" />
                {selectionData.client_name || "Klien Anonim"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Total Terpilih</span>
              <span className="font-bold text-slate-800 text-sm block mt-0.5">
                {selectionData.total_selected} Foto
              </span>
            </div>
          </div>

          {/* Notes if any */}
          {selectionData.client_notes && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-bold block mb-1">Catatan Klien:</span>
              <p className="italic text-xs">&quot;{selectionData.client_notes}&quot;</p>
            </div>
          )}

          {/* Files List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Daftar Nama File ({selectionData.selected_files.length})
              </span>
              <button
                onClick={handleCopyFilenames}
                className="text-[11px] font-semibold text-brand-violet hover:text-brand-violetHover flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Semua Nama File</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 space-y-1 font-mono text-[11px]">
              {selectionData.selected_files.map((file, i) => (
                <div key={file.file_id || i} className="p-1.5 rounded bg-white border border-slate-100 flex items-center gap-2">
                  <span className="w-6 text-right text-slate-400 font-bold">{i + 1}.</span>
                  <span className="text-slate-700 truncate">{file.filename}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-brand-border flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
