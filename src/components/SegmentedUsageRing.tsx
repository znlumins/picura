"use client";

interface SegmentedUsageRingProps {
  size?: number;
}

export default function SegmentedUsageRing({ size = 128 }: SegmentedUsageRingProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90 transform"
      >
        {/* Background Track */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#eceff3"
          strokeWidth="14"
          fill="none"
        />

        {/* Segment 1: Volt Violet (#5e4cff) */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#5e4cff"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="120 169"
          strokeDashoffset="0"
        />

        {/* Segment 2: Lavender (#c8ccf3) */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#c8ccf3"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="60 229"
          strokeDashoffset="-135"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-heading font-semibold text-lg text-[#272835]">88%</span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-[#818898]">
          Kapasitas
        </span>
      </div>
    </div>
  );
}
