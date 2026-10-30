# **TECHNICAL REQUIREMENT DOCUMENTATION (TRD): PICURA**

# **Ringkasan Spesifikasi Teknis Dokumen**

| Parameter Teknis | Detail Spesifikasi |
| :---- | :---- |
| **Nama Produk** | Picura SaaS Platform |
| **Dokumen Versi** | 1.0.0-TRD |
| **Status Dokumen** | Approved for Implementation |
| **Lead Architect** | Person |
| **Target Cloud Infrastructure** | AWS Elastic Container Service (ECS) / GCP Cloud Run |
| **Primary Stack** | Next.js 14 (App Router), Node.js (NestJS), PostgreSQL 16, Redis 7 |

# **1\. System Architecture & High-Level Design**

# **1.1 Architecture Diagram & Component Overview**

Sistem Picura mengadopsi arsitektur terintegrasi modern berbasis micro-services/decoupled monolith yang terbagi ke dalam empat layer utama untuk menjamin ketersediaan tinggi, skalabilitas, dan latensi minimum.

* **Client Tier (Frontend):** Berbasis Next.js 14 (React) App Router dengan Tailwind CSS, di-host pada platform edge Vercel / Cloudflare Pages. Bertanggung jawab menyajikan antarmuka *Mobile-First* yang responsif, manajemen state lokal untuk seleksi foto, serta rendering pratinjau *Lightbox* interaktif.  
* **API Gateway & Application Server:** Node.js (Express / NestJS) RESTful API Service running di dalam Docker container yang dikelola oleh AWS ECS atau GCP Cloud Run. Layer ini menangani orkestrasi bisnis, validasi token, integrasi API pihak ketiga, dan manajemen kuota langganan.  
* **Database & Cache Tier:**  
  * **PostgreSQL 16:** Relational database utama untuk menyimpan data terstruktur seperti akun pengguna, galeri, metadata seleksi, dan status langganan.  
  * **Redis 7.2:** In-Memory Data Store yang bertindak sebagai layer *caching* metadata Google Drive, *rate limiter*, serta pengelola sesi JWT/Refresh Tokens.  
* **External Integration Services:**  
  * **Google Drive API v3:** Mengambil metadata dan *thumbnail* foto secara *read-only* langsung dari cloud storage pengguna.  
  * **WhatsApp Deep Link Generator Engine:** Pembangkit URL URI Scheme untuk pesan otomatis terformat tanpa perantara API resmi berbiaya.  
  * **Payment Gateway Service (Midtrans / Xendit):** Memproses transaksi langganan SaaS via webhook terenkripsi.

# **1.2 Data Flow Architecture**

## **Workflow 1: Konfigurasi & Ingesti Galeri**

1. Fotografer autentikasi via Google OAuth 2.0.  
2. Fotografer memilih folder Google Drive.  
3. Backend memanggil Google Drive API v3 secara *asynchronous*, memetakan nama file, `fileId`, dan `thumbnailLink`.  
4. Metadata foto disimpan sementara di Redis Cache (TTL 15 menit) dan direkam di database PostgreSQL.  
5. Unique Slug / Hash ID galeri diterbitkan untuk akses klien.

## **Workflow 2: Eksekusi Seleksi Foto oleh Klien**

1. Klien membuka tautan `https://picura.app/g/{gallery_slug}`.  
2. Klien memasukkan kata sandi galeri jika dilindungi.  
3. Frontend mengambil metadata foto dari Redis via API Backend.  
4. Klien menandai foto (State dikelola di React Context / Zustand).  
5. Klien menekan tombol "Kirim Pilihan ke Editor".  
6. Backend memverifikasi batas kuota. Jika valid, pesan terformat dibangun dan dialihkan ke URI scheme WhatsApp (`wa.me`).

# **1.3 Database Schema Design (PostgreSQL DDL)**

Berikut adalah struktur tabel relational utama yang dirancang untuk mendukung operasional Picura:

```
-- Enum Types for Subscription Tiers and Status
CREATE TYPE subscription_tier AS ENUM ('FREEMIUM', 'PRO_FREELANCE', 'STUDIO');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SETTLED', 'EXPIRED', 'FAILED');

-- Users / Photographers Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    tier subscription_tier DEFAULT 'FREEMIUM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Auth Tokens (Encrypted OAuth Tokens)
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Galleries Table
CREATE TABLE galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    drive_folder_id VARCHAR(255) NOT NULL,
    editor_phone VARCHAR(30) NOT NULL,
    max_selection INT NOT NULL DEFAULT 0,
    password_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Selections Table (Client Selection Logs)
CREATE TABLE selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
    client_name VARCHAR(255),
    selected_files JSONB NOT NULL, -- Array of Drive File IDs and Filenames
    total_selected INT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions & Payments Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    tier subscription_tier NOT NULL,
    status payment_status DEFAULT 'PENDING',
    payment_gateway VARCHAR(50) NOT NULL,
    snap_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

# **2\. API Specifications & Integration Details**

# **2.1 RESTful API Endpoint Inventory**

| Endpoint | Method | Auth Required | Description |
| :---- | :---- | :---- | :---- |
| `/api/v1/auth/google` | `POST` | Public | Google OAuth Callback & JWT Issuance |
| `/api/v1/auth/refresh` | `POST` | Refresh Token | Mendapatkan Access Token baru |
| `/api/v1/galleries` | `POST` | Bearer JWT | Membuat galeri baru terintegrasi Drive |
| `/api/v1/galleries` | `GET` | Bearer JWT | Memuat daftar galeri milik fotografer |
| `/api/v1/galleries/:slug` | `GET` | Public / Password | Memuat metadata galeri & file foto untuk klien |
| `/api/v1/galleries/:id/submit` | `POST` | Public | Menyimpan hasil seleksi & menerbitkan pesan WA |
| `/api/v1/payments/webhook` | `POST` | Signature Key | Receiver notification dari Midtrans/Xendit |

## **Endpoint Spec: Submit Selection (`POST /api/v1/galleries/:id/submit`)**

**Request Payload:**n  
{  
"client\_name": "Budi Santoso",  
"selected\_files": \[  
{ "file\_id": "1A2b3C4d5E", "filename": "IMG\_001.JPG" },  
{ "file\_id": "6F7g8H9i0J", "filename": "IMG\_005.JPG" }  
\]  
}

````

**Response Payload (200 OK):**
```json
{
  "status": "success",
  "data": {
    "selection_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "total_selected": 2,
    "whatsapp_url": "https://wa.me/6281234567890?text=Halo%20Kak%2C%20berikut%20daftar%20foto%20terpilih..."
  }
}
````

# **2.2 Google Drive API Integration**

* **OAuth 2.0 Scope Scope:**  
  * `https://www.googleapis.com/auth/drive.readonly`: Menjamin aplikasi hanya dapat membaca file tanpa risiko modifikasi/penghapusan data mentah pengguna.  
  * `https://www.googleapis.com/auth/userinfo.profile`: Profil dasar fotografer.  
* **Thumbnail Processing & URL Transformation:**  
  Guna menghemat *bandwidth* server dan mempercepat pemuatan halaman di seluler, sistem tidak mengunduh binary foto mentah. Sistem mengambil properti `thumbnailLink` dari Google Drive API v3 dan mengubah parameter ukurannya:  
  * Grid View (Mobile/Desktop): Ubah akhiran `=s220` menjadi `=s400` (400px width).  
  * Lightbox Preview Mode: Ubah akhiran `=s220` menjadi `=s1600` (1600px width HD Preview).  
* **Folder Traversal Query:**  
  Pengambilan daftar file menggunakan query presisi untuk mengeklusi folder dan file sampah:

```
GET https://www.googleapis.com/drive/v3/files?q='{FOLDER_ID}'+in+parents+and+mimeType!='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name,thumbnailLink,mimeType,webContentLink)&pageSize=1000
```

# **2.3 WhatsApp Deep Link Protocol Engine**

Pesan otomatis dibentuk menggunakan engine pengubah string terenkode UTF-8 agar kompatibel dengan seluruh *mobile OS* dan *WhatsApp Desktop/Web*.

## **Format Schema**

```
https://wa.me/{phone_number}?text={encoded_message}
```

## **Encoder Algorithm Logic (TypeScript)**

```
export function generateWhatsAppLink(
  phoneNumber: string, 
  galleryTitle: string, 
  filenames: string[]
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  let message = `Halo Kak, berikut daftar foto terpilih untuk *${galleryTitle}*:\n\n`;
  filenames.forEach((name, index) => {
    message += `${index + 1}. ${name}\n`;
  });
  message += `\nTotal: ${filenames.length} Foto.\nTerima kasih!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
```

# **2.4 Payment Gateway Integration (Midtrans Webhook)**

* **Webhook Endpoint:** `/api/v1/payments/webhook`  
* **Signature Key Validation (SHA512):**  
  Sistem wajib memverifikasi keabsahan data webhook dengan menghitung ulang signature key:  
  \$\$\\text{Signature} \= \\text{SHA512}(\\text{order\_id} \+ \\text{status\_code} \+ \\text{gross\_amount} \+ \\text{ServerKey})\$\$  
* **Idempotency Strategy:**  
  Guna mencegah pemicuan berulang (*double provisioning*), sistem menyimpan `order_id` pada Redis Lock selama pemrosesan dan mengecek status transaksi pada PostgreSQL. Jika status transaksi `settlement` sudah tercatat, webhook susulan dengan `order_id` yang sama akan diabaikan (mengembalikan respon `200 OK`).

# **3\. Security, Authentication & Data Protection**

# **3.1 Session Management & Auth Flow**

* **Access Token:** JSON Web Token (JWT) dengan durasi aktif pendek (15 menit), ditandatangani menggunakan algoritma RS256.  
* **Refresh Token:** HttpOnly, Secure, SameSite=Strict Cookie dengan durasi aktif 7 hari. Disimpan di Redis dengan kaitan ID pengguna untuk mendukung pembatalan sesi (*session revocation*).

# **3.2 Data Encryption & Token Storage**

* **OAuth Refresh Token Encryption:** Refresh token Google Drive milik fotografer disimpan di tabel `user_tokens` dalam bentuk terenkripsi menggunakan algoritma **AES-256-GCM** dengan *Initialization Vector* (IV) unik per entri.  
* **Transit Security:** Seluruh komunikasi HTTP wajib menggunakan enkripsi TLS 1.3 (HTTPS).

# **3.3 Rate Limiting & Protection**

* **Rate Limiter Engine:** Redis Token Bucket dipasang pada middleware API Gateway.  
* **Public Gallery Limit:** Maksimal **60 request/menit per IP** untuk endpoint publik galeri klien guna mencegah *scraping* atau serangan Denial of Service (DoS).  
* **Auth Limit:** Maksimal **5 percobaan/menit** pada endpoint verifikasi kata sandi galeri.

# **3.4 Password Protection for Galleries**

* Sandi galeri dienkripsi menggunakan algoritma **Argon2id** / **Bcrypt** (Cost factor 10\) sebelum disimpan ke kolom `password_hash` pada tabel `galleries`.

# **4\. Performance, Scalability & Reliability**

# **4.1 Caching Strategy (Redis Multi-Layer)**

Guna memenuhi target performa waktu muat galeri di bawah 2 detik serta menghindari batasan *rate limit* Google Drive API (12.000 request/menit/proyek), diterapkan strategi pembagian cache:

```
[Client Request] 
       │
       ▼
[Redis Cache Exists?] ──(YES)──► [Return Cached JSON Metadata (< 50ms)]
       │
      (NO)
       │
       ▼
[Fetch Google Drive API] ──► [Store in Redis (TTL 15 Min)] ──► [Return Response]
```

* **Cache Key Scheme:** `drive:folder:{folder_id}:photos`  
* **TTL Configuration:** 15 menit (900 detik).  
* **Invalidation Trigger:** Cache dihapus secara otomatis jika fotografer menekan tombol "Refresh Folder" pada dashboard.

# **4.2 Client-Side Image Optimization Pipeline**

* **Next.js `<Image />` Component Integration:** Memanfaatkan loader khusus untuk memetakan URL *thumbnail* Google Drive ke dalam format modern **WebP** atau **AVIF** secara *on-the-fly*.  
* **Lazy Loading & Blur-up Placeholder:** Menggunakan teknik *Intersection Observer* (`loading="lazy"`) sehingga gambar hanya diunduh saat masuk ke dalam *viewport* pengguna. Selagi memuat, sistem menampilkan CSS skeleton / blur placeholder berukuran \< 1 KB.

# **4.3 Infrastructure Scalability & Reliability**

* **Stateless Server Containerization:** Server API dikemas menggunakan Docker *multi-stage build* untuk menghasilkan citra (*image*) ringan (\< 150 MB).  
* **Autoscaling Policy:** AWS ECS / Cloud Run dikonfigurasi untuk menambah *instance* secara otomatis (*Horizontal Pod Autoscaling*) ketika penggunaan CPU melampaui 70% atau memori melampaui 80% selama 2 menit berturut-turut.  
* **Database Connection Pooling:** Menggunakan **PgBouncer** di depan PostgreSQL untuk mengelola ribuan koneksi simultan tanpa menguras memori database.

