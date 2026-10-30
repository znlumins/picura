"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PicuraLogo } from "@/components/PicuraLogo";
import {
  IconLock,
  IconMail,
  IconArrowRight,
  IconSpinner,
  IconAlert,
  IconCheck,
  IconGoogle,
  IconSparkles,
  IconWhatsApp,
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Email atau kata sandi tidak cocok");
      }

      if (data.token) {
        localStorage.setItem("picura_token", data.token);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@picura.id");
    setPassword("password123");
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/v1/auth/google";
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* 1. Left Hero / Brand Showcase (50% on desktop) - Matching Picura Theme */}
      <div
        className="lg:w-1/2 bg-[#0e1017] text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[460px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-[#1f2230]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {/* Radiant Violet Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-[#5e4cff]/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-10 right-0 w-[380px] h-[380px] bg-[#3b82f6]/15 rounded-full blur-[120px]" />
        </div>

        {/* Top Header: Official Picura Full Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <PicuraLogo className="h-8 w-auto text-white transition group-hover:opacity-90" variant="full" />
          </Link>
        </div>

        {/* Center: Brand Value Proposition & Live Proofing Mockup */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-white/10 border border-white/15 text-xs font-mono text-[#dfdbff]">
            <IconSparkles className="w-3.5 h-3.5 text-[#5e4cff]" />
            <span>Zero Re-upload • Direct Google CDN & WhatsApp</span>
          </div>

          <h1 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.12]">
            Pilih foto klien langsung ke WhatsApp tanpa re-upload.
          </h1>

          <p className="text-sm sm:text-base text-[#9aa2b5] leading-relaxed">
            Tautkan folder Google Drive, biarkan klien menandai foto favorit di browser HP, dan terima daftar kode file tersusun rapi di WhatsApp editor.
          </p>

          {/* Interactive Live Proofing Mockup Card */}
          <div className="rounded-[12px] bg-[#141622]/90 backdrop-blur-md border border-white/15 p-4 sm:p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-xs font-mono text-white/90">Wedding_SarahDimas_2026</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#dfdbff] border border-white/10">
                120 Foto
              </span>
            </div>

            {/* Photo Selection Grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "IMG_0142", selected: true },
                { id: "IMG_0145", selected: true },
                { id: "IMG_0149", selected: false },
                { id: "IMG_0153", selected: true },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`aspect-[4/3] rounded-[6px] p-1.5 flex flex-col justify-between text-[10px] font-mono transition-all ${
                    item.selected
                      ? "bg-[#5e4cff]/25 border-2 border-[#5e4cff] text-white shadow-sm"
                      : "bg-white/5 border border-white/10 text-white/40"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[8px] opacity-75">{item.id}</span>
                    {item.selected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#5e4cff] text-white flex items-center justify-center font-bold text-[8px]">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Dispatch Bar */}
            <div className="pt-1 flex items-center justify-between text-xs border-t border-white/10">
              <div className="flex items-center gap-2">
                <IconWhatsApp className="w-4 h-4 text-[#25D366]" />
                <span className="text-[11px] font-mono text-[#c5cbdb]">3 foto terpilih</span>
              </div>
              <span className="text-[11px] font-semibold text-[#dfdbff] flex items-center gap-1 font-mono">
                Format WA Otomatis ⚡
              </span>
            </div>
          </div>

          {/* Feature Checkpoints */}
          <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono text-[#9aa2b5]">
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
              <span>Nol Kuota Re-upload</span>
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
              <span>Format WA Rapi</span>
            </span>
            <span className="flex items-center gap-1.5">
              <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
              <span>Proteksi PIN Sesi</span>
            </span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-xs text-[#818898] border-t border-white/10 pt-4 font-mono">
          <span>&copy; {new Date().getFullYear()} Picura. Platform Seleksi Foto Google Drive & WhatsApp.</span>
        </div>
      </div>

      {/* 2. Right Form Column (50% on desktop) - Clean Picura Lightdash UI */}
      <div className="lg:w-1/2 bg-[#ffffff] flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="max-w-[400px] w-full space-y-6">
          {/* Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
              Selamat datang kembali!
            </h2>
            <p className="text-xs sm:text-sm text-[#666d80]">
              Masuk ke akun studio fotomu untuk mengelola galeri dan hasil seleksi klien.
            </p>
          </div>

          {/* Continue with Google Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-[8px] bg-white border border-[#cdd2d9] hover:bg-[#f6f8fa] hover:border-[#818898] text-xs sm:text-sm font-medium text-[#272835] transition flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
            >
              <IconGoogle className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#cdd2d9] w-full" />
            <span className="bg-[#ffffff] px-3 text-xs text-[#818898] font-mono uppercase">
              atau
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2.5">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <IconMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#272835]">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <IconLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] shadow-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <IconArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-[8px] border border-[#cdd2d9] bg-[#f6f8fa] hover:bg-[#eceff3] text-[#36394a] text-xs font-mono flex items-center justify-center gap-2 transition"
            >
              <IconCheck className="w-3.5 h-3.5 text-[#5e4cff]" />
              <span>Gunakan Akun Demo: demo@picura.id</span>
            </button>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center text-xs text-[#666d80] pt-2">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-[#5e4cff] font-semibold hover:underline ml-1"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
