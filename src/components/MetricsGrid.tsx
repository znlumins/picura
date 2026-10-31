"use client";

import { IconWhatsApp } from "@/components/Icons";

interface MetricsGridProps {
  activeGalleries: number;
  quotaLimit: number;
  totalPhotos: number;
  totalSelections: number;
  tier: string;
}

export default function MetricsGrid({
  activeGalleries = 0,
  quotaLimit = 2,
  totalPhotos = 0,
  totalSelections = 0,
  tier = "FREEMIUM",
}: MetricsGridProps) {
  const isUnlimited = quotaLimit === 999 || tier === "PRO_FREELANCE" || tier === "STUDIO";
  const tierName =
    tier === "PRO_FREELANCE" ? "Pro Freelance" : tier === "STUDIO" ? "Studio Agency" : "Free";

  const isFull = !isUnlimited && activeGalleries >= quotaLimit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Real Galleries & Quota */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9] shadow-xs flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#818898] font-medium">
            Galeri Aktif
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading font-semibold text-3xl text-[#272835]">
              {activeGalleries}
            </span>
            <span className="text-xs text-[#818898]">
              / {isUnlimited ? "∞" : quotaLimit} sesi aktif
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Batas Kuota</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${
              isFull
                ? "bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48]"
                : "bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isFull ? "bg-[#f43f5e]" : "bg-[#10b981]"}`}
            />
            <span>{isFull ? "Penuh" : isUnlimited ? "Tanpa Batas" : "Tersedia"}</span>
          </span>
        </div>
      </div>

      {/* Metric 2: Real Total Photos Cached from Google Drive */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9] shadow-xs flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#818898] font-medium">
            Total Foto Terhubung
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading font-semibold text-3xl text-[#272835]">
              {totalPhotos}
            </span>
            <span className="text-xs text-[#818898]">file foto</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Penyimpanan Gambar</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-[11px] font-medium">
            <span>Direct Google CDN</span>
          </span>
        </div>
      </div>

      {/* Metric 3: Real Client Selections Submitted */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9] shadow-xs flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#818898] font-medium">
            Seleksi Klien Diterima
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading font-semibold text-3xl text-[#272835]">
              {totalSelections}
            </span>
            <span className="text-xs text-[#818898]">sesi selesai</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Output Pemilihan</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#f6f8fa] border border-[#cdd2d9] text-[#4b5563] text-[11px] font-medium">
            <IconWhatsApp className="w-3 h-3 text-[#25D366]" />
            <span>WhatsApp Format</span>
          </span>
        </div>
      </div>
    </div>
  );
}
