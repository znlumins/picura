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
    <div className="bg-white rounded-[12px] p-6 sm:p-7 border border-[#cdd2d9] relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side */}
        <div className="space-y-5 max-w-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#818898] font-medium">
                Estimasi Nilai Sesi / Billing Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#dfdbff] text-[#5e4cff] font-medium">
                {activeRate}
              </span>
            </div>
            <div className="font-heading font-semibold text-3xl sm:text-4xl text-[#272835] tracking-tight">
              {balanceAmount}
            </div>
          </div>

          {/* Stats Row */}
          <div className="pt-4 border-t border-[#eceff3] grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#818898] block mb-0.5">
                Foto Terkelola
              </span>
              <span className="font-heading font-semibold text-lg text-[#272835]">
                {totalPhotosCount} Files
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#818898] block mb-0.5">
                Seleksi Selesai
              </span>
              <span className="font-heading font-semibold text-lg text-[#5e4cff]">
                {totalSelectionsCount} Klien
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Line Chart */}
        <div className="w-full lg:w-[400px] h-[120px] relative shrink-0">
          <svg viewBox="0 0 400 120" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="violetChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5e4cff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#5e4cff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 10 100 C 60 85, 100 110, 150 60 C 200 25, 240 75, 290 35 C 340 10, 370 35, 395 15 L 395 120 L 10 120 Z"
              fill="url(#violetChartGradient)"
            />

            <path
              d="M 10 100 C 60 85, 100 110, 150 60 C 200 25, 240 75, 290 35 C 340 10, 370 35, 395 15"
              stroke="#5e4cff"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <circle cx="395" cy="15" r="4" fill="#5e4cff" />
          </svg>

          <div className="absolute right-0 bottom-0 text-[10px] font-mono text-[#818898]">
            Trend 30 Hari
          </div>
        </div>
      </div>
    </div>
  );
}
