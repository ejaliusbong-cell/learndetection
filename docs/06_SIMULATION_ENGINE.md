# 06. Mesin Simulasi Bencana (Simulation Engine)

## 🎯 Tujuan Fitur Simulasi

Dalam pengembangan sistem tanggap darurat, gempa berkekuatan destruktif (M ≥ 7.0) atau peringatan tsunami jarang terjadi secara harian. Oleh karena itu, pengembang dan tim tanggap bencana membutuhkan cara untuk menguji:
1. Respon banner peringatan bahaya (*Alert Banner*).
2. Perubahan indikator warna magnitudo pada kartu sorotan utama.
3. Bunyi sirine Web Audio API.
4. Pemetaan episentrum dan perambatan gelombang pada peta GIS.

---

## ⚡ Skenario Tersedia

### 1. Megathrust Selat Sunda (M 8.7)
- **Karakteristik**: Magnitudo 8.7 SR, kedalaman dangkal 10 km di zona subduksi lempeng selatan Jawa-Sumatera.
- **Peringatan**: Status SIAGA TSUNAMI untuk pesisir Banten dan Lampung.
- **Skala MMI**: VI-VII Banten, V-VI Jakarta, V Bandung.

### 2. Gempa Laut Maluku (M 7.8)
- **Karakteristik**: Magnitudo 7.8 SR, kedalaman 12 km di sekitar Laut Maluku.
- **Peringatan**: Potensi Tsunami Lokal ketinggian 1–3 meter untuk wilayah Ambon dan sekitarnya.

### 3. Skenario Kustom (Custom Drill)
Pengguna dapat menentukan sendiri parameter magnitudo, koordinat garis lintang/bujur, kedalaman, dan teks potensi ancaman melalui antarmuka modal pengujian.
