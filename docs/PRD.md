# **PRODUCT REQUIREMENT DOCUMENT (PRD): PICURA**

Platform Seleksi Foto Interaktif Terintegrasi Google Drive & WhatsApp

## **Ringkasan Spesifikasi Dokumen**

| Parameter | Detail Informasi |
| :---- | :---- |
| **Nama Produk** | Picura |
| **Tipe Produk** | Software as a Service (SaaS) Platform Web |
| **Versi Dokumen** | 1.0 |
| **Tanggal Terbit** | 30 Oktober 2026 |
| **Status Dokumen** | Ready for Development |

# **1\. Executive Summary & Objectives**

## **1.1 Latar Belakang & Masalah**

Fotografer freelance dan studio foto skala kecil-menengah menghadapi hambatan operasional dan efisiensi yang signifikan pada proses seleksi foto setelah pemotretan. Metode konvensional yang umum digunakan—seperti pengiriman tangkapan layar (screenshot), pencatatan manual nama file via chat, atau kunjungan langsung klien ke studio—memakan waktu lama, rawan kesalahan penulisan nama file (typo), serta menimbulkan komunikasi berulang antara klien dan tim editor.

## **1.2 Tujuan Produk**

Picura hadir sebagai platform web SaaS yang mendigitalkan dan menyederhanakan alur kerja "pilih lalu edit". Klien dapat memilih foto favorit secara interaktif dari mana saja melalui galeri web yang responsif, dan daftar foto pilihan akan terkirim secara otomatis ke WhatsApp editor tanpa perlu mengunggah ulang (*re-upload*) file mentah berukuran besar.

# **2\. Target User & Persona**

## **2.1 Primary User: Fotografer / Editor / Pemilik Studio**

* **Kebutuhan Utama:** Menghemat waktu operasional seleksi foto, mengeliminasi kesalahan pencatatan nama file, serta mengelola galeri banyak klien secara terorganisir.  
* **Karakteristik & Perilaku:** Menyimpan file foto mentah di Google Drive dan menggunakan WhatsApp sebagai saluran komunikasi utama dengan klien dan tim editor.

## **2.2 Secondary User: Klien Akhir**

* **Segmen Klien:** Klien pernikahan (*wedding*), wisudawan, penyelenggara acara (*event host*), dan pemilik bisnis/produk.  
* **Kebutuhan Utama:** Antarmuka galeri web yang fleksibel, cepat, interaktif, dan mudah diakses dari perangkat ponsel maupun desktop kapan saja.

# **3\. User Flow & Architecture Overview**

## **3.1 End-to-End User Flow**

1. **Konfigurasi Galeri oleh Fotografer**  
   * Fotografer melakukan *login* ke dashboard Picura.  
   * Menghubungkan akun/folder Google Drive berisi foto mentah.  
   * Mengatur parameter galeri (kata sandi, kuota batas seleksi, nomor WhatsApp editor).  
   * Sistem mendokumentasikan metadata dan menghasilkan tautan galeri unik.  
2. **Penyampaian Akses Klien**  
   * Fotografer membagikan tautan galeri unik kepada klien melalui WhatsApp.  
3. **Proses Seleksi oleh Klien**  
   * Klien membuka tautan galeri (memasukkan kata sandi jika diaktifkan).  
   * Klien menjelajahi foto dan menandai foto pilihan.  
   * Klien menekan tombol "Simpan Pilihan".  
4. **Pemrosesan & Automasi Pesan**  
   * Sistem Picura menyusun daftar nama file foto terpilih.  
   * Sistem memformat pesan ringkasan secara otomatis.  
   * Sistem mengarahkan klien langsung ke tautan *deep link* WhatsApp editor.  
5. **Eksekusi Penyuntingan**  
   * Editor menerima pesan terformat berisi daftar presisi file foto pilihan.  
   * Editor melakukan penyuntingan (*editing*) dan menyerahkan hasil akhir ke klien.

# **4\. Functional Requirements (Fitur Utama)**

## **4.1 Modul 1: Autentikasi & Integrasi Google Drive**

* **FR-1.1 (Autentikasi):** Sistem wajib mendukung *Login & Signup* fotografer menggunakan Google OAuth 2.0 serta opsi pendaftaran berbasis Email.  
* **FR-1.2 (Integrasi Drive):** Integrasi Google Drive API dengan akses *read-only* untuk membaca isi folder foto mentah tanpa mengunggah ulang file fisik ke server Picura.  
* **FR-1.3 (Metadata Processing):** Pengambilan metadata foto meliputi nama file, thumbnail berukuran ringan, dan URL pratinjau secara presisi.

## **4.2 Modul 2: Pengelolaan Galeri oleh Fotografer**

* **FR-2.1 (Dashboard Utama):** Fitur pembuatan galeri baru, pemantauan daftar galeri aktif, serta peninjauan status seleksi klien.  
* **FR-2.2 (Pengaturan Galeri):**  
  * Pengisian Judul Klien / Sesi Pemotretan.  
  * Penetapan Batas Maksimal / Kuota Foto yang Boleh Dipilih (contoh: Maksimal 20 Foto).  
  * Proteksi Kata Sandi (*Password Protection*) galeri.  
  * Batas Waktu Kadaluarsa Tautan Galeri (*Expiry Date*).  
* **FR-2.3 (Nomor WhatsApp Editor):** Input nomor WhatsApp tujuan penerima daftar hasil seleksi.

## **4.3 Modul 3: Galeri Interaktif Klien (Web Client UI)**

* **FR-3.1 (Responsive Layout):** Tampilan galeri web berbasis *Mobile-First Design* serta tampilan *Grid Desktop* yang adaptif.  
* **FR-3.2 (Lightbox Preview):** Mode pratinjau foto ukuran penuh, dukungan perbesaran (*zoom*), serta navigasi geser (*swipe*).  
* **FR-3.3 (Interaksi Seleksi):** Tombol penanda pilihan/favorit pada setiap foto (ikon centang/hati).  
* **FR-3.4 (Indikator Kuota Real-time):** Penghitung pilihan otomatis (contoh: "Terpilih 15 dari 20 Foto").  
* **FR-3.5 (Pencarian & Filter):** Fitur filter berdasarkan nama file foto atau status foto terpilih.

## **4.4 Modul 4: Konfirmasi Seleksi & WhatsApp Redirection**

* **FR-4.1 (Submit Action):** Tombol eksekusi "Kirim Pilihan ke Editor".  
* **FR-4.2 (Template Pesan Otomatis):** Pembangkit pesan WhatsApp terformat:  
  * *Format Pesan:* "Halo Kak, berikut daftar foto terpilih untuk \[Judul Galeri\]: 1\. IMG\_001.JPG, 2\. IMG\_005.JPG, ... Total: 15 Foto."  
* **FR-4.3 (Deep Linking):** Pengalihan otomatis ke aplikasi WhatsApp / WhatsApp Web dengan nomor penerima dan isi pesan terisi secara otomatis.

## **4.5 Modul 5: Sistem Langganan & Kuota (SaaS Model)**

| Tier Paket | Batas Kuota Galeri | Fitur Tambahan | Target Pengguna |
| :---- | :---- | :---- | :---- |
| **Freemium** | Maksimal 2 Galeri Aktif | Fitur Standar Picura | Uji Coba / Fotografer Pemula |
| **Pro Freelance** | Kuota Galeri Lebih Besar | Custom Watermark & Branding Studio | Fotografer Freelance Aktif |
| **Studio** | Tanpa Batas Galeri | Multi-akun Tim & Akses Manajemen | Studio Foto Skala Menengah |

* **FR-5.2 (Payment Gateway):** Integrasi sistem pembayaran otomatis (Midtrans / Xendit) untuk perpanjangan langganan berulang.

# **5\. Non-Functional Requirements (NFR)**

* **Performance:** Waktu pemuatan (*load time*) thumbnail galeri di bawah 2 detik menggunakan teknik *lazy loading* dan sistem *caching* yang optimal.  
* **Security & Privacy:**  
  * File foto mentah tetap tersimpan secara aman di Google Drive pengguna; Picura hanya mengelola metadata.  
  * Token akses OAuth disimpan menggunakan standar enkripsi data yang aman.  
  * Galeri privat terlindungi kata sandi sesuai konfigurasi pengguna.  
* **Compatibility:** Kompatibel dengan seluruh *modern web browser* (Google Chrome, Safari, Microsoft Edge, Mozilla Firefox) baik pada perangkat seluler maupun desktop.  
* **Usability:** Antarmuka yang bersih, intuitif, minim kerumitan, serta ramah bagi klien awam.

# **6\. Recommended Tech Stack**

| Komponen | Teknologi yang Direkomendasikan | Alasan Pemilihan |
| :---- | :---- | :---- |
| **Frontend** | React.js / Next.js, Tailwind CSS | Performa render tinggi, optimalisasi tampilan mobile, & SEO |
| **Backend** | Node.js (Express) / Go / FastAPI | Penanganan *asynchronous I/O* yang efisien untuk pemrosesan API |
| **Database** | PostgreSQL \+ Redis | PostgreSQL untuk data terstruktur; Redis untuk *caching* & sesi |
| **Integrasi API** | Google Drive API (v3), WA Scheme, Payment API | Menghubungkan ekosistem cloud, sistem perpesanan, & pembayaran |

# **7\. Roadmap Pengembangan (Phases)**

| Fase | Durasi | Focus & Deliverables Utama |
| :---- | :---- | :---- |
| **Phase 1: MVP Release** | Bulan 1 – 3 | Google Auth, Integrasi Google Drive API, Galeri Klien Dasar, Proteksi Sandi, Redirection WhatsApp. |
| **Phase 2: Monetization & Branding** | Bulan 4 – 6 | Integrasi Payment Gateway, Fitur Paket Langganan, Branding Studio / Custom Logo, Catatan Klien per Foto. |
| **Phase 3: Scale & Automations** | Bulan 7 – 12 | Dukungan Seleksi Video, Akun Tim Studio (Admin & Editor), Pengingat Otomatis via WA Business API Resmi. |

# **8\. Success Metrics (KPIs)**

* **Efisiensi Waktu:** Penurunan durasi proses seleksi foto oleh klien hingga lebih dari 50% dibandingkan metode konvensional.  
* **Adopsi Pengguna:** Pertumbuhan jumlah akun fotografer aktif serta jumlah galeri yang berhasil dibuat setiap bulannya.  
* **Conversion Rate:** Persentase pengguna paket gratis (Freemium) yang berhasil dikonversi menjadi pelanggan berbayar (Pro/Studio).

