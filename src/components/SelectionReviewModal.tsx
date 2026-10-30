"use client";

import { useState } from "react";
import {
  IconClose,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconSpinner,
  IconFileText,
  IconWhatsApp,
} from "@/components/Icons";

interface SelectionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryTitle: string;
  editorWhatsapp?: string;
  selectedPhotos: { id: string; filename: string; thumbnail_url: string }[];
  onSubmit: (clientName: string, clientNotes: string) => Promise<{
    whatsapp_url: string;
    whatsapp_web_url: string;
    message_text: string;
  }>;
}

export default function SelectionReviewModal({
  isOpen,
  onClose,
  galleryTitle,
  selectedPhotos,
  onSubmit,
}: SelectionReviewModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    whatsapp_url: string;
    whatsapp_web_url: string;
    message_text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await onSubmit(clientName, clientNotes);
      setResult(res);

      if (res.whatsapp_url) {
        window.open(res.whatsapp_url, "_blank");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    if (result?.message_text) {
      navigator.clipboard.writeText(result.message_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa]">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#272835]">
              {result ? "Pilihan Berhasil Disimpan" : "Konfirmasi Seleksi Foto"}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {!result ? (
            <>
              {/* Selected Photos Preview List */}
              <div>
                <span className="block text-xs font-medium text-[#36394a] mb-2">
                  Daftar Foto ({selectedPhotos.length} item)
                </span>
                <div className="max-h-40 overflow-y-auto border border-[#cdd2d9] rounded-[8px] divide-y divide-[#eceff3] bg-[#f6f8fa] p-2">
                  {selectedPhotos.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 py-1.5 px-2 text-xs"
                    >
                      <span className="font-mono text-[#818898] w-6">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.thumbnail_url}
                        alt={p.filename}
                        className="w-7 h-7 object-cover rounded-[4px] border border-[#cdd2d9]"
                      />
                      <span className="font-mono text-[#272835] truncate flex-1">
                        {p.filename}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#36394a] mb-1">
                  Nama Anda / Klien
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sarah / Raditya"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#36394a] mb-1">
                  Catatan untuk Editor / Retoucher (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Tolong foto nomor 05 kulit diratakan, dan warna tone sedikit lebih warm..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] flex items-center gap-2 text-[#065f46]">
                <IconCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                <span className="text-xs">
                  Pilihan Anda telah tercatat! Format WhatsApp telah digenerate.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#36394a] flex items-center gap-1.5">
                    <IconFileText className="w-3.5 h-3.5 text-[#818898]" />
                    <span>Daftar Kode / Format Pesan:</span>
                  </span>
                  <button
                    onClick={handleCopyText}
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
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 bg-[#1a1b25] text-[#dfdbff] rounded-[8px] font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                  {result.message_text}
                </pre>
              </div>

              {result.whatsapp_url && (
                <a
                  href={result.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-[8px] bg-[#10b981] text-white text-xs font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <IconWhatsApp className="w-4 h-4" />
                  <span>Kirim Ulang ke WhatsApp Fotografer</span>
                  <IconExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#f6f8fa] border-t border-[#cdd2d9] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] hover:bg-[#eceff3] text-xs font-medium transition"
          >
            {result ? "Tutup" : "Batal"}
          </button>

          {!result && (
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <IconWhatsApp className="w-4 h-4" />
                  <span>Kirim ke WhatsApp</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
