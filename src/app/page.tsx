import Link from "next/link";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black relative font-sans">
      <AmbientGlow />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-36 border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/15 text-xs font-mono text-slate-300 shadow-sm animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Refined Glass Fintech Aesthetic</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none animate-fade-up">
            Pilih Foto Klien{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Langsung ke WhatsApp
            </span>{" "}
            Tanpa Re-upload.
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed animate-fade-up">
            Platform seleksi foto interaktif berbasis Google Drive API v3 dan WhatsApp URI protocol dengan estetika modern Refined Glass, responsif kilat, dan bebas typo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 animate-fade-up">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#050505] font-heading font-bold text-sm shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <span>Buka Dashboard Fotografer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/g/graduation-sarah-ui-2026"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass border border-white/15 hover:bg-white/10 text-white font-heading font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-slate-300" />
              <span>Demo Galeri Klien</span>
            </Link>
          </div>

          {/* Social Proof Pills */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              100% Google Drive API Read-Only
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-blue" />
              Borders 1px Translucent White
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-rose" />
              Backdrop Blurs Fixed at 35px
            </span>
          </div>
        </div>
      </section>

      {/* 3 Step Features in Glass Cards */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Alur Kerja Terintegrasi
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-white">
              Sederhana, Cepat, dan Akurat
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Menghemat waktu fotografer dan mempermudah klien dalam memilih karya foto terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-7 border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-heading font-black text-lg border border-white/15">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Hubungkan Folder Drive
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fotografer cukup menyalin tautan folder Google Drive. Sistem memindai nama dan thumbnail secara otomatis tanpa mengunggah ulang file mentah berukuran besar.
              </p>
            </div>

            <div className="glass rounded-3xl p-7 border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 text-accent-blue flex items-center justify-center font-heading font-black text-lg border border-accent-blue/20">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Klien Menandai Interaktif
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klien membuka tautan galeri unik di smartphone, menikmati pratinjau Lightbox layar penuh, zoom foto, dan menandai foto sesuai batas kuota sesi.
              </p>
            </div>

            <div className="glass rounded-3xl p-7 border border-white/10 space-y-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-emerald/15 text-accent-emerald flex items-center justify-center font-heading font-black text-lg border border-accent-emerald/20">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Kirim Langsung ke WhatsApp
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Daftar presisi nama file foto terpilih dirangkum otomatis dan dialihkan langsung ke WhatsApp editor dalam satu ketukan tanpa risiko salah ketik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gallery Demo Cards */}
      <section className="py-16 relative z-10 border-y border-white/10 glass-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Live Preview
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                Jelajahi Demo Galeri Klien Picura
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-mono font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <span>Buka Dashboard Fotografer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo 1: Protected Gallery */}
            <div className="glass-strong rounded-3xl p-7 border border-white/15 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400" />
                    PIN PROTECTED
                  </span>
                  <span className="text-xs font-mono text-slate-400">PIN: 123456</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  The Wedding of Radit & Vanya
                </h3>
                <p className="text-xs text-slate-400">
                  Uji coba alur verifikasi kata sandi galeri, pratinjau thumbnail beresolusi tinggi, dan seleksi hingga 20 foto.
                </p>
              </div>

              <div>
                <Link
                  href="/g/wedding-radit-vanya"
                  className="w-full py-3 px-4 rounded-xl bg-white text-[#050505] text-xs font-heading font-bold flex items-center justify-center gap-2 shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 transition"
                >
                  <span>Buka Galeri Wedding (PIN: 123456)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Demo 2: Public Gallery */}
            <div className="glass-strong rounded-3xl p-7 border border-white/15 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-accent-emerald" />
                    DIRECT ACCESS
                  </span>
                  <span className="text-xs font-mono text-slate-400">Kuota 10 Foto</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  Graduation Session - Sarah UI 2026
                </h3>
                <p className="text-xs text-slate-400">
                  Uji coba instan tanpa sandi. Tandai foto, uji fitur pencarian nama file, dan lakukan simulasi pengiriman ke WhatsApp.
                </p>
              </div>

              <div>
                <Link
                  href="/g/graduation-sarah-ui-2026"
                  className="w-full py-3 px-4 rounded-xl glass border border-white/20 text-white hover:bg-white/10 text-xs font-heading font-bold flex items-center justify-center gap-2 transition"
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
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Skema Langganan SaaS
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-white">
              Transparan Tanpa Biaya Tersembunyi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Mulai gratis dengan 2 galeri aktif, tingkatkan ke Pro kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Freemium */}
            <div className="glass rounded-3xl p-7 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                  STARTER
                </span>
                <h3 className="font-heading font-bold text-xl text-white">Freemium</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-heading font-black text-white">Rp 0</span>
                  <span className="text-xs text-slate-400 font-mono"> / selamanya</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Maksimal 2 Galeri Aktif</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Integrasi Google Drive v3</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Redirection WhatsApp Otomatis</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl border border-white/15 text-white font-heading font-bold text-xs hover:bg-white/10 flex items-center justify-center transition"
                >
                  Mulai Gratis
                </Link>
              </div>
            </div>

            {/* Pro Freelance */}
            <div className="glass-strong rounded-3xl p-7 border-2 border-white/30 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(255,255,255,0.06)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#050505] text-[10px] font-heading font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                Paling Diminati
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                  PRO FREELANCE
                </span>
                <h3 className="font-heading font-bold text-xl text-white">Pro Freelance</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-heading font-black text-white">Rp 99.000</span>
                  <span className="text-xs text-slate-400 font-mono"> / bulan</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span><strong>Tanpa Batas Galeri Aktif</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Custom Logo & Watermark Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Catatan Khusus Klien per Foto</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Prioritas Caching Berkecepatan Tinggi</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-[#050505] font-heading font-bold text-xs flex items-center justify-center transition shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200"
                >
                  Pilih Paket Pro
                </Link>
              </div>
            </div>

            {/* Studio Scale */}
            <div className="glass rounded-3xl p-7 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
                  STUDIO SCALE
                </span>
                <h3 className="font-heading font-bold text-xl text-white">Studio Scale</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-heading font-black text-white">Rp 249.000</span>
                  <span className="text-xs text-slate-400 font-mono"> / bulan</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Semua Fitur Pro Freelance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Multi-User Akun Tim (Admin & Editor)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                    <span>Custom Subdomain Galeri Klien</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 rounded-xl border border-white/15 text-white font-heading font-bold text-xs hover:bg-white/10 flex items-center justify-center transition"
                >
                  Pilih Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/10 text-center text-xs text-slate-500 relative z-10 glass-soft">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-heading font-bold text-white">Picura</span>
            <span>&copy; 2026. Refined Glass Design System.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <Link href="/" className="hover:text-white transition">Beranda</Link>
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/g/wedding-radit-vanya" className="hover:text-white transition">Demo Galeri</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
