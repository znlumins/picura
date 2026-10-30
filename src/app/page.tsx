import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Check,
  Lock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-violet selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violetLight text-brand-violet text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SaaS Seleksi Foto #1 di Indonesia</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-brand-primary tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Pilih Foto Favorit Klien{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-indigo-600">
              Langsung ke WhatsApp
            </span>{" "}
            Tanpa Re-upload.
          </h1>

          <p className="text-sm sm:text-lg text-brand-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminasi typo nama file dan screenshot manual. Hubungkan folder Google Drive foto mentah, bagikan tautan interaktif ke klien, dan terima daftar presisi foto pilihan di WhatsApp editor dalam hitungan detik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-violet hover:bg-brand-violetHover text-white font-bold text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              <span>Buka Dashboard Fotografer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/g/graduation-sarah-ui-2026"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-brand-border hover:bg-slate-50 text-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-brand-violet" />
              <span>Coba Demo Galeri Klien</span>
            </Link>
          </div>

          {/* Social Proof / Stats Pill */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
              100% Google Drive API Read-Only
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
              Kompatibel iOS, Android & Desktop
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
              Waktu Muat Cepat di Bawah 2 Detik
            </span>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="font-heading font-extrabold text-3xl text-brand-primary">
              Alur Kerja Super Cepat
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Tinggalkan cara lama yang memakan waktu dan rawan salah ketik nama file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-brand-border shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-violet flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-primary">
                Tempel Link Folder Drive
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Fotografer cukup menyalin tautan folder Google Drive berisi file foto mentah. Sistem Picura langsung memindai nama dan thumbnail secara otomatis.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-brand-border shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-primary">
                Klien Memilih Interaktif
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Klien membuka tautan unik di smartphone, menikmati pratinjau lightbox layar penuh, zoom foto, dan menandai foto sesuai batas kuota.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-brand-border shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-emerald flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-brand-primary">
                Kirim Otomatis ke WhatsApp
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Begitu klien menekan tombol kirim, format pesan terstruktur beserta nomor editor langsung terbuka di WhatsApp. Editor langsung siap eksekusi editing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Demos Section */}
      <section className="py-16 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                Pengalaman Langsung
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-brand-primary mt-1">
                Jelajahi Demo Galeri Klien Picura
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1"
            >
              <span>Buka Dashboard Fotografer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo 1: Protected Gallery */}
            <div className="p-6 rounded-3xl border border-brand-border bg-slate-50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    Proteksi Password
                  </span>
                  <span className="text-xs text-slate-400">PIN: 123456</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-primary">
                  The Wedding of Radit & Vanya
                </h3>
                <p className="text-xs text-brand-muted">
                  Uji coba alur verifikasi kata sandi galeri, pratinjau thumbnail beresolusi tinggi, dan seleksi hingga 20 foto.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/g/wedding-radit-vanya"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <span>Buka Galeri Wedding (PIN: 123456)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Demo 2: Public Gallery */}
            <div className="p-6 rounded-3xl border border-brand-border bg-slate-50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Akses Langsung
                  </span>
                  <span className="text-xs text-slate-400">Kuota 10 Foto</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-primary">
                  Graduation Session - Sarah UI 2026
                </h3>
                <p className="text-xs text-brand-muted">
                  Uji coba instan tanpa sandi. Tandai foto, uji fitur pencarian nama file, dan lakukan simulasi pengiriman ke WhatsApp.
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/g/graduation-sarah-ui-2026"
                  className="w-full py-3 px-4 rounded-xl bg-brand-violet hover:bg-brand-violetHover text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <span>Buka Galeri Wisuda Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (PRD Section 4.5) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Paket Langganan
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-brand-primary">
              Harga Transparan untuk Setiap Skala Fotografer
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Mulai gratis dengan 2 galeri aktif, lalu tingkatkan kapan saja sesuai pertumbuhan sesi pemotretan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Freemium */}
            <div className="bg-white p-7 rounded-3xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  PEMULA
                </span>
                <h3 className="font-heading font-bold text-xl text-brand-primary">Freemium</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-black text-brand-primary">Rp 0</span>
                  <span className="text-xs text-slate-500"> / selamanya</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Maksimal 2 Galeri Aktif</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Integrasi Google Drive v3</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Redirection WhatsApp Otomatis</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl border border-brand-border text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center transition"
                >
                  Mulai Gratis
                </Link>
              </div>
            </div>

            {/* Pro Freelance */}
            <div className="bg-white p-7 rounded-3xl border-2 border-brand-violet shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-violet text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                Paling Diminati
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-violetLight text-brand-violet">
                  PRO FREELANCE
                </span>
                <h3 className="font-heading font-bold text-xl text-brand-primary">Pro Freelance</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-black text-brand-primary">Rp 99.000</span>
                  <span className="text-xs text-slate-500"> / bulan</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span><strong>Tanpa Batas Galeri Aktif</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Custom Logo & Watermark Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Catatan Khusus Klien per Foto</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Prioritas Caching Berkecepatan Tinggi</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-violet hover:bg-brand-violetHover text-white font-bold text-xs flex items-center justify-center transition shadow-md"
                >
                  Pilih Paket Pro
                </Link>
              </div>
            </div>

            {/* Studio Agency */}
            <div className="bg-white p-7 rounded-3xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  STUDIO SCALE
                </span>
                <h3 className="font-heading font-bold text-xl text-brand-primary">Studio Agency</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-black text-brand-primary">Rp 249.000</span>
                  <span className="text-xs text-slate-500"> / bulan</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Semua Fitur Pro Freelance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Multi-User Akun Tim (Admin & Editor)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0" />
                    <span>Custom Subdomain Galeri Klien</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl border border-brand-border text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center transition"
                >
                  Pilih Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-brand-border text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-slate-700">Picura Indonesia</span>
            <span>&copy; 2026. Hak Cipta Dilindungi.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/" className="hover:underline">Beranda</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/g/wedding-radit-vanya" className="hover:underline">Demo Galeri</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
