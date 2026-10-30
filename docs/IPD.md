# **IMPLEMENTATION PLAN DOCUMENTATION (IPD): PICURA**

# **Ringkasan Eksekutif & Metadata Pelaksanaan**

| Parameter | Detail Operasional |
| :---- | :---- |
| **Nama Proyek** | Picura \- Platform Seleksi Foto Interaktif |
| **Tipe Dokumen** | Implementation Plan Documentation (IPD) |
| **Versi & Status** | Versi 1.0 — Ready for Execution |
| **Tanggal Terbit** | 30 Oktober 2026 |
| **Target Eksekusi** | November 2026 – Oktober 2027 |

Dokumen Pelaksanaan Implementasi (*Implementation Plan Documentation*) ini menyusun secara terperinci strategi rekayasa perangkat lunak, jadwal eksekusi *sprint*, pembagian sumber daya teknis, serta mitigasi risiko teknis untuk membangun platform SaaS Picura berbasis Next.js, Node.js API, PostgreSQL, dan Redis.

# **1\. Project Roadmap & Sprint Breakdown**

## **Phase 1: MVP Core Development (Bulan 1 \- Bulan 3\)**

### **Sprint 1 (Minggu 1-2): Setup Infrastruktur & Autentikasi**

* Inisialisasi monorepo/repositori terpisah untuk Next.js (Frontend) dan Node.js Express API (Backend).  
* Konfigurasi database PostgreSQL, Prisma ORM, dan pengeset instance Redis Caching server.  
* Implementasi alur *Login & Signup* fotografer berbasis Google OAuth 2.0 dan *Session Management* menggunakan JSON Web Token (JWT).  
* Penyusunan arsitektur basis data untuk tabel Pengguna (*Users*), Galeri (*Galleries*), dan Metadata Foto (*Photo Metadata*).

### **Sprint 2 (Minggu 3-4): Integrasi Google Drive API**

* Pengembangan modul integrasi Google Drive API v3 dengan mekanisme *read-only access*.  
* Implementasi *background job* untuk pemindaian folder Google Drive, ekstraksi nama file, URL thumbnail, dan dimensi gambar.  
* Integrasi skema *caching* metadata pada Redis untuk mempercepat waktu pemuatan galeri di bawah 2 detik.  
* Penanganan penanganan error token Google OAuth *refresh token* secara otomatis.

### **Sprint 3 (Minggu 5-6): Dashboard Management Fotografer**

* Pembuatan antarmuka pengguna (UI) Dashboard Fotografer untuk pengelolaan galeri.  
* Form pembuatan galeri baru yang mencakup Judul Sesi, Batas Maksimal/Kuota Seleksi Foto, Proteksi Kata Sandi, dan Nomor WhatsApp Editor.  
* Implementasi pendaftaran *slug* unik/URL galeri khusus untuk dibagikan ke klien.  
* Penyesuaian pengaturan batasan akun sesuai tier Freemium (maksimal 2 galeri aktif).

### **Sprint 4 (Minggu 7-8): Mobile-First Client Gallery UI**

* Pengembangan antarmuka galeri interaktif klien berbasis *Mobile-First Design* dan *Grid Desktop* yang adaptif.  
* Fitur *Lightbox Preview* ukuran penuh, navigasi geser (*swipe*), dan mode penjelajahan responsif.  
* Komponen *Selection Toggle* (ikon favorit/centang) dengan kalkulasi indikator kuota real-time.  
* Fitur pencarian nama file foto dan filter status terpilih.

### **Sprint 5 (Minggu 9-10): WhatsApp Deep Link Generator & Finalization**

* Pengembangan generator *template* pesan terformat otomatis yang merangkum daftar nama file foto terpilih dan total kuota.  
* Integrasi *WhatsApp Deep Linking* (`https://wa.me/`) yang mengarahkan klien langsung ke nomor WhatsApp editor.  
* Pengujian fungsionalitas pengiriman pesan pada aplikasi seluler (iOS/Android) dan WhatsApp Web.

### **Sprint 6 (Minggu 11-12): Testing, Security Audit & Initial MVP Launch**

* Pelaksanaan *End-to-End (E2E) Testing* menyeluruh untuk alur seleksi foto hingga pengiriman pesan WhatsApp.  
* *Load testing* pada API integrasi Google Drive dan penjelajahan galeri berkecepatan tinggi.  
* Audit keamanan enkripsi token OAuth dan perlindungan galeri privat berbasis password.  
* Peluncuran publik MVP Picura versi Gratis (Freemium).

## **Phase 2: Monetization & Advanced Features (Bulan 4 \- Bulan 6\)**

### **Sprint 7-8: Payment Gateway & Subscription Management**

* Integrasi *Payment Gateway* Midtrans / Xendit untuk pemrosesan pembayaran otomatis.  
* Pembuatan skema langganan SaaS berulang (*recurring subscription*) untuk tier Pro Freelance dan Studio.  
* Penanganan *webhook* status pembayaran untuk aktivasi kuota galeri secara *real-time*.

### **Sprint 9-10: Custom Branding Studio**

* Pengembangan fitur kustomisasi branding studio foto pada halaman galeri klien.  
* Penambahan modul unggah *Custom Watermark* dan Logo Studio.  
* Pengaturan *Custom Subdomain* atau identitas visual unik bagi pengguna tier Pro dan Studio.

### **Sprint 11-12: Client Notes & Auto-Expiry System**

* Penambahan fitur catatan khusus per foto (contoh: instruksi *retouching* spesifik dari klien).  
* Otomasi sistem batas waktu kadaluarsa galeri (*Expiry Date*) untuk menghapus cache metadata galeri yang sudah tidak aktif.  
* Peninjauan kinerja alur konversi pengguna dari Freemium ke Pro/Studio.

## **Phase 3: Scaling & Enterprise Capabilities (Bulan 7 \- Bulan 12\)**

### **Pelaksanaan Ekstensi Utama**

* **Integrasi WhatsApp Business API Resmi:** Pengiriman notifikasi status seleksi dan pengingat otomatis langsung dari server tanpa perlu *deep link* manual.  
* **Multi-User Team Access:** Manajemen hak akses bertingkat untuk studio foto (Admin, Fotografer, Editor).  
* **Dukungan File Video & Image CDN Delivery:** Ekstensi seleksi file video dan penggunaan *Content Delivery Network* (CDN) berkecepatan tinggi untuk pratinjau gambar berukuran besar.

# **2\. Resource Allocation & Team Responsibilities**

| Peran Tim | Tanggung Jawab Utama | Deliverables Kunci |
| :---- | :---- | :---- |
| **Frontend Lead** | Responsive Web Gallery UI/UX, Lightbox Preview, State Management, Next.js, Tailwind CSS. | \- Client Gallery Interface- Photographer Dashboard UI- Lightbox & Zoom Component |
| **Backend Lead** | API Architecture, Google OAuth 2.0, Drive API Sync, PostgreSQL Schema, Redis Caching, Payment Webhooks. | \- Express/Node.js REST API- Google Drive Metadata Engine- Payment Gateway Service |
| **QA & Security Specialist** | E2E Testing (Playwright/Cypress), Audit Keamanan Token OAuth, Rate Limiting & Load Testing. | \- Test Automation Suite- Security Audit Report- Performance Benchmark (\<2s Load Time) |

# **3\. Risk Assessment & Mitigation Matrix**

| Kategori Risiko | Deskripsi Risiko | Tingkat Dampak | Strategi Mitigasi Terencana |
| :---- | :---- | :---- | :---- |
| **Google Drive API Quota Limit** | Panggilan API terblokir karena melebihi batasan kuota *rate limit* bawaan Google Cloud. | Tinggi | Implementasi sistem *caching* Redis untuk metadata folder selama 15 menit dan penggunaan transmisi data *incremental sync*. |
| **Pemuatan Thumbnail Lambat** | Waktu pemuatan foto lambat pada koneksi seluler lambat. | Sedang | Memanfaatkan parameter preset ukuran thumbnail resmi Google Drive (`s400`) serta teknik *lazy loading* Next.js. |
| **Perubahan URL Scheme WhatsApp** | Format *deep link* WhatsApp mengalami perubahan dari pihak penyedia. | Sedang | Pemisahan *abstraction layer* URL generator pada server backend sehingga pembaruan dapat dilakukan terpusat tanpa rilis ulang frontend. |
| **Kebocoran Akses Folder Drive** | Token OAuth atau akses folder mentah disalahgunakan pihak ketiga. | Tinggi | Menggunakan akses *read-only* murni, enkripsi AES-256 pada penyimpanan token, dan proteksi sandi pada galeri privat. |

# **4\. Launch Readiness Checklist & KPIs**

## **Kriteria Kesiapan Peluncuran (Launch Checklist)**

* Seluruh pengujian otomatis E2E lulus 100% pada peramban seluler dan desktop utama.  
* Waktu respons API rata-rata di bawah 200ms dan *load time* thumbnail galeri di bawah 2 detik.  
* Enkripsi data sensitif dan enkripsi token OAuth terverifikasi oleh *QA & Security Specialist*.  
* Dokumentasi panduan pengguna untuk fotografer dan panduan rujukan editor telah tersedia.

## **Target KPI Utama**

* **Efisiensi Operasional:** Penurunan durasi waktu seleksi foto oleh klien sebesar \>50%.  
* **Performa Teknis:** Menjaga tingkat *uptime* platform sebesar 99.9% sepanjang fase MVP.  
* **Konversi Layanan:** Mencapai tingkat konversi akun Freemium ke paket berbayar sesuai target roadmap.

