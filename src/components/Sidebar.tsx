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
  IconClose,
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
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
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  const handleDashboardClick = () => {
    if (onTabChange) {
      onTabChange("dashboard");
    }
    onCloseMobile?.();
  };

  const handleSettingsClick = () => {
    if (onTabChange) {
      onTabChange("settings");
    } else if (onSettingsClick) {
      onSettingsClick();
    }
    onCloseMobile?.();
  };

  // Shared inner navigation content
  const renderNav = () => (
    <nav className="space-y-1">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[#818898] px-3 font-medium">
        Menu
      </span>
      <div className="pt-1.5 space-y-1">
        <button
          type="button"
          onClick={handleDashboardClick}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition ${
            activeTab === "dashboard"
              ? isDarkMode
                ? "text-white bg-[#1a1d2d] border border-[#2e334a] shadow-xs font-semibold"
                : "text-[#272835] bg-white border border-[#cdd2d9] shadow-xs font-semibold"
              : isDarkMode
              ? "text-slate-400 hover:text-white hover:bg-[#1a1d2d]"
              : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <IconDashboard className="w-4 h-4 shrink-0 text-[#818898]" />
            <span>Dashboard</span>
          </div>
          {activeTab === "dashboard" && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#5e4cff]" />
          )}
        </button>

        {user && (
          <button
            type="button"
            onClick={handleSettingsClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition ${
              activeTab === "settings"
                ? isDarkMode
                  ? "text-white bg-[#1a1d2d] border border-[#2e334a] shadow-xs font-semibold"
                  : "text-[#272835] bg-white border border-[#cdd2d9] shadow-xs font-semibold"
                : isDarkMode
                ? "text-slate-400 hover:text-white hover:bg-[#1a1d2d]"
                : "text-[#666d80] hover:text-[#272835] hover:bg-[#eceff3]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <IconSettings className="w-4 h-4 shrink-0 text-[#818898]" />
              <span>Pengaturan Studio &amp; API</span>
            </div>
            {activeTab === "settings" && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#5e4cff]" />
            )}
          </button>
        )}
      </div>
    </nav>
  );

  // Shared inner account card
  const renderAccountCard = () => (
    <div className="mt-auto pt-4 space-y-2">
      {user ? (
        <div
          className={`p-3.5 rounded-[12px] border space-y-3 shadow-xs ${
            isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div
                className={`text-xs font-semibold truncate ${
                  isDarkMode ? "text-white" : "text-[#272835]"
                }`}
              >
                {user.name}
              </div>
              <div className="text-[11px] text-[#818898] truncate">
                {user.studioName || user.email}
              </div>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] shrink-0 ${
                isPro
                  ? "bg-[#dfdbff] text-[#5e4cff] border border-[#beb5ff]"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-[#f6f8fa] text-[#818898] border border-[#cdd2d9]"
              }`}
            >
              {user?.subscriptionTier === "STUDIO"
                ? "STUDIO"
                : isPro
                ? "PRO"
                : "FREE"}
            </span>
          </div>

          {/* Quota Display */}
          {isPro ? (
            <div
              className={`py-1.5 px-2.5 rounded-[6px] border text-[11px] font-medium flex items-center justify-between ${
                isDarkMode
                  ? "bg-[#5e4cff]/20 border-[#5e4cff]/40 text-[#dfdbff]"
                  : "bg-[#dfdbff]/40 border-[#beb5ff] text-[#5e4cff]"
              }`}
            >
              <span>Kuota Galeri:</span>
              <span className="font-semibold">Tanpa Batas (∞)</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-[11px] text-[#666d80] flex justify-between">
                <span>Galeri Aktif:</span>
                <span
                  className={`font-mono font-semibold ${
                    isDarkMode ? "text-slate-200" : "text-[#272835]"
                  }`}
                >
                  {stats?.activeGalleries || 0} / {stats?.quotaLimit || 2}
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isDarkMode ? "bg-slate-800" : "bg-[#eceff3]"
                }`}
              >
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

          {!isPro ? (
            <button
              type="button"
              onClick={() => {
                onUpgradeClick();
                onCloseMobile?.();
              }}
              className="w-full py-2 px-3 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Upgrade Pro</span>
              <IconChevronRight className="w-3 h-3 ml-auto text-white/80" />
            </button>
          ) : null}
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
            onClick={() => {
              if (onAuthClick) onAuthClick();
              onCloseMobile?.();
            }}
            className="w-full py-2 px-3 bg-[#272835] text-white text-xs font-medium rounded-[8px] hover:bg-[#1a1b25] transition flex items-center justify-center gap-1.5"
          >
            <IconLogIn className="w-3.5 h-3.5" />
            <span>Masuk / Daftar</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: 260px fixed width, pinned */}
      <aside
        className={`w-[260px] shrink-0 h-screen sticky top-0 hidden lg:flex flex-col justify-between p-5 border-r select-none z-20 transition-colors ${
          isDarkMode
            ? "bg-[#0f111a] border-[#222533] text-slate-200"
            : "bg-[#f6f8fa] border-[#cdd2d9] text-[#36394a]"
        }`}
      >
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group" title="Kembali ke Beranda Picura">
            <PicuraLogo
              className={`h-7 w-auto transition-opacity group-hover:opacity-85 ${
                isDarkMode ? "text-white" : "text-[#272835]"
              }`}
            />
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] ${
                isPro
                  ? "bg-[#dfdbff] text-[#5e4cff]"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-[#eceff3] text-[#818898]"
              }`}
            >
              {user?.subscriptionTier === "STUDIO"
                ? "STUDIO"
                : isPro
                ? "PRO"
                : "FREE"}
            </span>
          </Link>

          {renderNav()}
        </div>

        {renderAccountCard()}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[280px] max-w-[85vw] h-full z-50 flex flex-col justify-between p-5 border-r select-none transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full pointer-events-none"
        } ${
          isDarkMode
            ? "bg-[#0f111a] border-[#222533] text-slate-200"
            : "bg-[#f6f8fa] border-[#cdd2d9] text-[#36394a]"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#eceff3] dark:border-slate-800">
            <Link
              href="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2 group"
              title="Kembali ke Beranda Picura"
            >
              <PicuraLogo
                className={`h-6 w-auto transition-opacity group-hover:opacity-85 ${
                  isDarkMode ? "text-white" : "text-[#272835]"
                }`}
              />
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] ${
                  isPro
                    ? "bg-[#dfdbff] text-[#5e4cff]"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-400"
                    : "bg-[#eceff3] text-[#818898]"
                }`}
              >
                {user?.subscriptionTier === "STUDIO"
                ? "STUDIO"
                : isPro
                ? "PRO"
                : "FREE"}
              </span>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className={`p-1.5 rounded-[6px] border transition ${
                isDarkMode
                  ? "border-slate-800 text-slate-400 hover:text-white"
                  : "border-[#cdd2d9] text-[#818898] hover:text-[#272835]"
              }`}
              aria-label="Tutup menu"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>

          {renderNav()}
        </div>

        {renderAccountCard()}
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
                  onCloseMobile?.();
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
