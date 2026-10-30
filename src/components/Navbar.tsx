"use client";

import Link from "next/link";
import { PicuraLogo } from "@/components/PicuraLogo";
import { IconDashboard, IconLogOut, IconLogIn } from "@/components/Icons";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    studioName?: string | null;
    subscriptionTier: string;
  } | null;
  onUpgradeClick?: () => void;
  onAuthClick?: () => void;
  onLogout?: () => void;
}

export default function Navbar({
  user,
  onUpgradeClick,
  onAuthClick,
  onLogout,
}: NavbarProps) {
  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#cdd2d9]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <PicuraLogo className="h-7 w-auto text-[#272835] transition-opacity group-hover:opacity-85" />
          {user?.studioName && (
            <span className="hidden sm:inline-block text-xs font-mono font-medium text-[#818898] pl-2 border-l border-[#cdd2d9]">
              {user.studioName}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isPro && (
                <button
                  onClick={onUpgradeClick}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-[8px] bg-[#f6f8fa] text-[#36394a] border border-[#cdd2d9] hover:border-[#818898] transition"
                >
                  Upgrade Pro
                </button>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-[8px] bg-[#272835] text-white hover:bg-[#1a1b25] transition"
              >
                <IconDashboard className="w-3.5 h-3.5 text-white/80" />
                <span>Dashboard</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-[#cdd2d9]">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[#cdd2d9] object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#f6f8fa] border border-[#cdd2d9] text-[#36394a] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium text-[#36394a] line-clamp-1 max-w-[130px]">
                    {user.name}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full ${
                      isPro
                        ? "bg-[#dfdbff] text-[#5e4cff]"
                        : "bg-[#f6f8fa] text-[#818898] border border-[#cdd2d9]"
                    }`}
                  >
                    {user.subscriptionTier}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#f6f8fa] transition ml-1"
                  title="Keluar Akun"
                >
                  <IconLogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onAuthClick}
                className="text-xs font-medium px-3.5 py-1.5 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] hover:border-[#818898] hover:bg-[#f6f8fa] transition"
              >
                Masuk
              </button>
              <button
                onClick={onAuthClick}
                className="text-xs font-medium px-3.5 py-1.5 rounded-[8px] bg-[#5e4cff] text-white hover:opacity-90 transition inline-flex items-center gap-1.5"
              >
                <IconLogIn className="w-3.5 h-3.5" />
                <span>Mulai Gratis</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
