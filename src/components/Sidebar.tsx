"use client";

import { useState } from "react";
import Link from "next/link";
import { PicuraLogo } from "@/components/PicuraLogo";
import {
  IconDashboard,
  IconSettings,
  IconLogOut,
  IconLogIn,
  IconChevronRight,
  IconAlert,
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
  activeTab?: "dashboard" | "settings";
  onTabChange?: (tab: "dashboard" | "settings") => void;
  onUpgradeClick: () => void;
  onSettingsClick?: () => void;
  onAuthClick?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
}

export default function Sidebar({
  user,
  stats,
  activeTab = "dashboard",
  onTabChange,
  onUpgradeClick,
  onSettingsClick,
  onAuthClick,
  onLogout,
  isDarkMode = false,
}: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  const handleDashboardClick = () => {
    if (onTabChange) {
      onTabChange("dashboard");
    }
  };

  const handleSettingsClick = () => {
    if (onTabChange) {
      onTabChange("settings");
    } else if (onSettingsClick) {
      onSettingsClick();
    }
  };

  return (
    <>
      <aside
        className={`w-[260px] shrink-0 h-screen sticky top-0 hidden lg:flex flex-col justify-between p-5 border-r select-none z-20 transition-colors ${
          isDarkMode
            ? "bg-[#0f111a] border-[#222533] text-slate-200"
            : "bg-[#f6f8fa] border-[#cdd2d9] text-[#36394a]"
        }`}
      >
        {/* Top section: Logo & Nav */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group" title="Kembali ke Beranda Picura">
            <PicuraLogo
              className={`h-7 w-auto transition-opacity group-hover:opacity-85 ${
                isDarkMode ? "text-white" : "text-[#272835]"
              }`}
            />
          </Link>

          {/* Navigation Section (Clean background, no redundant 'MENU' label, no border, no dot) */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={handleDashboardClick}
              className={`w-full flex items-center px-3 py-2 rounded-[8px] text-[13px] font-medium transition ${
                activeTab === "dashboard"
                  ? isDarkMode
                    ? "text-white bg-[#1a1d2d]"
                    : "text-[#272835] bg-[#eceff3]"
                  : isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-[#1a1d2d]/60"
                  : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconDashboard className="w-4 h-4 shrink-0 text-[#818898]" />
                <span>Dashboard</span>
              </div>
            </button>

            {user && (
              <button
                type="button"
                onClick={handleSettingsClick}
                className={`w-full flex items-center px-3 py-2 rounded-[8px] text-[13px] font-medium transition ${
                  activeTab === "settings"
                    ? isDarkMode
                      ? "text-white bg-[#1a1d2d]"
                    : "text-[#272835] bg-[#eceff3]"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white hover:bg-[#1a1d2d]/60"
                    : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconSettings className="w-4 h-4 shrink-0 text-[#818898]" />
                  <span>Pengaturan</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Account Card: Avatar + Studio Name + Badge PRO (tepat 1x) + Menu Pengaturan/Keluar */}
        <div className="mt-auto pt-4">
          {user ? (
            <div
              className={`p-3 rounded-[12px] border space-y-2.5 shadow-2xs ${
                isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
              }`}
            >
              {/* Avatar + Studio Name + Badge PRO */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5e4cff]/10 dark:bg-[#5e4cff]/20 text-[#5e4cff] font-semibold text-xs flex items-center justify-center shrink-0 select-none">
                  {(user.studioName || user.name || "P").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isDarkMode ? "text-white" : "text-[#272835]"
                      }`}
                      title={user.studioName || user.name}
                    >
                      {user.studioName || user.name}
                    </span>
                    {isPro && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff] dark:bg-[#5e4cff]/25 dark:text-[#dfdbff] shrink-0">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#818898] truncate block">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* Kuota Galeri: Hanya tampil jika terbatas (!isPro) */}
              {!isPro && (
                <div className="space-y-1 pt-1.5 border-t border-[#eceff3] dark:border-slate-800">
                  <div className="text-[11px] text-[#666d80] dark:text-slate-400 flex justify-between tabular-nums">
                    <span>Kuota:</span>
                    <span className="font-medium text-[#272835] dark:text-slate-200">
                      {stats?.activeGalleries || 0}/{stats?.quotaLimit || 2} galeri
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden bg-[#eceff3] dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#5e4cff] transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats?.activeGalleries || 0) / (stats?.quotaLimit || 2)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Menu Aksi Akun: Pengaturan & Keluar */}
              <div className="pt-2 border-t border-[#eceff3] dark:border-slate-800 flex items-center justify-between text-xs text-[#818898]">
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className="hover:text-[#272835] dark:hover:text-white transition flex items-center gap-1"
                >
                  <IconSettings className="w-3.5 h-3.5" />
                  <span>Pengaturan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="hover:text-[#ef4444] transition flex items-center gap-1"
                >
                  <IconLogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-[12px] border text-center space-y-2 ${
                isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
              }`}
            >
              <span className="text-xs text-[#818898] block">Akses Akun Fotografer</span>
              <button
                type="button"
                onClick={onAuthClick}
                className="w-full py-2 px-3 bg-[#272835] text-white text-xs font-medium rounded-[8px] hover:bg-[#1a1b25] transition flex items-center justify-center gap-1.5"
              >
                <IconLogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Confirmation Dialog Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`rounded-[12px] max-w-sm w-full p-5 shadow-2xl border space-y-4 animate-in fade-in duration-150 ${
              isDarkMode ? "bg-[#141624] border-[#2e334a] text-white" : "bg-white border-[#cdd2d9] text-[#272835]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center shrink-0">
                <IconAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-sm">Konfirmasi Keluar</h4>
                <p className="text-xs text-[#818898] mt-0.5">
                  Apakah Anda yakin ingin keluar dari akun studio ini?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eceff3] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className={`py-1.5 px-3 rounded-[8px] border text-xs font-medium transition ${
                  isDarkMode
                    ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                    : "border-[#cdd2d9] hover:bg-[#f6f8fa] text-[#666d80]"
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
                className="py-1.5 px-3.5 rounded-[8px] bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-medium transition shadow-xs"
              >
                Ya, Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
