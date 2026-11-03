# Panduan Deployment FaceScan AI ke Vercel

Dokumen ini menjelaskan langkah demi langkah cara mendeploy platform **FaceScan AI** ke **Vercel** dengan cepat, aman, dan tanpa kendala routing SPA (Single Page Application).

---

## 🚀 Keunggulan Deploy di Vercel

1. **HTTPS Otomatis (Wajib untuk Kamera)**: Browser modern (Chrome, Safari, Edge) mewajibkan koneksi aman `https://` untuk mengizinkan akses kamera webcam melalui `navigator.mediaDevices.getUserMedia`. Vercel menyediakan sertifikat SSL gratis secara otomatis.
2. **Global Edge CDN**: MediaPipe WASM model binary dan aset UI didistribusikan secara global dengan latensi sangat rendah.
3. **SPA Routing Terintegrasi**: Berkas konfigurasi `vercel.json` sudah disiapkan agar rute `/analyze`, `/dashboard`, `/history`, dan `/profile` tidak error 404 saat pengguna melakukan refresh halaman.

---

## 🛠️ Langkah-langkah Deploy ke Vercel

### Metode 1: Melalui Dashboard Vercel (Paling Mudah)

1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository GitHub Anda: `learndetection` (atau `FaceScan`).
4. Pada halaman konfigurasi project (*Configure Project*):
   - **Framework Preset**: Pilih **Vite** (atau biarkan *Other* karena `vercel.json` sudah otomatis mengonfigurasinya).
   - **Root Directory**: Biarkan `./` (karena `vercel.json` di root sudah mengatur build ke `client/`).
   - **Build Command**: `npm --prefix client run build` (sudah otomatis diset di `vercel.json`).
   - **Output Directory**: `client/dist` (sudah otomatis diset di `vercel.json`).
5. **Environment Variables**:
   Tambahkan variabel lingkungan berikut:
   ```env
   VITE_SUPABASE_URL=https://fvpbaxlbdiedghesetba.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_URL=https://fvpbaxlbdiedghesetba.supabase.co
   SUPABASE_JWT_SECRET=fKLL83cYh5I/bTFswwVqEgzW7ZrBTPa2nBWiDx6ekV2ukWYBxcrAHFJJpJlHk7fIbYwrxaVLztyHXZbdwGI8HQ==
   ```
6. Klik **"Deploy"**.
7. Tunggu sekitar 1-2 menit hingga proses build selesai. Website Anda langsung live dengan domain `*.vercel.app`!

---

### Metode 2: Menggunakan Vercel CLI

Jika Anda memiliki Vercel CLI di komputer Anda:
```bash
# Login ke Vercel
npx vercel login

# Deploy ke production
npx vercel --prod
```

---

## ⚙️ Berkas Konfigurasi yang Tersedia

1. **`vercel.json` (Root)**:
   Mengatur build frontend Vite di folder `client/`, rewrites SPA ke `index.html`, serta header cache immutable untuk folder aset.
2. **`client/vercel.json`**:
   Cadangan jika Anda memilih folder `client` sebagai Root Directory di pengaturan Vercel.
3. **`api/health.js`**:
   Fungsi Serverless Vercel bawaan untuk memeriksa status telemetri `/api/health`.
4. **`.vercelignore`**:
   Mengecualikan file log dan dokumen yang tidak diperlukan agar proses unggah cepat.
