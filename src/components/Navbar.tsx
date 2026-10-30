"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, Crown } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    subscriptionTier: string;
  } | null;
  onUpgradeClick?: () => void;
}

export default function Navbar({ user, onUpgradeClick }: NavbarProps) {
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  return (
    <header className="sticky top-0 z-40 glass-soft border-b border-white/10 text-white backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white text-[#050505] flex items-center justify-center font-heading font-black text-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                Picura
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10 uppercase tracking-wider">
                ID
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block -mt-1 font-medium">
              Refined Glass Platform
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isPro && (
                <button
                  onClick={onUpgradeClick}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-heading font-semibold px-3 py-1.5 rounded-xl bg-white text-[#050505] shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Upgrade Pro
                </button>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 text-white transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                Dashboard
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs font-heading">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-white line-clamp-1 max-w-[140px]">
                    {user.name}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isPro
                        ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
                        : "bg-white/10 text-slate-300 border border-white/10"
                    }`}
                  >
                    {user.subscriptionTier}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-xs font-heading font-bold px-4 py-2 rounded-xl bg-white text-[#050505] shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Masuk / Demo
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
