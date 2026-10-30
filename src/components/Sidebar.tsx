"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderSync,
  Clock,
  Sparkles,
  CreditCard,
  Crown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    subscriptionTier: string;
  } | null;
  stats?: {
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
  } | null;
  onUpgradeClick: () => void;
}

export default function Sidebar({ user, stats, onUpgradeClick }: SidebarProps) {
  const pathname = usePathname();
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Galeri Wedding", href: "/g/wedding-radit-vanya", icon: FolderSync, external: true },
    { label: "Galeri Wisuda", href: "/g/graduation-sarah-ui-2026", icon: Clock, external: true },
    { label: "Beranda Utama", href: "/", icon: Sparkles },
  ];

  return (
    <aside className="w-[280px] shrink-0 h-screen sticky top-0 hidden lg:flex flex-col justify-between p-5 border-r border-white/10 glass-soft z-20 select-none">
      <div className="space-y-7">
        {/* Top Logo Area: 44px square white box with black character P */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-[44px] h-[44px] rounded-xl bg-white flex items-center justify-center text-[#050505] font-heading font-black text-2xl shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-105">
            P
          </div>
          <div>
            <div className="font-heading font-bold text-lg text-white tracking-tight flex items-center gap-2">
              Picura
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Refined Glass Platform</p>
          </div>
        </Link>

        {/* Navigation Section */}
        <nav className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 font-semibold">
            Menu Navigasi
          </span>
          <div className="pt-1 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                    isActive
                      ? "text-white bg-white/10 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[17px] h-[17px] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.external ? (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_8px_#3B82F6]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Floating Wallet / Subscription Tier Card with Float Animation */}
      <div className="animate-float">
        <div className="glass p-4 rounded-2xl relative overflow-hidden border border-white/15">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-heading font-semibold text-white">
                Tier Langganan
              </span>
            </div>
            <span
              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                isPro
                  ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
                  : "bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {user?.subscriptionTier || "FREEMIUM"}
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Kuota Galeri Aktif:</span>
              <span className="font-mono text-white font-bold">
                {stats?.activeGalleries || 0} / {isPro ? "∞" : stats?.quotaLimit || 2}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isPro ? "bg-accent-blue" : "bg-accent-rose"
                }`}
                style={{
                  width: isPro
                    ? "100%"
                    : `${Math.min(100, ((stats?.activeGalleries || 0) / (stats?.quotaLimit || 2)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {!isPro ? (
            <button
              onClick={onUpgradeClick}
              className="w-full py-2 px-3 rounded-xl bg-white text-[#050505] text-xs font-heading font-bold shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Upgrade ke Pro</span>
              <ChevronRight className="w-3 h-3 ml-auto text-slate-500" />
            </button>
          ) : (
            <div className="text-[11px] font-mono text-accent-emerald flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
              <span>Akun Premium Aktif</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
