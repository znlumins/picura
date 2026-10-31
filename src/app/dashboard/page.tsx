"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import RecentActivity, { ActivityItem } from "@/components/RecentActivity";
import StudioSettingsView from "@/components/StudioSettingsView";
import CreateGalleryModal from "@/components/CreateGalleryModal";
import UpgradeModal from "@/components/UpgradeModal";
import SelectionDetailModal from "@/components/SelectionDetailModal";
import AuthModal from "@/components/AuthModal";
import SettingsModal from "@/components/SettingsModal";
import StatusDot from "@/components/StatusDot";
import Button from "@/components/Button";
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
  } | null>(null);

  const [stats, setStats] = useState<{
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
    totalPhotos?: number;
  } | null>(null);

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab & Theme states
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Initialize theme from URL parameter or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paramTheme = urlParams.get("theme");
      const savedTheme = paramTheme || localStorage.getItem("picura_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (paramTheme === "light") {
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
    setIsLoading(true);
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

  const activeCount = galleries.length;
  const waitingCount = galleries.filter((g) => (g.latestSelectedCount || 0) === 0).length;
  const completedCount = galleries.filter((g) => (g.latestSelectedCount || 0) > 0).length;

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
      />

      {/* Main Content Area: Independent Vertical Scroll, Sidebar Stays 100% Pinned */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0">
        {/* Header: Fixed 64px height (h-16), ample vertical padding, title never touching edge */}
        <header
          className={`h-16 px-6 sm:px-8 border-b flex items-center justify-between sticky top-0 z-20 transition-colors shrink-0 ${
            isDarkMode ? "bg-[#0f111a] border-[#222533]" : "bg-white border-[#cdd2d9]"
          }`}
        >
          <div className="flex items-center gap-3">
            <h1
              className={`font-heading font-semibold text-xl tracking-tight leading-none ${
                isDarkMode ? "text-white" : "text-[#272835]"
              }`}
            >
              {activeTab === "settings" ? "Pengaturan" : "Galeri"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Search Bar: Only show when galleries >= 5 */}
                {galleries.length >= 5 && (
                  <div className="relative hidden md:block w-52">
                    <IconSearch className="w-4 h-4 text-[#818898] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari galeri..."
                      className={`w-full text-xs pl-9 pr-3 py-1.5 rounded-[8px] border transition focus:outline-none focus:border-[#5e4cff] ${
                        isDarkMode
                          ? "bg-[#1a1d2d] border-[#2e334a] text-white placeholder-slate-500"
                          : "bg-[#f6f8fa] border-[#cdd2d9] text-[#36394a] placeholder-[#a4abb8]"
                      }`}
                    />
                  </div>
                )}

                {/* Dark / Light Mode Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-2 rounded-[8px] border transition ${
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

                {/* Only show + Buat Galeri if galleries.length > 0 to prevent duplication on empty state */}
                {galleries.length > 0 && (
                  <Button
                    size="md"
                    variant="primary"
                    onClick={() => {
                      if (!isPro && (stats?.activeGalleries || 0) >= 2) {
                        setIsUpgradeOpen(true);
                      } else {
                        setIsCreateOpen(true);
                      }
                    }}
                    leftIcon={<IconPlus className="w-4 h-4" />}
                  >
                    Buat Galeri
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="md"
                variant="primary"
                onClick={() => setIsAuthOpen(true)}
                leftIcon={<IconLogIn className="w-4 h-4" />}
              >
                Masuk / Daftar
              </Button>
            )}
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1200px] w-full">
          {/* TAB 1: STUDIO SETTINGS VIEW */}
          {activeTab === "settings" && (
            <StudioSettingsView
              user={user}
              onSuccess={fetchDashboardData}
              onBack={() => setActiveTab("dashboard")}
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

              {/* Single concise summary line (no cards, no borders, tabular-nums) */}
              {user && (
                <div className="text-xs text-[#666d80] dark:text-[#94a3b8] flex flex-wrap items-center gap-2 select-none py-1">
                  <span>
                    <strong className="font-semibold text-[#272835] dark:text-white tabular-nums">
                      {activeCount}
                    </strong>{" "}
                    aktif
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="font-semibold text-[#272835] dark:text-white tabular-nums">
                      {waitingCount}
                    </strong>{" "}
                    menunggu klien
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="font-semibold text-[#272835] dark:text-white tabular-nums">
                      {completedCount}
                    </strong>{" "}
                    selesai dipilih
                  </span>
                </div>
              )}

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
                        <Button
                          size="md"
                          variant="primary"
                          onClick={() => setIsCreateOpen(true)}
                          leftIcon={<IconPlus className="w-3.5 h-3.5" />}
                        >
                          Buat Galeri Pertama
                        </Button>
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

                                {/* Status Dot: 6px dot + neutral text, no colored pill */}
                                <StatusDot
                                  status={gallery.latestSelectedCount > 0 ? "selesai" : "menunggu"}
                                />

                                {gallery.hasPassword && (
                                  <span
                                    className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[4px] border ${
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
                                <span className="tabular-nums">{gallery.totalPhotos || 0} foto</span>
                                <span>·</span>
                                <span className="tabular-nums">
                                  {gallery.latestSelectedCount || 0}/{gallery.maxSelectionQuota} dipilih
                                </span>
                                <span>·</span>
                                <span className="tabular-nums">Dibuat {formattedDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap shrink-0">
                            {gallery.latestSelection && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleViewResults(gallery)}
                                leftIcon={<IconEye className="w-3.5 h-3.5" />}
                              >
                                Hasil ({gallery.latestSelectedCount})
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCopyLink(gallery.slug)}
                              title="Salin tautan galeri klien"
                              leftIcon={
                                isCopied ? (
                                  <IconCheck className="w-3.5 h-3.5 text-[#10b981]" />
                                ) : (
                                  <IconCopy className="w-3.5 h-3.5 text-[#818898]" />
                                )
                              }
                            >
                              {isCopied ? "Tersalin!" : "Salin link"}
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleShareToClientWA(gallery)}
                              title="Kirim pesan seleksi via WhatsApp"
                              leftIcon={<IconWhatsApp className="w-3.5 h-3.5" />}
                            >
                              Kirim WA
                            </Button>

                            <a
                              href={`/g/${gallery.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 rounded-[8px] border transition ${
                                isDarkMode
                                  ? "border-[#2e334a] text-slate-400 hover:text-white hover:bg-[#1a1d2d]"
                                  : "border-[#cdd2d9] text-[#818898] hover:text-[#272835] hover:bg-[#f6f8fa]"
                              }`}
                              title="Pratinjau Galeri Klien"
                            >
                              <IconExternalLink className="w-4 h-4" />
                            </a>

                            <Button
                              size="sm"
                              variant="danger-ghost"
                              onClick={() =>
                                setGalleryToDelete({ slug: gallery.slug, title: gallery.title })
                              }
                              className="px-2"
                              title="Hapus Galeri"
                            >
                              <IconTrash className="w-4 h-4" />
                            </Button>
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
              <Button
                variant="secondary"
                size="sm"
                disabled={isDeletingGallery}
                onClick={() => setGalleryToDelete(null)}
              >
                Batal
              </Button>
              <Button
                variant="danger-ghost"
                size="sm"
                disabled={isDeletingGallery}
                isLoading={isDeletingGallery}
                onClick={confirmDeleteGallery}
                className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50"
              >
                Ya, Hapus Galeri
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
