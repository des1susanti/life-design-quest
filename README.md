# 🧭 Life Design Quest

Game interaktif berbasis web untuk sesi **Career Development "Your Future, Your Plan: Building Your Personal Career Roadmap"** di Sekolah Tinggi Ilmu Ekonomi Al-Madani, Januari 2027.

Mahasiswa memindai QR dari layar presentasi dan memainkan level demi level di HP masing-masing. Setiap level baru terbuka setelah narasumber selesai menjelaskan bab terkait, sehingga game menjadi latihan langsung dari materi. Skor tampil live di papan skor proyektor, dan di akhir mahasiswa mengunduh sertifikat berisi roadmap karier pribadi mereka.

| | Tautan |
|---|---|
| 🎮 Main game | https://des1susanti.github.io/life-design-quest/ |
| 🏆 Papan skor (proyektor) | https://des1susanti.github.io/life-design-quest/leaderboard.html |

---

## Latar belakang

Materi game diadaptasi dari pendekatan *design thinking* dalam buku **Designing Your Life** karya Bill Burnett dan Dave Evans (Stanford University). Idenya: masa depan karier tidak perlu ditebak, tetapi bisa dirancang, dicoba dalam versi kecil, lalu diperbaiki.

Game ini dibuat agar latihan-latihan dari buku tersebut terasa seperti permainan, bukan tugas, sehingga mahasiswa tetap aktif dan tidak bosan.

## Alur permainan

| Level | Nama | Isi | Poin |
|---|---|---|---|
| 1 | 🔋 Cek Baterai Hidup | Mengisi dashboard Health, Work, Play, Love | 50 (selesai) |
| 2 | 🌍 Gravitasi atau Bukan? | 10 kartu cepat: masalah gravitasi atau bisa diatasi? (8 detik/kartu) | s.d. 1.500 |
| 3 | 🔄 Reframe Rush | Memilih cara pandang baru untuk 5 keyakinan yang bikin macet (15 detik/soal) | s.d. 750 |
| 4 | 🧭 Rakit Kompasmu | Memilih nilai Workview + Lifeview, lalu kalimat kompas dirangkai otomatis | 50 (selesai) |
| 5 | 🚀 Odyssey Builder | Menulis Plan A, B, C untuk 5 tahun ke depan dan menilai antusiasme | 50 (selesai) |
| 6 | 👑 Boss: Selamatkan Salsa! | Cerita bercabang 4 babak tentang mahasiswa yang hampir menyerah | s.d. 400 |

Level dibuka satu per satu oleh narasumber setelah materi terkait selesai dijelaskan (tombol 1–6 di papan skor).

- **Skor maksimum:** 2.800 poin.
- Jawaban benar bernilai 100 poin, ditambah bonus kecepatan hingga 50 poin.
- Level refleksi (1, 4, 5) tidak memiliki jawaban benar-salah. Poin diberikan karena menyelesaikannya.
- Peringkat ditentukan oleh skor tertinggi. Jika skor sama, yang lebih cepat selesai berada di atas.
- Satu NIM tercatat dalam satu baris. Skor diperbarui di akhir setiap sesi dan dikunci setelah seluruh level selesai.

## Fitur

- 🧭 **Animasi pembuka:** logo kompas yang tersusun dari jaringan neuron, dirakit dan jarumnya berayun selama ±5 detik.
- 🧑‍🎓 **10 karakter pixel:** 5 laki-laki dan 5 perempuan (3 berhijab) yang dipilih setelah mengisi data; karakter melompat saat jawaban benar dan tercetak di sertifikat.
- 🏫 **Lobi kampus ala ZEP:** di layar proyektor, karakter mahasiswa keluar dari gedung Perguruan Tinggi Al-Madani versi pixel lalu berjalan-jalan dengan nama dan level di atas kepala.
- 🔓 **Level dibuka bertahap:** narasumber mengklik tombol 1–6 di layar papan skor; level di HP mahasiswa terbuka otomatis.
- 📱 **Mobile-first:** dirancang untuk layar HP, tanpa perlu instal aplikasi atau login.
- 💾 **Progres tersimpan:** jika halaman ter-refresh, permainan berlanjut dari posisi terakhir.
- 🏆 **Papan skor live:** 10 besar diperbarui otomatis setiap 5 detik, dengan tampilan QR untuk bergabung dan animasi podium juara.
- 🏅 **Sertifikat otomatis:** berisi nama, NIM, program studi, skor, peringkat, kode verifikasi, serta *Personal Career Roadmap* (kalimat kompas dan Plan A/B/C) milik peserta.
- 📊 **Rekap data:** semua hasil peserta tersimpan di Google Sheets dan bisa diunduh sebagai Excel.

## Teknologi yang digunakan

| Bagian | Teknologi |
|---|---|
| Tampilan & logika game | HTML5, CSS3, JavaScript murni (*vanilla*, tanpa framework) |
| Logo & animasi | SVG yang dibangkitkan dengan JavaScript + animasi CSS |
| Karakter & lobi | Pixel art yang digambar dengan kode di HTML5 Canvas (tanpa file gambar) |
| Pembuatan sertifikat | HTML5 Canvas API, diekspor sebagai PNG langsung di perangkat peserta |
| Penyimpanan progres | `localStorage` browser |
| Penyimpanan skor & status sesi | Google Sheets + Google Apps Script (Web App, PropertiesService) |
| Komunikasi data | JSONP, agar bisa memanggil Apps Script dari GitHub Pages tanpa kendala CORS |
| Kode QR | [qrcodejs](https://github.com/davidshimjs/qrcodejs) |
| Font | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts) |
| Hosting | GitHub Pages (gratis, statis) |

Proyek ini sengaja dibuat tanpa *build tool* dan tanpa server sendiri agar mudah dipasang, ringan dibuka di HP, dan bisa dipakai ulang untuk acara lain hanya dengan mengubah `config.js`.

## Struktur file

```
life-design-quest/
├── index.html         # Game untuk HP mahasiswa
├── leaderboard.html   # Layar papan skor untuk proyektor
├── logo.js            # Logo kompas neural-network (SVG + animasi)
├── chars.js           # 10 karakter pixel + animasinya
├── lobby.js           # Peta lobi kampus untuk layar proyektor
├── kampus.png         # Logo Perguruan Tinggi Al-Madani (tugu di lobi)
├── config.js          # Pengaturan: URL Apps Script, nama acara, narasumber
└── README.md
```

Skrip Google Apps Script (`Code.gs`) dipasang terpisah di Google Sheets dan tidak disertakan di repository ini.

## Cara memakai ulang

1. *Fork* atau unduh repository ini.
2. Buat Google Sheet baru, buka **Extensions > Apps Script**, tempel skrip `Code.gs`, lalu **Deploy > New deployment > Web app** (Execute as: Me, Who has access: Anyone).
3. Tempel URL Web app (berakhiran `/exec`) ke `SCRIPT_URL` di `config.js`, lalu sesuaikan nama acara, tanggal, dan narasumber.
4. Aktifkan **Settings > Pages** (branch `main`, folder root).
5. Buka `leaderboard.html` di proyektor. Pintasan keyboard: `1` Lobi, `2` Papan Skor, `3` Juara. Tombol **BUKA LEVEL 🔒 1–6** di bar atas untuk membuka atau mengunci level.

Untuk mengulang permainan di perangkat yang sama (misalnya setelah uji coba), buka alamat game dengan tambahan `?reset=1`.

## Pembuat

**Desi Susanti, S.Kom., M.Kom.**

[LinkedIn](https://linkedin.com/in/desi-susanti-70a7b831a) · [GitHub](https://github.com/des1susanti)

Dikembangkan dengan bantuan Claude (Anthropic) sebagai asisten AI.

## Referensi

Burnett, B., & Evans, D. (2016). *Designing Your Life: How to Build a Well-Lived, Joyful Life*. Alfred A. Knopf.

Seluruh soal, studi kasus, dan tokoh (Nadia, Raka, Salsa) dalam game ini adalah karya orisinal yang terinspirasi dari konsep buku tersebut, bukan kutipan isi buku.
