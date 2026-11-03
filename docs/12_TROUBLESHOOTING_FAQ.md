# 12. Troubleshooting & Tanya Jawab (FAQ)

### Q1: Mengapa peta Leaflet sempat berkedip atau error saat SSR?
**Jawab**: Leaflet membutuhkan akses ke API `window` dan DOM peramban. Seluruh kode Leaflet pada aplikasi ini telah diisolasi di dalam komponen klien `'use client'` dengan mekanisme *Dynamic Import* di dalam *hook* `useEffect`, menjamin ketiadaan error `window is not defined` pada server Next.js.

---

### Q2: Apakah aplikasi tetap berfungsi jika kredensial Supabase belum dimasukkan?
**Jawab**: Ya! Sistem dirancang dengan arsitektur ketahanan tinggi (*high resilience*). Jika Supabase belum dikonfigurasi di `.env.local`, backend secara otomatis beralih ke `lib/memoryStore.ts` yang menyimpan data seismik dan skenario simulasi secara in-memory.

---

### Q3: Bagaimana jika BMKG memblokir permintaan server dengan status 403?
**Jawab**: Modul `lib/bmkg.ts` telah dilengkapi header `User-Agent` peramban modern yang lolos dari filter WAF BMKG. Selain itu, bila terjadi kendala jaringan sementara, sistem menggunakan *fallback cache* dari sinkronisasi sebelumnya sehingga dasbor pengguna tidak pernah kosong (*zero blank screen*).

---

### Q4: Apakah sirine audio dapat berbunyi otomatis saat ada gempa bumi besar?
**Jawab**: Kebijakan peramban modern melarang pemutaran audio otomatis (*autoplay restriction*) sebelum pengguna berinteraksi dengan dokumen web setidaknya satu kali (klik tombol, scroll, atau tap). Begitu pengguna mengklik tombol "Sirine Suara" atau berinteraksi di halaman, konteks audio aktif dan siap membunyikan peringatan darurat.
