"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PicuraLogo } from "@/components/PicuraLogo";
import {
  IconLock,
  IconMail,
  IconUser,
  IconPhone,
  IconBuilding,
  IconArrowRight,
  IconSpinner,
  IconAlert,
  IconGoogle,
  IconSparkles,
} from "@/components/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          studio_name: studioName,
          whatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Gagal mendaftarkan akun");
      }

      if (data.token) {
        localStorage.setItem("picura_token", data.token);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/v1/auth/google";
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* 1. Left Hero / Brand Showcase (50% on desktop) */}
      <div className="lg:w-1/2 bg-[#090a12] text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[380px] lg:min-h-screen">
        {/* Ambient Glows & Vector Waves Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5e4cff]/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3b82f6]/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#8b5cf6]/20 rounded-full blur-[90px]" />

          {/* Ribbon Waves SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-100 450 C200 350, 250 650, 550 500 C750 400, 800 600, 950 450"
              stroke="url(#paint0_linear_reg)"
              strokeWidth="2.5"
            />
            <path
              d="M-100 520 C180 400, 280 720, 560 560 C740 450, 820 680, 950 530"
              stroke="url(#paint1_linear_reg)"
              strokeWidth="3.5"
            />
            <path
              d="M-100 580 C220 440, 320 760, 620 590 C780 470, 860 740, 950 600"
              stroke="url(#paint2_linear_reg)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="paint0_linear_reg" x1="-100" y1="450" x2="950" y2="450" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="0.5" stopColor="#5e4cff" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="paint1_linear_reg" x1="-100" y1="520" x2="950" y2="530" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="0.6" stopColor="#5e4cff" />
                <stop offset="1" stopColor="#c084fc" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="paint2_linear_reg" x1="-100" y1="580" x2="950" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#4f46e5" />
                <stop offset="1" stopColor="#7c3aed" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Large Watermark Text */}
          <div className="absolute -bottom-10 -left-6 font-heading font-black text-[120px] sm:text-[160px] text-white/[0.03] select-none pointer-events-none leading-none tracking-tighter">
            PICURA
          </div>
        </div>

        {/* Top Header Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="p-2 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/15 group-hover:bg-white/15 transition">
              <PicuraLogo className="h-6 w-auto text-white" variant="mark" />
            </div>
            <span className="font-heading font-bold text-xl text-white tracking-tight">
              Picura
            </span>
          </Link>
        </div>

        {/* Center Headline */}
        <div className="relative z-10 my-10 lg:my-auto max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5e4cff]/20 border border-[#5e4cff]/40 text-xs font-mono text-[#dfdbff]">
            <IconSparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Mulai 100% Gratis Tanpa Kartu Kredit</span>
          </div>

          <h2 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15]">
            Mulai percepat alur kerja seleksi foto Anda hari ini.
          </h2>

          <p className="text-sm sm:text-base text-[#9aa2b5] leading-relaxed">
            Klien Anda akan menyukai kemudahan memilih foto dari browser ponsel tanpa perlu mengetik manual kode nama file di WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-[#c5cbdb]">
            <span className="px-3 py-1 rounded-[6px] bg-white/5 border border-white/10">⚡ Cepat & Ringan</span>
            <span className="px-3 py-1 rounded-[6px] bg-white/5 border border-white/10">📱 Antarmuka Mobile</span>
            <span className="px-3 py-1 rounded-[6px] bg-white/5 border border-white/10">🎯 Anti-Typo Nama File</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-xs text-[#6e778d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 pt-6">
          <span>&copy; {new Date().getFullYear()} Picura. All rights reserved.</span>
          <Link href="/" className="hover:text-white transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* 2. Right Form Column (50% on desktop) */}
      <div className="lg:w-1/2 bg-[#fafbfc] flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-[420px] w-full space-y-5">
          {/* Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-xs sm:text-sm text-[#666d80]">
              Daftar gratis untuk mulai membuat galeri proofing klien pertama Anda.
            </p>
          </div>

          {/* Continue with Google Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-[10px] bg-white border border-[#cdd2d9] hover:bg-[#f6f8fa] hover:border-[#818898] text-xs sm:text-sm font-medium text-[#272835] transition flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
            >
              <IconGoogle className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#cdd2d9] w-full" />
            <span className="bg-[#fafbfc] px-3 text-xs text-[#818898] font-mono uppercase">
              atau
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2.5">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Nama Lengkap / PIC
              </label>
              <div className="relative">
                <IconUser className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Daffa Ahmad"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[10px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Nama Studio Foto <span className="text-[#818898] font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <IconBuilding className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="Lumina Studio Jakarta"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[10px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Nomor WhatsApp Studio
              </label>
              <div className="relative">
                <IconPhone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6281234567890"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[10px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
              <p className="text-[11px] text-[#818898] mt-1">
                Nomor penerima hasil seleksi foto dari klien (Format: 628xxx).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <IconMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="studio@anda.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[10px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <IconLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[10px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-[10px] bg-[#5e4cff] hover:bg-[#4d3be6] text-white text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <IconArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs text-[#666d80] pt-2">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="text-[#5e4cff] font-semibold hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
