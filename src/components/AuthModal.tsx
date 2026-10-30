"use client";

import { useState } from "react";
import {
  IconClose,
  IconLock,
  IconMail,
  IconUser,
  IconPhone,
  IconBuilding,
  IconArrowRight,
  IconSpinner,
  IconAlert,
} from "@/components/Icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studioName, setStudioName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const endpoint = mode === "register" ? "/api/v1/auth/register" : "/api/v1/auth/login";
    const body =
      mode === "register"
        ? { name, email, password, studio_name: studioName, whatsapp }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Gagal melakukan autentikasi");
      }

      if (data.token) {
        localStorage.setItem("picura_token", data.token);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa]">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#272835]">
              {mode === "login" ? "Masuk ke Dashboard" : "Daftar Akun Fotografer"}
            </h3>
            <p className="text-xs text-[#666d80] mt-0.5">
              {mode === "login"
                ? "Akses galeri dan hasil seleksi foto klien Anda"
                : "Mulai kelola seleksi foto klien tanpa re-upload"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#eceff3] transition"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] flex items-center gap-2">
              <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#36394a] mb-1">
                  Nama Fotografer / PIC
                </label>
                <div className="relative">
                  <IconUser className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#36394a] mb-1">
                  Nama Studio Foto
                </label>
                <div className="relative">
                  <IconBuilding className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                  <input
                    type="text"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="Lensa Abadi Studio"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#36394a] mb-1">
                  Nomor WhatsApp (Konfirmasi Klien)
                </label>
                <div className="relative">
                  <IconPhone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Email
            </label>
            <div className="relative">
              <IconMail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="studio@anda.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#36394a] mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <IconLock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#818898]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#cdd2d9] rounded-[8px] text-[#36394a] placeholder-[#a4abb8] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <IconSpinner className="w-4 h-4 text-white" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{mode === "login" ? "Masuk Sekarang" : "Daftar Akun"}</span>
                <IconArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="px-6 py-4 bg-[#f6f8fa] border-t border-[#cdd2d9] text-center text-xs text-[#666d80]">
          {mode === "login" ? (
            <p>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                }}
                className="text-[#5e4cff] font-medium hover:underline ml-1"
              >
                Daftar Gratis
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className="text-[#5e4cff] font-medium hover:underline ml-1"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
