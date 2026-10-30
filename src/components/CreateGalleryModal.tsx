"use client";

import { useState } from "react";
import {
  X,
  FolderOpen,
  Lock,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
} from "lucide-react";

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onQuotaExceeded: () => void;
}

export default function CreateGalleryModal({
  isOpen,
  onClose,
  onSuccess,
  onQuotaExceeded,
}: CreateGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [driveFolderUrl, setDriveFolderUrl] = useState("");
  const [maxQuota, setMaxQuota] = useState(20);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [editorWhatsapp, setEditorWhatsapp] = useState("081234567890");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          drive_folder_url: driveFolderUrl || "https://drive.google.com/drive/folders/sampleWeddingFolder",
          max_selection_quota: Number(maxQuota) || 20,
          password: usePassword ? password : null,
          editor_whatsapp: editorWhatsapp,
          expires_at: expiresAt ? expiresAt : null,
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === "QUOTA_EXCEEDED") {
        onClose();
        onQuotaExceeded();
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Gagal membuat galeri");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/15 animate-fade-up overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Buat Sesi Galeri Klien Baru
            </h3>
            <p className="text-xs text-slate-400">
              Tautkan folder Google Drive foto mentah dan tentukan batas kuota
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-accent-rose/15 border border-accent-rose/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-accent-rose" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sesi / Judul Galeri */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Judul Sesi / Klien <span className="text-accent-rose">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: The Wedding of Aditya & Nabila"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition placeholder:text-slate-500"
              required
            />
          </div>

          {/* Google Drive Folder URL */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-accent-blue" />
              <span>URL Folder Google Drive Foto Mentah</span>
              <span className="text-accent-rose">*</span>
            </label>
            <input
              type="text"
              value={driveFolderUrl}
              onChange={(e) => setDriveFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/1A2b3C4d5E..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition font-mono text-[11px] placeholder:text-slate-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Picura hanya membaca metadata (nama & thumbnail) secara <em>read-only</em> tanpa memindahkan file fisik.
            </p>
          </div>

          {/* Quota Limit & Editor WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Batas Kuota Foto</span>
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={maxQuota}
                onChange={(e) => setMaxQuota(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition font-mono"
              />
              <span className="text-[10px] text-slate-500">Maksimal foto yang boleh dipilih.</span>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-accent-emerald" />
                <span>WhatsApp Editor</span>
              </label>
              <input
                type="text"
                value={editorWhatsapp}
                onChange={(e) => setEditorWhatsapp(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition font-mono"
                required
              />
              <span className="text-[10px] text-slate-500">Tujuan hasil seleksi foto.</span>
            </div>
          </div>

          {/* Password Protection Toggle */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Proteksi Kata Sandi / PIN</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Klien harus memasukkan PIN sebelum dapat melihat galeri
                </p>
              </div>
              <input
                type="checkbox"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="w-4 h-4 rounded text-white bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
              />
            </div>

            {usePassword && (
              <div className="mt-2.5">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan PIN / Password (contoh: 123456)"
                  className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition font-mono"
                  required={usePassword}
                />
              </div>
            )}
          </div>

          {/* Expiry Date */}
          <div className="pt-2 border-t border-white/10">
            <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Batas Waktu Akses (Opsional)</span>
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition font-mono"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-white text-[#050505] hover:bg-slate-200 disabled:opacity-50 rounded-xl font-heading font-bold shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terbitkan Galeri</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
