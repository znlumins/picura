"use client";

import { useState, useEffect } from "react";
import {
  IconSettings,
  IconBuilding,
  IconPhone,
  IconKey,
  IconCheck,
  IconAlert,
  IconSpinner,
  IconArrowRight,
  IconFolder,
  IconLogOut,
} from "@/components/Icons";

interface StudioSettingsViewProps {
  user: {
    id?: string;
    name: string;
    email: string;
    studioName?: string | null;
    studioWhatsapp?: string | null;
    hasGoogleApiKey?: boolean;
    subscriptionTier: string;
  } | null;
  onSuccess: () => void;
  onBack: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
}

export default function StudioSettingsView({
  user,
  onSuccess,
  onBack,
  onLogout,
  isDarkMode = false,
}: StudioSettingsViewProps) {
  const [studioName, setStudioName] = useState(user?.studioName || "");
  const [studioWhatsapp, setStudioWhatsapp] = useState(user?.studioWhatsapp || "");
  const [useCustomApiKey, setUseCustomApiKey] = useState(Boolean(user?.hasGoogleApiKey));
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      setStudioName(user.studioName || "");
      setStudioWhatsapp(user.studioWhatsapp || "");
      setUseCustomApiKey(Boolean(user.hasGoogleApiKey));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;
      const res = await fetch("/api/v1/auth/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          studio_name: studioName,
          studio_whatsapp: studioWhatsapp,
          google_api_key: useCustomApiKey ? googleApiKey : "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan pengaturan studio");
      }

      setSaveSuccess(true);
      onSuccess();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#eceff3] dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
              <IconSettings className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#818898]">
              Konfigurasi Studio
            </span>
          </div>
          <h2 className={`font-heading font-semibold text-2xl tracking-tight ${
            isDarkMode ? "text-white" : "text-[#272835]"
          }`}>
            Pengaturan Studio &amp; Integrasi API
          </h2>
          <p className="text-xs text-[#818898] mt-0.5">
            Kelola profil studio, nomor WhatsApp penerimaan pesanan, dan koneksi Google Drive CDN.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className={`py-1.5 px-3 rounded-[8px] border text-xs font-medium transition self-start sm:self-auto flex items-center gap-1.5 ${
            isDarkMode
              ? "border-[#2e334a] bg-[#1a1d2d] text-slate-300 hover:bg-[#25283a]"
              : "border-[#cdd2d9] bg-white text-[#36394a] hover:bg-[#f6f8fa]"
          }`}
        >
          <span>&larr; Kembali ke Dashboard</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-[8px] bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs flex items-center gap-2.5 shadow-xs">
          <IconCheck className="w-4 h-4 text-[#10b981] shrink-0" />
          <span>Pengaturan studio berhasil disimpan dan langsung diperbarui di dashboard!</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2.5">
          <IconAlert className="w-4 h-4 text-[#ef4444] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className={`rounded-[12px] p-6 border space-y-6 shadow-xs ${
          isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
        }`}
      >
        {/* Section 1: Profil Studio */}
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-[#272835]"
          }`}>
            <IconBuilding className="w-4 h-4 text-[#5e4cff]" />
            <span>Identitas Studio &amp; Kontak WhatsApp</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#818898] mb-1.5">
                Nama Studio / Brand Fotografi *
              </label>
              <input
                type="text"
                required
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Contoh: Lumina Studio Jakarta"
                className={`w-full px-3.5 py-2 rounded-[8px] border text-xs transition focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] ${
                  isDarkMode
                    ? "bg-[#1a1d2d] border-[#2e334a] text-white placeholder-slate-500"
                    : "bg-white border-[#cdd2d9] text-[#272835] placeholder-[#a4abb8]"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#818898] mb-1.5">
                Nomor WhatsApp Studio (Penerimaan Seleksi) *
              </label>
              <div className="relative">
                <IconPhone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="tel"
                  required
                  value={studioWhatsapp}
                  onChange={(e) => setStudioWhatsapp(e.target.value)}
                  placeholder="08123456789 atau 628123456789"
                  className={`w-full pl-9 pr-3.5 py-2 rounded-[8px] border text-xs transition focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] ${
                    isDarkMode
                      ? "bg-[#1a1d2d] border-[#2e334a] text-white placeholder-slate-500"
                      : "bg-white border-[#cdd2d9] text-[#272835] placeholder-[#a4abb8]"
                  }`}
                />
              </div>
              <p className="text-[11px] text-[#818898] mt-1">
                Format pesan seleksi foto klien akan diteruskan otomatis ke nomor ini.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Koneksi Google Drive CDN */}
        <div className="space-y-4 pt-4 border-t border-[#eceff3] dark:border-slate-800">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${
            isDarkMode ? "text-white" : "text-[#272835]"
          }`}>
            <IconFolder className="w-4 h-4 text-[#5e4cff]" />
            <span>Koneksi Google Drive CDN</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1: Shared CDN (Default) */}
            <div
              onClick={() => setUseCustomApiKey(false)}
              className={`p-4 rounded-[10px] border cursor-pointer transition space-y-1.5 ${
                !useCustomApiKey
                  ? "border-[#5e4cff] bg-[#5e4cff]/5 ring-1 ring-[#5e4cff]"
                  : isDarkMode
                  ? "border-[#25283a] bg-[#1a1d2d] hover:border-slate-600"
                  : "border-[#cdd2d9] bg-[#f6f8fa] hover:border-[#818898]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-[#272835]"}`}>
                  Google Drive Shared CDN
                </span>
                {!useCustomApiKey && (
                  <span className="w-4 h-4 rounded-full bg-[#5e4cff] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#818898] leading-relaxed">
                Bawaan sistem Picura. Cukup pastikan folder Google Drive publik (&ldquo;Anyone with the link can view&rdquo;) tanpa repot setting API.
              </p>
            </div>

            {/* Option 2: Custom API Key */}
            <div
              onClick={() => setUseCustomApiKey(true)}
              className={`p-4 rounded-[10px] border cursor-pointer transition space-y-1.5 ${
                useCustomApiKey
                  ? "border-[#5e4cff] bg-[#5e4cff]/5 ring-1 ring-[#5e4cff]"
                  : isDarkMode
                  ? "border-[#25283a] bg-[#1a1d2d] hover:border-slate-600"
                  : "border-[#cdd2d9] bg-[#f6f8fa] hover:border-[#818898]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-[#272835]"}`}>
                  Custom Google Cloud API Key
                </span>
                {useCustomApiKey && (
                  <span className="w-4 h-4 rounded-full bg-[#5e4cff] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#818898] leading-relaxed">
                Gunakan Google Drive API Key dari project Google Cloud pribadi Anda untuk kuota request mandiri berkecepatan tinggi.
              </p>
            </div>
          </div>

          {useCustomApiKey && (
            <div className="pt-2 animate-in fade-in duration-150">
              <label className="block text-xs font-medium text-[#818898] mb-1.5">
                Google Drive API Key Pribadi *
              </label>
              <div className="relative">
                <IconKey className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  required={useCustomApiKey}
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className={`w-full pl-9 pr-3.5 py-2 rounded-[8px] border text-xs font-mono transition focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] ${
                    isDarkMode
                      ? "bg-[#1a1d2d] border-[#2e334a] text-white placeholder-slate-500"
                      : "bg-white border-[#cdd2d9] text-[#272835] placeholder-[#a4abb8]"
                  }`}
                />
              </div>
              <p className="text-[11px] text-[#818898] mt-1">
                Dapatkan API Key gratis di Google Cloud Console &rarr; Enable Google Drive API.
              </p>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#eceff3] dark:border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className={`text-xs font-medium transition ${
              isDarkMode ? "text-slate-400 hover:text-white" : "text-[#666d80] hover:text-[#272835]"
            }`}
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-5 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs font-medium transition flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <IconSpinner className="w-4 h-4 text-white" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <span>Simpan Perubahan</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Sesi Akun Studio & Keluar */}
      {user && (
        <div
          className={`p-5 rounded-[12px] border space-y-3 ${
            isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-sm font-heading font-semibold ${isDarkMode ? "text-white" : "text-[#272835]"}`}>
                Sesi Akun Studio
              </h3>
              <p className="text-xs text-[#818898] mt-0.5">
                Saat ini masuk sebagai <strong className={isDarkMode ? "text-slate-200" : "text-[#272835]"}>{user.name}</strong> ({user.studioName || user.email}).
              </p>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="py-2 px-4 rounded-[8px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white text-xs font-medium transition flex items-center gap-2 shadow-xs shrink-0 active:scale-95"
              >
                <IconLogOut className="w-3.5 h-3.5" />
                <span>Keluar dari Akun</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-[12px] max-w-sm w-full p-5 shadow-2xl border space-y-4 animate-in fade-in duration-150 ${
              isDarkMode ? "bg-[#141624] border-[#2e334a] text-white" : "bg-white border-[#cdd2d9] text-[#272835]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center shrink-0">
                <IconAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm">Konfirmasi Keluar</h4>
                <p className="text-xs text-[#818898] mt-0.5">
                  Apakah Anda yakin ingin keluar dari akun studio ini?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eceff3] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className={`py-1.5 px-3 rounded-[8px] border text-xs font-medium transition ${
                  isDarkMode
                    ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                    : "border-[#cdd2d9] hover:bg-[#f6f8fa] text-[#666d80]"
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="py-1.5 px-3.5 rounded-[8px] bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-medium transition shadow-xs"
              >
                Ya, Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
