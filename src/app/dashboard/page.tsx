"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import AmbientGlow from "@/components/AmbientGlow";
import HeroBalanceChart from "@/components/HeroBalanceChart";
import MetricsGrid from "@/components/MetricsGrid";
import SegmentedUsageRing from "@/components/SegmentedUsageRing";
import RecentActivity from "@/components/RecentActivity";
import CreateGalleryModal from "@/components/CreateGalleryModal";
import UpgradeModal from "@/components/UpgradeModal";
import SelectionDetailModal from "@/components/SelectionDetailModal";
import {
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Trash2,
  Lock,
  Eye,
  Loader2,
  FolderOpen,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedGalleryResult, setSelectedGalleryResult] = useState<any>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/v1/auth/me");
      const userData = await userRes.json();
      if (userData.status === "success") {
        setUser(userData.user);
        setStats(userData.stats);
      }

      const galRes = await fetch("/api/v1/galleries");
      const galData = await galRes.json();
      if (galData.status === "success") {
        setGalleries(galData.data);
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

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/g/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleShareToClientWA = (gallery: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/g/${gallery.slug}`;
    const msg = `Halo Kak! Sesi foto untuk *${gallery.title}* sudah siap dipilih secara online di tautan berikut:\n\n👉 ${fullUrl}\n\nSilakan tandai maksimal ${gallery.maxSelectionQuota} foto favorit Kakak lalu kirimkan kembali ya. Terima kasih! ✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleDeleteGallery = async (slug: string) => {
    if (!confirm("Hapus sesi galeri ini beserta hasil seleksinya?")) return;
    try {
      const res = await fetch(`/api/v1/galleries/${slug}`, { method: "DELETE" });
      if (res.ok) fetchDashboardData();
    } catch {
      alert("Gagal menghapus galeri");
    }
  };

  const handleViewResults = async (gallery: any) => {
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
            selected_files: selectedFiles.map((p: any) => ({
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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex relative selection:bg-white selection:text-black font-sans">
      {/* Ambient Background Lighting & Grain Overlay */}
      <AmbientGlow />

      {/* 280px Fixed Width Sidebar (Refined Glass) */}
      <Sidebar
        user={user}
        stats={stats}
        onUpgradeClick={() => setIsUpgradeOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header (Horizontal Flex) */}
        <header className="h-20 px-6 sm:px-10 border-b border-white/10 glass-soft flex items-center justify-between sticky top-0 z-20">
          {/* Left: 30px Display Heading in Outfit & 14px Date/Greeting Subtext */}
          <div>
            <h1 className="font-heading font-extrabold text-[24px] sm:text-[30px] text-white tracking-tight leading-none">
              Overview Studio
            </h1>
            <p className="text-[14px] text-slate-400 mt-1 font-medium hidden sm:block">
              {user ? `Selamat Datang, ${user.name}` : "Memuat data fotografer..."} • 30 Oktober 2026
            </p>
          </div>

          {/* Right: 224px Wide Glass Search Bar, Primary Button With Heavy Glow, Circular 40px Avatar */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-[224px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari galeri..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-400 focus:outline-none focus:border-white/30 backdrop-blur-md transition"
              />
            </div>

            <button
              onClick={() => {
                if (!isPro && stats?.activeGalleries >= 2) {
                  setIsUpgradeOpen(true);
                } else {
                  setIsCreateOpen(true);
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-white text-[#050505] font-heading font-bold text-xs shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Buat Galeri Baru</span>
              <span className="sm:hidden">Buat</span>
            </button>

            {/* Circular Avatar (40px) with Slate Gradient */}
            <div className="w-[40px] h-[40px] rounded-full p-0.5 bg-gradient-to-tr from-slate-600 via-slate-400 to-white/70 shadow-sm shrink-0">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center font-heading font-bold text-xs text-white">
                  P
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Balance Section */}
          <HeroBalanceChart
            balanceAmount="Rp 2.450.000"
            totalPhotosCount={stats?.activeGalleries ? stats.activeGalleries * 24 : 48}
            totalSelectionsCount={stats?.totalSelections || 0}
            activeRate="+34.8% MoM"
          />

          {/* Metrics Grid (3-column glass cards: Rose, Blue, Emerald) */}
          <MetricsGrid
            quotaUsed={stats?.activeGalleries || 0}
            quotaLimit={isPro ? 999 : stats?.quotaLimit || 2}
            driveRequests={1840}
            selectionsSaved={stats?.totalSelections || 0}
          />

          {/* Bento Section: Gallery Cards & Segmented Usage Ring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Client Galleries */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">
                    Sesi Galeri Klien Aktif
                  </h2>
                  <p className="text-xs text-slate-400">
                    Folder foto terhubung langsung via Google Drive API v3
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {filteredGalleries.length} Galeri
                </span>
              </div>

              {isLoading ? (
                <div className="py-20 text-center glass rounded-3xl">
                  <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                  <span className="text-xs text-slate-400 font-mono">Memuat galeri...</span>
                </div>
              ) : filteredGalleries.length === 0 ? (
                <div className="glass rounded-3xl p-8 text-center border border-white/10">
                  <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-base text-white">
                    Belum Ada Galeri
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                    Mulai buat galeri sesi foto pertama Anda dengan menautkan link Google Drive.
                  </p>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 bg-white text-[#050505] text-xs font-heading font-bold rounded-xl shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition"
                  >
                    + Buat Galeri Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredGalleries.map((gallery) => {
                    const isCompleted = gallery.status === "COMPLETED";

                    return (
                      <div
                        key={gallery.id}
                        className="glass rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                                isCompleted
                                  ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30"
                                  : "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isCompleted ? "bg-accent-blue" : "bg-accent-emerald"
                                }`}
                              />
                              {isCompleted ? "SELESAI" : "AKTIF"}
                            </span>

                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                              {gallery.hasPassword && (
                                <span
                                  className="p-1 rounded bg-white/10 text-white"
                                  title="Diproteksi PIN/Password"
                                >
                                  <Lock className="w-3 h-3" />
                                </span>
                              )}
                              <span className="font-mono">{gallery.totalPhotos} Photos</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-heading font-bold text-base text-white line-clamp-1 group-hover:text-slate-100 transition">
                              {gallery.title}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                              /g/{gallery.slug}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 text-[11px]">Progres Seleksi:</span>
                              <span className="font-mono font-bold text-white text-xs">
                                {gallery.latestSelectedCount} / {gallery.maxSelectionQuota} Foto
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompleted ? "bg-accent-blue" : "bg-accent-emerald"
                                }`}
                                style={{ width: `${gallery.progressPercent || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons on glass-soft */}
                        <div className="pt-4 mt-3 border-t border-white/[0.08] flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopyLink(gallery.slug)}
                              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                              title="Salin Tautan Galeri"
                            >
                              {copiedSlug === gallery.slug ? (
                                <Check className="w-3.5 h-3.5 text-accent-emerald" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleShareToClientWA(gallery)}
                              className="p-2 rounded-lg text-slate-400 hover:text-accent-emerald hover:bg-accent-emerald/10 transition"
                              title="Bagikan ke WhatsApp Klien"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`/g/${gallery.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                              title="Buka Pratinjau Klien"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {gallery.latestSelectedCount > 0 && (
                              <button
                                onClick={() => handleViewResults(gallery)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-semibold transition flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Hasil</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteGallery(gallery.slug)}
                              className="p-2 text-slate-500 hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition"
                              title="Hapus Galeri"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 1 Col: Liquid Glass Card with Segmented AI Usage Ring */}
            <div className="glass rounded-3xl p-6 border border-white/15 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-white">
                    Alokasi Resource
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-blue/15 text-accent-blue border border-accent-blue/30 font-bold">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Distribusi beban operasional platform seleksi foto
                </p>
              </div>

              {/* Segmented AI Usage Ring Component */}
              <div className="flex justify-center py-2">
                <SegmentedUsageRing size={160} />
              </div>

              {/* Legend with Monospaced Percentages */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                    <span>Drive Thumbnail Sizing</span>
                  </div>
                  <span className="font-mono text-white font-semibold">38%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald" />
                    <span>WhatsApp Deep Link</span>
                  </div>
                  <span className="font-mono text-white font-semibold">28%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
                    <span>Client Reviews</span>
                  </div>
                  <span className="font-mono text-white font-semibold">18%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span>Idle Cache Headroom</span>
                  </div>
                  <span className="font-mono text-slate-400 font-semibold">16%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Panel */}
          <RecentActivity />
        </main>
      </div>

      {/* Modals */}
      <CreateGalleryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchDashboardData}
        onQuotaExceeded={() => setIsUpgradeOpen(true)}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={fetchDashboardData}
        currentTier={user?.subscriptionTier}
      />

      <SelectionDetailModal
        isOpen={!!selectedGalleryResult}
        onClose={() => setSelectedGalleryResult(null)}
        galleryTitle={selectedGalleryResult?.title || ""}
        selectionData={selectedGalleryResult?.data || null}
      />
    </div>
  );
}
