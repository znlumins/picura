"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PicuraLogo } from "@/components/PicuraLogo";
import {
  IconLock,
  IconMail,
  IconSpinner,
  IconAlert,
  IconCheck,
  IconGoogle,
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
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* 1. Left Side: Dark Ambient Hero (50% on desktop) - Locked 100% Height, No Scroll */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#07080e] text-white relative flex-col justify-between p-12 xl:p-16 h-full overflow-hidden select-none">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-[#1e3a8a]/30 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-[#4338ca]/25 rounded-full blur-[150px]" />
          <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-[#1d4ed8]/35 rounded-full blur-[160px]" />
        </div>

        {/* Luminous Fluid Wave Curves (Exact Reference Style) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          viewBox="0 0 700 800"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveGrad1" x1="0" y1="300" x2="700" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="curveGrad2" x1="0" y1="800" x2="700" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#4338ca" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#07080e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="edgeGrad1" x1="100" y1="450" x2="600" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="edgeGrad2" x1="50" y1="600" x2="650" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Deep luminous waves */}
          <path
            d="M-50 680 C180 500, 260 840, 520 660 C660 560, 720 720, 800 600 L800 850 L-50 850 Z"
            fill="url(#curveGrad1)"
          />
          <path
            d="M-50 740 C220 580, 320 900, 600 710 C720 620, 780 780, 800 700 L800 850 L-50 850 Z"
            fill="url(#curveGrad2)"
          />

          {/* Elegant luminous ribbon strokes */}
          <path
            d="M-50 560 C180 400, 280 750, 530 580 C680 480, 740 680, 800 550"
            stroke="url(#edgeGrad1)"
            strokeWidth="2"
          />
          <path
            d="M-50 680 C180 500, 260 840, 520 660 C660 560, 720 720, 800 600"
            stroke="url(#edgeGrad2)"
            strokeWidth="3.5"
          />
          <path
            d="M-50 740 C220 580, 320 900, 600 710 C720 620, 780 780, 800 700"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
        </svg>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <PicuraLogo className="h-8 w-auto text-white transition group-hover:opacity-90" variant="full" />
          </Link>
        </div>

        {/* Center: Clean Editorial Headline & Subtitle (No AI Slop / Mockups) */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto">
          <h1 className="font-heading font-semibold text-3xl sm:text-4xl xl:text-[44px] text-white tracking-tight leading-[1.12]">
            Platform kurasi foto Google Drive terhubung langsung ke WhatsApp.
          </h1>
          <p className="text-sm xl:text-base text-[#9aa2b5] font-normal leading-relaxed">
            Pilihan andalan fotografer dan studio foto untuk alur kerja seleksi foto cepat, akurat, dan tanpa re-upload kuota.
          </p>
        </div>

        {/* Bottom: Clean Copyright */}
        <div className="relative z-10 text-xs text-[#6e778d] font-sans">
          Copyright &copy; {new Date().getFullYear()} Picura. All rights reserved.
        </div>
      </div>

      {/* 2. Right Side: Clean Form (50% on desktop) - Vertically Centered, No Scroll */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 h-full overflow-hidden">
        <div className="max-w-[380px] w-full space-y-5">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex justify-center pb-2">
            <Link href="/">
              <PicuraLogo className="h-7 w-auto text-[#272835]" variant="full" />
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
              Welcome back!
            </h2>
            <p className="text-xs sm:text-sm text-[#666d80]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Continue with Google */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-[8px] bg-white border border-[#cdd2d9] hover:bg-[#f6f8fa] text-xs sm:text-sm font-medium text-[#272835] transition flex items-center justify-center gap-3 shadow-xs active:scale-[0.99]"
            >
              <IconGoogle className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#cdd2d9] w-full" />
            <span className="bg-white px-3 text-xs text-[#818898] uppercase">
              or
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Email Address
              </label>
              <div className="relative">
                <IconMail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email address"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1">
                Password
              </label>
              <div className="relative">
                <IconLock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Demo */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-1.5 px-3 rounded-[6px] border border-dashed border-[#cdd2d9] bg-[#f6f8fa] hover:bg-[#eceff3] text-[#666d80] text-[11px] font-mono flex items-center justify-center gap-1.5 transition"
          >
            <IconCheck className="w-3 h-3 text-[#5e4cff]" />
            <span>Gunakan Akun Demo: demo@picura.id</span>
          </button>

          {/* Switch link */}
          <div className="text-center text-xs text-[#666d80] pt-1">
            Don&apos;t have an account?{" "}
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
