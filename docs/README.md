# 📚 Dokumentasi Lengkap Sistem Monitoring Gempa Bumi & Tsunami BMKG

Selamat datang di pusat dokumentasi resmi **BMKG Real-Time Seismic & Tsunami Early Warning System (InaTEWS)**. Proyek ini mengadopsi arsitektur terpadu (*unified fullstack*) berbasis **Next.js App Router**, menghubungkan Frontend responsif, Backend REST Route Handlers, dan Supabase Database dalam satu struktur yang rapi dan terkunci.

---

## 📑 Daftar Modul Dokumentasi

| No | Modul Dokumentasi | Deskripsi |
| :---: | :--- | :--- |
| 01 | [**01_PROJECT_OVERVIEW.md**](./01_PROJECT_OVERVIEW.md) | Gambaran umum proyek, misi InaTEWS, dan arsitektur sistem level tinggi. |
| 02 | [**02_ARCHITECTURE_UNIFIED.md**](./02_ARCHITECTURE_UNIFIED.md) | Desain arsitektur Next.js fullstack terpadu (kunci struktur folder proyek). |
| 03 | [**03_BMKG_API_INGESTION.md**](./03_BMKG_API_INGESTION.md) | Protokol pengambilan data resmi BMKG, penanganan proteksi WAF 403, dan parsing koordinat. |
| 04 | [**04_SUPABASE_DATABASE_SCHEMA.md**](./04_SUPABASE_DATABASE_SCHEMA.md) | Skema DDL PostgreSQL, tabel gempa, telemetri sinkronisasi, dan kebijakan Row Level Security. |
| 05 | [**05_REST_API_ENDPOINTS.md**](./05_REST_API_ENDPOINTS.md) | Spesifikasi lengkap endpoint REST API (`/api/earthquakes`, `/api/cron`, `/api/simulation`, dsb). |
| 06 | [**06_SIMULATION_ENGINE.md**](./06_SIMULATION_ENGINE.md) | Mesin simulasi gempa megathrust & tsunami untuk latihan evakuasi dan pengujian sistem. |
| 07 | [**07_LEAFLET_GIS_SEISMIC_MAP.md**](./07_LEAFLET_GIS_SEISMIC_MAP.md) | Implementasi peta interaktif GIS Leaflet dengan tema gelap dan indikator episentrum beranimasi. |
| 08 | [**08_WEB_AUDIO_EMERGENCY_SIREN.md**](./08_WEB_AUDIO_EMERGENCY_SIREN.md) | Sintesis audio sirine darurat berbasis Web Audio API tanpa berkas audio eksternal. |
| 09 | [**09_CRON_AUTOMATION_SYNC.md**](./09_CRON_AUTOMATION_SYNC.md) | Penjadwalan otomatis ingestion data seismik BMKG dan pencatatan telemetri performa. |
| 10 | [**10_LOCAL_DEVELOPMENT_GUIDE.md**](./10_LOCAL_DEVELOPMENT_GUIDE.md) | Panduan instalasi lokal, konfigurasi `.env.local`, dan menjalankan server pengembang. |
| 11 | [**11_DEPLOYMENT_VERCEL_SUPABASE.md**](./11_DEPLOYMENT_VERCEL_SUPABASE.md) | Panduan peluncuran produksi ke platform Vercel dan Supabase Cloud. |
| 12 | [**12_TROUBLESHOOTING_FAQ.md**](./12_TROUBLESHOOTING_FAQ.md) | Panduan penyelesaian kendala umum (SSR Leaflet, WAF BMKG, fallback store). |

---

## 🏛️ Kunci Struktur Proyek (Locked Architecture)

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
