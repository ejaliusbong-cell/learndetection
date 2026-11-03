# 🚢 Panduan Deployment Produksi (Deployment Guide)

Dokumen ini memandu proses rilis dan deployment seluruh komponen FaceScan Monorepo ke lingkungan *production*.

---

## 1. Topologi Arsitektur Produksi

```
[ Klien Pengguna (Browser Web / Mobile) ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  [ Frontend Web ]    [ Backend API ]
 (Vercel / Netlify)  (Docker / Cloud Run)
        │                   │
        └─────────┬─────────┘
                  ▼
        [ Supabase Cloud ]
(PostgreSQL + Storage + Auth + RLS)
```

---

## 2. Deployment Frontend (`apps/web`)

Frontend dibangun menggunakan Vite, menghasilkan berkas statis teroptimasi (*Static Single Page App*).

### Opsi A: Vercel
1. Import repositori Git ke Vercel.
2. Atur konfigurasi build:
   - **Root Directory**: `apps/web` (atau biarkan root dengan monorepo build)
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
3. Tambahkan Environment Variables di Vercel:
   ```ini
   VITE_API_BASE_URL=https://api.facescan-anda.com/api
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Opsi B: Netlify
Tambahkan file `netlify.toml` pada root atau arahkan base directory ke `apps/web`:
```toml
[build]
  base = "apps/web"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 3. Deployment Backend API (`apps/api`)

Backend merupakan aplikasi Node.js Express. Dapat di-deploy sebagai container Docker di layanan seperti **Render**, **Railway**, **Fly.io**, atau **Google Cloud Run**.

### Dockerfile Produksi
Buat `Dockerfile` di root monorepo:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies and build shared packages + api
RUN npm install
RUN npm run build:packages
RUN npm run build:api

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
```

### Environment Variables untuk Backend:
```ini
NODE_ENV=production
PORT=4000
API_CORS_ORIGIN=https://facescan-anda.com
SUPABASE_URL=https://proyek-anda.supabase.co
SUPABASE_ANON_KEY=anon-key-anda
SUPABASE_SERVICE_ROLE_KEY=service-role-key-rahasia-anda
```

---

## 4. Setup Supabase Cloud

1. Buka [database.new](https://database.new) untuk membuat proyek Supabase baru.
2. Salin isi migrasi [20261103000001_initial_schema.sql](../supabase/migrations/20261103000001_initial_schema.sql) ke **SQL Editor** Supabase Cloud dan jalankan.
3. Pastikan Storage Bucket `face-images` dan `scan-captures` telah terbentuk.
4. Periksa **Project Settings -> API** untuk mendapatkan URL dan API Keys (Anon Key & Service Role Key).
5. Atur **URL Redirects** di menu **Authentication -> URL Configuration** untuk mengizinkan domain website produksi Anda.
