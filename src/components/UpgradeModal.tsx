"use client";

import { useState, useEffect } from "react";
import {
  IconClose,
  IconCheck,
  IconCheckCircle,
  IconCrown,
  IconShield,
  IconBuilding,
  IconSpinner,
  IconUser,
  IconExternalLink,
  IconCopy,
  IconSparkles,
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
  const [selectedTier, setSelectedTier] = useState<"PRO_FREELANCE" | "STUDIO">("STUDIO");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    orderId: string;
    amount: number;
    paymentUrl: string;
    tier: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (currentTier === "PRO_FREELANCE") {
        setSelectedTier("STUDIO");
      } else {
        setSelectedTier("PRO_FREELANCE");
      }
      setPendingOrder(null);
      setSuccessMessage(null);
    }
  }, [isOpen, currentTier]);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    setIsProcessing(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/payments/upgrade", {
        method: "POST",
        headers,
        body: JSON.stringify({
          tier: selectedTier,
          auto_settle: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Gagal membuat tagihan pembayaran");
      }

      const orderData = {
        orderId: data.data.order_id,
        amount: data.data.amount,
        paymentUrl: data.data.payment_url,
        tier: data.data.tier,
      };

      setPendingOrder(orderData);
      // Open SociaBuzz payment link in new window/tab
      if (typeof window !== "undefined" && orderData.paymentUrl) {
        window.open(orderData.paymentUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses pembayaran";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInstantActivation = async () => {
    setIsProcessing(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/payments/upgrade", {
        method: "POST",
        headers,
        body: JSON.stringify({
          tier: selectedTier,
          auto_settle: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Gagal mengaktifkan langganan");
      }

      setSuccessMessage(`Selamat! Akun Anda kini aktif pada paket ${selectedTier === "STUDIO" ? "Studio Agency" : "Pro Freelance"}.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupgrade paket";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOrderId = () => {
    if (pendingOrder?.orderId && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(pendingOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#272835]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#cdd2d9] overflow-hidden text-[#36394a] font-sans animate-in fade-in duration-150">
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
              {pendingOrder ? "Menunggu Pembayaran QRIS" : "Pilih Paket Langganan Picura"}
            </h3>
            <p className="text-xs text-[#666d80] mt-0.5">
              {pendingOrder
                ? "Selesaikan transaksi QRIS/E-Wallet via SociaBuzz untuk mengaktifkan lisensi."
                : "Buat galeri tanpa batas dan tingkatkan kecepatan operasional studio Anda."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[#818898] hover:text-[#272835] hover:bg-[#eceff3] transition"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-800 flex items-center gap-3">
            <IconCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-medium">{successMessage}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!pendingOrder ? (
            <>
              {/* Plans Grid */}
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
                      Cocok untuk fotografer wedding &amp; wisuda independen.
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

              {/* Gateway Note */}
              <div className="p-3.5 rounded-[8px] bg-[#f6f8fa] border border-[#cdd2d9] flex items-center gap-3">
                <IconShield className="w-5 h-5 text-[#5e4cff] shrink-0" />
                <div className="text-xs text-[#666d80]">
                  <span className="font-semibold text-[#272835] block">
                    Pembayaran Aman via SociaBuzz (@mindyourkills) — QRIS &amp; E-Wallet
                  </span>
                  Mendukung QRIS semua Bank (BCA, Mandiri, BRI, BNI), GoPay, OVO, ShopeePay &amp; DANA.
                </div>
              </div>
            </>
          ) : (
            /* Pending Payment State View */
            <div className="space-y-4">
              <div className="p-4 rounded-[12px] bg-[#f6f8fa] border border-[#beb5ff] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#818898]">Paket Pilihan:</span>
                  <span className="text-xs font-semibold text-[#272835]">
                    {pendingOrder.tier === "STUDIO" ? "Studio Agency" : "Pro Freelance"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#818898]">Total Tagihan:</span>
                  <span className="text-base font-heading font-bold text-[#5e4cff]">
                    Rp {pendingOrder.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#cdd2d9]/60">
                  <span className="text-xs text-[#818898]">Nomor Referensi (Order ID):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#272835] bg-white px-2 py-0.5 rounded border border-[#cdd2d9]">
                      {pendingOrder.orderId}
                    </span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1 rounded text-[#818898] hover:text-[#272835] hover:bg-white border border-transparent hover:border-[#cdd2d9] transition"
                      title="Salin Order ID"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                    </button>
                    {copied && <span className="text-[10px] text-emerald-600 font-medium">Tersalin!</span>}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <span className="font-semibold block text-amber-950">Langkah Penyelesaian:</span>
                <ol className="list-decimal pl-4 space-y-1 text-amber-800">
                  <li>
                    Tab pembayaran SociaBuzz telah dibuka di peramban Anda. Jika belum terbuka, silakan klik tombol <strong>&quot;Buka Halaman Pembayaran SociaBuzz&quot;</strong> di bawah.
                  </li>
                  <li>
                    Pilih metode pembayaran (QRIS, GoPay, OVO, ShopeePay, DANA) lalu selesaikan pembayaran.
                  </li>
                  <li>
                    Setelah transfer selesai, klik tombol <strong>&quot;Saya Sudah Bayar (Aktivasi)&quot;</strong> di bawah ini untuk langsung menerapkan lisensi ke akun Anda.
                  </li>
                </ol>
              </div>

              <div className="flex justify-center">
                <a
                  href={pendingOrder.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-white border border-[#cdd2d9] text-[#272835] hover:bg-[#eceff3] text-xs font-medium transition shadow-xs"
                >
                  <span>Buka Ulang Halaman Bayar SociaBuzz</span>
                  <IconExternalLink className="w-3.5 h-3.5 text-[#818898]" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f6f8fa] border-t border-[#cdd2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!pendingOrder && (
              <button
                type="button"
                onClick={handleInstantActivation}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 text-xs text-[#5e4cff] hover:text-[#4734ea] font-medium transition"
                title="Aktivasi langsung untuk kebutuhan testing/demonstrasi"
              >
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Aktivasi Cepat (Mode Uji Coba)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={() => {
                if (pendingOrder) {
                  setPendingOrder(null);
                } else {
                  onClose();
                }
              }}
              disabled={isProcessing}
              className="px-4 py-2 rounded-[8px] border border-[#cdd2d9] bg-white text-[#36394a] hover:bg-[#eceff3] text-xs font-medium transition disabled:opacity-50"
            >
              {pendingOrder ? "Kembali" : "Batal"}
            </button>

            {!pendingOrder ? (
              <button
                onClick={handleStartPayment}
                disabled={isProcessing || selectedTier === currentTier}
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
                    <span>Bayar via QRIS (SociaBuzz)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleInstantActivation}
                disabled={isProcessing}
                className="px-5 py-2 rounded-[8px] bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <IconSpinner className="w-4 h-4 text-white" />
                    <span>Mengonfirmasi...</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4 text-white" />
                    <span>Saya Sudah Bayar (Aktivasi)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
