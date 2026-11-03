# 🌐 BMKG Real-Time Seismic & Tsunami Early Warning System

> Platform Monitoring Seismik & Peringatan Dini Gempa Bumi / Tsunami Indonesia terpadu berbasis **Next.js App Router**, terintegrasi data resmi **BMKG** dan basis data **Supabase PostgreSQL**.

![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-GIS%20Peta-199900?logo=leaflet)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20RLS-3ECF8E?logo=supabase)

---

## 🏛️ Kunci Struktur Proyek (Locked Unified Architecture)

Frontend dan Backend disatukan secara elegan di bawah **Next.js App Router**, tanpa pemisahan monorepo yang rumit:

```text
BMKG/
├── app/
│   ├── api/                      # 🔌 BACKEND REST API (Route Handlers)
│   │   ├── earthquakes/          # GET: Daftar gempa riwayat & filter magnitudo
│   │   │   └── latest/           # GET: Data gempa terbaru BMKG
│   │   ├── cron/sync-bmkg/       # POST/GET: Ingestion & sinkronisasi data BMKG
│   │   ├── simulation/           # POST/GET/DELETE: Kontrol simulasi demo
│   │   └── health/               # GET: Telemetri kesehatan koneksi & sinkronisasi
│   │
│   ├── globals.css               # Styling dark mode Tailwind & radar pulse
│   ├── layout.tsx                # Root layout & Leaflet stylesheet
│   └── page.tsx                  # 🖥️ FRONTEND DASHBOARD (Terhubung langsung ke /api/*)
│
├── components/                   # Komponen Frontend
│   ├── Navbar.tsx                # Navigasi, Toggle Sirine Suara, Status BMKG
│   ├── EarthquakeHero.tsx        # Kartu Sorotan Gempa Terkini + Shakemap BMKG
│   ├── EarthquakeMap.tsx         # Peta Seismik Indonesia (Leaflet GIS)
│   ├── EarthquakeList.tsx        # Tab Gempa M 5.0+ dan Gempa Dirasakan (MMI)
│   ├── SimulationAlertBanner.tsx # Banner Peringatan Mode Simulasi
│   └── SimulationModal.tsx       # Modal Kontrol Skenario Simulasi Demo
│
├── lib/                          # Shared Services & Utility
│   ├── bmkg.ts                   # Fetcher data BMKG (bypass proteksi WAF 403)
│   ├── memoryStore.ts            # High-speed in-memory cache & fallback store
│   ├── supabase.ts               # Integrasi Supabase client
│   └── audio.ts                  # Sintesis sirine audio darurat (Web Audio API)
│
├── sql/
│   └── schema.sql                # Skema DDL PostgreSQL untuk Supabase SQL Editor
├── docs/                         # Berkas Dokumentasi Teknis Lengkap
├── .env.local                    # Kredensial Supabase & Konfigurasi Sistem
└── package.json
```

---

## 🚀 Fitur Unggulan

1. **Pemantauan Seismik Terkini (Real-Time Ingestion)**:
   - Terkoneksi ke endpoint resmi BMKG (`autogempa.json`, `gempaterkini.json`, `gempadirasakan.json`).
   - Dilengkapi *anti-blocking header* peramban modern untuk melewati proteksi WAF 403 BMKG.
   - Polling otomatis setiap 30 detik pada sisi klien.

2. **Peta Seismik Interaktif (Leaflet GIS)**:
   - Visualisasi titik gempa tektonik kepulauan Nusantara dengan latar peta gelap (*CartoDB Dark Matter*).
   - Penanda episentrum proporsional berdasarkan magnitudo dengan animasi pulsasi radar untuk gempa kuat (M ≥ 7.0).
   - Popup info detail (kedalaman, waktu WIB, koordinat, dan status tsunami).

3. **Sintesis Audio Sirine Peringatan (Web Audio API)**:
   - Menghasilkan sirine peringatan dini secara langsung melalui osilator frekuensi ganda termodulasi LFO (0.7 Hz) tanpa memerlukan berkas audio eksternal.

4. **Mesin Simulasi Bencana (Drill Engine)**:
   - Skenario *Megathrust Selat Sunda* (M 8.7) berstatus Siaga Tsunami.
   - Skenario *Gempa Laut Maluku* (M 7.8).
   - Kustom skenario gempa untuk pelatihan evakuasi tanggap bencana.

5. **Ketahanan Tinggi (Dual Layer Storage)**:
   - Menggunakan PostgreSQL Supabase dengan Row Level Security (RLS).
   - Dilengkapi *in-memory fallback store* otomatis jika kredensial database cloud belum dipasang.

---

## ⚡ Panduan Menjalankan Aplikasi

```bash
# 1. Instal dependensi
npm install

# 2. Salin variabel lingkungan
cp .env.example .env.local

# 3. Jalankan server pengembang
npm run dev
```

Buka peramban di: **[http://localhost:3000](http://localhost:3000)**

---

## 📚 Dokumentasi Rinci

Telusuri direktori [docs/README.md](./docs/README.md) untuk mempelajari:
- [01. Gambaran Umum Proyek](./docs/01_PROJECT_OVERVIEW.md)
- [02. Desain Arsitektur Terpadu](./docs/02_ARCHITECTURE_UNIFIED.md)
- [03. Ingestion Data BMKG & WAF Bypass](./docs/03_BMKG_API_INGESTION.md)
- [04. Skema Basis Data Supabase](./docs/04_SUPABASE_DATABASE_SCHEMA.md)
- [05. Referensi Endpoint REST API](./docs/05_REST_API_ENDPOINTS.md)
- [06. Panduan Mesin Simulasi](./docs/06_SIMULATION_ENGINE.md)
- [07. Peta GIS Leaflet](./docs/07_LEAFLET_GIS_SEISMIC_MAP.md)
- [08. Sirine Suara Web Audio API](./docs/08_WEB_AUDIO_EMERGENCY_SIREN.md)
- [10. Panduan Pengembangan Lokal](./docs/10_LOCAL_DEVELOPMENT_GUIDE.md)
- [11. Panduan Deployment Vercel & Supabase](./docs/11_DEPLOYMENT_VERCEL_SUPABASE.md)
- [12. Troubleshooting & FAQ](./docs/12_TROUBLESHOOTING_FAQ.md)
