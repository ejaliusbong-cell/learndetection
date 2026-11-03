# 07. Integrasi Peta Geospasial (Leaflet GIS)

## 🗺️ Implementasi Leaflet di Next.js App Router

Leaflet membutuhkan objek `window` peramban untuk inisialisasi kanvas peta. Jika dipanggil langsung saat *Server-Side Rendering* (SSR), Next.js akan menghasilkan error `window is not defined`.

Solusi yang diterapkan pada [components/EarthquakeMap.tsx](../components/EarthquakeMap.tsx):
1. Menandai komponen dengan arahan `'use client'`.
2. Melakukan *Dynamic Import* pustaka Leaflet di dalam blok `useEffect`:
   ```typescript
   useEffect(() => {
     if (typeof window === 'undefined') return;
     import('leaflet').then(L => {
       // Inisialisasi peta dan marker
     });
   }, []);
   ```

---

## 🎨 Lapisan Peta Gelap (CartoDB Dark Matter)

Peta menggunakan *tile layer* CartoDB Dark Matter untuk kontras maksimal dengan titik-titik seismik:
- URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

---

## 🔴 Visualisasi Episentrum Seismik
Ukuran jari-jari (*radius*) dan warna lingkaran marker disesuaikan secara proporsional dengan skala Magnitudo:
- **M ≥ 7.0**: Radius 16px, Merah menyala dengan efek pulsasi radar.
- **M 6.0 – 6.9**: Radius 12px, Oranye intensif.
- **M 5.0 – 5.9**: Radius 9px, Kuning peringatan.
- **M < 5.0**: Radius 7px, Biru toska.
