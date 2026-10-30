"use client";

import { Flame, Activity, CheckCircle2 } from "lucide-react";

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
      {/* Card 1: Rose Accent for Quota / Spending */}
      <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border border-white/10 hover:border-accent-rose/30 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Konsumsi Kuota
            </span>
            <div className="p-2 rounded-xl bg-accent-rose/15 text-accent-rose border border-accent-rose/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-white">
            {quotaUsed} <span className="text-sm font-normal text-slate-400">/ {quotaLimit} Galeri</span>
          </div>
          <span className="text-[11px] text-accent-rose font-mono mt-1 block">
            {quotaUsed >= quotaLimit ? "Batas Paket Tercapai" : "Kuota Tersedia"}
          </span>
        </div>

        {/* Small SVG area chart (h-14) at the bottom */}
        <div className="h-14 w-full mt-3">
          <svg viewBox="0 0 200 50" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 45 C 30 35, 60 40, 90 25 C 120 15, 150 30, 200 10 L 200 50 L 0 50 Z"
              fill="url(#roseGradient)"
            />
            <path
              d="M 0 45 C 30 35, 60 40, 90 25 C 120 15, 150 30, 200 10"
              stroke="#F43F5E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Blue Accent for API Usage / Drive Operations */}
      <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border border-white/10 hover:border-accent-blue/30 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Drive API Traffic
            </span>
            <div className="p-2 rounded-xl bg-accent-blue/15 text-accent-blue border border-accent-blue/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-white">
            {driveRequests.toLocaleString()} <span className="text-sm font-normal text-slate-400">Syncs</span>
          </div>
          <span className="text-[11px] text-accent-blue font-mono mt-1 block">
            Latency &lt; 50ms via Caching
          </span>
        </div>

        {/* Small SVG area chart (h-14) at the bottom */}
        <div className="h-14 w-full mt-3">
          <svg viewBox="0 0 200 50" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 40 C 40 45, 70 20, 110 30 C 150 15, 170 22, 200 8 L 200 50 L 0 50 Z"
              fill="url(#blueGradient)"
            />
            <path
              d="M 0 40 C 40 45, 70 20, 110 30 C 150 15, 170 22, 200 8"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: Emerald Accent for Savings / Completed Selections */}
      <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border border-white/10 hover:border-accent-emerald/30 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Efisiensi Seleksi
            </span>
            <div className="p-2 rounded-xl bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-bold text-2xl text-white">
            {selectionsSaved} <span className="text-sm font-normal text-slate-400">Sesi Hemat 50%+</span>
          </div>
          <span className="text-[11px] text-accent-emerald font-mono mt-1 block">
            Zero File Typo ke WhatsApp
          </span>
        </div>

        {/* Small SVG area chart (h-14) at the bottom */}
        <div className="h-14 w-full mt-3">
          <svg viewBox="0 0 200 50" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 42 C 40 38, 80 44, 120 18 C 160 25, 180 12, 200 5 L 200 50 L 0 50 Z"
              fill="url(#emeraldGradient)"
            />
            <path
              d="M 0 42 C 40 38, 80 44, 120 18 C 160 25, 180 12, 200 5"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
