"use client";

import { CheckCircle2, MessageCircle, FolderSync } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "selection" | "whatsapp" | "sync";
  title: string;
  client: string;
  time: string;
  value: string;
  statusColor: "emerald" | "blue" | "amber";
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "selection",
    title: "Seleksi 20 Foto Diterima",
    client: "Radit & Vanya (Wedding)",
    time: "10 menit yang lalu",
    value: "20 / 20 Selected",
    statusColor: "emerald",
  },
  {
    id: "act-2",
    type: "whatsapp",
    title: "Deep Link WhatsApp Terkirim ke Editor",
    client: "Sarah UI 2026 (Graduation)",
    time: "42 menit yang lalu",
    value: "wa.me/6289876543210",
    statusColor: "blue",
  },
  {
    id: "act-3",
    type: "sync",
    title: "Sinkronisasi Metadata Google Drive",
    client: "Prewedding Studio Bromo",
    time: "2 jam yang lalu",
    value: "48 Photos Cached",
    statusColor: "amber",
  },
];

export default function RecentActivity() {
  const getIcon = (type: string, _color: string) => {
    switch (type) {
      case "selection":
        return <CheckCircle2 className="w-5 h-5 text-accent-emerald" />;
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-accent-blue" />;
      case "sync":
      default:
        return <FolderSync className="w-5 h-5 text-accent-amber" />;
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-6 border border-white/12 space-y-5 animate-fade-up">
      {/* Header with 'View all' link */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Aktivitas Sesi & Transaksi Terkini
          </h3>
          <p className="text-xs text-slate-400">
            Log interaksi klien, pengiriman WhatsApp, dan pemrosesan Drive
          </p>
        </div>
        <button className="text-xs font-mono font-medium text-slate-400 hover:text-white transition">
          Lihat Semua &rarr;
        </button>
      </div>

      {/* Vertical list of rows with hover states 'background: rgba(255,255,255,0.025)' */}
      <div className="divide-y divide-white/[0.06]">
        {SAMPLE_ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="py-3.5 px-3 rounded-2xl flex items-center justify-between transition-colors hover:bg-white/[0.025] group"
          >
            <div className="flex items-center gap-3.5">
              {/* 40px rounded-xl glass box for icon */}
              <div
                className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 border ${
                  act.statusColor === "emerald"
                    ? "bg-accent-emerald/10 border-accent-emerald/20"
                    : act.statusColor === "blue"
                    ? "bg-accent-blue/10 border-accent-blue/20"
                    : "bg-accent-amber/10 border-accent-amber/20"
                }`}
              >
                {getIcon(act.type, act.statusColor)}
              </div>

              <div>
                <span className="text-sm font-semibold text-white block group-hover:text-slate-100 transition">
                  {act.title}
                </span>
                <span className="text-xs text-slate-400">
                  {act.client} • <span className="text-slate-500">{act.time}</span>
                </span>
              </div>
            </div>

            {/* Right-aligned monospaced currency / metric values (JetBrains Mono) */}
            <div className="text-right">
              <span className="font-mono text-xs font-semibold text-white block">
                {act.value}
              </span>
              <span className="text-[10px] font-mono text-accent-emerald font-medium">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
