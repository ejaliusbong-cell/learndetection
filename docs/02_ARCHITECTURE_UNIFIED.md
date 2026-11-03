# 02. Arsitektur Terpadu (Unified Architecture)

## 🏗️ Mengapa Memilih Arsitektur Terpadu (Single Next.js App Router)?

Pada arsitektur monorepo konvensional (misalnya pemisahan `apps/web` dan `apps/api`), pengembang sering menghadapi kompleksitas berlebih:
- Pengelolaan ganda port lokal (Frontend di `:3000` atau `:5173`, Backend di `:4000`).
- Isu CORS (*Cross-Origin Resource Sharing*) pada lingkungan pengembangan dan produksi.
- Duplikasi proses deployment ke dua server berbeda.
- Ketergantungan *symlink* atau build step manual pada *workspaces*.

Dengan mengadopsi **Next.js App Router terpadu**, struktur proyek menjadi jauh lebih rapi, terpusat, dan efisien:

```
┌───────────────────────────────────────────────────────────┐
│                      Next.js 14 App                       │
│                                                           │
│  ┌─────────────────────────┐   ┌────────────────────────┐ │
│  │    Frontend Dashboard   │   │   Backend REST APIs    │ │
│  │     (app/page.tsx &     │──>│ (app/api/.../route.ts) │ │
│  │       components/)      │   │                        │ │
│  └─────────────────────────┘   └───────────┬────────────┘ │
│                                            │              │
│                       ┌────────────────────┴───────────┐  │
│                       │   Shared Utilities (lib/)      │  │
│                       │ (bmkg.ts, memoryStore, audio)  │  │
│                       └────────────────────┬───────────┘  │
└────────────────────────────────────────────┼──────────────┘
                                             ▼
                             ┌──────────────────────────────┐
                             │       Supabase Backend       │
                             │  (PostgreSQL + RLS + Cron)   │
                             └──────────────────────────────┘
```

### Keuntungan Utama:
1. **Satu Perintah Dev (`npm run dev`)**: Seluruh backend REST API dan frontend dashboard berjalan bersamaan di `http://localhost:3000`.
2. **Nol Konfigurasi CORS**: Karena frontend dan backend berada di origin yang sama (`/api/*`), pemanggilan API bersifat lokal dan tanpa latensi pra-pemeriksaan (*preflight request*).
3. **Deployment Tunggal**: Cukup hubungkan repositori ke Vercel atau buat satu image Docker produksi.
4. **Berbagi Kode Instan**: Modul pada direktori `lib/` dapat langsung diimpor baik oleh komponen server maupun komponen klien tanpa proses transpilasi tambahan.
