# 05. Spesifikasi Lengkap Endpoint REST API

Semua endpoint backend diimplementasikan menggunakan **Next.js Route Handlers** (`app/api/**/route.ts`).

---

## 1. `GET /api/earthquakes/latest`
Mengambil informasi gempa bumi terkini (Headline) dari sistem BMKG atau simulasi yang sedang berjalan.

#### Contoh Respon (200 OK):
```json
{
  "success": true,
  "source": "BMKG_LIVE",
  "data": {
    "id": "bmkg-20261103224510",
    "dateTime": "2026-11-03T15:45:10.000Z",
    "dateStr": "03 Nov 2026",
    "timeStr": "22:45:10 WIB",
    "latitude": -7.42,
    "longitude": 106.91,
    "coordinates": "-7.42, 106.91",
    "magnitude": 5.6,
    "depthKm": 24,
    "region": "84 km BaratDaya KAB-SUKABUMI-JABAR",
    "potency": "Tidak berpotensi tsunami",
    "feltMmi": "III-IV Sukabumi, II Bandung",
    "shakemapUrl": "https://data.bmkg.go.id/DataMKG/TEWS/20261103224510.mmi.jpg",
    "category": "LATEST"
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 2. `GET /api/earthquakes`
Mengambil daftar katalog riwayat gempa bumi dengan parameter filter.

#### Parameter Query:
- `category` (*opsional*): `'ALL'`, `'M5+'`, `'FELT'` (Default: `'ALL'`)
- `minMagnitude` (*opsional*): Bilangan desimal magnitudo minimal (misal `5.0`, `6.5`)
- `limit` (*opsional*): Jumlah data maksimal (Default: `25`)

---

## 3. `GET /api/cron/sync-bmkg` & `POST /api/cron/sync-bmkg`
Menjalankan *ingestion pipeline* untuk menyinkronkan data dari ketiga endpoint BMKG ke dalam Supabase Database dan Memory Store.

#### Header Keamanan (POST):
```http
Authorization: Bearer <CRON_SECRET>
```

---

## 4. `GET /api/simulation`, `POST /api/simulation`, `DELETE /api/simulation`
Endpoint manajemen mode simulasi:
- `GET`: Mengambil status aktif simulasi.
- `POST`: Mengaktifkan skenario (`MEGATHRUST_SUNDA`, `TSUNAMI_MALUKU`, atau `CUSTOM`).
- `DELETE`: Menghentikan simulasi dan mengembalikan sistem ke data real-time BMKG.

---

## 5. `GET /api/health`
Mengembalikan status telemetri server, konektivitas database Supabase, dan uptime sistem.
