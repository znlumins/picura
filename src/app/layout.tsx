import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://picura.web.id"),
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
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Picura - Platform Seleksi Foto Google Drive & WhatsApp",
    description:
      "Pilih foto klien langsung ke WhatsApp tanpa re-upload. Tautkan Google Drive, kurasi di browser HP, dan daftar nama file otomatis terkirim rapi ke WhatsApp editor.",
    url: "https://picura.web.id",
    siteName: "Picura",
    images: [
      {
        url: "/og-poster-v2.png",
        secureUrl: "https://picura.web.id/og-poster-v2.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Picura - Seleksi Foto Klien Langsung ke WhatsApp",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Picura - Platform Seleksi Foto Google Drive & WhatsApp",
    description:
      "Pilih foto klien langsung ke WhatsApp tanpa re-upload. Tautkan Google Drive, kurasi di browser HP.",
    images: ["/og-poster-v2.png"],
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
      <head>
        <meta property="og:image:secure_url" content="https://picura.web.id/og-poster-v2.png" />
        <meta property="og:image:type" content="image/png" />
        <link rel="image_src" href="https://picura.web.id/og-poster-v2.png" />
      </head>
      <body className="antialiased bg-[#050505] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
