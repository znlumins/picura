"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PicuraLogo } from "@/components/PicuraLogo";
import UpgradeModal from "@/components/UpgradeModal";
import {
  IconCheck,
  IconArrowRight,
  IconCrown,
  IconShield,
  IconSparkles,
  IconWhatsApp,
  IconFolder,
  IconSpinner,
  IconPhoto,
} from "@/components/Icons";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userName, setUserName] = useState<string>("");
  const [studioName, setStudioName] = useState<string>("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Survey State
  const [photographyFocus, setPhotographyFocus] = useState<string>("wedding");
  const [photoVolume, setPhotoVolume] = useState<string>("150-500");
  const [currentWorkflowPain, setCurrentWorkflowPain] = useState<string>("typo_wa");

  // Fetch logged-in user profile if available
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("picura_token") : null;
    if (token) {
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && data.user) {
            setUserName(data.user.name || "");
            setStudioName(data.user.studioName || "");
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleFinishFree = async () => {
    setIsSubmitting(true);
    // Save survey answers to local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("picura_onboarding_completed", "true");
      localStorage.setItem(
        "picura_user_survey",
        JSON.stringify({
          focus: photographyFocus,
          volume: photoVolume,
          painPoint: currentWorkflowPain,
          selectedPlan: "FREEMIUM",
          completedAt: new Date().toISOString(),
        })
      );
    }
    // Navigate to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleSelectPro = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("picura_onboarding_completed", "true");
      localStorage.setItem(
        "picura_user_survey",
        JSON.stringify({
          focus: photographyFocus,
          volume: photoVolume,
          painPoint: currentWorkflowPain,
          selectedPlan: "PRO_FREELANCE",
          completedAt: new Date().toISOString(),
        })
      );
    }
    setIsUpgradeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#36394a] font-sans selection:bg-[#dfdbff] selection:text-[#5e4cff] flex flex-col justify-between">
      {/* 1. Header Bar */}
      <header className="border-b border-[#cdd2d9] bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <PicuraLogo className="h-7 w-auto text-[#272835]" variant="full" />
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-mono font-medium text-[#818898] uppercase tracking-wider block">
                Langkah {step} dari 2
              </span>
              <span className="text-xs font-semibold text-[#272835]">
                {step === 1 ? "Kebutuhan Studio" : "Pilihan Paket"}
              </span>
            </div>

            <div className="w-24 sm:w-32 h-2 rounded-full bg-[#eceff3] overflow-hidden">
              <div
                className="h-full bg-[#5e4cff] transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full my-auto">
        {step === 1 ? (
          /* STEP 1: Survey Kebutuhan Studio */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Title */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#f6f8fa] border border-[#cdd2d9] text-xs font-mono text-[#5e4cff]">
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Personalisasi Alur Kerja</span>
              </div>
              <h1 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
                Halo{userName ? `, ${userName}` : ""}! Ceritakan alur kerja fotografi Anda.
              </h1>
              <p className="text-xs sm:text-sm text-[#666d80] max-w-xl">
                Bantu Picura menyesuaikan kuota, format dispatch WhatsApp, dan rekomendasi fitur terbaik untuk studio Anda.
              </p>
            </div>

            {/* Questions Grid */}
            <div className="space-y-6">
              {/* Question 1: Fokus Fotografi */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#272835]">
                  1. Apa fokus utama layanan fotografi Anda?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "wedding",
                      title: "Wedding & Prewedding",
                      desc: "Volume ratusan/ribuan foto per sesi, kurasi intensif bersama pasangan.",
                      icon: "💍",
                    },
                    {
                      id: "graduation_portrait",
                      title: "Wisuda, Studio & Portrait",
                      desc: "Sesi foto rutin, portrait individu, keluarga, dan kelulusan mahasiswa.",
                      icon: "🎓",
                    },
                    {
                      id: "event_commercial",
                      title: "Event & Commercial Shoot",
                      desc: "Dokumentasi event perusahaan, gathering, produk, & brand campaign.",
                      icon: "🏢",
                    },
                    {
                      id: "freelance_general",
                      title: "Freelance Photography",
                      desc: "Fotografer lepas serbabisa dengan beragam kebutuhan klien personal.",
                      icon: "📸",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPhotographyFocus(item.id)}
                      className={`p-4 rounded-[10px] border cursor-pointer transition flex items-start gap-3.5 ${
                        photographyFocus === item.id
                          ? "bg-white border-[#5e4cff] ring-1 ring-[#5e4cff] shadow-xs"
                          : "bg-white border-[#cdd2d9] hover:border-[#818898]"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="space-y-0.5">
                        <div className="text-xs sm:text-sm font-semibold text-[#272835] flex items-center justify-between">
                          <span>{item.title}</span>
                          {photographyFocus === item.id && (
                            <div className="w-4 h-4 rounded-full bg-[#5e4cff] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-[#666d80] leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 2: Estimasi Foto Mentah */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#272835]">
                  2. Berapa rata-rata jumlah foto mentah yang biasanya Anda serahkan ke klien?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "under-150", label: "< 150 Foto", note: "Mini session / studio kilat" },
                    { id: "150-500", label: "150 – 500 Foto", note: "Sesi wisuda / portrait lengkap" },
                    { id: "500-plus", label: "500 – 2.000+ Foto", note: "Full wedding & multi-event" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setPhotoVolume(item.id)}
                      className={`p-3.5 rounded-[10px] border cursor-pointer transition text-center ${
                        photoVolume === item.id
                          ? "bg-white border-[#5e4cff] ring-1 ring-[#5e4cff] shadow-xs"
                          : "bg-white border-[#cdd2d9] hover:border-[#818898]"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-[#272835]">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#666d80] mt-0.5 font-mono">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 3: Alur Seleksi Saat Ini */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#272835]">
                  3. Apa kendala alur seleksi foto yang paling sering Anda hadapi?
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "typo_wa",
                      text: "Klien mengetik manual kode foto di WhatsApp satu per satu (sering salah ketik nama file / typo).",
                    },
                    {
                      id: "slow_reupload",
                      text: "Harus upload ulang ratusan gigabyte foto ke web lain padahal file sudah ada di Google Drive.",
                    },
                    {
                      id: "client_confused",
                      text: "Klien bingung atau lama memilih karena galeri preview Google Drive lambat & tidak ada tombol checklist.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentWorkflowPain(item.id)}
                      className={`p-3 rounded-[8px] border cursor-pointer transition flex items-center justify-between text-xs ${
                        currentWorkflowPain === item.id
                          ? "bg-white border-[#5e4cff] text-[#272835] ring-1 ring-[#5e4cff] font-medium"
                          : "bg-white border-[#cdd2d9] text-[#666d80] hover:border-[#818898]"
                      }`}
                    >
                      <span>{item.text}</span>
                      {currentWorkflowPain === item.id && (
                        <span className="w-4 h-4 rounded-full bg-[#5e4cff] text-white flex items-center justify-center text-[10px] shrink-0 ml-3">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Lanjut ke Pilihan Paket</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Pemilihan Paket Langganan */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Title */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#dfdbff] text-[#5e4cff] text-xs font-mono font-medium">
                <IconCrown className="w-3.5 h-3.5" />
                <span>Pilih Lisensi Studio</span>
              </div>
              <h1 className="font-heading font-semibold text-2xl sm:text-3xl text-[#272835] tracking-tight">
                Pilih paket yang pas untuk kebutuhan {studioName || "studio Anda"}.
              </h1>
              <p className="text-xs sm:text-sm text-[#666d80] max-w-xl">
                Bisa mulai 100% gratis tanpa komitmen, atau langsung buka fitur Pro untuk galeri tanpa batas dan branding sendiri.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Option 1: FREE / STARTER */}
              <div className="bg-white rounded-[12px] border border-[#cdd2d9] p-6 flex flex-col justify-between space-y-6 hover:border-[#818898] transition">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#818898]">
                      Starter Plan
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f6f8fa] border border-[#cdd2d9] text-[#666d80]">
                      Gratis Selamanya
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-2xl text-[#272835]">Free</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-[#272835]">Rp 0</span>
                      <span className="text-xs text-[#818898]">/ bulan</span>
                    </div>
                    <p className="text-xs text-[#666d80] mt-1.5 leading-relaxed">
                      Cocok untuk mencoba alur kurasi Google Drive & WhatsApp pada 1-3 klien pertama.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 pt-2 border-t border-[#eceff3] text-xs text-[#36394a]">
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span><strong>3 Galeri Klien</strong> aktif bersamaan</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span>Hingga <strong>150 foto</strong> per folder galeri</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span>Format dispatch pesan WhatsApp otomatis</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#818898]">
                      <span className="w-4 text-center text-xs">⚠️</span>
                      <span>Menampilkan label & watermark Picura</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinishFree}
                    className="w-full py-2.5 px-4 rounded-[8px] bg-white border border-[#cdd2d9] hover:bg-[#f6f8fa] text-[#272835] text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <IconSpinner className="w-4 h-4 text-[#5e4cff]" />
                        <span>Menyiapkan Dashboard...</span>
                      </>
                    ) : (
                      <span>Mulai dengan Paket Free</span>
                    )}
                  </button>
                  <p className="text-[11px] text-[#818898] text-center mt-2">
                    Bisa upgrade kapan saja lewat dashboard
                  </p>
                </div>
              </div>

              {/* Option 2: PRO FREELANCE (Recommended) */}
              <div className="bg-white rounded-[12px] border-2 border-[#5e4cff] p-6 flex flex-col justify-between space-y-6 relative shadow-md">
                {/* Popular Badge */}
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#5e4cff] text-white text-[10px] font-mono font-bold tracking-wider uppercase py-1 px-3 rounded-full shadow-sm">
                    ⭐ Paling Populer & Direkomendasikan
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5e4cff]">
                      Pro Freelance
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dfdbff] text-[#5e4cff] font-medium">
                      SociaBuzz Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-2xl text-[#272835]">Pro Freelance</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-[#272835]">Rp 49.000</span>
                      <span className="text-xs text-[#818898]">/ bulan</span>
                    </div>
                    <p className="text-xs text-[#666d80] mt-1.5 leading-relaxed">
                      Untuk fotografer aktif & studio wedding yang butuh kuota besar dan branding profesional.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 pt-2 border-t border-[#eceff3] text-xs text-[#36394a]">
                    <div className="flex items-center gap-2.5 font-medium text-[#272835]">
                      <IconCheck className="w-4 h-4 text-[#5e4cff] shrink-0" />
                      <span><strong>Galeri Tanpa Batas</strong> (Unlimited Active Galleries)</span>
                    </div>
                    <div className="flex items-center gap-2.5 font-medium text-[#272835]">
                      <IconCheck className="w-4 h-4 text-[#5e4cff] shrink-0" />
                      <span>Hingga <strong>2.000 foto</strong> per folder galeri</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#5e4cff] shrink-0" />
                      <span><strong>Hapus Watermark</strong> & gunakan nama studio sendiri</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#5e4cff] shrink-0" />
                      <span><strong>Proteksi PIN Password</strong> khusus sesi klien</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconCheck className="w-4 h-4 text-[#5e4cff] shrink-0" />
                      <span>Prioritas Google Drive High-Speed CDN</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSelectPro}
                    className="w-full py-2.5 px-4 rounded-[8px] bg-[#5e4cff] hover:opacity-90 text-white text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                  >
                    <IconCrown className="w-4 h-4" />
                    <span>Pilih Paket Pro (Rp 49rb)</span>
                  </button>
                  <p className="text-[11px] text-[#818898] text-center mt-2">
                    Pembayaran QRIS / e-Wallet via SociaBuzz
                  </p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#666d80] hover:text-[#272835] font-medium transition"
              >
                &larr; Kembali ke survey pertanyaan
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-[#cdd2d9] bg-white py-4 text-center text-xs text-[#818898] font-mono">
        <span>&copy; {new Date().getFullYear()} Picura. Platform Seleksi Foto Google Drive & WhatsApp.</span>
      </footer>

      {/* Upgrade Modal for Pro Plan Payment */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => {
          setIsUpgradeModalOpen(false);
          router.push("/dashboard");
        }}
        onSuccess={() => {
          setIsUpgradeModalOpen(false);
          router.push("/dashboard");
        }}
        currentTier="FREEMIUM"
      />
    </div>
  );
}
