"use client";

import { useState, useMemo } from "react";
import {
  IconCheck,
  IconSearch,
  IconPhoto,
  IconAlert,
  IconArrowRight,
  IconEye,
} from "@/components/Icons";
import Lightbox, { LightboxPhoto } from "./Lightbox";
import SelectionReviewModal from "./SelectionReviewModal";

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
    <div className="min-h-screen bg-[#f6f8fa] text-[#36394a] pb-32 relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#272835] text-white text-xs font-mono font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2">
          <IconAlert className="w-4 h-4 text-[#dfdbff]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#cdd2d9]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Gallery Info & Quota Counter */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-semibold text-base sm:text-lg text-[#272835] truncate max-w-[200px] sm:max-w-md">
                  {gallery.title}
                </h1>
                {gallery.photographer?.name && (
                  <span className="hidden sm:inline-block text-[11px] font-mono text-[#818898] bg-[#f6f8fa] px-2 py-0.5 rounded-full border border-[#cdd2d9]">
                    oleh {gallery.photographer.name}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#666d80]">
                Pilih foto favorit Anda untuk proses retouching & editing
              </div>
            </div>

            {/* Selection Counter Badge */}
            <div className="flex items-center gap-1.5 ml-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                  selectedIds.size > 0
                    ? "bg-[#dfdbff] text-[#5e4cff] border border-[#c8ccf3]"
                    : "bg-[#f6f8fa] text-[#818898] border border-[#cdd2d9]"
                }`}
              >
                <IconCheck className="w-3.5 h-3.5" />
                <span>
                  {selectedIds.size} / {gallery.max_selection_quota || "∞"} Foto
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex items-center gap-2">
            <div className="flex bg-[#f6f8fa] p-1 rounded-[8px] text-xs font-medium border border-[#cdd2d9]">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-[6px] transition ${
                  activeTab === "all"
                    ? "bg-white text-[#272835] shadow-sm font-semibold"
                    : "text-[#666d80] hover:text-[#272835]"
                }`}
              >
                Semua ({gallery.photos.length})
              </button>
              <button
                onClick={() => setActiveTab("selected")}
                className={`px-3 py-1 rounded-[6px] transition flex items-center gap-1.5 ${
                  activeTab === "selected"
                    ? "bg-white text-[#272835] shadow-sm font-semibold"
                    : "text-[#666d80] hover:text-[#272835]"
                }`}
              >
                <span>Terpilih</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#dfdbff] text-[#5e4cff]">
                  {selectedIds.size}
                </span>
              </button>
            </div>

            <div className="relative flex-1 sm:w-48">
              <IconSearch className="w-3.5 h-3.5 text-[#818898] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari file..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Photo Grid */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[12px] border border-[#cdd2d9] p-8">
            <IconPhoto className="w-10 h-10 text-[#818898] mx-auto mb-3" />
            <h3 className="text-sm font-heading font-semibold text-[#272835]">Tidak ada foto ditemukan</h3>
            <p className="text-xs text-[#666d80] mt-1">
              {activeTab === "selected"
                ? "Anda belum memilih foto. Ketuk foto atau tombol pilih pada foto untuk memulai."
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
                  className={`group relative aspect-square rounded-[12px] overflow-hidden bg-white border transition duration-200 ${
                    isSelected
                      ? "border-[#5e4cff] ring-2 ring-[#5e4cff]/30 shadow-sm"
                      : "border-[#cdd2d9] hover:border-[#818898]"
                  }`}
                >
                  {/* Photo Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbnail_url}
                    alt={photo.filename}
                    loading="lazy"
                    onClick={() => setLightboxIndex(index)}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Top Right: Selection Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(photo);
                    }}
                    className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition shadow-md ${
                      isSelected
                        ? "bg-[#5e4cff] text-white scale-105"
                        : "bg-white/90 text-[#36394a] hover:bg-white border border-[#cdd2d9]"
                    }`}
                    title={isSelected ? "Hapus dari pilihan" : "Pilih foto"}
                  >
                    <IconCheck className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Overlay Info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-mono truncate max-w-[120px]">
                      {photo.filename}
                    </span>
                    <button
                      onClick={() => setLightboxIndex(index)}
                      className="p-1 rounded-[4px] hover:bg-white/20 text-white/90"
                      title="Perbesar foto"
                    >
                      <IconEye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar for Submission */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-lg w-full">
          <div className="bg-white rounded-[12px] p-3 sm:p-4 border border-[#cdd2d9] shadow-2xl flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#272835] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5e4cff]" />
                <span>{selectedIds.size} Foto Dipilih</span>
              </div>
              <div className="text-[11px] text-[#666d80] mt-0.5">
                {gallery.max_selection_quota > 0
                  ? `Sisa kuota: ${gallery.max_selection_quota - selectedIds.size} foto`
                  : "Siap dikirimkan ke fotografer"}
              </div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span>Kirim Pilihan</span>
              <IconArrowRight className="w-4 h-4" />
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
          onNavigate={(idx) => setLightboxIndex(idx)}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          isMaxReached={isMaxReached}
        />
      )}

      {/* Selection Review & WhatsApp Submission Modal */}
      <SelectionReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        selectedPhotos={selectedPhotosList}
        editorWhatsapp={gallery.editor_whatsapp}
        galleryTitle={gallery.title}
        onSubmit={handleSubmitSelection}
      />
    </div>
  );
}
