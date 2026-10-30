"use client";

import { useState } from "react";
import {
  IconClose,
  IconCheck,
  IconCrown,
  IconShield,
  IconBuilding,
  IconSpinner,
  IconUser,
} from "@/components/Icons";

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupgrade paket";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#cdd2d9] bg-[#f6f8fa] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
                <IconCrown className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#818898]">
                Lisensi Fotografer
              </span>
            </div>
            <h3 className="font-heading font-semibold text-xl text-[#272835]">
              Pilih Paket Langganan Picura
            </h3>
            <p className="text-xs text-[#666d80] mt-0.5">
              Buat galeri tanpa batas dan tingkatkan kecepatan operasional studio Anda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#eceff3] transition"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Plans Grid */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pro Freelance Plan */}
            <div
              onClick={() => setSelectedTier("PRO_FREELANCE")}
              className={`p-5 rounded-[12px] border cursor-pointer transition relative flex flex-col justify-between ${
                selectedTier === "PRO_FREELANCE"
                  ? "border-[#5e4cff] bg-[#f6f8fa] ring-1 ring-[#5e4cff]"
                  : "border-[#cdd2d9] bg-white hover:border-[#818898]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconUser className="w-4 h-4 text-[#5e4cff]" />
                    <span className="font-heading font-semibold text-base text-[#272835]">
                      Pro Freelance
                    </span>
                  </div>
                  {currentTier === "PRO_FREELANCE" && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="font-heading font-semibold text-2xl text-[#272835]">
                    Rp 49.000
                  </span>
                  <span className="text-xs text-[#818898]"> / bulan</span>
                </div>

                <ul className="space-y-2 text-xs text-[#666d80] mb-6">
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Hingga <strong>15 Galeri Aktif</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Integrasi Google Drive Otomatis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Proteksi PIN Galeri Klien</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Format WhatsApp Instan</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-[#cdd2d9]/60">
                <span className="text-[11px] font-mono text-[#818898]">
                  Cocok untuk fotografer wedding & wisuda independen.
                </span>
              </div>
            </div>

            {/* Studio Plan */}
            <div
              onClick={() => setSelectedTier("STUDIO")}
              className={`p-5 rounded-[12px] border cursor-pointer transition relative flex flex-col justify-between ${
                selectedTier === "STUDIO"
                  ? "border-[#5e4cff] bg-[#f6f8fa] ring-1 ring-[#5e4cff]"
                  : "border-[#cdd2d9] bg-white hover:border-[#818898]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconBuilding className="w-4 h-4 text-[#5e4cff]" />
                    <span className="font-heading font-semibold text-base text-[#272835]">
                      Studio Agency
                    </span>
                  </div>
                  {currentTier === "STUDIO" && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[#dfdbff] text-[#5e4cff]">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="font-heading font-semibold text-2xl text-[#272835]">
                    Rp 129.000
                  </span>
                  <span className="text-xs text-[#818898]"> / bulan</span>
                </div>

                <ul className="space-y-2 text-xs text-[#666d80] mb-6">
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span><strong>Galeri Tanpa Batas (Unlimited)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Prioritas CDN Fetch Speed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Custom Branding Nama Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-3.5 h-3.5 text-[#5e4cff] shrink-0" />
                    <span>Multi-editor WhatsApp Routing</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-[#cdd2d9]/60">
                <span className="text-[11px] font-mono text-[#818898]">
                  Dirancang untuk studio foto dan tim agency komersial.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-[8px] bg-[#f6f8fa] border border-[#cdd2d9] flex items-center gap-3">
            <IconShield className="w-5 h-5 text-[#5e4cff] shrink-0" />
            <div className="text-xs text-[#666d80]">
              <span className="font-semibold text-[#272835] block">
                Pembayaran Aman & Instan via QRIS / Virtual Account
              </span>
              Aktivasi instan dan dapat dibatalkan sewaktu-waktu tanpa komitmen kontrak.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f6f8fa] border-t border-[#cdd2d9] flex items-center justify-between">
          <span className="text-xs font-mono text-[#818898]">
            Paket terpilih: <strong>{selectedTier}</strong>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] hover:bg-[#eceff3] text-xs font-medium transition"
            >
              Batal
            </button>
            <button
              onClick={() => handleUpgrade(true)}
              disabled={isProcessing}
              className="px-5 py-2 rounded-[8px] bg-[#5e4cff] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <IconSpinner className="w-4 h-4 text-white" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <IconCrown className="w-4 h-4 text-white" />
                  <span>Konfirmasi & Bayar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
