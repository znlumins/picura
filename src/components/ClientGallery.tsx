"use client";

import { useState, useMemo } from "react";
import {
  Check,
  Search,
  Send,
  Camera,
  Maximize2,
  AlertTriangle,
} from "lucide-react";
import Lightbox, { LightboxPhoto } from "./Lightbox";
import SelectionReviewModal from "./SelectionReviewModal";
import AmbientGlow from "./AmbientGlow";

interface ClientGalleryProps {
  gallery: {
    id: string;
    title: string;
    slug: string;
    max_selection_quota: number;
    editor_whatsapp: string;
    photographer?: {
      name: string;
      avatar?: string | null;
    };
    photos: {
      id: string;
      filename: string;
      thumbnail_url: string;
      preview_url: string;
    }[];
  };
}

export default function ClientGallery({ gallery }: ClientGalleryProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isMaxReached =
    gallery.max_selection_quota > 0 &&
    selectedIds.size >= gallery.max_selection_quota;

  const handleToggleSelect = (photo: LightboxPhoto) => {
    const next = new Set(selectedIds);
    if (next.has(photo.id)) {
      next.delete(photo.id);
      setSelectedIds(next);
    } else {
      if (isMaxReached) {
        showToast(
          `Batas maksimal kuota foto (${gallery.max_selection_quota}) telah tercapai.`
        );
        return;
      }
      next.add(photo.id);
      setSelectedIds(next);
    }
  };

  const filteredPhotos = useMemo(() => {
    let list = gallery.photos;
    if (activeTab === "selected") {
      list = list.filter((p) => selectedIds.has(p.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.filename.toLowerCase().includes(q));
    }
    return list;
  }, [gallery.photos, activeTab, selectedIds, searchQuery]);

  const selectedPhotosList = useMemo(() => {
    return gallery.photos.filter((p) => selectedIds.has(p.id));
  }, [gallery.photos, selectedIds]);

  const handleSubmitSelection = async (
    clientName: string,
    clientNotes: string
  ) => {
    const payload = {
      client_name: clientName,
      client_notes: clientNotes,
      selected_files: selectedPhotosList.map((p) => ({
        file_id: p.id,
        filename: p.filename,
      })),
    };

    const res = await fetch(`/api/v1/galleries/${gallery.slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Gagal menyimpan pilihan");
    }

    return data.data;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 relative selection:bg-white selection:text-black font-sans">
      <AmbientGlow />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass border border-accent-rose/40 text-white text-xs font-mono font-semibold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-accent-rose" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Top Bar in Refined Glass */}
      <div className="sticky top-0 z-30 glass-soft border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Gallery Info & Quota Counter */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-base sm:text-lg text-white truncate max-w-[200px] sm:max-w-md">
                  {gallery.title}
                </h1>
                {gallery.photographer?.name && (
                  <span className="hidden sm:inline-block text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                    by {gallery.photographer.name}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Pilih foto favorit Anda untuk proses retouching & editing
              </div>
            </div>

            {/* Selection Counter Badge */}
            <div className="flex items-center gap-1.5 ml-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  selectedIds.size > 0
                    ? "bg-white text-[#050505] shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    : "bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  {selectedIds.size} / {gallery.max_selection_quota || "∞"} Foto
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/[0.05] p-1 rounded-xl text-xs font-mono border border-white/10">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "all"
                    ? "bg-white text-[#050505] font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Semua ({gallery.photos.length})
              </button>
              <button
                onClick={() => setActiveTab("selected")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  activeTab === "selected"
                    ? "bg-white text-[#050505] font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Terpilih</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                  {selectedIds.size}
                </span>
              </button>
            </div>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari file..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-400 focus:outline-none focus:border-white/30 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Photo Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 relative z-10">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/10 p-8">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-heading font-bold text-white">Tidak ada foto ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "selected"
                ? "Anda belum memilih foto. Ketuk ikon centang pada foto untuk memilih."
                : "Tidak ada file yang cocok dengan pencarian."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredPhotos.map((photo, index) => {
              const isSelected = selectedIds.has(photo.id);

              return (
                <div
                  key={photo.id}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border transition-all duration-300 ${
                    isSelected
                      ? "border-white ring-2 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Photo Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbnail_url}
                    alt={photo.filename}
                    loading="lazy"
                    onClick={() => setLightboxIndex(index)}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Right: Selection Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(photo);
                    }}
                    className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-lg ${
                      isSelected
                        ? "bg-white text-[#050505] scale-110 shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                        : "bg-black/50 text-white hover:bg-black/80 backdrop-blur-md border border-white/15"
                    }`}
                    title={isSelected ? "Batalkan Pilihan" : "Pilih Foto"}
                  >
                    <Check
                      className={`w-4 h-4 stroke-[3] ${
                        isSelected ? "text-[#050505]" : "text-white"
                      }`}
                    />
                  </button>

                  {/* Bottom: Filename Badge & Lightbox Trigger */}
                  <div
                    onClick={() => setLightboxIndex(index)}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 text-white flex items-center justify-between cursor-pointer opacity-90 group-hover:opacity-100 transition"
                  >
                    <span className="text-[10px] font-mono truncate max-w-[80%] text-slate-200">
                      {photo.filename}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-300 group-hover:scale-110 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar in Glass-Strong */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-5 inset-x-4 max-w-xl mx-auto z-40 animate-fade-up">
          <div className="glass-strong text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-3xl">
            <div>
              <div className="text-xs font-heading font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                <span>{selectedIds.size} Foto Terpilih</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Maksimal kuota: {gallery.max_selection_quota} foto
              </div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-white text-[#050505] font-heading font-bold text-xs flex items-center gap-2 shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition"
            >
              <span>Kirim ke WhatsApp Editor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          isMaxReached={isMaxReached}
        />
      )}

      {/* Selection Review & WhatsApp Submission Modal */}
      <SelectionReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        galleryTitle={gallery.title}
        selectedPhotos={selectedPhotosList}
        onSubmit={handleSubmitSelection}
      />
    </div>
  );
}
