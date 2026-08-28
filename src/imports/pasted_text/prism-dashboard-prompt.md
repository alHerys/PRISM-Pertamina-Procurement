# Prompt untuk PRISM (Web Dashboard)

Salin seluruh isi di bawah ini ke PRISM dalam satu prompt.

---

## Konteks Produk

Buatkan desain UI lengkap untuk **PRISM (Procurement Reference Intelligence & Smart Market Engine)**, sebuah **web dashboard B2B internal** yang membantu tim procurement PT Pertamina Patra Niaga menilai kewajaran harga penawaran vendor secara AI-powered, transparan, dan mempertimbangkan TKDN, dilengkapi pemantauan harga pasar aktif dan deteksi indikasi persekongkolan harga (kolusi) antar vendor.

Target pengguna adalah **staf profesional internal** (evaluator penawaran, verifikator harga, pengambil keputusan pengadaan) yang mengakses aplikasi ini dari desktop/laptop di lingkungan kerja kantor — bukan aplikasi konsumen. Mereka terbiasa dengan tools B2B/enterprise software, sehingga UI boleh lebih data-dense dan informatif, tapi harus tetap terasa modern dan tidak berat.

## Arahan Desain (Sangat Penting)

Desain harus terasa **seperti produk SaaS startup modern kelas enterprise** — kualitas visual setara Linear, Notion, Stripe Dashboard, atau Vercel — bukan seperti aplikasi internal pemerintahan yang kaku dan datang dari tahun 2010-an. Prinsip kunci:

1. **Clean & spacious.** Gunakan whitespace generatif, jangan menumpuk elemen. Card dan tabel punya padding lega, bukan mepet.
2. **Hierarki visual yang jelas.** Informasi paling penting (status, angka kritis, alert) langsung terlihat tanpa perlu mencari. Gunakan ukuran, warna, dan posisi untuk membedakan prioritas.
3. **Rounded corner moderat** (8-12px), shadow halus (bukan flat 100% tapi juga bukan skeuomorphic berlebihan), border tipis warna netral untuk pemisah antar elemen.
4. **Data visualization berkualitas tinggi.** Gunakan chart garis untuk tren harga, bar chart untuk perbandingan, gauge/progress ring untuk confidence level dan skor risiko — bukan angka mentah dalam tabel polos saja.
5. **Status selalu dikomunikasikan lewat warna + label, bukan warna saja** (accessibility): badge berwarna dengan teks jelas ("Aman", "Perlu Review", "Perlu Investigasi").
6. **Konsisten:** satu design system dipakai di semua 6 modul fitur, jangan terasa seperti dibuat oleh tim berbeda-beda.
7. **Micro-interaction yang halus** disebutkan sebagai anotasi desain (hover state pada card/row, transisi tab, skeleton loading saat data dimuat) — meski statis, tunjukkan state-state ini sebagai variant terpisah.
8. **Quick product tour saat login pertama kali** (opsional tapi direkomendasikan) — 3-4 spotlight singkat yang menyorot bagian kunci (Dashboard, Evaluasi Harga, Intelijen Pasar, Integritas Vendor) dengan tooltip 1 kalimat, bisa di-skip, dan bisa diakses ulang lewat menu Bantuan. Karena PRISM punya banyak modul AI yang cukup baru bagi pengguna, tur singkat ini membantu adopsi tanpa terasa menggurui staf profesional.

## Design System

- **Palet warna:**
  - Base netral: putih dan abu sangat muda sebagai dominan (dominan 70%+ dari layar)
  - **Warna primer/brand:** biru tua/indigo — memberi kesan terpercaya, enterprise, analitis (dipakai di tombol utama, active nav item, link)
  - **Ungu** → elemen hasil AI/insight sistem (harga referensi, hasil deteksi anomali, rekomendasi) — supaya pengguna bisa membedakan mana output AI vs input manual
  - **Hijau** → status aman/normal/positif ("Within Range", "Normal", HEA terbaik)
  - **Amber/kuning** → status perlu perhatian ("Review Recommended")
  - **Merah** → status risiko tinggi ("Perlu Investigasi", deviasi ekstrem)
  - Warna-warna ini dipakai konsisten sebagai badge, border kiri card, dan aksen chart di seluruh modul
- **Tipografi:** sans-serif modern yang tegas dan mudah dibaca di data-dense UI (contoh: Inter, Söhne, atau sejenis). Gunakan tabular figures/monospace numerals untuk angka di tabel supaya rapi sejajar.
- **Ikonografi:** gaya outline tipis konsisten (contoh: Lucide/Feather icon style), dipakai di sidebar nav, tombol aksi, dan indikator status.
- **Komponen kunci:**
  - Card dengan header + body + optional footer aksi
  - Data table dengan sorting, filter chip, pagination, dan row hover state
  - Tab horizontal untuk sub-navigasi dalam satu halaman (misal detail item pengadaan)
  - Badge status berwarna
  - Confidence gauge / progress ring (lingkaran persentase)
  - Chart garis (tren harga dari waktu ke waktu) dan bar chart (perbandingan HEA antar vendor)
  - Modal/drawer untuk aksi sekunder (misal ekspor laporan)
  - Empty state, loading state (skeleton), dan error state yang didesain rapi, bukan sekadar teks polos

## Informasi Arsitektur (Struktur Navigasi)

```
Login (SSO internal Pertamina)

Main App (Sidebar navigasi kiri, fixed, dengan logo PRISM di atas)
├── Dashboard
│     └── Overview cards (tender aktif, evaluasi pending, alert anomali terbaru), 
│         grafik ringkasan, activity feed terbaru
├── Evaluasi Harga
│     ├── Daftar Item Pengadaan (tabel: nama item, kategori, status, tanggal, aksi)
│     ├── Form "Item Pengadaan Baru" (spesifikasi, kategori, volume, lokasi, input penawaran vendor)
│     └── Detail Item Pengadaan (halaman dengan tab horizontal):
│           ├── Tab: Harga Referensi (Historical Price Intelligence)
│           ├── Tab: Analisis Deviasi (Explainable Price Deviation)
│           ├── Tab: TKDN & HEA (TKDN-aware Evaluation Price)
│           └── Tab: Simulator What-if (What-if Procurement Simulator)
├── Intelijen Pasar (Dynamic Market Crawling Machine)
│     ├── Dashboard harga pasar per komoditas (grid card + mini chart)
│     └── Detail komoditas (grafik tren harga besar, breakdown per sumber data, status crawling)
├── Integritas Vendor (Vendor Anomaly Detection)
│     ├── Daftar Tender dengan skor risiko kolusi (tabel sortable by skor)
│     └── Detail Tender — visualisasi kemiripan pola penawaran antar vendor, tombol ekspor laporan
├── Riwayat & Laporan
│     └── Riwayat evaluasi harga (tabel + filter tanggal/kategori), tombol ekspor
└── Pengaturan
      ├── Profil Pengguna
      ├── Manajemen Akses (khusus Admin)
      └── Konfigurasi Ambang Batas Skor Anomali (khusus Admin)

Top bar (di semua halaman Main App): search global, ikon notifikasi (badge jumlah), avatar profil dengan dropdown
```

## Daftar Layar yang Harus Dibuat (Lengkap)

Buat seluruh layar berikut dalam viewport desktop web app (1440x900, responsive dashboard layout):

### A. Autentikasi
1. Login page (branding PRISM + Pertamina, form login SSO sederhana)
2. (Opsional) Quick product tour overlay — 3-4 spotlight step di atas Dashboard

### B. Dashboard
3. Dashboard utama — overview cards (jumlah tender aktif, evaluasi pending, alert anomali baru), grafik ringkasan aktivitas, activity feed/notifikasi terbaru

### C. Evaluasi Harga
4. Daftar Item Pengadaan (tabel dengan filter status & kategori, tombol "Item Baru")
5. Form "Item Pengadaan Baru" — spesifikasi, kategori, volume, lokasi + section input penawaran vendor (bisa tambah beberapa vendor)
6. Detail Item — Tab "Harga Referensi": rentang harga (Rp X - Rp Y), confidence gauge, chart histori harga sejenis
7. Detail Item — Tab "Analisis Deviasi": kartu perbandingan harga penawaran vs referensi, tabel breakdown faktor deviasi (nama faktor + kontribusi %), badge status ("Within Range"/"Review Recommended")
8. Detail Item — Tab "TKDN & HEA": tabel perbandingan vendor (harga, TKDN%, HEA), highlight vendor dengan HEA terbaik
9. Detail Item — Tab "Simulator What-if": panel input skenario (slider volume, dropdown TKDN requirement, date picker waktu pengadaan), area hasil perbandingan sebelum vs sesudah (chart + angka)

### D. Intelijen Pasar
10. Dashboard harga pasar — grid card per komoditas dengan mini sparkline chart, indikator status crawling per sumber (aktif/gagal, terakhir diperbarui), filter sumber data & kategori
11. Detail komoditas — grafik tren harga besar (multi-line per sumber: e-commerce B2B, e-Katalog LKPP, bursa global), tabel histori harga

### E. Integritas Vendor
12. Daftar Tender dengan skor risiko kolusi — tabel sortable (nama tender, jumlah vendor, skor risiko dengan visual bar, status badge "Normal"/"Perlu Investigasi")
13. Detail Tender — visualisasi kemiripan pola penawaran antar vendor (misal network graph atau heatmap kemiripan), detail vendor yang ditandai, tombol "Ekspor Laporan Anomali"

### F. Riwayat & Laporan
14. Riwayat evaluasi harga — tabel dengan filter tanggal/kategori/status, tombol ekspor per baris dan ekspor massal

### G. Pengaturan
15. Halaman Profil Pengguna
16. Manajemen Akses Pengguna (khusus Admin) — tabel user, role, tombol tambah/edit
17. Konfigurasi Ambang Batas Skor Anomali (khusus Admin) — slider/input threshold dengan preview dampak

### H. Global States & Komponen Pendukung
18. Panel/dropdown Notifikasi (dari ikon lonceng di top bar)
19. Empty state (misal: "Belum ada item pengadaan, mulai dengan menambahkan yang pertama")
20. Loading state (skeleton screen) untuk tabel dan chart
21. Error/no-connection state

## Data Dummy untuk Konten Desain

- **Item Pengadaan:** contoh "Industrial Pump — Qty 25", kategori "Peralatan Mekanikal", lokasi "Kalimantan Timur"
- **Harga Referensi:** contoh "Rp 1.08 M – Rp 1.15 M", confidence 87%
- **Penawaran Vendor:** contoh "Vendor A — Rp 1.25 M", deviasi "+9.4% di atas rentang pasar"
- **Breakdown Deviasi:** Material cost +4.1%, Spesifikasi +2.8%, Histori harga vendor +3.2%, Volume -1.7%, TKDN -1.2%
- **TKDN & HEA:** Vendor A (TKDN 42%, HEA Rp 1.04 M) vs Vendor B (TKDN 18%, HEA Rp 1.07 M)
- **Harga Pasar:** tren komoditas seperti "Pipa Baja", "Kabel Listrik", "Semen" dengan grafik naik/turun beberapa bulan terakhir
- **Skor Risiko Kolusi:** contoh tender dengan skor 78/100 berstatus "Perlu Investigasi", tender lain skor 12/100 "Normal"

## Tone of Voice (Microcopy)

Gunakan Bahasa Indonesia profesional dan ringkas, khas produk B2B enterprise — bukan bahasa santai, tapi juga tidak kaku birokratis. Contoh:
- "Rekomendasi: Perlu ditinjau lebih lanjut sebelum disetujui."
- "3 tender memerlukan perhatian Anda."
- "Data pasar terakhir diperbarui 4 menit lalu."
- "Belum ada evaluasi tercatat untuk periode ini."

## Output yang Diharapkan

Hasilkan seluruh 21 layar/state di atas dalam satu file desain yang terorganisir (frame per layar, dikelompokkan per bagian A-H), dengan design system (warna, tipografi, komponen) yang konsisten dan reusable di semua layar. Prioritaskan clarity, kredibilitas visual, dan kesan "produk AI enterprise yang matang" — ini adalah tool pengambilan keputusan bernilai tinggi bagi tim procurement, jadi desainnya harus membangun kepercayaan sejak detik pertama dilihat.