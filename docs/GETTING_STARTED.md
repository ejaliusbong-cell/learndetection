# 🚀 Panduan Mulai Cepat (Getting Started)

Panduan ini berisi langkah-langkah mudah untuk menyiapkan, menginstal dependensi, mengonfigurasi variabel lingkungan, dan menjalankan FaceScan Monorepo di komputer lokal Anda.

---

## 1. Prasyarat Sistem

Pastikan perangkat Anda telah terinstal perangkat lunak berikut:
- **Node.js**: Versi `18.x` atau lebih baru (disarankan `20.x` atau `24.x`)
- **npm**: Versi `9.x` atau lebih baru (disertakan bersama instalasi Node.js)
- **Git**: Versi `2.x`
- *(Opsional)* **Supabase CLI**: Jika ingin menjalankan emulasi Supabase lokal dengan Docker.

---

## 2. Instalasi Dependensi Monorepo

Jalankan perintah instalasi dari direktori root proyek:

```bash
# Masuk ke direktori root FaceScan
cd FaceScan

# Instal semua dependensi untuk semua package dan app sekaligus
npm install
```

Sistem **npm workspaces** akan secara otomatis menghubungkan `@facescan/shared` dan `@facescan/supabase-config` ke dalam `apps/web` dan `apps/api`.

---

## 3. Konfigurasi Variabel Lingkungan (.env)

Buat file konfigurasi `.env` pada root atau masing-masing sub-proyek. Anda dapat menyalin contoh dari `.env.example`:

### A. Root `.env` (atau `apps/api/.env`)
```ini
PORT=4000
NODE_ENV=development
API_CORS_ORIGIN=http://localhost:5173

# Konfigurasi Supabase
SUPABASE_URL=https://proyek-anda.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### B. Frontend `apps/web/.env`
```ini
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://proyek-anda.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_NAME="FaceScan AI Web App"
```

> **Catatan Mode Demo / Simulasi**:
> Jika Anda belum memiliki akun Supabase aktif, aplikasi tetap dapat dijalankan! Frontend dan Backend telah dilengkapi *fallback simulation mode* sehingga antarmuka dan pemindaian wajah dapat langsung diuji.

---

## 4. Menjalankan Aplikasi di Mode Pengembangan (Development)

Tersedia beberapa skrip siap pakai di root `package.json`:

### A. Menjalankan Frontend dan Backend Secara Bersamaan
```bash
npm run dev
```

### B. Menjalankan Hanya Salah Satu Bagian
```bash
# Menjalankan frontend saja (http://localhost:5173)
npm run dev:web

# Menjalankan backend server saja (http://localhost:4000)
npm run dev:api
```

### URL Akses Lokal:
- **Frontend Web UI**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 5. Perintah Tambahan (Scripts Reference)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run build` | Melakukan build kompilasi TypeScript untuk seluruh paket dan aplikasi |
| `npm run typecheck` | Menjalankan pengecekan tipe statis TypeScript tanpa menghasilkan output |
| `npm run clean` | Menghapus direktori `dist/` dan cache build |
| `npm run supabase:start` | Menjalankan instance Supabase lokal via Docker |
| `npm run supabase:stop` | Menghentikan container Supabase lokal |
| `npm run supabase:db:reset`| Mereset database lokal dan mengaplikasikan file migrasi serta seed |
