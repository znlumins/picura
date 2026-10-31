"use client";

import { IconWhatsApp, IconKey, IconCrown, IconSettings } from "@/components/Icons";

interface StudioHeroBannerProps {
  user: {
    name: string;
    studioName?: string | null;
    studioWhatsapp?: string | null;
    hasGoogleApiKey?: boolean;
    subscriptionTier: string;
  } | null;
  stats?: {
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
    totalPhotos?: number;
  } | null;
  onUpgradeClick?: () => void;
  onSettingsClick?: () => void;
}

export default function StudioHeroBanner({
  user,
  stats,
  onUpgradeClick,
  onSettingsClick,
}: StudioHeroBannerProps) {
  return (
    <div className="bg-white rounded-[12px] p-5 sm:p-6 border border-[#cdd2d9] relative overflow-hidden shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Studio Profile & Badges */}
        <div className="space-y-1">
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
            Ikhtisar Studio
          </h2>
          <p className="text-xs text-[#818898]">
            Kelola tautan galeri, pantau kurasi foto klien, dan kelola alur kerja seleksi.
          </p>
        </div>

        {/* Right: Studio WhatsApp & Edit Info Studio Button (No redundant quota text) */}
        <div className="flex flex-wrap items-center sm:justify-end gap-3 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-[#eceff3]">
          {user?.studioWhatsapp && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#f6f8fa] border border-[#cdd2d9] text-[#272835] text-[11px] font-mono">
              <IconWhatsApp className="w-3.5 h-3.5 text-[#10b981]" />
              <span>WA: {user.studioWhatsapp}</span>
            </span>
          )}

          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="py-1 px-2.5 rounded-[6px] border border-[#cdd2d9] bg-white hover:bg-[#f6f8fa] text-[11px] font-medium text-[#666d80] hover:text-[#272835] transition flex items-center gap-1.5 shadow-xs"
            >
              <IconSettings className="w-3.5 h-3.5 text-[#818898]" />
              <span>Edit Info Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
