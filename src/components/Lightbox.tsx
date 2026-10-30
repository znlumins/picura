"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
} from "lucide-react";

export interface LightboxPhoto {
  id: string;
  filename: string;
  thumbnail_url: string;
  preview_url: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  selectedIds: Set<string>;
  onToggleSelect: (photo: LightboxPhoto) => void;
  isMaxReached: boolean;
}

export default function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  selectedIds,
  onToggleSelect,
  isMaxReached,
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentPhoto = photos[currentIndex];
  const isSelected = currentPhoto ? selectedIds.has(currentPhoto.id) : false;

  const handlePrev = useCallback(() => {
    setZoom(1);
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    setZoom(1);
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " " && currentPhoto) {
        e.preventDefault();
        onToggleSelect(currentPhoto);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, currentPhoto, onToggleSelect]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> Next
      handleNext();
    } else if (diff < -50) {
      // Swiped right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-sm font-medium text-slate-200 truncate max-w-[220px] sm:max-w-md">
            {currentPhoto.filename}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Selection inside Lightbox */}
          <button
            onClick={() => onToggleSelect(currentPhoto)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              isSelected
                ? "bg-brand-violet text-white ring-2 ring-indigo-400"
                : isMaxReached
                ? "bg-white/10 text-slate-400 cursor-not-allowed"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Check className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-300"}`} />
            <span>{isSelected ? "Terpilih" : "Pilih Foto"}</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 transition ml-1"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/75 transition backdrop-blur-sm"
          title="Foto Sebelumnya (Panah Kiri)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image with zoom transformation */}
        <div
          className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhoto.preview_url || currentPhoto.thumbnail_url}
            alt={currentPhoto.filename}
            className="max-h-[80vh] max-w-[92vw] object-contain rounded-sm shadow-2xl transition-opacity duration-300 select-none"
            draggable={false}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/75 transition backdrop-blur-sm"
          title="Foto Selanjutnya (Panah Kanan)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom info helper */}
      <div className="py-2.5 px-4 bg-black/40 text-center text-[11px] text-slate-400 hidden sm:block">
        Gunakan tombol panah keyboard atau geser (swipe) untuk berganti foto. Tekan Spasi untuk memilih foto.
      </div>
    </div>
  );
}
