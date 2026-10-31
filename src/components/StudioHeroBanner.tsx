"use client";

import { IconPlus, IconSettings, IconFolder, IconWhatsApp, IconKey, IconCrown } from "@/components/Icons";

interface StudioHeroBannerProps {
  user: {
    name: string;
    studioName?: string | null;
    studioWhatsapp?: string | null;
    hasGoogleApiKey?: boolean;
    subscriptionTier: string;
  } | null;
  stats: {
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
    totalPhotos?: number;
  } | null;
  onCreateClick: () => void;
  onSettingsClick: () => void;
  onUpgradeClick?: () => void;
}

export default function StudioHeroBanner({
  user,
  stats,
  onCreateClick,
  onSettingsClick,
  onUpgradeClick,
}: StudioHeroBannerProps) {
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";
  const quota = stats?.quotaLimit === 999 ? "Unlimited" : `${stats?.quotaLimit || 2} Galeri`;

  return (
    <div className="bg-white rounded-[12px] p-6 sm:p-7 border border-[#cdd2d9] relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Studio Profile & Quick Info */}
        <div className="space-y-4 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] ${
                isPro ? "bg-[#dfdbff] text-[#5e4cff] border border-[#beb5ff]" : "bg-[#f6f8fa] text-[#5c6470] border border-[#cdd2d9]"
              }`}
            >
              {user?.subscriptionTier || "FREEMIUM"}
            </span>

            {!isPro && onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff] hover:bg-[#c8ccf3] transition flex items-center gap-1 border border-[#beb5ff]"
              >
                <IconCrown className="w-3 h-3" />
                <span>Upgrade ke Pro (Rp 49rb)</span>
              </button>
            )}

            {user?.hasGoogleApiKey ? (
              <span className="text-[10px] font-mono text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                <IconKey className="w-3 h-3" />
                <span>Custom API Key Aktif</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#818898] bg-[#f6f8fa] border border-[#cdd2d9] px-2 py-0.5 rounded-[4px]">
                Google Drive Shared CDN
              </span>
            )}
          </div>

          <div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
              {user?.studioName || user?.name || "Studio Fotografi"}
            </h2>
            <p className="text-xs text-[#666d80] mt-1 leading-relaxed">
              Hubungkan folder Google Drive foto klien Anda, bagikan link seleksi instan, dan terima daftar file pilihan langsung via WhatsApp tanpa salah ketik.
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#818898] font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <IconFolder className="w-3.5 h-3.5 text-[#5e4cff]" />
              <strong className="text-[#272835]">{stats?.activeGalleries || 0}</strong> Galeri Aktif (Kuota: {quota})
            </span>
            {user?.studioWhatsapp && (
              <span className="flex items-center gap-1.5">
                <IconWhatsApp className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-[#36394a]">WA: {user.studioWhatsapp}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={onCreateClick}
            className="px-5 py-2.5 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <IconPlus className="w-4 h-4" />
            <span>Buat Galeri Klien Baru</span>
          </button>

          {!isPro && onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="px-5 py-2.5 rounded-[8px] border border-[#beb5ff] bg-[#dfdbff]/40 text-[#5e4cff] text-xs font-semibold hover:bg-[#dfdbff] transition flex items-center justify-center gap-2"
            >
              <IconCrown className="w-4 h-4" />
              <span>Tingkatkan ke Pro (Unlimited)</span>
            </button>
          )}

          <button
            onClick={onSettingsClick}
            className="px-5 py-2.5 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] text-xs font-medium hover:bg-[#f6f8fa] transition flex items-center justify-center gap-2"
          >
            <IconSettings className="w-4 h-4 text-[#818898]" />
            <span>Pengaturan Studio & API</span>
          </button>
        </div>
      </div>
    </div>
  );
}
