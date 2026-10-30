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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-brand-border animate-scaleUp overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-primary to-slate-900 text-white relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-amber-400 text-slate-900">
                <Crown className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Tingkatkan Akun Picura
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl">
              Pilih Paket Langganan SaaS
            </h3>
            <p className="text-xs text-slate-300">
              Buat galeri tanpa batas dan tingkatkan profesionalitas studio Anda.
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
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedTier === "PRO_FREELANCE"
                  ? "border-brand-violet bg-brand-violetLight/40 shadow-md ring-2 ring-indigo-200"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-violet text-white">
                  POPULAR
                </span>
                <UserCheck className="w-5 h-5 text-brand-violet" />
              </div>
              <h4 className="font-heading font-extrabold text-base text-brand-primary">
                Pro Freelance
              </h4>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-black text-brand-primary">Rp 99.000</span>
                <span className="text-xs text-slate-500"> / bulan</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span><strong>Tanpa Batas Galeri Aktif</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Custom Watermark & Logo Studio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Catatan Khusus Klien per Foto</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Prioritas Dukungan Teknis</span>
                </li>
              </ul>
            </div>

            {/* Studio Card */}
            <div
              onClick={() => setSelectedTier("STUDIO")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedTier === "STUDIO"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-200"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  AGENCY
                </span>
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-heading font-extrabold text-base text-brand-primary">
                Studio Scale
              </h4>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-black text-brand-primary">Rp 249.000</span>
                <span className="text-xs text-slate-500"> / bulan</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Semua fitur Pro Freelance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Multi-User Akun Tim (Admin & Editor)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Custom Subdomain Galeri Klien</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>Dukungan Pratinjau Video Mentah</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-emerald shrink-0" />
            <div className="text-[11px] text-slate-500">
              Didukung integrasi Payment Gateway resmi (Midtrans) dengan enkripsi SHA-512 dan pembayaran instan via QRIS, Virtual Account, & Kartu Kredit.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-brand-border flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Paket saat ini: <span className="font-bold text-slate-700">{currentTier}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpgrade(true)}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-violet to-indigo-600 hover:from-brand-violetHover hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses Upgrade...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Aktifkan {selectedTier === "PRO_FREELANCE" ? "Pro Freelance" : "Studio"} Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
