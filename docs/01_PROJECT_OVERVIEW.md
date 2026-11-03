# 01. Gambaran Umum Proyek (Project Overview)

## 📌 Pendahuluan

Indonesia terletak pada pertemuan empat lempeng tektonik utama dunia: **Lempeng Indo-Australia**, **Lempeng Eurasia**, **Lempeng Pasifik**, dan **Lempeng Laut Filipina**. Kondisi geografis ini menjadikan kepulauan Indonesia sebagai salah satu wilayah dengan aktivitas seismik dan vulkanik paling aktif di dunia (*Ring of Fire*).

Aplikasi **BMKG Real-Time Seismic & Tsunami Early Warning System** ini dirancang untuk memberikan informasi gempa bumi dan potensi ancaman tsunami secara cepat, akurat, dan visual kepada masyarakat dan pengambil kebijakan darurat.

---

## 🎯 Tujuan Sistem

1. **Pemantauan Seismik Real-Time**: Mengambil data terverifikasi langsung dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) setiap 30–60 detik.
2. **Visualisasi Geospasial Interaktif**: Memetakan titik episentrum gempa bumi di atas peta GIS digital kepulauan Nusantara menggunakan Leaflet.
3. **Peringatan Dini Suara (Audio Alert)**: Mengaktifkan sirine audio sintesis browser secara otomatis atau manual saat terdeteksi gempa berkekuatan destruktif (M ≥ 7.0 atau berpotensi tsunami).
4. **Penyimpanan Berkelanjutan Terintegrasi**: Mengabadikan seluruh riwayat gempa bumi ke dalam basis data PostgreSQL Supabase dengan proteksi Row Level Security (RLS).
5. **Mode Simulasi Bencana (Disaster Drill Engine)**: Menyediakan skenario latihan darurat seperti gempa *Megathrust Selat Sunda* (M 8.7) atau *Laut Maluku* (M 7.8) untuk keperluan edukasi dan uji kesiapan sistem evakuasi.
