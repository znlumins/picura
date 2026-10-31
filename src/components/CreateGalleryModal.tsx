"use client";

import { useState } from "react";
import {
  IconClose,
  IconFolder,
  IconLock,
  IconPhone,
  IconClock,
  IconAlert,
  IconSpinner,
  IconPlus,
} from "@/components/Icons";

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onQuotaExceeded: () => void;
  defaultWhatsapp?: string;
}

export default function CreateGalleryModal({
  isOpen,
  onClose,
  onSuccess,
  onQuotaExceeded,
  defaultWhatsapp = "",
}: CreateGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [driveFolderUrl, setDriveFolderUrl] = useState("");
  const [directLinks, setDirectLinks] = useState("");
  const [maxQuota, setMaxQuota] = useState(20);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [editorWhatsapp, setEditorWhatsapp] = useState(defaultWhatsapp || "081234567890");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Parse direct links if entered
    const parsedDirectFiles: { file_id: string; filename: string }[] = [];
    if (directLinks.trim()) {
      const lines = directLinks.split(/[\n,]+/);
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed) {
          const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
          const fileId = match ? match[1] : trimmed;
          if (fileId && fileId.length >= 10) {
            parsedDirectFiles.push({
              file_id: fileId,
              filename: `FOTO_${String(index + 1).padStart(3, "0")}.JPG`,
            });
          }
        }
      });
    }

    try {
      const token = localStorage.getItem("picura_token");
      const res = await fetch("/api/v1/galleries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          drive_folder_url: driveFolderUrl,
          max_selection_quota: Number(maxQuota) || 20,
          password: usePassword ? password : null,
          editor_whatsapp: editorWhatsapp,
          expires_at: expiresAt ? expiresAt : null,
          direct_files: parsedDirectFiles.length > 0 ? parsedDirectFiles : undefined,
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa]">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#272835]">
              Buat Galeri Seleksi Baru
            </h3>
            <p className="text-xs text-[#666d80] mt-0.5">
              Hubungkan folder Google Drive foto klien Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#eceff3] transition"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] flex items-center gap-2">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Judul Sesi / Nama Klien *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Wedding Radit & Vanya"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Link Folder Google Drive *
            </label>
            <div className="relative">
              <IconFolder className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="url"
                required
                placeholder="https://drive.google.com/drive/folders/1ABC...xyz"
                value={driveFolderUrl}
                onChange={(e) => setDriveFolderUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
            <p className="text-[11px] text-[#818898] mt-1">
              Pastikan akses folder diatur ke &ldquo;Anyone with the link can view&rdquo;.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Atau Tempel File ID / Link Foto Langsung (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Pisahkan dengan baris baru atau koma..."
              value={directLinks}
              onChange={(e) => setDirectLinks(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] font-mono text-[11px] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#36394a] mb-1">
                Batas Foto Dipilih (Kuota)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={maxQuota}
                onChange={(e) => setMaxQuota(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] font-mono focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#36394a] mb-1">
                WhatsApp Editor / Studio
              </label>
              <div className="relative">
                <IconPhone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  placeholder="081234567890"
                  value={editorWhatsapp}
                  onChange={(e) => setEditorWhatsapp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Batas Waktu Akses (Opsional)
            </label>
            <div className="relative">
              <IconClock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
          </div>

          {/* Password Lock Section */}
          <div className="pt-2 border-t border-[#cdd2d9]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[#36394a] flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={(e) => setUsePassword(e.target.checked)}
                  className="rounded text-[#5e4cff] focus:ring-[#5e4cff]"
                />
                <span>Kunci Galeri dengan Kata Sandi</span>
              </label>
              <IconLock className="w-4 h-4 text-[#818898]" />
            </div>

            {usePassword && (
              <input
                type="text"
                placeholder="Buat PIN / Kata sandi klien"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <IconSpinner className="w-4 h-4 text-white" />
                <span>Memproses & Menghubungkan Drive...</span>
              </>
            ) : (
              <>
                <IconPlus className="w-4 h-4" />
                <span>Simpan &amp; Buat Galeri</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
