# **DESIGN BRIEF DOCUMENTATION (DBD): PICURA**

## **Platform Seleksi Foto Interaktif Terintegrasi Google Drive & WhatsApp**

| Parameter Dokumen | Spesifikasi Detail |
| :---- | :---- |
| **Nama Produk** | Picura |
| **Tipe Dokumen** | Design Brief & UI/UX Guidelines |
| **Versi Dokumen** | 1.0 |
| **Tanggal Terbit** | 30 Oktober 2026 |
| **Status Design** | Approved for Frontend Implementation |

# **1\. Design Vision & Brand Identity**

Picura dirancang sebagai platform yang modern, elegan, bersih (*clean*), dan berfokus pada konten visual foto (photographer-first). Antarmuka didesain agar tidak membingungkan bagi klien awam dan memberikan kesan profesional bagi studio foto.

# **1.1 Core Design Philosophy**

* **Content-First Clarity:** Foto karya fotografer merupakan pahlawan utama antarmuka. Elemen UI visual sengaja dirancang minimalis dan subtle agar tidak mengalihkan perhatian dari kualitas foto.  
* **Frictionless Experience:** Mengeliminasi seluruh kerumitan teknis bagi klien akhir. Proses seleksi dapat diselesaikan hanya dengan beberapa ketukan (*taps*) di perangkat seluler tanpa registrasi akun bagi klien.  
* **Professional Trust:** Memberikan citra eksklusif bagi fotografer freelance dan studio foto, memperkuat kredibilitas bisnis mereka saat membagikan tautan galeri ke klien akhir.

# **1.2 Design Pillars**

* **Adaptability:** Transisi mulus antara layar desktop fotografer yang kaya informasi dan layar seluler klien yang terfokus.  
* **Tactile Responsiveness:** Umpan balik visual yang intuitif saat interaksi menandai foto, melampaui kuota, atau mengirimkan pilihan ke WhatsApp.  
* **Visual Balance:** Pemanfaatan *negative space* yang memadai untuk mencegah kesan sesak pada galeri berkapasitas foto besar.

# **2\. Color Palette & Visual Theme**

Sistem warna Picura menggabungkan nada netral gelap yang profesional dengan aksen modern yang mencolok untuk memberikan kepastian status interaksi bagi pengguna.

# **2.1 Color Tokens & Palette**

| Roles | Color Name | Hex Code | Purpose & Usage |
| :---- | :---- | :---- | :---- |
| **Primary Color** | Deep Slate Black | `#0F172A` | Mewakili kesan profesional, header, teks utama, dan latar belakang netral ber-kontras tinggi untuk foto. |
| **Accent Color** | Electric Violet | `#6366F1` | Digunakan untuk tombol interaktif utama (CTA), status terpilih, dan indikator navigasi aktif. |
| **Secondary Accent** | Emerald Green | `#10B981` | Digunakan untuk status sukses, konfirmasi seleksi, dan branding integrasi WhatsApp. |
| **Neutral Background Light** | Pure White / Off-White | `#FFFFFF` / `#F8FAFC` | Latar belakang mode terang untuk Dashboard Fotografer dan web galeri standar. |
| **Neutral Background Dark** | Dark Charcoal | `#1E293B` | Mode gelap untuk kanvas galeri foto agar warna foto terlihat lebih akurat dan menonjol. |
| **Border & Muted Text** | Slate Muted | `#E2E8F0` / `#64748B` | Garis pembatas ringan, placeholder, dan teks sekunder. |

# **2.2 Typography System**

Menggunakan font Sans-Serif modern berkinerja tinggi yang memiliki legibilitas optimal pada layar seluler maupun desktop.

| Level | Font Family | Size (pt) | Weight | Line Height | Usage |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Title** | Plus Jakarta Sans | 30pt | Bold (700) | 1.0 | Judul utama dashboard dan halaman selamat datang |
| **Heading 1** | Plus Jakarta Sans | 24pt | Bold (700) | 1.15 | Judul seksi utama dan nama galeri klien |
| **Heading 2** | Plus Jakarta Sans | 18pt | Semi-Bold (600) | 1.2 | Header kartu, judul modal, dan sub-seksi |
| **Heading 3** | Plus Jakarta Sans | 14pt | Bold (700) | 1.2 | Sub-header dan penanda status |
| **Body / Normal** | Inter | 12pt | Regular (400) | 1.25 | Teks deskripsi, instruksi, dan isi tabel |
| **Caption / Small** | Inter | 10pt | Medium (500) | 1.3 | Metadata foto (nama file, dimensi) dan label badge |

# **3\. UI/UX Component Specifications**

# **3.1 Dashboard Fotografer (Desktop & Tablet)**

Dashboard dirancang untuk membantu fotografer mengelola banyak galeri klien dengan cepat dan memantau status seleksi secara *real-time*.

## **Header & Navigation Area**

* **Logo & Branding:** Logo Picura berada di sudut kiri atas dengan opsi penambahan logo studio (*Pro/Studio Tier*).  
* **User Profile & Tier Badge:** Menampilkan nama fotografer, foto profil Google OAuth, dan *Badge Status Paket* (Freemium / Pro Freelance / Studio).  
* **Account Controls:** Tombol upgrade paket beraksen Violet (`#6366F1`) serta menu dropdown pengaturan akun.

## **Gallery Card Grid**

* **Thumbnail Cover:** Preview foto sampul dari folder Google Drive dengan rasio 16:9.  
* **Client Info Block:** Judul Klien / Sesi Pemotretan dan tanggal pembuatan galeri.  
* **Selection Progress Indicator:** *Progress Bar* dan label angka yang menunjukkan jumlah foto yang telah dipilih klien (contoh: "15 dari 20 Foto Terpilih").  
* **Status Badge:**  
  * *Aktif:* Badge Hijau Soft (`#ECFDF5`) untuk galeri yang sedang berjalan.  
  * *Selesai:* Badge Violet Soft (`#EEF2FF`) untuk seleksi yang telah dikirimkan.  
  * *Kadaluarsa:* Badge Abu-abu (`#F1F5F9`) jika melewati batas waktu.  
* **Quick Action Toolbar:** Tombol tindakan cepat untuk *Salin Tautan Galeri*, *Edit Parameter Galeri*, dan *Hapus Galeri*.

# **3.2 Web Galeri Klien (Mobile-First Focus)**

Antarmuka galeri klien dioptimalkan penuh untuk kenyamanan akses dari smartphone.

## **Sticky Top Bar**

* **Gallery Context:** Menampilkan Nama Galeri / Klien di sisi kiri.  
* **Real-time Selection Counter:** Badge melayang beraksen Violet (`#6366F1`) yang menampilkan penghitung kuota presisi (contoh: "15/20 Foto").  
* **Filter Toggle:** Switch tab sederhana untuk menyaring tampilan: `Semua Foto` atau `Terpilih Saja`.

## **Photo Grid Layout**

* **Grid Style:** Adaptive Square Grid (2 Kolom pada Mobile, 4-5 Kolom pada Desktop) dengan jarak antar foto (*gap*) 8px.  
* **Lazy Loading:** Teknik *blur-up placeholder* atau skeleton loader saat gambar sedang dimuat untuk mencegah pergeseran tata letak (CLS).  
* **Overlay Selection Card:**  
  * Ikon centang/hati melayang di sudut kanan atas setiap thumbnail.  
  * Efek visual saat terpilih: Ring border tebal beraksen Violet (`#6366F1`) dan ikon centang terisi warna penuh.

## **Lightbox Preview Modal**

* **Full Screen Mode:** Menampilkan foto ukuran besar dengan latar belakang Dark Charcoal (`#1E293B`).  
* **Gestures & Controls:**  
  * Dukungan gerakan jari *pinch-to-zoom* dan *swipe* horizontal untuk berpindah antar foto.  
  * Tombol navigasi panah di sisi kiri dan kanan (untuk akses desktop).  
* **Bottom Action Bar:** Nama file foto (contoh: `IMG_0045.JPG`) dan tombol toggle seleksi berukuran besar ("+ Tandai Foto" / "✓ Foto Terpilih").

## **Floating Action Button (FAB) & Submit Drawer**

* **Sticky FAB:** Tombol utama melayang di bagian bawah layar mobile berlabel "Kirim Pilihan (15 Foto)".  
* **Pulse Animation:** Animasi denyut halus (*pulse*) pada FAB saat kuota maksimal foto telah terpenuhi.  
* **WhatsApp Redirection Drawer:** Saat FAB diklik, lembar konfirmasi muncul menampilkan ringkasan foto pilihan sebelum mengarahkan (*deep link*) langsung ke aplikasi WhatsApp editor.

# **4\. Micro-Interactions & Animation Rules**

| Trigger Interaksi | Animasi & Umpan Balik Visual | Durasi & Timing |
| :---- | :---- | :---- |
| **Menandai Foto (Select)** | Scale-up thumbnail foto sebesar 3% secara singkat, border beraksen Violet muncul, ikon centang membesar dengan efek spring. | `200ms ease-out` |
| **Membuka Lightbox** | Zoom-in foto dari posisi grid ke tengah layar dengan latar belakang menghitam secara halus. | `250ms cubic-bezier(0.4, 0, 0.2, 1)` |
| **Kuota Terpenuhi** | Counter kuota bergetar halus (*shake*), warna badge berubah ke Emerald Green (`#10B981`), dan FAB mulai beranimasi pulse. | `300ms ease-in-out` |
| **Submit ke WhatsApp** | Memicu lembar konfirmasi naik dari bawah layar (*slide-up drawer*) sebelum melakukan redirection. | `300ms ease-out` |

# **5\. Accessibility & Responsiveness Guidelines**

# **5.1 Accessibility Standards (WCAG 2.1 AA)**

* **Touch Target Size:** Seluruh elemen interaktif pada perangkat seluler (tombol seleksi, FAB, panah navigasi) memiliki area sentuh minimal **44 x 44 px**.  
* **Contrast Ratio:** Teks utama dan ikon kontrol memiliki rasio kontras minimal **4.5:1** terhadap latar belakangnya.  
* **Keyboard Navigation:** Seluruh fungsionalitas galeri dan modal lightbox dapat diakses menggunakan navigasi keyboard (Tab, Space, Enter, Escape, Arrow keys).

# **5.2 Responsive Layout Breakpoints**

| Device Category | Breakpoint Width | Grid Columns | Layout Adjustments |
| :---- | :---- | :---- | :---- |
| **Mobile (Portrait)** | `< 640px` | 2 Kolom Grid | Sticky Header ringkas, Floating Action Button di bagian bawah, drawer modal. |
| **Tablet / Mobile Landscape** | `640px – 1024px` | 3 Kolom Grid | Navigation Bar penuh, instruksi singkat di bagian atas galeri. |
| **Desktop / Laptop** | `> 1024px` | 4 \- 5 Kolom Grid | Dashboard fotografer penuh, sidebar filter, preview modal berukuran besar. |

