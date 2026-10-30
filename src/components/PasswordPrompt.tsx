"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import AmbientGlow from "./AmbientGlow";

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
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memverifikasi password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-12 relative font-sans">
      <AmbientGlow />

      <div className="max-w-md w-full glass-strong rounded-3xl border border-white/15 p-6 sm:p-8 text-center animate-fade-up relative z-10">
        <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/15">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="font-heading font-extrabold text-2xl text-white mb-1">
          Galeri Terproteksi
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Masukkan kata sandi atau PIN akses untuk membuka sesi foto{" "}
          <strong className="text-white block mt-0.5">{galleryTitle}</strong>
          {photographerName && (
            <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
              Oleh {photographerName}
            </span>
          )}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-accent-rose/15 border border-accent-rose/30 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-accent-rose" />
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
              className="w-full text-center text-lg font-mono font-bold tracking-widest px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] text-white focus:outline-none focus:border-white/40 transition placeholder:font-normal placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-500"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3 px-4 rounded-xl bg-white text-[#050505] font-heading font-bold text-sm shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Buka Galeri Foto</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
          <span>Privasi foto dilindungi enkripsi Picura</span>
        </div>
      </div>
    </div>
  );
}
