"use client";

interface SegmentedUsageRingProps {
  size?: number;
  totalPercent?: number;
}

export default function SegmentedUsageRing({ size = 128 }: SegmentedUsageRingProps) {
  // Segment distribution with visual gaps:
  // Blue: 95, Emerald: 70, Amber: 45, Slate: 40
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
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="16"
          fill="none"
        />

        {/* Segment 1: Blue (#3B82F6) - Google Drive Photo Sync */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#3B82F6"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="80 209"
          strokeDashoffset="0"
          className="transition-all duration-700 hover:opacity-80 cursor-pointer"
        />

        {/* Segment 2: Emerald (#10B981) - Client Selection Completed */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#10B981"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="65 224"
          strokeDashoffset="-92"
          className="transition-all duration-700 hover:opacity-80 cursor-pointer"
        />

        {/* Segment 3: Amber (#F59E0B) - Active Reviews In Progress */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#F59E0B"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="45 244"
          strokeDashoffset="-170"
          className="transition-all duration-700 hover:opacity-80 cursor-pointer"
        />

        {/* Segment 4: Slate (#64748B) - Available Quota Capacity */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="#64748B"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="35 254"
          strokeDashoffset="-230"
          className="transition-all duration-700 hover:opacity-80 cursor-pointer"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-heading font-extrabold text-xl text-white">88%</span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
          Capacity
        </span>
      </div>
    </div>
  );
}
