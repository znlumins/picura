"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  IconClose,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
} from "@/components/Icons";

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
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1a1b25]/95 backdrop-blur-md flex flex-col select-none font-sans"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white text-xs sm:text-sm font-mono truncate max-w-[200px] sm:max-w-xs">
            {currentPhoto.filename}
          </span>
          <span className="text-xs text-[#a4abb8] font-mono">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
            className="p-2 rounded-[8px] text-[#a4abb8] hover:text-white hover:bg-white/10 transition text-xs font-mono"
            title="Perbesar"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="p-2 rounded-[8px] text-[#a4abb8] hover:text-white hover:bg-white/10 transition text-xs font-mono"
            title="Perkecil"
          >
            -
          </button>
          {zoom > 1 && (
            <button
              onClick={() => setZoom(1)}
              className="p-2 rounded-[8px] text-[#a4abb8] hover:text-white hover:bg-white/10 transition text-xs font-mono"
              title="Reset Zoom"
            >
              1x
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-[8px] text-[#a4abb8] hover:text-white hover:bg-white/10 transition ml-2"
            title="Tutup (Esc)"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-10 p-3 rounded-full bg-[#272835]/80 text-white hover:bg-[#272835] border border-white/10 transition shadow-lg"
          title="Foto Sebelumnya"
        >
          <IconChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-10 p-3 rounded-full bg-[#272835]/80 text-white hover:bg-[#272835] border border-white/10 transition shadow-lg"
          title="Foto Selanjutnya"
        >
          <IconChevronRight className="w-5 h-5" />
        </button>

        {/* The Image */}
        <div
          className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhoto.preview_url}
            alt={currentPhoto.filename}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-[8px] shadow-2xl"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between z-10 bg-[#1a1b25]">
        <div className="text-xs text-[#a4abb8] font-mono hidden sm:block">
          Gunakan tombol panah keyboard atau spasi untuk memilih
        </div>

        <button
          onClick={() => onToggleSelect(currentPhoto)}
          disabled={!isSelected && isMaxReached}
          className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-xs font-medium transition ${
            isSelected
              ? "bg-[#5e4cff] text-white shadow-md hover:opacity-90"
              : isMaxReached
              ? "bg-[#272835] text-[#818898] border border-white/10 cursor-not-allowed"
              : "bg-white text-[#272835] hover:bg-[#f6f8fa]"
          }`}
        >
          <IconCheck className="w-4 h-4" />
          <span>{isSelected ? "Foto Dipilih (Hapus)" : isMaxReached ? "Batas Kuota Tercapai" : "Pilih Foto Ini"}</span>
        </button>
      </div>
    </div>
  );
}
