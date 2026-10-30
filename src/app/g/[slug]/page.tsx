"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ClientGallery from "@/components/ClientGallery";
import PasswordPrompt from "@/components/PasswordPrompt";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [galleryData, setGalleryData] = useState<any>(null);

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

      if (data.status === "locked" || data.is_password_protected && !data.data.photos) {
        setIsLocked(true);
        setGalleryData(data.data);
      } else {
        setIsLocked(false);
        setGalleryData(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat galeri");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-brand-primary">
        <Loader2 className="w-8 h-8 animate-spin text-brand-violet mb-3" />
        <p className="text-xs font-semibold text-brand-muted">Memuat galeri foto...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="w-14 h-14 bg-slate-200 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
          <Clock className="w-7 h-7" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-brand-primary mb-1">
          Masa Aktif Berakhir
        </h2>
        <p className="text-xs text-brand-muted max-w-sm mb-6">
          Tautan galeri ini telah melewati batas waktu kadaluarsa. Silakan hubungi fotografer atau studio untuk meminta perpanjangan akses.
        </p>
        <Link
          href="/"
          className="text-xs font-bold text-brand-violet hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-brand-primary mb-1">
          Galeri Tidak Ditemukan
        </h2>
        <p className="text-xs text-brand-muted max-w-sm mb-6">{error}</p>
        <Link
          href="/"
          className="text-xs font-bold text-brand-violet hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <PasswordPrompt
        galleryTitle={galleryData?.title || "Sesi Foto"}
        photographerName={galleryData?.photographer?.name}
        onVerify={handlePasswordVerify}
      />
    );
  }

  return <ClientGallery gallery={galleryData} />;
}
