"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import HeroBalanceChart from "@/components/HeroBalanceChart";
import MetricsGrid from "@/components/MetricsGrid";
import RecentActivity from "@/components/RecentActivity";
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
} from "@/components/Icons";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    studioName?: string | null;
    studioWhatsapp?: string | null;
    subscriptionTier: string;
  } | null>(null);

  const [stats, setStats] = useState<{
    activeGalleries: number;
    quotaLimit: number;
    totalSelections: number;
  } | null>(null);

  interface GalleryItem {
    id: string;
    title: string;
    slug: string;
    maxSelectionQuota: number;
    totalPhotos: number;
    latestSelectedCount: number;
    editorWhatsappNumber?: string;
    hasPassword?: boolean;
    expiresAt?: string | null;
    createdAt?: string;
  }

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedGalleryResult, setSelectedGalleryResult] = useState<{
    title: string;
    editor_phone?: string;
    data: {
      client_name: string;
      total_selected: number;
      selected_files: { file_id: string; filename: string }[];
    };
  } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

        // 2. Fetch galleries for this real user
        const galRes = await fetch("/api/v1/galleries", { headers });
        const galData = await galRes.json();
        if (galData.status === "success") {
          setGalleries(galData.data || []);
        }
      } else {
        setUser(null);
        setStats(null);
        setGalleries([]);
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
    setStats(null);
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

  const handleDeleteGallery = async (slug: string) => {
    if (!confirm("Hapus sesi galeri ini beserta hasil seleksinya?")) return;
    try {
      const token = localStorage.getItem("picura_token");
      const res = await fetch(`/api/v1/galleries/${slug}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) fetchDashboardData();
    } catch {
      alert("Gagal menghapus galeri");
    }
  };

  const handleViewResults = async (gallery: GalleryItem) => {
    try {
      const res = await fetch(`/api/v1/galleries/${gallery.slug}`);
      const data = await res.json();
      if (data.status === "success") {
        const selectedFiles =
          gallery.latestSelectedCount > 0
            ? data.data.photos.slice(0, gallery.latestSelectedCount)
            : [];

        setSelectedGalleryResult({
          title: gallery.title,
          editor_phone: gallery.editorWhatsappNumber,
          data: {
            client_name: "Klien Picura",
            total_selected: gallery.latestSelectedCount,
            selected_files: selectedFiles.map((p: { id: string; filename: string }) => ({
              file_id: p.id,
              filename: p.filename,
            })),
          },
        });
      }
    } catch {
      console.error("Failed to load results");
    }
  };

  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  const filteredGalleries = galleries.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPhotosCount = galleries.reduce((acc, g) => acc + (g.totalPhotos || 0), 0);

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#36394a] flex font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* 260px Fixed Width Sidebar */}
      <Sidebar
        user={user}
        stats={stats}
        onUpgradeClick={() => setIsUpgradeOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-[#cdd2d9] flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-heading font-semibold text-xl text-[#272835] tracking-tight leading-none">
              Overview Studio
            </h1>
            <p className="text-xs text-[#818898] mt-1 hidden sm:block">
              {user ? `Halo, ${user.name}` : "Silakan masuk ke akun fotografer"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="relative hidden md:block w-52">
                  <IconSearch className="w-4 h-4 text-[#818898] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari galeri..."
                    className="w-full text-xs pl-9 pr-3 py-1.5 rounded-[8px] border border-[#cdd2d9] bg-[#f6f8fa] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff]"
                  />
                </div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#f6f8fa] text-[#666d80] transition"
                  title="Pengaturan Studio & API Key"
                >
                  <IconSettings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (!isPro && (stats?.activeGalleries || 0) >= 2) {
                      setIsUpgradeOpen(true);
                    } else {
                      setIsCreateOpen(true);
                    }
                  }}
                  className="py-2 px-3.5 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
                >
                  <IconPlus className="w-4 h-4" />
                  <span>Buat Galeri</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="py-2 px-4 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
              >
                <IconLogIn className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1200px] w-full">
          {!user && (
            <div className="p-6 bg-white rounded-[12px] border border-[#cdd2d9] text-center space-y-3">
              <IconFolder className="w-10 h-10 text-[#818898] mx-auto" />
              <h2 className="font-heading font-semibold text-lg text-[#272835]">
                Mulai Kelola Seleksi Foto Anda
              </h2>
              <p className="text-xs text-[#666d80] max-w-md mx-auto">
                Daftar sekarang untuk menghubungkan folder Google Drive secara langsung dan mengirimkan link seleksi foto ke klien Anda.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="py-2 px-5 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <IconLogIn className="w-4 h-4" />
                <span>Daftar Akun Gratis</span>
              </button>
            </div>
          )}

          {/* 1. Hero Balance Section */}
          <HeroBalanceChart
            balanceAmount="Rp 1.450.000"
            totalPhotosCount={totalPhotosCount}
            totalSelectionsCount={galleries.reduce((acc, g) => acc + (g.latestSelectedCount > 0 ? 1 : 0), 0)}
            activeRate="+28.4%"
          />

          {/* 2. Metrics Grid */}
          <MetricsGrid
            quotaUsed={stats?.activeGalleries || galleries.length}
            quotaLimit={isPro ? 9999 : stats?.quotaLimit || 2}
            driveRequests={totalPhotosCount * 8}
            selectionsSaved={stats?.totalSelections || 0}
          />

          {/* 3. Galleries Management Table / Cards */}
          <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eceff3]">
              <div>
                <h3 className="font-heading font-semibold text-lg text-[#272835]">
                  Daftar Galeri Aktif ({filteredGalleries.length})
                </h3>
                <p className="text-xs text-[#818898]">
                  Kelola tautan bukti foto, pantau status pilihan klien, dan salin link
                </p>
              </div>

              {user && (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="py-1.5 px-3 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#f6f8fa] text-xs font-medium text-[#36394a] transition self-start sm:self-auto flex items-center gap-1.5"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  <span>Tambah Sesi</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-[#818898] flex items-center justify-center gap-2 text-xs">
                <IconSpinner className="w-5 h-5 text-[#5e4cff]" />
                <span>Memuat data galeri...</span>
              </div>
            ) : filteredGalleries.length === 0 ? (
              <div className="py-12 text-center text-[#818898] space-y-2">
                <IconFolder className="w-8 h-8 mx-auto text-[#c1c7d0]" />
                <p className="text-xs font-medium text-[#666d80]">Belum ada galeri sesi foto</p>
                <p className="text-[11px] text-[#818898]">
                  Klik tombol &ldquo;Buat Galeri&rdquo; untuk menautkan folder Google Drive pertama Anda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#eceff3]">
                {filteredGalleries.map((gallery) => {
                  const isCopied = copiedSlug === gallery.slug;

                  return (
                    <div
                      key={gallery.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f6f8fa] px-3 rounded-[8px] transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#272835]">
                            {gallery.title}
                          </span>
                          {gallery.hasPassword && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#f6f8fa] text-[#818898] border border-[#cdd2d9]">
                              <IconLock className="w-3 h-3" />
                              <span>PIN</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#818898] font-mono">
                          <span>{gallery.totalPhotos || 0} Foto</span>
                          <span>•</span>
                          <span>Maks {gallery.maxSelectionQuota} Pilihan</span>
                          {gallery.latestSelectedCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-[#5e4cff] font-medium">
                                {gallery.latestSelectedCount} Foto Terpilih
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {gallery.latestSelectedCount > 0 && (
                          <button
                            onClick={() => handleViewResults(gallery)}
                            className="px-3 py-1.5 rounded-[8px] bg-[#dfdbff] text-[#5e4cff] hover:opacity-90 text-xs font-medium transition flex items-center gap-1.5"
                            title="Lihat foto yang dipilih klien"
                          >
                            <IconEye className="w-3.5 h-3.5" />
                            <span>Hasil Seleksi</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleCopyLink(gallery.slug)}
                          className="px-3 py-1.5 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#eceff3] text-xs font-medium text-[#36394a] transition flex items-center gap-1.5"
                          title="Salin link galeri klien"
                        >
                          {isCopied ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-[#10b981]" />
                              <span className="text-[#10b981]">Tersalin</span>
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
                          className="p-2 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#eceff3] text-[#10b981] transition"
                          title="Bagikan link ke WhatsApp Klien"
                        >
                          <IconWhatsApp className="w-4 h-4" />
                        </button>

                        <a
                          href={`/g/${gallery.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#eceff3] text-[#818898] hover:text-[#272835] transition"
                          title="Buka tampilan klien"
                        >
                          <IconExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDeleteGallery(gallery.slug)}
                          className="p-2 rounded-[8px] border border-[#cdd2d9] bg-white hover:bg-[#fef2f2] text-[#818898] hover:text-[#ef4444] transition"
                          title="Hapus galeri"
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

          {/* 4. Recent Activity */}
          <RecentActivity />
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
    </div>
  );
}
