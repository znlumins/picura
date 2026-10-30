"use client";

interface HeroBalanceChartProps {
  balanceAmount?: string;
  totalPhotosCount?: number;
  totalSelectionsCount?: number;
  activeRate?: string;
}

export default function HeroBalanceChart({
  balanceAmount = "Rp 1.450.000",
  totalPhotosCount = 48,
  totalSelectionsCount = 14,
  activeRate = "+28.4%",
}: HeroBalanceChartProps) {
  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden animate-fade-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Outfit 48px Balance Display & Stats */}
        <div className="space-y-6 max-w-md">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Total Estimasi Nilai Sesi / Saldo Editor
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 font-bold">
                {activeRate}
              </span>
            </div>
            <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              {balanceAmount}
            </div>
          </div>

          {/* Bottom stats row with 18px semibold figures & 1px top border */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Foto Terkelola
              </span>
              <span className="font-heading font-semibold text-[18px] text-white">
                {totalPhotosCount} Files
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Seleksi Terkonfirmasi
              </span>
              <span className="font-heading font-semibold text-[18px] text-accent-emerald">
                {totalSelectionsCount} Sesi Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Large SVG Area (420px x 130px) with smooth white line chart & shimmer animation */}
        <div className="w-full lg:w-[420px] h-[130px] relative shrink-0">
          <svg
            viewBox="0 0 420 130"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path
              d="M 10 110 C 60 95, 100 120, 150 70 C 200 30, 240 85, 290 40 C 340 10, 380 45, 410 20 L 410 130 L 10 130 Z"
              fill="url(#chartGradient)"
            />

            {/* Smooth White Line Chart with shimmerLine stroke-dash animation */}
            <path
              d="M 10 110 C 60 95, 100 120, 150 70 C 200 30, 240 85, 290 40 C 340 10, 380 45, 410 20"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-shimmer-line"
            />

            {/* Glowing Peak Point */}
            <circle cx="410" cy="20" r="4.5" fill="#FFFFFF" />
            <circle
              cx="410"
              cy="20"
              r="10"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </svg>

          <div className="absolute right-0 bottom-0 text-[10px] font-mono text-slate-500">
            Aktivitas 30 Hari Terakhir
          </div>
        </div>
      </div>
    </div>
  );
}
