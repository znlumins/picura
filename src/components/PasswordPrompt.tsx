"use client";

import { useState } from "react";
import {
  IconLock,
  IconArrowRight,
  IconShield,
  IconAlert,
  IconSpinner,
} from "@/components/Icons";

interface PasswordPromptProps {
  galleryTitle: string;
  photographerName?: string;
  onVerify: (password: string) => Promise<boolean>;
}

export default function PasswordPrompt({
  galleryTitle,
  photographerName,
  onVerify,
}: PasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const ok = await onVerify(password);
      if (!ok) {
        setErrorMessage("Password atau PIN yang Anda masukkan salah.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memverifikasi password.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#36394a] flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-white rounded-[12px] border border-[#cdd2d9] p-6 sm:p-8 text-center shadow-lg relative z-10">
        <div className="w-12 h-12 bg-[#dfdbff] text-[#5e4cff] rounded-[8px] flex items-center justify-center mx-auto mb-4">
          <IconLock className="w-6 h-6" />
        </div>

        <h2 className="font-heading font-semibold text-xl text-[#272835] mb-1">
          Galeri Terproteksi
        </h2>
        <p className="text-xs text-[#666d80] mb-6">
          Masukkan kata sandi atau PIN akses untuk membuka sesi foto{" "}
          <strong className="text-[#272835] block mt-0.5">{galleryTitle}</strong>
          {photographerName && (
            <span className="block text-[11px] font-mono text-[#818898] mt-0.5">
              Oleh {photographerName}
            </span>
          )}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs flex items-center gap-2 text-left">
            <IconAlert className="w-4 h-4 shrink-0 text-[#ef4444]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan PIN / Kata Sandi"
              className="w-full text-center text-lg font-mono font-medium tracking-widest px-4 py-2.5 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] focus:outline-none focus:border-[#5e4cff] focus:ring-1 focus:ring-[#5e4cff] placeholder:font-normal placeholder:tracking-normal placeholder:text-xs placeholder:text-[#a4abb8]"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] text-white font-medium text-xs hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <IconSpinner className="w-4 h-4 text-white" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Buka Galeri Foto</span>
                <IconArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#cdd2d9] flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#818898]">
          <IconShield className="w-3.5 h-3.5 text-[#5e4cff]" />
          <span>Privasi foto dilindungi enkripsi Picura</span>
        </div>
      </div>
    </div>
  );
}
