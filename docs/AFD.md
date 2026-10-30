# **APP FLOW DOCUMENTATION (AFD): PICURA**

Dokumen Deskripsi Alur Interaksi & Arsitektur Pengguna Sistem Picura

# **1\. Flow Overview & User Roles**

Dokumen ini menjelaskan alur interaksi pengguna (User Flow) secara terperinci untuk platform Picura, mencakup dua peran utama: Fotografer/Editor (Admin User) dan Klien Akhir (End User).

| Peran Pengguna | Deskripsi Peran | Akses Perangkat | Utama Interaksi Sistem |
| :---- | :---- | :---- | :---- |
| **Fotografer / Editor (Admin)** | Pengelola galeri, penyambung tautan Google Drive, dan penerima daftar foto pilihan. | Desktop & Mobile Web | Dashboard Admin, OAuth Drive, Konfigurasi Galeri, Manajemen Langganan. |
| **Klien Akhir (End User)** | Pelanggan studio foto yang memilih foto favorit secara interaktif. | Mobile Web (Primary) & Desktop | Landing Galeri, Authentication Passcode, Lightbox Preview, WhatsApp Redirect. |

# **2\. Flow 1: Auth & Onboarding Fotografer**

Proses autentikasi awal bagi fotografer untuk menghubungkan akun Google dan memberikan otorisasi akses Google Drive API secara aman.

## **Step-by-Step Flow**

1. **Akses Landing Page:** User mengunjungi halaman utama Picura (`/`).  
2. **Inisiasi Login:** User menekan tombol "Masuk dengan Google" pada navbar atau hero section.  
3. **OAuth Redirect:** Sistem mengarahkan user ke Google OAuth 2.0 Consent Screen dengan scope `https://www.googleapis.com/auth/drive.readonly`.  
4. **Persetujuan Izin (Grant Permission):** User menyetujui akses pembacaan file Google Drive.  
5. **Verifikasi Token & Registrasi:**  
   * Backend Picura menerima callback authorization code dari Google OAuth.  
   * Backend menukarkan code dengan `access_token` dan `refresh_token`.  
   * Sistem menyimpan akun pengguna ke basis data serta mengenkripsi `refresh_token`.  
   * Sistem membuat JWT session cookie (HTTP-only) untuk mengotentikasi sesi browser.  
6. **Redirect Dashboard:** User diarahkan ke Dashboard Utama (`/dashboard`).

## **Diagram State Flow**

* Unauthenticated Visitor \-\> OAuth Consent Screen \-\> Token Exchange & Encryption \-\> Authenticated Session \-\> Dashboard Admin.

# **3\. Flow 2: Pembuatan & Konfigurasi Galeri**

Alur kerja fotografer dalam menghubungkan folder foto mentah dari Google Drive hingga mempublikasikan tautan galeri interaktif bagi klien.

## **Step-by-Step Flow**

1. **Inisiasi Galeri Baru:** Fotografer menekan tombol "+ Buat Galeri Baru" pada Dashboard Utama (`/dashboard`).  
2. **Langkah 1 (Koneksi Drive):**  
   * Fotografer menempelkan (paste) URL folder Google Drive berisi foto mentah.  
   * Sistem mengekstrak `folder_id` dari tautan tersebut.  
3. **Langkah 2 (Metadata Sync & Inspection):**  
   * Backend melakukan query ke Google Drive API v3.  
   * Sistem mengambil nama file, URL thumbnail ringan, dan dimensi gambar.  
   * Sistem menampilkan pratinjau grid foto untuk dikonfirmasi oleh fotografer.  
4. **Langkah 3 (Konfigurasi Parameter Galeri):**  
   * **Judul Galeri / Klien:** Input teks (contoh: "Wedding Budi & Ani").  
   * **Kuota Pilihan Foto:** Input numerik batas maksimal foto terpilih (contoh: 25 foto).  
   * **Proteksi Password (Opsional):** Toggle & input PIN/Password akses galeri.  
   * **Masa Kadaluarsa (Opsional):** Date picker tanggal aktif galeri.  
   * **Nomor WhatsApp Editor:** Input nomor WhatsApp aktif format internasional (contoh: `6281234567890`).  
5. **Langkah 4 (Publishing):**  
   * Fotografer menekan tombol "Terbitkan Galeri".  
   * Sistem memvalidasi kuota galeri aktif fotografer berdasarkan paket langganan.  
   * Sistem membuat rekord galeri baru dan menggenerasi slug unik (`picura.id/g/wedding-budi-ani-8x29`).  
   * Tautan galeri siap dibagikan melalui tombol "Salin Tautan" atau "Kirim ke WA Klien".

# **4\. Flow 3: Pengalaman Akses & Seleksi Foto oleh Klien**

Alur interaksi klien akhir saat menjelajahi, memperbesar, dan menandai foto pilihan dalam antarmuka galeri.

## **Step-by-Step Flow**

1. **Akses Tautan:** Klien membuka tautan galeri unik (`picura.id/g/slug-unik`) dari perangkat mobile atau desktop.  
2. **Pemeriksaan Keamanan (Password Challenge):**  
   * Jika galeri menggunakan kata sandi, sistem menampilkan modal pendaftaran akses.  
   * Klien memasukkan password \-\> Sistem memvalidasi via API \-\> Mengembalikan token akses galeri sementara.  
3. **Pemuatan Grid Galeri:**  
   * Tampilan galeri memuat daftar thumbnail foto dengan teknik *lazy loading* untuk menghemat bandwidth.  
   * Header menampilkan Judul Galeri dan Indikator Kuota Real-time ("Terpilih 0 / 25 Foto").  
4. **Interaksi Lightbox (Pratinjau Penuh):**  
   * Klien mengetuk thumbnail foto untuk membuka mode modal Lightbox layar penuh.  
   * Navigasi swipe kiri/kanan atau panah keyboard untuk berpindah foto.  
   * Fitur pinch-to-zoom untuk memeriksa detail kerapihan foto.  
5. **Tindakan Seleksi & Pengendalian Kuota:**  
   * Klien menekan ikon 'Hati/Centang' untuk menambah/menghapus foto dari daftar pilihan.  
   * State lokal dan session storage langsung diperbarui.  
   * Indikator kuota real-time diperbarui ("Terpilih 12 / 25 Foto").  
   * **Kondisi Batas Maksimal:** Jika klien mencoba memilih foto ke-26 saat kuota 25, sistem menampilkan notifikasi snackbar: *"Batas maksimal kuota foto (25) telah tercapai."*  
6. **Review Pilihan:**  
   * Klien berpindah ke tab "Foto Terpilih" untuk menyaring dan meninjau kembali seluruh foto terpilih sebelum melangkah ke tahap konfirmasi.

# **5\. Flow 4: Konfirmasi Pilihan & WhatsApp Redirection**

Alur penerbitan daftar foto terpilih menjadi format pesan ringkas yang dikirimkan secara otomatis ke WhatsApp editor.

## **Step-by-Step Flow**

1. **Eksekusi Pengiriman:** Klien menekan tombol utama "Kirim Pilihan ke WhatsApp Editor" pada bagian bawah layar.  
2. **Modal Ringkasan (Review Modal):**  
   * Tampil jendela konfirmasi yang menampilkan daftar nama file foto terpilih (contoh: `IMG_0012.JPG`, `IMG_0045.JPG`) dan total foto terpilih.  
   * Catatan opsional dari klien untuk editor (opsional).  
3. **Konfirmasi Akhir:** Klien menekan tombol "Konfirmasi & Buka WhatsApp".  
4. **Penyusunan Format Pesan Auto-Generated:**  
   * Sistem merangkai teks pesan dengan struktur terformat:

```
Halo Kak, berikut daftar foto terpilih untuk [Judul Galeri]:

Daftar Foto (Total: 15 Foto):
1. IMG_0012.JPG
2. IMG_0045.JPG
3. IMG_0089.JPG
...

Catatan Tambahan: Tolong edit warna lebih cerah di foto outdoor.
Terima kasih!
```

5. **Deep-Link Redirection:**  
   * Sistem mengarahkan browser ke URL URI scheme WhatsApp:  
     `https://wa.me/{nomor_wa_editor}?text={encoded_message_text}`  
6. **Penyerahan ke Aplikasi WhatsApp:**  
   * Aplikasi WhatsApp (Mobile) atau WhatsApp Web (Desktop) terbuka secara otomatis.  
   * Teks pesan dan nomor penerima terisi lengkap, klien tinggal menekan tombol "Kirim/Send".  
7. **Pembaruan Status Galeri:** Backend Picura menandai status galeri menjadi *"Seleksi Selesai"*.

# **6\. Flow 5: Upgrade Langganan SaaS (Monetisasi)**

Alur batas penggunaan paket dan proses transaksi peningkatan lisensi SaaS untuk fotografer.

## **Step-by-Step Flow**

1. **Pemicu Batas Kuota (Limit Reached):**  
   * Fotografer pada paket Freemium mencoba membuat galeri ke-3 (Batas Freemium: 2 Galeri Aktif).  
   * Sistem menahan tindakan dan menampilkan modal pemberitahuan: *"Batas Kuota Galeri Gratis Tercapai"*.  
2. **Inisiasi Upgrade:**  
   * Fotografer menekan tombol "Upgrade ke Paket Pro / Studio".  
   * Modal pemilihan paket langganan (Pro Freelance / Studio) terbuka.  
3. **Pemilihan Metode Pembayaran:**  
   * Fotografer memilih durasi langganan (Bulanan / Tahunan) dan menekan "Bayar Sekarang".  
   * Sistem menginisiasi transaksi melalui Payment Gateway Midtrans.  
   * Midtrans Snap Modal terbuka di layar menampilkan opsi pembayaran (QRIS, Virtual Account, Credit Card).  
4. **Eksekusi & Pembayaran:**  
   * Fotografer menyelesaikan transaksi pembayaran pada saluran yang dipilih.  
5. **Pemrosesan Webhook & Activation:**  
   * Midtrans mengirimkan notifikasi HTTP Webhook `payment_status = settlement` ke backend Picura.  
   * Backend memverifikasi signature key transaksi.  
   * Sistem memperbarui tier akun fotografer dari `Freemium` menjadi `Pro` secara otomatis.  
6. **Konfirmasi & Pengangkatan Limit:**  
   * Interface dashboard memperbarui status langganan dan kuota galeri secara real-time.  
   * Modal pembuatan galeri yang tertunda otomatis dibuka kembali.

# **7\. Handing Penanganan Kondisi Khusus (Edge Cases)**

| Skenario Penanganan | Tindakan Sistem & Interface |
| :---- | :---- |
| **Izin Google Drive Dicabut** | Jika token expired/dicabut, sistem menampilkan alert di dashboard: *"Akses Google Drive terputus. Silakan hubungkan ulang akun Google Anda."* |
| **File Foto Diubah/Dihapus di Drive** | Jika file di Drive dihapus setelah galeri diterbitkan, sistem menampilkan *placeholder fallback* pada galeri dengan keterangan *"Foto tidak lagi tersedia di sumber Drive."* |
| **WhatsApp Belum Terinstal (Desktop)** | Sistem menyediakan fallback tautan WhatsApp Web (`web.whatsapp.com`) dan tombol *"Salin Teks Pesan"* jika deep link gagal. |
| **Sandi Galeri Salah** | Tampilkan pesan error pada form password: *"Password yang Anda masukkan salah. Silakan coba lagi."* |

