"use client";

import { IconFolder, IconWhatsApp, IconKey, IconCrown } from "@/components/Icons";

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
  onUpgradeClick?: () => void;
}

export default function StudioHeroBanner({
  user,
  stats,
  onUpgradeClick,
}: StudioHeroBannerProps) {
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";
  const quota = stats?.quotaLimit === 999 || isPro ? "Unlimited" : `${stats?.quotaLimit || 2} Galeri`;

  const tierBadgeText =
    user?.subscriptionTier === "PRO_FREELANCE"
      ? "Pro Freelance"
      : user?.subscriptionTier === "STUDIO"
      ? "Studio Agency"
      : "Paket Free";

  return (
    <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#cdd2d9] relative overflow-hidden shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Studio Profile & Badges */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-[4px] ${
                isPro
                  ? "bg-[#dfdbff] text-[#5e4cff] border border-[#beb5ff]"
                  : "bg-[#f6f8fa] text-[#666d80] border border-[#cdd2d9]"
              }`}
            >
              {tierBadgeText}
            </span>

            {user?.hasGoogleApiKey ? (
              <span className="text-[11px] text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-[4px] flex items-center gap-1">
                <IconKey className="w-3 h-3" />
                <span>Custom API Key Aktif</span>
              </span>
            ) : (
              <span className="text-[11px] text-[#666d80] bg-[#f6f8fa] border border-[#cdd2d9] px-2.5 py-0.5 rounded-[4px]">
                Google Drive Shared CDN
              </span>
            )}

            {!isPro && onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff] hover:bg-[#c8ccf3] transition flex items-center gap-1 border border-[#beb5ff]"
              >
                <IconCrown className="w-3 h-3" />
                <span>Upgrade Pro</span>
              </button>
            )}
          </div>

          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
            {user?.studioName || user?.name || "Studio Fotografi"}
          </h2>
        </div>

        {/* Right: Quick Metadata (No duplicate CTA buttons) */}
        <div className="flex flex-wrap items-center sm:justify-end gap-4 sm:gap-6 text-xs text-[#818898] border-t sm:border-t-0 pt-3 sm:pt-0 border-[#eceff3]">
          <span className="flex items-center gap-1.5">
            <IconFolder className="w-3.5 h-3.5 text-[#5e4cff]" />
            <span>
              <strong className="text-[#272835] font-semibold">{stats?.activeGalleries || 0}</strong> Galeri (Kuota: {quota})
            </span>
          </span>

          {user?.studioWhatsapp && (
            <span className="flex items-center gap-1.5">
              <IconWhatsApp className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[#36394a]">WA: {user.studioWhatsapp}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
