"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ClientGallery from "@/components/ClientGallery";
import PasswordPrompt from "@/components/PasswordPrompt";
import { IconSpinner, IconAlert, IconClock, IconArrowRight } from "@/components/Icons";
import Link from "next/link";

export default function GalleryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [galleryData, setGalleryData] = useState<{
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
  } | null>(null);

  const fetchGallery = useCallback(async (token?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      const savedToken = token || localStorage.getItem(`picura_token_${slug}`);
      if (savedToken) {
        headers["x-gallery-token"] = savedToken;
      }

      const res = await fetch(`/api/v1/galleries/${slug}`, { headers });
      const data = await res.json();

      if (res.status === 410 || data.error === "GALLERY_EXPIRED") {
        setIsExpired(true);
        setIsLoading(false);
        return;
      }

      if (!res.ok && res.status !== 200) {
        throw new Error(data.message || data.error || "Gagal memuat galeri");
      }

      if (data.status === "locked" || (data.is_password_protected && !data.data.photos)) {
        setIsLocked(true);
        setGalleryData(data.data);
      } else {
        setIsLocked(false);
        setGalleryData(data.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat galeri";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchGallery();
    }
  }, [slug, fetchGallery]);

  const handlePasswordVerify = async (password: string): Promise<boolean> => {
    const res = await fetch(`/api/v1/galleries/${slug}/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem(`picura_token_${slug}`, data.token);
      await fetchGallery(data.token);
      return true;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8fa] text-[#36394a]">
        <IconSpinner className="w-8 h-8 text-[#5e4cff] mb-3" />
        <p className="text-xs font-mono text-[#818898]">Menghubungkan Google Drive & memuat foto...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f6f8fa] text-center text-[#36394a]">
        <div className="w-12 h-12 bg-white text-[#818898] rounded-[8px] flex items-center justify-center mb-4 border border-[#cdd2d9] shadow-sm">
          <IconClock className="w-6 h-6" />
        </div>
        <h2 className="font-heading font-semibold text-xl text-[#272835] mb-1">
          Masa Aktif Berakhir
        </h2>
        <p className="text-xs text-[#666d80] max-w-sm mb-6">
          Tautan galeri ini telah melewati batas waktu yang ditentukan. Silakan hubungi fotografer atau studio untuk meminta perpanjangan akses.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-[8px] bg-[#272835] text-white text-xs font-medium hover:bg-[#1a1b25] transition inline-flex items-center gap-1.5"
        >
          <span>Kembali ke Beranda</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (error || !galleryData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f6f8fa] text-center text-[#36394a]">
        <div className="w-12 h-12 bg-[#fef2f2] text-[#ef4444] rounded-[8px] flex items-center justify-center mb-4 border border-[#fecaca]">
          <IconAlert className="w-6 h-6" />
        </div>
        <h2 className="font-heading font-semibold text-xl text-[#272835] mb-1">
          Galeri Tidak Ditemukan
        </h2>
        <p className="text-xs text-[#666d80] max-w-sm mb-6">
          {error || "Tautan galeri foto ini mungkin tidak valid atau sudah dihapus oleh fotografer."}
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-[8px] bg-[#272835] text-white text-xs font-medium hover:bg-[#1a1b25] transition inline-flex items-center gap-1.5"
        >
          <span>Kembali ke Beranda</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <PasswordPrompt
        galleryTitle={galleryData.title}
        photographerName={galleryData.photographer?.name}
        onVerify={handlePasswordVerify}
      />
    );
  }

  return <ClientGallery gallery={galleryData} />;
}
