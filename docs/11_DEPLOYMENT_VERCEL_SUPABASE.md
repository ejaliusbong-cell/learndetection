# 11. Panduan Rilis Produksi (Vercel & Supabase Cloud)

## 1. Menyiapkan Supabase Cloud
1. Kunjungi [database.new](https://database.new) dan buat proyek baru.
2. Buka menu **SQL Editor**.
3. Salin isi berkas [sql/schema.sql](../sql/schema.sql) dan jalankan (*Run*).
4. Catat `Project URL`, `anon public key`, dan `service_role secret` dari menu **Project Settings -> API**.

---

## 2. Deploy ke Vercel (Rekomendasi)
Karena proyek ini menggunakan Next.js App Router murni, deployment ke Vercel dapat dilakukan dalam 1 klik tanpa konfigurasi server tambahan:
1. Dorong (*push*) repositori ini ke GitHub / GitLab.
2. Impor repositori ke dashboard Vercel.
3. Masukkan variabel lingkungan pada bagian **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
4. Klik **Deploy**.

---

## 3. Menyiapkan Cron Job Otomatis di Vercel (Opsional)
Tambahkan berkas `vercel.json` di root proyek untuk memanggil sinkronisasi otomatis setiap 5 menit:
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-bmkg",
      "schedule": "*/5 * * * *"
    }
  ]
}
```
