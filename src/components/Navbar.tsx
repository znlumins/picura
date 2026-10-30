"use client";

import Link from "next/link";
import { Camera, Sparkles, LayoutDashboard, Crown } from "lucide-react";

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-brand-violet flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl text-brand-primary tracking-tight">
                Picura
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-violetLight text-brand-violet uppercase tracking-wider">
                ID
              </span>
            </div>
            <p className="text-[11px] text-brand-muted hidden sm:block -mt-1 font-medium">
              Seleksi Foto Drive & WhatsApp
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isPro && (
                <button
                  onClick={onUpgradeClick}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm hover:from-amber-600 hover:to-amber-700 transition"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade Pro
                </button>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-border hover:bg-slate-50 text-brand-primary transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-brand-muted" />
                Dashboard
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-brand-border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-violetLight text-brand-violet flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-brand-primary line-clamp-1 max-w-[140px]">
                    {user.name}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isPro
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
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
                className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-brand-violet hover:bg-brand-violetHover text-white shadow-sm transition inline-flex items-center gap-1.5"
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
