"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-brand-border p-6 sm:p-8 text-center animate-fadeIn">
        <div className="w-14 h-14 bg-brand-violetLight text-brand-violet rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="font-heading font-extrabold text-2xl text-brand-primary mb-1">
          Galeri Terproteksi
        </h2>
        <p className="text-xs text-brand-muted mb-6">
          Masukkan kata sandi atau PIN akses untuk membuka sesi foto{" "}
          <strong className="text-brand-primary block mt-0.5">{galleryTitle}</strong>
          {photographerName && (
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Oleh {photographerName}
            </span>
          )}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Kata Sandi / PIN"
              className="w-full text-center text-lg font-bold tracking-widest px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-violet focus:border-brand-violet transition placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3 px-4 rounded-xl bg-brand-violet hover:bg-brand-violetHover disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
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

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
          <span>Privasi foto dilindungi standar keamanan Picura</span>
        </div>
      </div>
    </div>
  );
}
