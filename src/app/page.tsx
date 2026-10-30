"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PicuraLogo } from "@/components/PicuraLogo";
import AuthModal from "@/components/AuthModal";
import {
  IconArrowRight,
  IconCheck,
  IconLock,
  IconFolder,
  IconWhatsApp,
  IconSparkles,
  PixelArtMosaic,
  IconExternalLink,
} from "@/components/Icons";

export default function Home() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    subscriptionTier: string;
    studioName?: string | null;
  } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;
    if (token) {
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#36394a] flex flex-col font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* 1. Announcement Bar (Top-of-page promo strip) */}
      <div className="bg-[#14151f] text-white text-xs py-2.5 px-4 text-center border-b border-white/10 flex flex-wrap items-center justify-center gap-2">
        <span className="font-medium text-slate-200">
          Stop Salin Manual Kode Foto! Klien Kurasi dari Google Drive & Langsung Terkirim Instan ke WhatsApp.
        </span>
        <button
          onClick={() => setIsAuthOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#14151f] hover:bg-[#5e4cff] hover:text-white font-semibold text-[11px] transition-all duration-200 shadow-sm active:scale-95"
        >
          <span>⚡ Bikin Galeri Klien Pertama — 100% Gratis!</span>
          <IconArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 2. Primary Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#cdd2d9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <PicuraLogo className="h-7 w-auto text-[#272835]" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#36394a]">
            <a href="#features" className="hover:text-[#5e4cff] transition">Fitur</a>
            <a href="#how-it-works" className="hover:text-[#5e4cff] transition">Cara Kerja</a>
            <a href="#pricing" className="hover:text-[#5e4cff] transition">Harga</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-[8px] bg-[#272835] text-white text-xs font-medium hover:bg-[#1a1b25] transition"
              >
                Buka Dashboard
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3.5 py-1.5 rounded-[8px] text-xs font-medium text-[#36394a] hover:bg-[#f6f8fa] border border-[#cdd2d9] transition"
                >
                  Masuk
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition"
                >
                  Mulai Gratis
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Split-asymmetric with Pixel-Art Mosaic) */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#cdd2d9] overflow-hidden bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 cols: Headline + Sub + CTAs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#f6f8fa] border border-[#cdd2d9] text-xs font-mono text-[#666d80]">
                <IconSparkles className="w-3.5 h-3.5 text-[#5e4cff]" />
                <span>Zero Re-upload • Direct Google CDN & WhatsApp</span>
              </div>

              <h1 className="font-heading font-semibold text-4xl sm:text-6xl text-[#36394a] tracking-tight leading-[1.05]">
                Pilih Foto Klien Langsung ke WhatsApp Tanpa Re-upload.
              </h1>

              <p className="text-base sm:text-lg text-[#666d80] max-w-2xl font-normal leading-relaxed">
                Tautkan folder Google Drive Anda dalam hitungan detik. Klien menandai foto favorit di browser, dan daftar kode file terkirim rapi ke WhatsApp editor tanpa salah ketik nama file.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-[8px] bg-[#5e4cff] text-white font-medium text-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm"
                  >
                    <span>Masuk ke Dashboard</span>
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-6 py-3 rounded-[8px] bg-[#5e4cff] text-white font-medium text-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm"
                  >
                    <span>Mulai Buat Galeri Gratis</span>
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-5 py-3 rounded-[8px] bg-white text-[#36394a] font-medium text-sm border border-[#cdd2d9] hover:bg-[#f6f8fa] transition flex items-center gap-2"
                >
                  <span>Masuk ke Akun</span>
                </button>
              </div>

              {/* Sub-proof metadata */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#818898] font-mono">
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
                  <span>Tanpa Kartu Kredit</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
                  <span>Format WhatsApp Otomatis</span>
                </span>
              </div>
            </div>

            {/* Right 4 cols: Pixel-Art Hero Decoration */}
            <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
              <PixelArtMosaic className="hidden sm:grid" />
            </div>
          </div>
        </div>
      </section>



      {/* 5. Features Grid (2 or 3 Columns) */}
      <section id="features" className="py-20 bg-white border-b border-[#cdd2d9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-xl">
            <h2 className="font-heading font-semibold text-3xl text-[#272835] tracking-tight">
              Dirancang Khusus untuk Alur Kerja Fotografer Modern
            </h2>
            <p className="text-sm text-[#666d80] mt-2">
              Tanpa repot upload ulang gigabyte foto, tanpa salah ketik nomor file di chat WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#dfdbff] text-[#5e4cff] flex items-center justify-center font-mono text-sm font-semibold">
                <IconFolder className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#272835]">
                Koneksi Google Drive Instan
              </h3>
              <p className="text-xs text-[#666d80] leading-relaxed">
                Cukup tempel URL folder Google Drive Anda. Picura langsung mengekstrak daftar file dan merender preview super cepat tanpa re-upload.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#ecfdf5] text-[#10b981] flex items-center justify-center font-mono text-sm font-semibold">
                <IconWhatsApp className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#272835]">
                Format WhatsApp Sekali Klik
              </h3>
              <p className="text-xs text-[#666d80] leading-relaxed">
                Setelah klien selesai menandai foto, format pesan teks tersusun rapi dengan nama file dan catatan khusus yang langsung diteruskan ke WhatsApp Anda.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] space-y-3">
              <div className="w-9 h-9 rounded-[8px] bg-[#dfdbff] text-[#5e4cff] flex items-center justify-center font-mono text-sm font-semibold">
                <IconLock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#272835]">
                Proteksi Kata Sandi Klien
              </h3>
              <p className="text-xs text-[#666d80] leading-relaxed">
                Jaga kerahasiaan sesi foto klien dengan PIN/password opsional. Hanya klien pemilik sesi yang dapat membuka galeri dan memilih foto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-b border-[#cdd2d9]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-heading font-semibold text-3xl text-[#272835] tracking-tight">
              Harga Sederhana & Transparan
            </h2>
            <p className="text-sm text-[#666d80]">
              Mulai gratis sekarang. Upgrade saat bisnis studio fotografi Anda berkembang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] flex flex-col justify-between">
              <div>
                <span className="font-heading font-semibold text-lg text-[#272835] block">Freemium</span>
                <span className="font-heading font-semibold text-2xl text-[#272835] mt-2 block">Gratis</span>
                <p className="text-xs text-[#818898] mt-1 mb-5">Untuk fotografer yang baru mulai.</p>
                <ul className="space-y-2.5 text-xs text-[#666d80]">
                  <li className="flex items-center gap-2">✓ 2 Galeri Aktif</li>
                  <li className="flex items-center gap-2">✓ Ekstrak Google Drive</li>
                  <li className="flex items-center gap-2">✓ Kirim ke WhatsApp</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="mt-6 w-full py-2 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] text-xs font-medium hover:bg-[#f6f8fa] transition"
              >
                Mulai Gratis
              </button>
            </div>

            {/* Pro */}
            <div className="bg-[#f6f8fa] rounded-[12px] p-6 border-2 border-[#5e4cff] flex flex-col justify-between relative shadow-sm">
              <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-[#5e4cff] text-white text-[10px] font-mono font-medium">
                POPULER
              </span>
              <div>
                <span className="font-heading font-semibold text-lg text-[#272835] block">Pro Freelance</span>
                <span className="font-heading font-semibold text-2xl text-[#272835] mt-2 block">
                  Rp 49.000 <span className="text-xs text-[#818898] font-normal">/ bln</span>
                </span>
                <p className="text-xs text-[#818898] mt-1 mb-5">Fotografer wedding & wisuda aktif.</p>
                <ul className="space-y-2.5 text-xs text-[#666d80]">
                  <li className="flex items-center gap-2">✓ Hingga 15 Galeri Aktif</li>
                  <li className="flex items-center gap-2">✓ Proteksi Password Galeri</li>
                  <li className="flex items-center gap-2">✓ Custom Kuota Foto per Sesi</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="mt-6 w-full py-2 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 transition"
              >
                Pilih Pro
              </button>
            </div>

            {/* Studio */}
            <div className="bg-white rounded-[12px] p-6 border border-[#cdd2d9] flex flex-col justify-between">
              <div>
                <span className="font-heading font-semibold text-lg text-[#272835] block">Studio Agency</span>
                <span className="font-heading font-semibold text-2xl text-[#272835] mt-2 block">
                  Rp 129.000 <span className="text-xs text-[#818898] font-normal">/ bln</span>
                </span>
                <p className="text-xs text-[#818898] mt-1 mb-5">Untuk studio foto & agency.</p>
                <ul className="space-y-2.5 text-xs text-[#666d80]">
                  <li className="flex items-center gap-2">✓ Galeri Tanpa Batas (Unlimited)</li>
                  <li className="flex items-center gap-2">✓ Custom Branding Nama Studio</li>
                  <li className="flex items-center gap-2">✓ Multi-editor WhatsApp Routing</li>
                </ul>
              </div>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="mt-6 w-full py-2 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] text-xs font-medium hover:bg-[#f6f8fa] transition"
              >
                Pilih Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#818898]">
          <div className="flex items-center gap-3">
            <PicuraLogo className="h-5 w-auto text-[#272835]" />
            <span>&copy; {new Date().getFullYear()} Picura. Platform Seleksi Foto untuk Fotografer.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://picura.web.id"
              className="text-[#5e4cff] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>picura.web.id</span>
              <IconExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
