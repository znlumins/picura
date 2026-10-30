"use client";

import { useState } from "react";
import {
  X,
  Check,
  Crown,
  ShieldCheck,
  Zap,
  Loader2,
  Building2,
  UserCheck,
} from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentTier?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  onSuccess,
  currentTier = "FREEMIUM",
}: UpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<"PRO_FREELANCE" | "STUDIO">("PRO_FREELANCE");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (autoSettle = true) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/v1/payments/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          auto_settle: autoSettle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memproses upgrade");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal mengupgrade paket");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-strong rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/15 animate-fade-up overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-white text-[#050505]">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                Peningkatan Lisensi SaaS
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white">
              Pilih Paket Langganan Picura
            </h3>
            <p className="text-xs text-slate-400">
              Buat galeri tanpa batas dan tingkatkan kecepatan operasional studio Anda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pro Freelance Card */}
            <div
              onClick={() => setSelectedTier("PRO_FREELANCE")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTier === "PRO_FREELANCE"
                  ? "border-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/30"
                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                  POPULAR
                </span>
                <UserCheck className="w-5 h-5 text-accent-blue" />
              </div>
              <h4 className="font-heading font-extrabold text-base text-white">
                Pro Freelance
              </h4>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-heading font-black text-white">Rp 99.000</span>
                <span className="text-xs text-slate-400 font-mono"> / bulan</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span><strong>Tanpa Batas Galeri Aktif</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Custom Watermark & Logo Studio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Catatan Khusus Klien per Foto</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Prioritas Dukungan Teknis</span>
                </li>
              </ul>
            </div>

            {/* Studio Card */}
            <div
              onClick={() => setSelectedTier("STUDIO")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedTier === "STUDIO"
                  ? "border-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/30"
                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
                  AGENCY
                </span>
                <Building2 className="w-5 h-5 text-accent-amber" />
              </div>
              <h4 className="font-heading font-extrabold text-base text-white">
                Studio Scale
              </h4>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-heading font-black text-white">Rp 249.000</span>
                <span className="text-xs text-slate-400 font-mono"> / bulan</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Semua fitur Pro Freelance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Multi-User Akun Tim (Admin & Editor)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                  <span>Custom Subdomain Galeri Klien</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-accent-emerald shrink-0" />
            <div className="text-[11px] text-slate-400">
              Integrasi resmi Payment Gateway Midtrans dengan verifikasi SHA-512 dan pembayaran instan via QRIS, Virtual Account, & Kartu Kredit.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="text-xs font-mono text-slate-400">
            Paket saat ini: <span className="font-bold text-white">{currentTier}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpgrade(true)}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-white text-[#050505] font-heading font-bold text-xs shadow-[0_10px_28px_-8px_rgba(255,255,255,0.4)] hover:bg-slate-200 rounded-xl transition flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses Upgrade...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Aktifkan {selectedTier === "PRO_FREELANCE" ? "Pro Freelance" : "Studio"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
