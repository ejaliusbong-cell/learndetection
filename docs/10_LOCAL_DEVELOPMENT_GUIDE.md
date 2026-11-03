# 10. Panduan Pengembangan Lokal (Local Development)

## 1. Prasyarat Sistem
- **Node.js**: Versi `18.x`, `20.x`, atau `24.x`
- **npm**: Versi `9.x` atau `11.x`
- Koneksi internet untuk mengakses endpoint BMKG dan tile peta CartoDB.

---

## 2. Instalasi Proyek
```bash
# Masuk ke direktori proyek
cd BMKG

# Instal semua dependensi
npm install
```

---

## 3. Menyiapkan Variabel Lingkungan (.env.local)
Salin berkas contoh:
```bash
cp .env.example .env.local
```
Sesuaikan parameter database Supabase Anda jika ingin menyimpan ke cloud:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Jika belum diisi, sistem otomatis beroperasi dalam mode in-memory store yang aman).*

---

## 4. Menjalankan Server Pengembang
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 5. Menguji Endpoint REST API
- Cek Gempa Terbaru: [http://localhost:3000/api/earthquakes/latest](http://localhost:3000/api/earthquakes/latest)
- Cek Katalog Gempa: [http://localhost:3000/api/earthquakes](http://localhost:3000/api/earthquakes)
- Jalankan Sinkronisasi Manual: [http://localhost:3000/api/cron/sync-bmkg](http://localhost:3000/api/cron/sync-bmkg)
- Telemetri Kesehatan: [http://localhost:3000/api/health](http://localhost:3000/api/health)
