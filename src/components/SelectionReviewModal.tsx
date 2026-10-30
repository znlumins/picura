"use client";

import { useState } from "react";
import {
  X,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";

interface SelectionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryTitle: string;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/15 animate-fade-up overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              {result ? "Pilihan Berhasil Disimpan" : "Konfirmasi Seleksi Foto"}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {result ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-accent-emerald/15 text-accent-emerald rounded-full flex items-center justify-center mx-auto border border-accent-emerald/30 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-white mb-1">
                  Pilihan Anda Siap Dikirim!
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Daftar {selectedPhotos.length} foto pilihan telah tersimpan. WhatsApp editor seharusnya sudah terbuka otomatis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-accent-blue" />
                    Format Pesan WhatsApp:
                  </span>
                  <button
                    onClick={handleCopyText}
                    className="text-[11px] font-mono font-semibold text-accent-blue hover:underline flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent-emerald" />
                        <span className="text-accent-emerald">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 bg-black/40 p-3 rounded-xl border border-white/10 overflow-x-auto whitespace-pre-wrap max-h-36">
                  {result.message_text}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={result.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-accent-emerald hover:bg-emerald-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Buka Aplikasi WhatsApp
                </a>
                <a
                  href={result.whatsapp_web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-white font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  WhatsApp Web
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Photos Preview List */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Foto Terpilih ({selectedPhotos.length} Foto)
                </label>
                <div className="max-h-40 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-2 space-y-1.5 divide-y divide-white/[0.06]">
                  {selectedPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-center gap-2.5 pt-1.5 first:pt-0">
                      <span className="text-[11px] font-mono font-bold text-slate-500 w-5 text-right">
                        {index + 1}.
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.thumbnail_url}
                        alt={photo.filename}
                        className="w-8 h-8 rounded-lg object-cover border border-white/15"
                      />
                      <span className="text-xs font-mono text-slate-300 truncate flex-1">
                        {photo.filename}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Name Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Anda / Klien
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:border-white/40 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Client Notes for Editor */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Catatan Tambahan untuk Editor (Opsional)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Contoh: Mohon diedit warna lebih warm di foto outdoor."
                  rows={3}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:border-white/40 focus:outline-none resize-none placeholder:text-slate-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2.5 bg-white/[0.02]">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || selectedPhotos.length === 0}
              className="px-5 py-2.5 bg-accent-emerald hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-heading font-bold text-xs shadow-lg transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi & Buka WhatsApp</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
