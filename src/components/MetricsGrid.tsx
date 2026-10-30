"use client";

interface MetricsGridProps {
  quotaUsed?: number;
  quotaLimit?: number;
  driveRequests?: number;
  selectionsSaved?: number;
}

export default function MetricsGrid({
  quotaUsed = 2,
  quotaLimit = 2,
  driveRequests = 1240,
  selectionsSaved = 14,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Quota */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Penggunaan Galeri
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {quotaUsed}
          </span>
          <span className="text-xs text-[#818898] font-mono">/ {quotaLimit === 9999 ? "∞" : quotaLimit} aktif</span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Status Kuota</span>
          <span className={`font-mono font-medium ${quotaUsed >= quotaLimit ? "text-[#e11d48]" : "text-[#5e4cff]"}`}>
            {quotaUsed >= quotaLimit ? "Batas Tercapai" : "Tersedia"}
          </span>
        </div>
      </div>

      {/* Metric 2: Sync Traffic */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Drive API Sync
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {driveRequests.toLocaleString()}
          </span>
          <span className="text-xs text-[#818898] font-mono">requests</span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Google CDN Cache</span>
          <span className="font-mono font-medium text-[#10b981]">Aktif (Fast)</span>
        </div>
      </div>

      {/* Metric 3: Selections Completed */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Sesi Seleksi Selesai
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {selectionsSaved}
          </span>
          <span className="text-xs text-[#818898] font-mono">klien</span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Format Pesan</span>
          <span className="font-mono font-medium text-[#5e4cff]">Direct WhatsApp</span>
        </div>
      </div>
    </div>
  );
}
