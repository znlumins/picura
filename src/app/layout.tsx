import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Picura - Platform Seleksi Foto Interaktif Google Drive & WhatsApp",
  description:
    "SaaS seleksi foto untuk fotografer freelance dan studio. Klien memilih foto mentah dari Google Drive secara interaktif di browser seluler dan daftar nama file otomatis terkirim ke WhatsApp editor tanpa re-upload.",
  keywords: [
    "Picura",
    "seleksi foto",
    "fotografer",
    "google drive",
    "whatsapp",
    "studio foto",
    "photo selection",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#050505] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
