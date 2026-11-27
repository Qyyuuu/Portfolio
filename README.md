# Portofolio Rifqy Kurniawan Fattahillah

Website portofolio personal Rifqy Kurniawan Fattahillah (Mahasiswa Informatika UNSIKA, Web & Database Developer, Bekasi, Jawa Barat). Dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework atau build tool.

## Struktur Berkas

```text
Portfolio/
├── index.html          # Halaman portofolio utama
├── cv.html             # Halaman CV terstruktur siap cetak (A4)
├── DESIGN.md           # Arah desain, palet warna, tipografi, dan dial antislop
├── assets/
│   └── foto-rifqy.jpg  # Foto profil resmi
├── css/
│   ├── style.css       # Gaya halaman utama
│   └── cv.css          # Gaya halaman CV dan aturan @media print
├── js/
│   └── main.js         # Navigasi mobile, validasi form, salin email, dan scroll state
└── README.md
```

## Bagian Halaman Utama

1. **Hero (`#home`)**: Identitas singkat, tautan aksi ke pengalaman kerja dan CV, tautan GitHub/Instagram/Email, serta foto profil.
2. **Tentang & Pendidikan (`#about`)**: Profil akademik di UNSIKA (IPK 3.90 / 4.00) dan pengalaman mengajar mata kuliah Basis Data di Study Club.
3. **Keahlian (`#skills`)**: Front-end web, basis data relasional (PHP, MySQL, ERD, SQL, SDLC), alat kolaborasi, dan soft skills.
4. **Pengalaman Kerja & Proyek (`#experience`)**: Servia (`https://servia.my.id/`), Sistem Manajemen Laboratorium Komputer / Simlab (GitHub + Figma), dan Website Pengelolaan Administrasi Desa (GitHub + Figma).
5. **Pengalaman Organisasi (`#organization`)**: Peran di HIMTIKA UNSIKA (2024 - 2026), kepanitiaan LKMM Pra-dasar & HIMTIKA Goes To Company, Ketua Pelaksana Study Club & Pengajar Basis Data, serta pengelolaan program kerja CnC, Pekan IT (SEMANTIK, NIC, Seminar & Pameran Pekan IT), dan Study Club.
6. **CV (`#cv`)**: Ringkasan dan tautan langsung ke [cv.html](cv.html) siap cetak PDF.
7. **Kontak (`#contact`)**: Email (`rifqykurniawanftthillah42@gmail.com`) dengan tombol salin, lokasi Bekasi, Instagram `@Qyyuu._`, GitHub `github.com/Qyyuuu`, dan formulir kirim pesan via `mailto:`.

## Menjalankan Secara Lokal

Buka `index.html` langsung di browser atau jalankan server statis lokal:

```bash
npx serve .
```
