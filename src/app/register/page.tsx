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

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#36394a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff]">
      {/* Top Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-85 transition">
          <PicuraLogo className="h-8 w-auto text-[#272835]" />
        </Link>
        <h1 className="font-heading font-semibold text-2xl text-[#272835] tracking-tight">
          Daftar Akun Picura
        </h1>
        <p className="text-xs text-[#666d80]">
          Mulai seleksi foto Google Drive tanpa re-upload dan terhubung instan ke WhatsApp klien.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-[12px] border border-[#cdd2d9] shadow-sm space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2.5">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1.5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1.5">
                Nama Studio Foto <span className="text-[#818898] font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <IconBuilding className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="Lumina Studio"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1.5">
                Nomor WhatsApp Studio
              </label>
              <div className="relative">
                <IconPhone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#818898]" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6281234567890"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
              <p className="text-[11px] text-[#818898] mt-1">
                Format: 628xxx (Nomor tujuan saat klien mengirim hasil seleksi foto).
              </p>
            </div>

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
                  placeholder="studio@anda.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#272835] mb-1.5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#cdd2d9] rounded-[8px] text-xs text-[#272835] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Sekarang</span>
                  <IconArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-xs text-[#666d80] pt-2 border-t border-[#cdd2d9]/60">
            Sudah memiliki akun Picura?{" "}
            <Link
              href="/login"
              className="text-[#5e4cff] font-medium hover:underline ml-1"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[#818898] hover:text-[#272835] transition inline-flex items-center gap-1"
          >
            <span>&larr; Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
