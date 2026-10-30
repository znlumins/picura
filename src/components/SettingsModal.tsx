"use client";

import { useState, useEffect } from "react";
import {
  IconClose,
  IconKey,
  IconBuilding,
  IconPhone,
  IconSave,
  IconSpinner,
  IconCheck,
  IconAlert,
  IconExternalLink,
} from "@/components/Icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    studioName?: string | null;
    studioWhatsapp?: string | null;
    hasGoogleApiKey?: boolean;
  } | null;
  onSuccess: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: SettingsModalProps) {
  const [studioName, setStudioName] = useState(user?.studioName || "");
  const [studioWhatsapp, setStudioWhatsapp] = useState(user?.studioWhatsapp || "");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setStudioName(user.studioName || "");
      setStudioWhatsapp(user.studioWhatsapp || "");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("picura_token");
      const res = await fetch("/api/v1/auth/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          studio_name: studioName,
          studio_whatsapp: studioWhatsapp,
          google_api_key: googleApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan pengaturan");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa]">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#272835]">
              Pengaturan Studio & Integrasi API
            </h3>
            <p className="text-xs text-[#666d80] mt-0.5">
              Kelola nama studio, kontak WhatsApp, dan Google Drive API Key Anda
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

          {isSuccess && (
            <div className="p-3 rounded-[8px] bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] flex items-center gap-2">
              <IconCheck className="w-4 h-4 text-[#10b981]" />
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Nama Studio Foto
            </label>
            <div className="relative">
              <IconBuilding className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Contoh: Timeless Wedding Photography"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Nomor WhatsApp Studio
            </label>
            <div className="relative">
              <IconPhone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="text"
                value={studioWhatsapp}
                onChange={(e) => setStudioWhatsapp(e.target.value)}
                placeholder="Contoh: 6281234567890"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#cdd2d9]">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#36394a]">
                Google Drive API Key (Opsional)
              </label>
              {user?.hasGoogleApiKey && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
                  Terkonfigurasi
                </span>
              )}
            </div>
            <div className="relative">
              <IconKey className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder={user?.hasGoogleApiKey ? "•••••••••••••••••••• (Tersimpan)" : "AIzaSy..."}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
            <p className="text-[11px] text-[#666d80] mt-1.5 leading-relaxed">
              Jika diisi, Picura akan menggunakan kuota Google Cloud Anda sendiri untuk mengunduh daftar file dari folder Google Drive publik secara otomatis.
            </p>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#5e4cff] hover:underline mt-1 font-medium"
            >
              <span>Cara buat Google API Key gratis di Google Console</span>
              <IconExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <IconSpinner className="w-4 h-4 text-white" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <IconSave className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
