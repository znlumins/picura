# 🚀 Picura Backend — High-Performance Golang REST API

Backend performa tinggi untuk platform **Picura**, dibangun menggunakan bahasa **Go (Golang)** dengan router **Chi**, ORM **GORM**, dan integrasi gateway pembayaran **SociaBuzz** via `github.com/hirotomasato/scbz`.

---

## 🏗️ Fitur & Arsitektur

* **Framework & Router**: Chi v5 (ringan, idiomatic, dan hemat memori).
* **Database**: PostgreSQL (berbagi database yang sama dengan Prisma Cloud / Supabase).
* **Autentikasi**: JWT (JSON Web Tokens) dengan enkripsi password bcrypt.
* **Payment Gateway**: **SociaBuzz** (mendukung QRIS instan, GoPay, OVO, DANA, ShopeePay, dan Virtual Account tanpa perlu legalitas PT/CV).
* **Integrasi Google Drive**: Fetching otomatis foto resolusi tinggi dan thumbnail via Google Global CDN.

---

## 📁 Struktur Direktori

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # Entry point server Chi
├── config/
│   └── config.go            # Manajemen konfigurasi & file .env
├── database/
│   ├── database.go          # Koneksi PostgreSQL & seed demo user
│   └── models.go            # Model GORM (users, galleries, photos_cache, selections, subscriptions)
├── handlers/
│   ├── auth.go              # Register, Login, Me, Update Settings
│   ├── gallery.go           # List, Create, Public Slug View, Password Verification, WhatsApp Submit
│   └── payment.go           # Upgrade langganan SociaBuzz & Webhook listener
├── middleware/
│   └── auth.go              # JWT Auth & Context extractor
├── services/
│   ├── gdrive.go            # Parsing Google Drive URL & metadata fetching
│   └── sociabuzz.go         # SociaBuzz SDK wrapper (scbz)
├── go.mod
├── go.sum
└── .env.example
```

---

## ⚙️ Menjalankan Server

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Buat file `.env` berdasarkan `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Atur variabel `SOCIABUZZ_USERNAME` dengan username akun SociaBuzz Anda:
   ```env
   SOCIABUZZ_USERNAME=username_sociabuzz_anda
   ```
4. Jalankan server:
   ```bash
   go run ./cmd/server
   ```
   Atau build binary:
   ```bash
   go build -o picura-server.exe ./cmd/server
   ./picura-server.exe
   ```

Server akan aktif di `http://localhost:8080`.

---

## 📡 Daftar Endpoint API

### 1. Autentikasi (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Pendaftaran fotografer baru
- `POST /api/v1/auth/login` — Masuk dan mendapatkan JWT Bearer token
- `GET /api/v1/auth/me` — Info profil pengguna terautentikasi (Protected)
- `PUT /api/v1/auth/settings` — Simpan nama studio, nomor WhatsApp, & Google API Key (Protected)

### 2. Galeri & Proofing (`/api/v1/galleries`)
- `GET /api/v1/galleries` — Daftar galeri fotografer & monitoring batas kuota tier
- `POST /api/v1/galleries` — Buat galeri baru dan tarik foto dari Google Drive
- `GET /api/v1/galleries/{slug}` — Halaman proofing foto untuk klien (Public)
- `POST /api/v1/galleries/{slug}/verify-password` — Verifikasi proteksi PIN/Password
- `POST /api/v1/galleries/{slug}/submit` — Klien mengirim seleksi foto & generate link WhatsApp

### 3. Pembayaran SociaBuzz (`/api/v1/payments`)
- `POST /api/v1/payments/upgrade` — Buat pesanan upgrade (Pro Freelance / Studio Agency) via SociaBuzz & generate QRIS/Payment URL
- `GET /api/v1/payments/status/{orderId}` — Cek status pembayaran pesanan
- `POST /api/v1/payments/webhook` — Webhook listener otomatis saat pembayaran SociaBuzz berhasil
