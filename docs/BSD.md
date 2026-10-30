# **BACKEND SCHEMA DOCUMENTATION (BSD): PICURA**

Dokumen Spesifikasi Skema Database, Relasi Entitas, dan Strategi Caching Platform Seleksi Foto

# **1\. Database Architecture & Overview**

Sistem backend Picura menggunakan kombinasi RDBMS PostgreSQL untuk penyimpanan data terstruktur relasional dan Redis key-value store untuk pengolahan performa tinggi, caching metadata, serta pembatasan laju akses (rate limiting).

| Komponen Sistem | Teknologi / Versi | Peran & Deskripsi Operasional |
| :---- | :---- | :---- |
| **Database Engine** | PostgreSQL (v15+) | Penyimpanan utama entitas pengguna, galeri, otentikasi, transaksi, dan histori seleksi. |
| **ORM / Query Builder** | Prisma ORM / Drizzle ORM | Layer pemetaan objek-relasional (*type-safe schema*) dan pengelolaan migrasi database. |
| **Cache & In-Memory Store** | Redis (v7+) | *In-memory store* untuk manajemen sesi, caching folder Google Drive, dan *rate-limiting* API. |
| **Cloud Storage Integration** | Google Drive API (v3) | Sumber penyimpanan foto mentah secara eksternal (*read-only metadata*). |

# **2\. Entity Relationship Diagram (ERD) & Table Schema Definitions**

## **2.1 Schema Overview & Relasi Entitas**

1. **`users` (1) ke `galleries` (N):** Satu fotografer/pengguna dapat memiliki banyak galeri aktif.  
2. **`galleries` (1) ke `photos_cache` (N):** Satu galeri memiliki banyak metadata foto yang di-cache dari Google Drive.  
3. **`galleries` (1) ke `selections` (N):** Satu galeri dapat menerima beberapa kali submit seleksi dari klien.  
4. **`users` (1) ke `subscriptions` (N):** Satu pengguna memiliki histori transaksi paket langganan SaaS.

## **2.2 Table: `users` (Fotografer & Admin)**

Tabel `users` menyimpan informasi akun fotografer, data kredensial Google OAuth 2.0 untuk integrasi Drive, serta status paket langganan SaaS.

```
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    google_access_token TEXT,
    google_refresh_token TEXT,
    avatar_url TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'FREEMIUM', -- FREEMIUM, PRO, STUDIO
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **Spesifikasi Kolom `users`:**

* **`subscription_tier`**: Menentukan batas kuota pembuatan galeri dan fitur premium (FREEMIUM, PRO, STUDIO).  
* **`google_access_token` & `google_refresh_token`**: Token terenkripsi untuk melakukan pemanggilan Google Drive API v3 secara *read-only*.

## **2.3 Table: `galleries` (Galeri Klien)**

Tabel `galleries` menyimpan konfigurasi galeri sesi pemotretan, batas kuota pilihan foto, proteksi kata sandi, dan nomor tujuan WhatsApp editor.

```
CREATE TABLE galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    google_drive_folder_id VARCHAR(255) NOT NULL,
    max_selection_quota INT NOT NULL DEFAULT 20,
    password_hash VARCHAR(255),
    editor_whatsapp_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, COMPLETED, EXPIRED
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_galleries_slug ON galleries(slug);
CREATE INDEX idx_galleries_user_id ON galleries(user_id);
```

### **Spesifikasi Kolom `galleries`:**

* **`slug`**: Identifier unik pada URL pratinjau galeri web yang diakses oleh klien.  
* **`google_drive_folder_id`**: ID unik folder Google Drive sumber file foto mentah.  
* **`editor_whatsapp_number`**: Nomor WhatsApp penerima format pesan daftar foto terpilih.

## **2.4 Table: `photos_cache` (Cache Metadata Foto)**

Tabel `photos_cache` menyimpan metadata foto berukuran ringan yang diimpor dari Google Drive untuk mempercepat proses pembuatan galeri dan render pratinjau.

```
CREATE TABLE photos_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    drive_file_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    thumbnail_url TEXT NOT NULL,
    web_content_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_gallery_id ON photos_cache(gallery_id);
```

### **Spesifikasi Kolom `photos_cache`:**

* **`drive_file_id`**: Identifikasi unik file di Google Drive untuk mempermudah presisi pencarian oleh editor.  
* **`thumbnail_url`**: URL pratinjau foto berukuran kecil untuk mendukung pengoptimalan *lazy loading*.

## **2.5 Table: `selections` (Hasil Seleksi Klien)**

Tabel `selections` mendokumentasikan entri data saat klien menyelesaikan dan mengonfirmasi pilihan foto mereka.

```
CREATE TABLE selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
    client_name VARCHAR(255),
    selected_photo_ids JSONB NOT NULL, -- Array of drive_file_id & file_name
    total_selected INT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **Spesifikasi Kolom `selections`:**

* **`selected_photo_ids`**: Format data JSONB yang menyimpan daftar file terpilih (misal: `[{"drive_id": "123", "file_name": "IMG_001.JPG"}]`) untuk efisiensi kueri dan integrasi tautan WhatsApp.

## **2.6 Table: `subscriptions` (Transaksi SaaS)**

Tabel `subscriptions` mengelola histori transaksi langganan SaaS, status pembayaran dari *payment gateway*, dan perpanjangan paket.

```
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    tier_plan VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, SETTLED, FAILED, EXPIRED
    payment_gateway VARCHAR(50) DEFAULT 'MIDTRANS',
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

# **3\. Redis Data Structure & Caching Strategy**

Untuk memenuhi batas waktu pemuatan di bawah 2 detik dan mencegah batasan *rate limit* pada Google Drive API, Redis dimanfaatkan sebagai lapisan *caching* berkinerja tinggi.

```
+-----------------------------------------------------------------------+
|                             REDIS MEMORY                              |
+-----------------------------------------------------------------------+
|  1. Session Key             -> session:{user_id}                      |
|  2. Drive Metadata Cache   -> cache:drive:folder:{folder_id}          |
|  3. Client Rate Limiting   -> ratelimit:gallery:{ip_address}          |
+-----------------------------------------------------------------------+
```

## **3.1 Session Key**

* **Pattern:** `session:{user_id}`  
* **Data Type:** String (JSON / Hash)  
* **Time To Live (TTL):** 7 hari (604,800 detik)  
* **Fungsi:** Menyimpan status autentikasi, OAuth tokens, dan role pengguna untuk mempercepat otorisasi API tanpa melakukan kueri berulang ke database PostgreSQL.

## **3.2 Drive Folder Metadata Cache**

* **Pattern:** `cache:drive:folder:{folder_id}`  
* **Data Type:** String (JSON Array)  
* **Time To Live (TTL):** 15 menit (900 detik)  
* **Fungsi:** Menyimpan respons metadata Google Drive (Thumbnail URL, File Name, ID) untuk galeri yang sedang aktif dibuka klien agar performa *load time* tetap konsisten.

## **3.3 Client Rate Limiting**

* **Pattern:** `ratelimit:gallery:{ip_address}`  
* **Data Type:** String (Counter Integer)  
* **Time To Live (TTL):** 1 menit (60 detik)  
* **Fungsi:** Mencegah serangan *brute force* pada proteksi kata sandi galeri dan membatasi jumlah eksekusi tombol submit seleksi.

# **4\. Constraint & Integrasi Data**

* **Enkripsi Token:** Kredensial `google_access_token` dan `google_refresh_token` wajib dienkripsi pada tingkat aplikasi (misal: AES-256-GCM) sebelum disimpan ke tabel `users`.  
* **Cascading Deletes:** Penggunaan klausa `ON DELETE CASCADE` pada foreign key memastikan kebersihan data saat galeri atau pengguna dihapus.  
* **Integritas Seleksi Klien:** Validasi backend wajib memastikan jumlah elemen `selected_photo_ids` tidak melebihi parameter `max_selection_quota` milik galeri terkait.

