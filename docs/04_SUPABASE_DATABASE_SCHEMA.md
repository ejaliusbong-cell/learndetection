# 04. Skema Basis Data PostgreSQL & Supabase

File skema DDL terletak di [sql/schema.sql](../sql/schema.sql) dan dapat langsung dieksekusi di **Supabase SQL Editor**.

---

## 1. Tabel `public.earthquakes`
Menyimpan seluruh rekaman seismik gempa bumi dari BMKG.

```sql
CREATE TABLE IF NOT EXISTS public.earthquakes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    bmkg_id TEXT UNIQUE,
    event_time TIMESTAMPTZ NOT NULL,
    date_str TEXT NOT NULL,
    time_str TEXT NOT NULL,
    latitude NUMERIC(7, 4) NOT NULL,
    longitude NUMERIC(7, 4) NOT NULL,
    coordinates_str TEXT NOT NULL,
    magnitude NUMERIC(3, 1) NOT NULL,
    depth_km NUMERIC(6, 1) NOT NULL,
    region TEXT NOT NULL,
    potency TEXT NOT NULL DEFAULT 'Tidak berpotensi tsunami',
    felt_mmi TEXT,
    shakemap_url TEXT,
    category TEXT NOT NULL DEFAULT 'M5+',
    is_simulation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### Indeks Performa:
- `idx_earthquakes_event_time`: Optimasi sorting berdasarkan waktu kejadian terbaru.
- `idx_earthquakes_magnitude`: Filter cepat gempa berdasarkan batas kekuatan getaran.
- `idx_earthquakes_category`: Pemfilteran tab katalog (`'LATEST'`, `'M5+'`, `'FELT'`).

---

## 2. Tabel `public.sync_telemetry`
Merekam metrik kinerja setiap proses sinkronisasi dari BMKG ke Supabase (waktu respon, jumlah baris tersimpan, status keberhasilan).

---

## 3. Tabel `public.simulation_state`
Menyimpan status skenario simulasi aktif agar tersinkronisasi di berbagai klien peramban secara konsisten.

---

## 4. Keamanan Row Level Security (RLS)
- Pembacaan data (`SELECT`): Terbuka untuk umum (*Public Read*).
- Penulisan data (`INSERT / UPDATE`): Hanya diizinkan melalui *Backend Route Handlers* yang memegang kunci server *Service Role Key*.
