"use client";

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
  const isUnlimited = quotaLimit === 999;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Real Galleries & Quota */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Galeri Aktif
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {activeGalleries}
          </span>
          <span className="text-xs text-[#818898] font-mono">
            / {isUnlimited ? "∞" : quotaLimit} sesi
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Batas Paket {tier}</span>
          <span
            className={`font-mono font-medium ${
              !isUnlimited && activeGalleries >= quotaLimit ? "text-[#e11d48]" : "text-[#5e4cff]"
            }`}
          >
            {!isUnlimited && activeGalleries >= quotaLimit ? "Kuota Penuh" : "Tersedia"}
          </span>
        </div>
      </div>

      {/* Metric 2: Real Total Photos Cached from Google Drive */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Total Foto Terhubung
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {totalPhotos}
          </span>
          <span className="text-xs text-[#818898] font-mono">file drive</span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Penyimpanan Gambar</span>
          <span className="font-mono font-medium text-[#10b981]">Direct Google CDN</span>
        </div>
      </div>

      {/* Metric 3: Real Client Selections Submitted */}
      <div className="bg-white rounded-[12px] p-5 border border-[#cdd2d9]">
        <div className="text-xs font-mono uppercase tracking-wider text-[#818898] font-medium">
          Seleksi Klien Diterima
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-semibold text-3xl text-[#272835]">
            {totalSelections}
          </span>
          <span className="text-xs text-[#818898] font-mono">sesi selesai</span>
        </div>
        <div className="mt-3 pt-3 border-t border-[#eceff3] flex items-center justify-between text-xs">
          <span className="text-[#666d80]">Output Pemilihan</span>
          <span className="font-mono font-medium text-[#5e4cff]">WhatsApp Format</span>
        </div>
      </div>
    </div>
  );
}
