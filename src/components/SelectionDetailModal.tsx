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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/15 animate-fade-up overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Hasil Seleksi Foto Klien
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-xs">{galleryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 block font-medium">Nama Klien</span>
              <span className="font-heading font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-accent-blue" />
                {selectionData.client_name || "Klien Anonim"}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] font-mono text-slate-400 block font-medium">Total Terpilih</span>
              <span className="font-heading font-bold text-accent-emerald text-sm block mt-0.5">
                {selectionData.total_selected} Foto
              </span>
            </div>
          </div>

          {/* Notes if any */}
          {selectionData.client_notes && (
            <div className="p-4 rounded-2xl bg-accent-amber/10 border border-accent-amber/20 text-amber-200">
              <span className="font-heading font-bold block mb-1">Catatan Klien:</span>
              <p className="italic text-xs">&quot;{selectionData.client_notes}&quot;</p>
            </div>
          )}

          {/* Files List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-slate-300 font-bold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Daftar Nama File ({selectionData.selected_files.length})
              </span>
              <button
                onClick={handleCopyFilenames}
                className="text-[11px] font-mono font-semibold text-accent-blue hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-accent-emerald" />
                    <span className="text-accent-emerald">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Semua Nama File</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-2.5 space-y-1 font-mono text-[11px]">
              {selectionData.selected_files.map((file, i) => (
                <div key={file.file_id || i} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                  <span className="w-6 text-right text-slate-500 font-bold">{i + 1}.</span>
                  <span className="text-slate-300 truncate">{file.filename}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
