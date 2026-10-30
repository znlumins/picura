<div align="center">

# 📸 Picura

### Platform Seleksi Foto Interaktif Google Drive & Dispatch Otomatis ke WhatsApp

[![Production Status](https://img.shields.io/badge/Production-Live-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://picura.web.id)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**[Kunjungi Website Resmi: picura.web.id](https://picura.web.id)**

---

</div>

## 💡 Tentang Picura (About)

**Picura** adalah platform SaaS *client proofing* dan kurasi media yang dirancang untuk fotografer *freelance*, studio foto, agensi visual, dan tim kreatif. 

### 🛑 Masalah Utama Fotografer:
1. **Re-upload yang Menghabiskan Waktu & Kuota:** Fotografer harus mengunggah ulang ratusan foto resolusi tinggi ke platform gallery berbayar.
2. **Klien Salah Ketik Nama File:** Klien mengetik manual puluhan kode foto di WhatsApp (contoh: `IMG_0412.JPG`, `DSC_8921.JPG`) yang sering salah ketik, membingungkan editor, dan menunda *deadline*.
3. **Biaya Cloud Mahal:** Platform proofing luar negeri mengenakan biaya langganan bulanan mahal untuk penyimpanan storage.

### ⚡ Solusi Picura:
- **Zero Re-upload:** Cukup tempel tautan folder Google Drive Anda yang sudah ada. Picura mengekstrak daftar foto dan menayangkannya melalui Google Global CDN.
- **Kurasi Interaktif di Browser HP:** Klien membuka tautan galeri di smartphone, memilih foto favorit dengan visual preview dan hitungan kuota real-time.
- **Dispatch Format WhatsApp Sekali Klik:** Setelah selesai, klien menekan satu tombol dan daftar kode nama file foto tersusun rapi beserta catatan khusus yang langsung diteruskan ke nomor WhatsApp editor/fotografer.

---

## ✨ Fitur Utama

- 🔗 **Google Drive Direct Integration:** Membaca metadata dan thumbnail foto dari folder Google Drive tanpa membebani storage server aplikasi.
- 📱 **Mobile-First Client Gallery:** Antarmuka responsif ramah layar sentuh untuk klien menandai foto favorit dan menulis catatan editing (*retouching/album*).
- 💬 **One-Click WhatsApp Dispatch:** Otomatis menghasilkan format pesan WhatsApp terstruktur dengan URL deep link `wa.me`.
- 🔒 **PIN & Proteksi Galeri:** Opsi pengamanan sesi foto klien dengan kata sandi/PIN agar privasi tetap terjaga.
- ⏱️ **Batas Kuota Seleksi & Masa Aktif:** Atur batas maksimal foto yang boleh dipilih (misal: 15, 20, atau 30 foto) dan batas tanggal kedaluwarsa galeri.
- 📊 **Real Dashboard Fotografer:** Pantau statistik galeri sesi foto aktif, riwayat seleksi masuk dari klien, serta detail foto yang dipilih secara langsung.
- 🎨 **Anti-Slop Clean Design System:** Dibangun dengan estetika Lightdash (*Space Grotesk, Inter, Ash Border, & Volt Violet*) dengan ikon vektor SVG kustom geometris tanpa ketergantungan icon slop.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend UI** | [Next.js 14](https://nextjs.org/) (App Router, Tailwind CSS, Space Grotesk & Inter) |
| **High-Perf Backend** | [Golang (Go)](https://go.dev/) (Chi v5 Router, GORM ORM) di folder /backend |
| **Payment Gateway** | **[SociaBuzz](https://sociabuzz.com/)** via [github.com/hirotomasato/scbz](https://github.com/hirotomasato/scbz) (QRIS, E-Wallet & VA) |
| **Database** | [PostgreSQL Cloud](https://www.postgresql.org/) (Shared dengan Prisma ORM) |
| **Authentication** | JWT (JSON Web Token) & Bcrypt Password Hashing |
| **Cloud Storage** | Google Drive API v3 & Google UserContent CDN |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend) & Golang Binary Service (Backend) |

---

## 🚀 Memulai (Local Development)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau 20+
- Database PostgreSQL aktif

### 2. Clone Repository
```bash
git clone https://github.com/znlumins/picura.git
cd picura
```

### 3. Install Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables (`.env`)
Buat file `.env` di root direktori dengan variabel berikut:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/picura?schema=public"
JWT_SECRET="ganti-dengan-secret-jwt-yang-aman"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Setup Database & Prisma
Sinkronisasikan skema Prisma ke database:

```bash
npx prisma generate
npx prisma db push
```

### 6. Jalankan Server Development
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📦 Build Produksi & Deployment

Untuk menguji build produksi lokal:
```bash
npm run build
npm run start
```

Deploy ke Vercel:
```bash
npx vercel --prod
```

---

## 📂 Struktur Direktori

```text
picura/
├── prisma/
│   └── schema.prisma        # Skema model database PostgreSQL (User, Gallery, Selection, PhotoCache)
├── public/
│   ├── favicon.svg          # Ikon favicon tab browser (Emblem P resmi)
│   ├── logo.svg             # Logo vektor resmi Picura
│   └── og-poster-v2.png     # Poster preview OpenGraph WhatsApp
├── src/
│   ├── app/
│   │   ├── api/v1/          # REST API (auth, galleries, selection submit)
│   │   ├── dashboard/       # Dashboard fotografer
│   │   ├── g/[slug]/        # Galeri interaktif klien
│   │   ├── globals.css      # Konfigurasi Tailwind & Font
│   │   ├── layout.tsx       # Root layout & meta tags OpenGraph
│   │   └── page.tsx         # Landing page resmi Picura
│   ├── components/          # Komponen UI (PicuraLogo, Icons, StudioHeroBanner, MetricsGrid, dll)
│   └── lib/                 # Utilitas (auth, prisma, google-drive, whatsapp)
└── README.md
```

---

## 📄 Lisensi & Tim Pengembang

Dikembangkan oleh:
- **[znlumins](https://github.com/znlumins)**
- **[Derajat-png](https://github.com/Derajat-png)**
- **[dzidniann](https://github.com/dzidniann)**

Hak Cipta &copy; 2026 Picura. All rights reserved.
