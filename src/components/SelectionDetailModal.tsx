"use client";

import { useState } from "react";
import {
  IconClose,
  IconCheck,
  IconCopy,
  IconFileText,
  IconUser,
} from "@/components/Icons";

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
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa]">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#272835]">
              Hasil Seleksi Foto Klien
            </h3>
            <p className="text-xs text-[#666d80] truncate max-w-xs">{galleryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#eceff3] transition"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[8px] bg-[#f6f8fa] border border-[#cdd2d9]">
              <span className="text-[10px] font-mono text-[#818898] block">Nama Klien</span>
              <span className="font-medium text-[#272835] text-sm flex items-center gap-1.5 mt-0.5">
                <IconUser className="w-3.5 h-3.5 text-[#5e4cff]" />
                {selectionData.client_name || "Klien Anonim"}
              </span>
            </div>
            <div className="p-3.5 rounded-[8px] bg-[#f6f8fa] border border-[#cdd2d9]">
              <span className="text-[10px] font-mono text-[#818898] block">Total Terpilih</span>
              <span className="font-semibold text-[#5e4cff] text-sm block mt-0.5 font-mono">
                {selectionData.total_selected} Foto
              </span>
            </div>
          </div>

          {/* Notes if any */}
          {selectionData.client_notes && (
            <div className="p-3.5 rounded-[8px] bg-[#fffbeb] border border-[#fde68a] text-[#92400e]">
              <span className="font-semibold block mb-1">Catatan Klien:</span>
              <p className="italic text-xs">&quot;{selectionData.client_notes}&quot;</p>
            </div>
          )}

          {/* List of Files */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#36394a] flex items-center gap-1.5">
                <IconFileText className="w-3.5 h-3.5 text-[#818898]" />
                <span>Daftar File ({selectionData.selected_files.length}):</span>
              </span>
              <button
                onClick={handleCopyFilenames}
                className="text-[11px] text-[#5e4cff] hover:underline flex items-center gap-1 font-medium"
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3 h-3 text-[#10b981]" />
                    <span className="text-[#10b981]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="w-3 h-3" />
                    <span>Salin Daftar Nama</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto border border-[#cdd2d9] rounded-[8px] divide-y divide-[#eceff3] bg-[#f6f8fa]">
              {selectionData.selected_files.map((file, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 flex items-center justify-between text-xs hover:bg-white transition"
                >
                  <span className="font-mono text-[#818898] w-7">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <span className="font-mono text-[#272835] flex-1 truncate">
                    {file.filename}
                  </span>
                  <span className="text-[10px] font-mono text-[#818898] bg-white px-2 py-0.5 rounded-[4px] border border-[#cdd2d9]">
                    {file.file_id ? "Drive ID" : "ID"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f6f8fa] border-t border-[#cdd2d9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-[#272835] text-white hover:bg-[#1a1b25] text-xs font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
