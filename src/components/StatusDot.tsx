import React from "react";

export type StatusType = "completed" | "waiting" | "active" | "neutral" | "selesai" | "menunggu";

interface StatusDotProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusDot({ status, label, className = "" }: StatusDotProps) {
  const isCompleted = status === "completed" || status === "selesai";
  const isWaiting = status === "waiting" || status === "menunggu";

  // Dot color: Green ONLY for "Selesai dipilih", amber for "Menunggu klien", slate for neutral
  const dotColor = isCompleted
    ? "bg-[#10b981]"
    : isWaiting
    ? "bg-[#f59e0b]"
    : "bg-[#64748b]";

  const defaultLabel = isCompleted
    ? "Selesai dipilih"
    : isWaiting
    ? "Menunggu klien"
    : "Aktif";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-[#525866] dark:text-slate-300 select-none ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="font-normal">{label || defaultLabel}</span>
    </span>
  );
}

export default StatusDot;
