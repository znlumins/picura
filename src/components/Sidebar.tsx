"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PicuraLogo } from "@/components/PicuraLogo";
import {
  IconDashboard,
  IconPhoto,
  IconSettings,
  IconLogOut,
  IconLogIn,
  IconChevronRight,
} from "@/components/Icons";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    studioName?: string | null;
    subscriptionTier: string;
  } | null;
  stats?: {
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
  } | null;
  onUpgradeClick: () => void;
  onSettingsClick?: () => void;
  onAuthClick?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  user,
  stats,
  onUpgradeClick,
  onSettingsClick,
  onAuthClick,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 hidden lg:flex flex-col justify-between p-5 border-r border-[#cdd2d9] bg-[#f6f8fa] z-20 select-none">
      <div className="space-y-6">
        {/* Top Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <PicuraLogo className="h-7 w-auto text-[#272835] transition-opacity group-hover:opacity-85" />
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
            {isPro ? "PRO" : "FREE"}
          </span>
        </Link>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#818898] px-3 font-medium">
            Menu
          </span>
          <div className="pt-1.5 space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-medium transition ${
                pathname === "/dashboard"
                  ? "text-[#272835] bg-white border border-[#cdd2d9] shadow-sm font-semibold"
                  : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconDashboard className="w-4 h-4 shrink-0 text-[#818898]" />
                <span>Dashboard</span>
              </div>
              {pathname === "/dashboard" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#5e4cff]" />
              )}
            </Link>

            <Link
              href="/"
              className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-medium transition ${
                pathname === "/"
                  ? "text-[#272835] bg-white border border-[#cdd2d9] font-semibold"
                  : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconPhoto className="w-4 h-4 shrink-0 text-[#818898]" />
                <span>Beranda & Demo</span>
              </div>
            </Link>

            {user && (
              <button
                onClick={onSettingsClick}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-medium text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3] transition"
              >
                <div className="flex items-center gap-2.5">
                  <IconSettings className="w-4 h-4 shrink-0 text-[#818898]" />
                  <span>Pengaturan Studio & API</span>
                </div>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Account Card */}
      <div className="space-y-2">
        {user ? (
          <div className="bg-white p-3.5 rounded-[12px] border border-[#cdd2d9] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#272835] truncate max-w-[140px]">
                  {user.name}
                </div>
                <div className="text-[11px] text-[#818898] truncate max-w-[140px]">
                  {user.studioName || user.email}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  isPro
                    ? "bg-[#dfdbff] text-[#5e4cff]"
                    : "bg-[#f6f8fa] text-[#818898] border border-[#cdd2d9]"
                }`}
              >
                {user.subscriptionTier || "FREEMIUM"}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-[#666d80] flex justify-between">
                <span>Galeri Aktif:</span>
                <span className="font-mono text-[#272835] font-semibold">
                  {stats?.activeGalleries || 0} / {isPro ? "∞" : stats?.quotaLimit || 2}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#eceff3] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5e4cff] transition-all"
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
                className="w-full py-1.5 px-3 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>Upgrade Pro</span>
                <IconChevronRight className="w-3 h-3 ml-auto text-white/80" />
              </button>
            ) : null}

            <button
              onClick={onLogout}
              className="w-full pt-1.5 border-t border-[#eceff3] text-[#818898] hover:text-[#272835] text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <IconLogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-white rounded-[12px] border border-[#cdd2d9] text-center space-y-2">
            <span className="text-xs text-[#818898] block">Akses Akun Fotografer</span>
            <button
              onClick={onAuthClick}
              className="w-full py-2 px-3 bg-[#272835] text-white text-xs font-medium rounded-[8px] hover:bg-[#1a1b25] transition flex items-center justify-center gap-1.5"
            >
              <IconLogIn className="w-3.5 h-3.5" />
              <span>Masuk / Daftar</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
