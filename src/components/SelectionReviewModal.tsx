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

      // Open WhatsApp deep link automatically in new tab/window
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-border animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-brand-primary">
              {result ? "Pilihan Berhasil Disimpan" : "Konfirmasi Seleksi Foto"}
            </h3>
            <p className="text-xs text-brand-muted truncate max-w-xs">{galleryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {result ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-brand-emerald rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-heading font-bold text-xl text-brand-primary mb-1">
                  Pilihan Anda Siap Dikirim!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Daftar {selectedPhotos.length} foto pilihan Anda telah terdata. WhatsApp editor seharusnya sudah terbuka otomatis.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-violet" />
                    Format Pesan WhatsApp:
                  </span>
                  <button
                    onClick={handleCopyText}
                    className="text-[11px] font-semibold text-brand-violet hover:text-brand-violetHover flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-36">
                  {result.message_text}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a
                  href={result.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-brand-emerald hover:bg-brand-emeraldHover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Buka Aplikasi WhatsApp
                </a>
                <a
                  href={result.whatsapp_web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl border border-brand-border hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
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
                <label className="block text-xs font-bold text-brand-primary mb-1.5">
                  Foto Terpilih ({selectedPhotos.length} Foto)
                </label>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-brand-border bg-slate-50 p-2 space-y-1.5 divide-y divide-slate-100">
                  {selectedPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-center gap-2.5 pt-1.5 first:pt-0">
                      <span className="text-[11px] font-bold text-slate-400 w-5 text-right">
                        {index + 1}.
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.thumbnail_url}
                        alt={photo.filename}
                        className="w-8 h-8 rounded object-cover border border-slate-200"
                      />
                      <span className="text-xs font-medium text-slate-700 truncate flex-1">
                        {photo.filename}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Name Input */}
              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Nama Anda / Klien
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-violet focus:outline-none"
                />
              </div>

              {/* Client Notes for Editor */}
              <div>
                <label className="block text-xs font-bold text-brand-primary mb-1">
                  Catatan Tambahan untuk Editor (Opsional)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Contoh: Mohon diedit warna lebih cerah di foto outdoor, dan bersihkan background di foto ke-3."
                  rows={3}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-violet focus:outline-none resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="px-6 py-4 bg-slate-50 border-t border-brand-border flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || selectedPhotos.length === 0}
              className="px-5 py-2.5 bg-brand-emerald hover:bg-brand-emeraldHover disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
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
