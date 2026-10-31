"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import StudioHeroBanner from "@/components/StudioHeroBanner";
import MetricsGrid from "@/components/MetricsGrid";
import RecentActivity, { ActivityItem } from "@/components/RecentActivity";
import StudioSettingsView from "@/components/StudioSettingsView";
import CreateGalleryModal from "@/components/CreateGalleryModal";
import UpgradeModal from "@/components/UpgradeModal";
import SelectionDetailModal from "@/components/SelectionDetailModal";
import AuthModal from "@/components/AuthModal";
import SettingsModal from "@/components/SettingsModal";
import {
  IconPlus,
  IconSearch,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconWhatsApp,
  IconTrash,
  IconLock,
  IconEye,
  IconSpinner,
  IconFolder,
  IconLogIn,
  IconSettings,
  IconCrown,
  IconSun,
  IconMoon,
  IconMenu,
} from "@/components/Icons";

interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  maxSelectionQuota: number;
  totalPhotos: number;
  latestSelectedCount: number;
  latestSelection?: {
    clientName: string;
    clientNotes?: string | null;
    totalSelected: number;
    submittedAt?: string | null;
    selectedFiles: { file_id: string; filename: string }[];
  } | null;
  editorWhatsappNumber?: string;
  hasPassword?: boolean;
  expiresAt?: string | null;
  createdAt?: string;
}

const DEMO_USER = {
  id: "demo-user-1",
  name: "Demo Fotografer",
  email: "demo@picura.id",
  avatarUrl: null,
  studioName: "Lumina Studio Jakarta",
  studioWhatsapp: "6281234567890",
  hasGoogleApiKey: true,
  subscriptionTier: "PRO_FREELANCE",
};

const DEMO_STATS = {
  activeGalleries: 1,
  quotaLimit: 999,
  totalSelections: 0,
  totalPhotos: 15,
};

const DEMO_GALLERIES: GalleryItem[] = [
  {
    id: "demo-gallery-1",
    title: "Sesi Foto Wedding Rian & Dina",
    slug: "sesi-foto-wedding-rian-dina",
    maxSelectionQuota: 25,
    totalPhotos: 15,
    latestSelectedCount: 0,
    latestSelection: null,
    editorWhatsappNumber: "6281234567890",
    hasPassword: false,
    expiresAt: null,
    createdAt: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    studioName?: string | null;
    studioWhatsapp?: string | null;
    hasGoogleApiKey?: boolean;
    subscriptionTier: string;
  } | null>(DEMO_USER);

  const [stats, setStats] = useState<{
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
    totalPhotos?: number;
  } | null>(DEMO_STATS);

  const [galleries, setGalleries] = useState<GalleryItem[]>(DEMO_GALLERIES);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tab, Nav & Theme states
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedGalleryResult, setSelectedGalleryResult] = useState<{
    title: string;
    editor_phone?: string;
    data: {
      client_name: string;
      client_notes?: string;
      total_selected: number;
      selected_files: { file_id: string; filename: string }[];
    };
  } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryToDelete, setGalleryToDelete] = useState<{ slug: string; title: string } | null>(null);
  const [isDeletingGallery, setIsDeletingGallery] = useState(false);

  // Initialize theme from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paramTheme = urlParams.get("theme");
      const paramTab = urlParams.get("tab");
      if (paramTab === "settings") {
        setActiveTab("settings");
      }
      const savedTheme = paramTheme || localStorage.getItem("picura_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("picura_theme", next ? "dark" : "light");
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  const fetchDashboardData = useCallback(async () => {
    // Keep responsive without blanking loader
    const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Fetch current authenticated user
      const userRes = await fetch("/api/v1/auth/me", { headers });
      const userData = await userRes.json();

      if (userData.status === "success" && userData.user) {
        setUser(userData.user);
        setStats(userData.stats);

        // 2. Fetch galleries & real client activities
        const galRes = await fetch("/api/v1/galleries", { headers });
        const galData = await galRes.json();
        if (galData.status === "success") {
          setGalleries(galData.data || []);
          setActivities(galData.activities || []);
          if (galData.meta?.totalPhotosCached) {
            setStats((prev) =>
              prev ? { ...prev, totalPhotos: galData.meta.totalPhotosCached } : null
            );
          }
        }
      } else {
        setUser(null);
        setStats(null);
        setGalleries([]);
        setActivities([]);
      }
    } catch {
      console.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("picura_token");
    setUser(null);
    setGalleries([]);
    setActivities([]);
    setStats(null);
    window.location.href = "/login";
  };

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/g/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleShareToClientWA = (gallery: GalleryItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/g/${gallery.slug}`;
    const msg = `Halo Kak! Sesi foto untuk *${gallery.title}* sudah siap dipilih secara online di tautan berikut:\n\n👉 ${fullUrl}\n\nSilakan tandai maksimal ${gallery.maxSelectionQuota} foto favorit Kakak lalu kirimkan kembali ya. Terima kasih! ✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const confirmDeleteGallery = async () => {
    if (!galleryToDelete) return;
    setIsDeletingGallery(true);
    try {
      const token = localStorage.getItem("picura_token");
      const res = await fetch(`/api/v1/galleries/${galleryToDelete.slug}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setGalleryToDelete(null);
        await fetchDashboardData();
      } else {
        alert("Gagal menghapus galeri");
      }
    } catch {
      alert("Gagal menghapus galeri");
    } finally {
      setIsDeletingGallery(false);
    }
  };

  const handleViewResults = (gallery: GalleryItem) => {
    if (gallery.latestSelection) {
      setSelectedGalleryResult({
        title: gallery.title,
        editor_phone: gallery.editorWhatsappNumber,
        data: {
          client_name: gallery.latestSelection.clientName || "Klien",
          client_notes: gallery.latestSelection.clientNotes || undefined,
          total_selected: gallery.latestSelection.totalSelected,
          selected_files: gallery.latestSelection.selectedFiles || [],
        },
      });
    }
  };

  const handleViewActivitySelection = (act: ActivityItem) => {
    setSelectedGalleryResult({
      title: act.galleryTitle,
      data: {
        client_name: act.clientName,
        client_notes: act.clientNotes || undefined,
        total_selected: act.totalSelected,
        selected_files: act.selectedFiles || [],
      },
    });
  };

  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  const filteredGalleries = galleries.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPhotosCount =
    stats?.totalPhotos || galleries.reduce((acc, g) => acc + (g.totalPhotos || 0), 0);

  return (
    <div
      className={`h-screen overflow-hidden flex font-sans transition-colors ${
        isDarkMode ? "bg-[#0b0c14] text-slate-200" : "bg-[#f6f8fa] text-[#36394a]"
      }`}
    >
      {/* 260px Fixed Width Sidebar */}
      <Sidebar
        user={user}
        stats={stats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUpgradeClick={() => setIsUpgradeOpen(true)}
        onSettingsClick={() => setActiveTab("settings")}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Independent Vertical Scroll, Sidebar Stays 100% Pinned */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Header: Fixed height, shrink-0 so it NEVER squishes, spacious vertical & horizontal padding */}
        <header
          className={`h-16 sm:h-20 shrink-0 px-4 sm:px-8 border-b flex items-center justify-between transition-colors z-20 w-full ${
            isDarkMode ? "bg-[#0f111a] border-[#222533]" : "bg-white border-[#cdd2d9]"
          }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className={`lg:hidden p-1.5 sm:p-2 rounded-[8px] border transition shrink-0 ${
                isDarkMode
                  ? "border-[#2e334a] bg-[#1a1d2d] text-slate-300 hover:text-white"
                  : "border-[#cdd2d9] bg-[#f6f8fa] text-[#666d80] hover:text-[#272835]"
              }`}
              title="Buka menu navigasi"
              aria-label="Buka menu navigasi"
            >
              <IconMenu className="w-4 h-4" />
            </button>

            <div className="min-w-0 space-y-1">
              <h1
                className={`font-heading font-semibold text-lg sm:text-2xl tracking-tight leading-none ${
                  isDarkMode ? "text-white" : "text-[#272835]"
                }`}
              >
                {activeTab === "settings" ? "Pengaturan Studio" : "Overview Studio"}
              </h1>
              <p className="text-xs text-[#818898] leading-none hidden sm:block">
                {user ? `Halo, ${user.name}` : "Silakan masuk ke akun fotografer"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {user ? (
              <>
                {/* Search Bar: Disabled when 0 galleries */}
                <div className="relative hidden md:block w-52 lg:w-64">
                  <IconSearch className="w-4 h-4 text-[#818898] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={galleries.length === 0}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      galleries.length === 0 ? "Belum ada galeri..." : "Cari galeri..."
                    }
                    className={`w-full text-xs pl-9 pr-3 py-2 rounded-[8px] border transition focus:outline-none focus:border-[#5e4cff] disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode
                        ? "bg-[#1a1d2d] border-[#2e334a] text-white placeholder-slate-500"
                        : "bg-[#f6f8fa] border-[#cdd2d9] text-[#36394a] placeholder-[#a4abb8]"
                    }`}
                    title={
                      galleries.length === 0
                        ? "Buat galeri pertama untuk mengaktifkan pencarian"
                        : "Cari galeri"
                    }
                  />
                </div>

                {/* Dark / Light Mode Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-2 rounded-[8px] border transition shrink-0 ${
                    isDarkMode
                      ? "border-[#2e334a] bg-[#1a1d2d] text-amber-400 hover:bg-[#25283a]"
                      : "border-[#cdd2d9] bg-white hover:bg-[#f6f8fa] text-[#666d80]"
                  }`}
                  title={
                    isDarkMode
                      ? "Beralih ke Mode Terang (Light Mode)"
                      : "Beralih ke Mode Gelap (Dark Mode)"
                  }
                >
                  {isDarkMode ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
                </button>

                {user.subscriptionTier !== "STUDIO" ? (
                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="py-2 px-3 rounded-[8px] border border-[#beb5ff] bg-[#dfdbff]/60 text-[#5e4cff] hover:bg-[#dfdbff] text-xs font-semibold transition flex items-center gap-1.5 shadow-xs shrink-0"
                    title={
                      user.subscriptionTier === "PRO_FREELANCE"
                        ? "Tingkatkan ke Studio Agency (Galeri Tanpa Batas)"
                        : "Tingkatkan ke Pro untuk galeri tanpa batas"
                    }
                  >
                    <IconCrown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {user.subscriptionTier === "PRO_FREELANCE" ? "Upgrade Studio" : "Upgrade Pro"}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="py-1.5 px-3 rounded-[8px] border border-amber-200/80 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs shrink-0"
                    title="Paket Studio Agency Aktif (Klik untuk melihat detail langganan)"
                  >
                    <IconCrown className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Studio Aktif</span>
                  </button>
                )}

                {/* Only show + Buat Galeri if galleries.length > 0 to prevent duplication on empty state */}
                {galleries.length > 0 && (
                  <button
                    onClick={() => {
                      if (!isPro && (stats?.activeGalleries || 0) >= 2) {
                        setIsUpgradeOpen(true);
                      } else {
                        setIsCreateOpen(true);
                      }
                    }}
                    className="py-2 px-3 sm:px-4 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                  >
                    <IconPlus className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Buat Galeri</span>
                    <span className="sm:hidden font-medium">Galeri</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="py-2 px-4 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <IconLogIn className="w-4 h-4 shrink-0" />
                <span>Masuk / Daftar</span>
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Body Content: Scrollable independent of header */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-[1280px] w-full">
          {/* TAB 1: STUDIO SETTINGS VIEW */}
          {activeTab === "settings" && (
            <StudioSettingsView
              user={user}
              onSuccess={fetchDashboardData}
              onBack={() => setActiveTab("dashboard")}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
            />
          )}

          {/* TAB 2: DASHBOARD MAIN OVERVIEW */}
          {activeTab === "dashboard" && (
            <>
              {!user && (
                <div
                  className={`p-6 rounded-[12px] border text-center space-y-3 ${
                    isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
                  }`}
                >
                  <IconFolder className="w-10 h-10 text-[#818898] mx-auto" />
                  <h2
                    className={`font-heading font-semibold text-lg ${
                      isDarkMode ? "text-white" : "text-[#272835]"
                    }`}
                  >
                    Mulai Kelola Seleksi Foto Anda
                  </h2>
                  <p className="text-xs text-[#666d80] max-w-md mx-auto">
                    Daftar sekarang untuk menghubungkan folder Google Drive secara langsung dan
                    mengirimkan link seleksi foto ke klien Anda.
                  </p>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="py-2 px-5 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition inline-flex items-center gap-2 shadow-xs"
                  >
                    <IconLogIn className="w-4 h-4" />
                    <span>Daftar Akun Gratis</span>
                  </button>
                </div>
              )}

              {/* Free Tier Notice & Upgrade CTA Banner */}
              {user && !isPro && (
                <div
                  className={`border rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                    isDarkMode
                      ? "bg-gradient-to-r from-[#5e4cff]/20 via-[#141624] to-[#141624] border-[#5e4cff]/40"
                      : "bg-gradient-to-r from-[#dfdbff]/40 via-white to-white border-[#beb5ff]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#5e4cff] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <IconCrown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-heading font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-[#272835]"
                          }`}
                        >
                          Anda Sedang Menggunakan Paket Free
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] border ${
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-slate-300"
                              : "bg-[#f6f8fa] border-[#cdd2d9] text-[#666d80]"
                          }`}
                        >
                          {stats?.activeGalleries || 0} / {stats?.quotaLimit || 2} Galeri Aktif
                        </span>
                      </div>
                      <p className="text-xs text-[#818898] mt-0.5">
                        Tingkatkan ke Pro untuk galeri tanpa batas, kuota hingga 2.000 foto/sesi,
                        dan hapus watermark Picura pada tampilan klien.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="px-4 py-2 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    <span>⚡ Tingkatkan ke Pro (Rp 49rb)</span>
                  </button>
                </div>
              )}

              {/* 1. Real Studio Hero Banner */}
              <StudioHeroBanner
                user={user}
                stats={stats}
                onUpgradeClick={() => setIsUpgradeOpen(true)}
                onSettingsClick={() => setActiveTab("settings")}
              />

              {/* 2. Real Metrics Grid */}
              <MetricsGrid
                activeGalleries={stats?.activeGalleries || galleries.length}
                quotaLimit={isPro ? 999 : stats?.quotaLimit || 2}
                totalPhotos={totalPhotosCount}
                totalSelections={stats?.totalSelections || 0}
                tier={user?.subscriptionTier || "FREEMIUM"}
              />

              {/* 3. Real Galleries Management */}
              <div
                className={`rounded-[12px] p-6 border space-y-4 shadow-xs ${
                  isDarkMode ? "bg-[#141624] border-[#25283a]" : "bg-white border-[#cdd2d9]"
                }`}
              >
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
                    isDarkMode ? "border-slate-800" : "border-[#eceff3]"
                  }`}
                >
                  <div>
                    <h3
                      className={`font-heading font-semibold text-lg ${
                        isDarkMode ? "text-white" : "text-[#272835]"
                      }`}
                    >
                      Daftar Galeri Aktif ({filteredGalleries.length})
                    </h3>
                    <p className="text-xs text-[#818898]">
                      Kelola tautan bukti foto, pantau status pilihan klien, dan salin link
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="py-16 text-center text-[#818898] flex items-center justify-center gap-2 text-xs">
                    <IconSpinner className="w-5 h-5 text-[#5e4cff]" />
                    <span>Memuat data galeri...</span>
                  </div>
                ) : filteredGalleries.length === 0 ? (
                  <div className="py-14 text-center space-y-3 max-w-sm mx-auto">
                    <div
                      className={`w-12 h-12 rounded-[10px] border flex items-center justify-center mx-auto ${
                        isDarkMode
                          ? "bg-slate-800/60 border-slate-700 text-slate-400"
                          : "bg-[#f6f8fa] border-[#cdd2d9] text-[#818898]"
                      }`}
                    >
                      <IconFolder className="w-6 h-6" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-white" : "text-[#272835]"
                        }`}
                      >
                        Belum ada galeri sesi foto
                      </p>
                      <p className="text-xs text-[#818898] mt-1 leading-relaxed">
                        Tautkan folder Google Drive pertama Anda untuk mulai mengirim tautan seleksi
                        foto ke klien.
                      </p>
                    </div>
                    {user && (
                      <div className="pt-1">
                        <button
                          onClick={() => setIsCreateOpen(true)}
                          className="py-2 px-4 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs font-medium transition inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <IconPlus className="w-3.5 h-3.5" />
                          <span>Buat Galeri Pertama</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`divide-y ${
                      isDarkMode ? "divide-slate-800" : "divide-[#eceff3]"
                    }`}
                  >
                    {filteredGalleries.map((gallery) => {
                      const isCopied = copiedSlug === gallery.slug;
                      const formattedDate = gallery.createdAt
                        ? new Date(gallery.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Baru saja";

                      return (
                        <div
                          key={gallery.id}
                          className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 rounded-[8px] transition ${
                            isDarkMode ? "hover:bg-[#1a1d2e]" : "hover:bg-[#f6f8fa]"
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            {/* Visual Thumbnail Box */}
                            <div
                              className={`w-11 h-11 shrink-0 rounded-[8px] border flex items-center justify-center transition-colors shadow-2xs ${
                                isDarkMode
                                  ? "bg-[#1a1d2d] border-[#2e334a] text-[#818cf8]"
                                  : "bg-[#f4f2ff] border-[#dfdbff] text-[#5e4cff]"
                              }`}
                            >
                              <svg
                                className="w-5 h-5 opacity-90"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.75}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`font-semibold text-sm truncate ${
                                    isDarkMode ? "text-white" : "text-[#272835]"
                                  }`}
                                >
                                  {gallery.title}
                                </span>

                                {/* Status Pill Badge */}
                                {gallery.latestSelectedCount > 0 ? (
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                      isDarkMode
                                        ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Selesai Dipilih</span>
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                      isDarkMode
                                        ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span>Menunggu Klien</span>
                                  </span>
                                )}

                                {gallery.hasPassword && (
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[4px] border ${
                                      isDarkMode
                                        ? "bg-slate-800 border-slate-700 text-slate-300"
                                        : "bg-[#f6f8fa] text-[#818898] border-[#cdd2d9]"
                                    }`}
                                  >
                                    <IconLock className="w-3 h-3" />
                                    <span>PIN</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#818898]">
                                <span>{gallery.totalPhotos || 0} Foto</span>
                                <span>•</span>
                                <span
                                  className={
                                    gallery.latestSelectedCount > 0
                                      ? "text-[#10b981] font-medium"
                                      : ""
                                  }
                                >
                                  {gallery.latestSelectedCount || 0}/{gallery.maxSelectionQuota} Terpilih
                                </span>
                                <span>•</span>
                                <span>Dibuat {formattedDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap shrink-0">
                            {gallery.latestSelection && (
                              <button
                                onClick={() => handleViewResults(gallery)}
                                className={`py-1.5 px-3 rounded-[6px] text-xs font-medium border transition flex items-center gap-1.5 ${
                                  isDarkMode
                                    ? "bg-[#10b981]/20 border-[#10b981]/40 text-[#34d399] hover:bg-[#10b981]/30"
                                    : "bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46] hover:bg-[#d1fae5]"
                                }`}
                              >
                                <IconEye className="w-3.5 h-3.5" />
                                <span>Hasil ({gallery.latestSelectedCount})</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyLink(gallery.slug)}
                              title="Salin tautan galeri klien"
                              className={`py-1.5 px-3 rounded-[6px] text-xs font-medium border transition flex items-center gap-1.5 ${
                                isDarkMode
                                  ? "bg-[#1a1d2d] border-[#2e334a] text-slate-300 hover:bg-[#25283a]"
                                  : "bg-white border-[#cdd2d9] text-[#36394a] hover:bg-[#f6f8fa]"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <IconCheck className="w-3.5 h-3.5 text-[#10b981]" />
                                  <span className="text-[#10b981]">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <IconCopy className="w-3.5 h-3.5 text-[#818898]" />
                                  <span>Salin Link</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleShareToClientWA(gallery)}
                              title="Kirim pesan seleksi via WhatsApp"
                              className="py-1.5 px-3 rounded-[6px] text-xs font-medium bg-[#25D366] text-white hover:bg-[#20ba59] transition flex items-center gap-1.5 shadow-xs"
                            >
                              <IconWhatsApp className="w-3.5 h-3.5" />
                              <span>Kirim WA</span>
                            </button>

                            <a
                              href={`/g/${gallery.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-1.5 rounded-[6px] border transition ${
                                isDarkMode
                                  ? "border-[#2e334a] text-slate-400 hover:text-white hover:bg-[#1a1d2d]"
                                  : "border-[#cdd2d9] text-[#818898] hover:text-[#272835] hover:bg-[#f6f8fa]"
                              }`}
                              title="Pratinjau Galeri Klien"
                            >
                              <IconExternalLink className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() =>
                                setGalleryToDelete({ slug: gallery.slug, title: gallery.title })
                              }
                              className={`p-1.5 rounded-[6px] border transition ${
                                isDarkMode
                                  ? "border-red-900/40 text-red-400 hover:bg-red-950/40"
                                  : "border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2]"
                              }`}
                              title="Hapus Galeri"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Real Recent Activity */}
              <RecentActivity
                activities={activities}
                onViewSelection={handleViewActivitySelection}
              />
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateGalleryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchDashboardData}
        onQuotaExceeded={() => setIsUpgradeOpen(true)}
        defaultWhatsapp={user?.studioWhatsapp || ""}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={fetchDashboardData}
        currentTier={user?.subscriptionTier || "FREEMIUM"}
      />

      <SelectionDetailModal
        isOpen={!!selectedGalleryResult}
        onClose={() => setSelectedGalleryResult(null)}
        galleryTitle={selectedGalleryResult?.title || ""}
        selectionData={selectedGalleryResult?.data || null}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSuccess={fetchDashboardData}
      />

      {/* Delete Gallery Confirmation Dialog */}
      {galleryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm rounded-[12px] p-6 border shadow-2xl space-y-4 ${
              isDarkMode
                ? "bg-[#141624] border-[#25283a] text-white"
                : "bg-white border-[#cdd2d9] text-[#272835]"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <IconTrash className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-heading font-semibold text-base">Hapus Galeri Klien?</h3>
              <p className="text-xs text-[#818898] mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus sesi{" "}
                <strong className={isDarkMode ? "text-slate-200" : "text-[#272835]"}>
                  &quot;{galleryToDelete.title}&quot;
                </strong>
                ? Tautan galeri dan seluruh hasil seleksi foto klien akan dihapus secara permanen.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingGallery}
                onClick={() => setGalleryToDelete(null)}
                className={`py-2 px-3.5 rounded-[8px] border text-xs font-medium transition ${
                  isDarkMode
                    ? "border-[#2e334a] bg-[#1a1d2d] text-slate-300 hover:bg-[#25283a]"
                    : "border-[#cdd2d9] bg-white text-[#36394a] hover:bg-[#f6f8fa]"
                }`}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingGallery}
                onClick={confirmDeleteGallery}
                className="py-2 px-4 rounded-[8px] bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5 shadow-xs"
              >
                {isDeletingGallery ? (
                  <>
                    <IconSpinner className="w-3.5 h-3.5" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Galeri</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
