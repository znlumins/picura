"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CreateGalleryModal from "@/components/CreateGalleryModal";
import UpgradeModal from "@/components/UpgradeModal";
import SelectionDetailModal from "@/components/SelectionDetailModal";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Trash2,
  Lock,
  Layers,
  Crown,
  Camera,
  CheckCircle2,
  Loader2,
  Eye,
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

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch current user & quota stats
      const userRes = await fetch("/api/v1/auth/me");
      const userData = await userRes.json();
      if (userData.status === "success") {
        setUser(userData.user);
        setStats(userData.stats);
      }

      // 2. Fetch galleries
      const galRes = await fetch("/api/v1/galleries");
      const galData = await galRes.json();
      if (galData.status === "success") {
        setGalleries(galData.data);
      }
    } catch (err) {
      console.error(err);
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
    if (!confirm("Apakah Anda yakin ingin menghapus galeri ini beserta hasil seleksinya?")) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/galleries/${slug}`, { method: "DELETE" });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch {
      alert("Gagal menghapus galeri");
    }
  };

  const handleViewResults = async (gallery: any) => {
    try {
      // Fetch gallery submission logs
      const res = await fetch(`/api/v1/galleries/${gallery.slug}`);
      const data = await res.json();
      if (data.status === "success") {
        // If selections are available in the gallery object
        const selectedFiles = gallery.latestSelectedCount > 0
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
    } catch (err) {
      console.error(err);
    }
  };

  const isPro = user?.subscriptionTier === "PRO_FREELANCE" || user?.subscriptionTier === "STUDIO";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onUpgradeClick={() => setIsUpgradeOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Top Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-brand-primary">
                Dashboard Fotografer
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isPro
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                Paket {user?.subscriptionTier || "FREEMIUM"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted">
              Kelola sesi foto Google Drive dan pantau pilihan klien secara instan tanpa re-upload file.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Upgrade ke Pro</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isPro && stats?.activeGalleries >= 2) {
                  setIsUpgradeOpen(true);
                } else {
                  setIsCreateOpen(true);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-violet hover:bg-brand-violetHover text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Buat Galeri Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-violetLight text-brand-violet flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-brand-muted block">Galeri Aktif</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-brand-primary">
                  {stats?.activeGalleries || 0}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / {isPro ? "Unlimited" : `${stats?.quotaLimit || 2} Kuota`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-brand-muted block">Seleksi Selesai</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-brand-primary">
                  {stats?.totalSelections || 0}
                </span>
                <span className="text-xs text-slate-400 font-medium">Sesi</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-brand-muted block">Drive API Mode</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-bold text-brand-primary">Read-Only v3</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery List Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-brand-primary">
              Daftar Galeri Klien
            </h2>
            <p className="text-xs text-brand-muted">
              Pantau status peninjauan dan daftar foto terpilih klien
            </p>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-violet mx-auto mb-2" />
            <span className="text-xs text-brand-muted">Memuat galeri...</span>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-brand-border p-8">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-brand-primary">
              Belum Ada Galeri
            </h3>
            <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto mb-4">
              Mulai buat galeri pertama Anda dengan menghubungkan link folder Google Drive berisi foto mentah.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-brand-violet text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-violetHover transition"
            >
              + Buat Galeri Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleries.map((gallery) => {
              const isCompleted = gallery.status === "COMPLETED";

              return (
                <div
                  key={gallery.id}
                  className="bg-white rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Status & Security Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isCompleted
                            ? "bg-brand-violetLight text-brand-violet"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCompleted ? "bg-brand-violet" : "bg-emerald-500"
                          }`}
                        />
                        {isCompleted ? "Seleksi Selesai" : "Sedang Berjalan"}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        {gallery.hasPassword && (
                          <span
                            className="p-1 rounded bg-slate-100 text-slate-600"
                            title="Diproteksi Kata Sandi"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span>{gallery.totalPhotos} Foto</span>
                      </div>
                    </div>

                    {/* Title & Slug */}
                    <div>
                      <h3 className="font-heading font-bold text-base text-brand-primary line-clamp-1">
                        {gallery.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                        /g/{gallery.slug}
                      </span>
                    </div>

                    {/* Selection Progress Indicator */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Progres Seleksi:</span>
                        <span className="font-bold text-brand-primary">
                          {gallery.latestSelectedCount} / {gallery.maxSelectionQuota} Foto
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-brand-violet" : "bg-brand-emerald"
                          }`}
                          style={{ width: `${gallery.progressPercent || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(gallery.slug)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                        title="Salin Tautan Galeri"
                      >
                        {copiedSlug === gallery.slug ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Share to Client WhatsApp */}
                      <button
                        onClick={() => handleShareToClientWA(gallery)}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                        title="Kirim Tautan ke WhatsApp Klien"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {/* Open Client Gallery */}
                      <a
                        href={`/g/${gallery.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                        title="Buka Tampilan Galeri Klien"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {gallery.latestSelectedCount > 0 && (
                        <button
                          onClick={() => handleViewResults(gallery)}
                          className="px-2.5 py-1.5 bg-brand-violetLight text-brand-violet hover:bg-indigo-100 rounded-lg font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Pilihan</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteGallery(gallery.slug)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Galeri"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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
        editorPhone={selectedGalleryResult?.editor_phone}
      />
    </div>
  );
}
