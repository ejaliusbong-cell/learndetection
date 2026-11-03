# 🛡️ Integrasi Supabase & Dokumentasi Backend

Dokumen ini memuat spesifikasi teknis mengenai database PostgreSQL Supabase, struktur tabel, kebijakan keamanan *Row Level Security* (RLS), *Storage Buckets*, dan *Triggers*.

---

## 1. Skema Database (Database Schema)

Database terdiri dari 4 tabel utama yang saling terhubung:

### A. Tabel `public.profiles`
Menyimpan profil pengguna yang tersinkronisasi otomatis dengan otentikasi Supabase (`auth.users`).

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Merujuk ke `auth.users(id)` dengan `ON DELETE CASCADE` |
| `email` | `TEXT` | Alamat email unik pengguna |
| `full_name` | `TEXT` | Nama lengkap pengguna |
| `avatar_url` | `TEXT` | URL foto profil opsional |
| `role` | `user_role (ENUM)` | Nilai: `'ADMIN'`, `'OPERATOR'`, `'USER'` (Default: `'USER'`) |
| `department` | `TEXT` | Divisi atau departemen pengguna |
| `has_face_registered` | `BOOLEAN` | Indikator apakah wajah sudah didaftarkan (Default: `false`) |
| `created_at` | `TIMESTAMPTZ` | Waktu pembuatan akun |
| `updated_at` | `TIMESTAMPTZ` | Waktu pembaruan akun (auto update via trigger) |

---

### B. Tabel `public.face_descriptors`
Menyimpan data biometrik representasi fitur wajah (vektor embedding numerik) untuk proses perbandingan biometrik.

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Pengidentifikasi unik data biometrik |
| `user_id` | `UUID (FK)` | Relasi ke `profiles(id)` dengan `ON DELETE CASCADE` |
| `descriptor_vector`| `JSONB` | Vektor embedding fitur wajah (array float berdimensi tetap) |
| `face_image_url` | `TEXT` | URL foto referensi pada Supabase Storage |
| `confidence_threshold` | `NUMERIC(4,2)` | Batas minimal skor kecocokan (Default: `85.00%`) |
| `is_active` | `BOOLEAN` | Status aktif descriptor biometrik |
| `created_at` | `TIMESTAMPTZ` | Waktu pendaftaran |

---

### C. Tabel `public.scan_logs`
Mencatat setiap transaksi pemindaian wajah (presensi kehadiran, verifikasi akses, atau pendaftaran).

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Pengidentifikasi unik log scan |
| `user_id` | `UUID (FK)` | ID pengguna yang cocok (bisa `NULL` jika tidak dikenal) |
| `scan_type` | `scan_type (ENUM)`| Nilai: `'ATTENDANCE'`, `'VERIFICATION'`, `'ACCESS_CONTROL'`, `'REGISTRATION'` |
| `status` | `scan_status (ENUM)`| Nilai: `'PENDING'`, `'VERIFIED'`, `'FAILED'`, `'SUSPICIOUS'` |
| `confidence_score`| `NUMERIC(5,2)` | Persentase skor kemiripan (0.00% - 100.00%) |
| `captured_image_url`| `TEXT` | Snapshot foto wajah saat melakukan pemindaian |
| `device_info` | `TEXT` | Identitas perangkat atau User Agent kamera |
| `location` | `TEXT` | Nama gerbang/lokasi terminal scanner |
| `error_message` | `TEXT` | Catatan alasan kegagalan jika status `'FAILED'` |
| `metadata` | `JSONB` | Data kontekstual tambahan |
| `created_at` | `TIMESTAMPTZ` | Waktu pemindaian |

---

### D. Tabel `public.audit_trails`
Mencatat tindakan pengubahan konfigurasi atau aksi administratif untuk kebutuhan audit kepatuhan keamanan.

---

## 2. Kebijakan Row Level Security (RLS)

Keamanan data diproteksi di lapisan PostgreSQL melalui kebijakan RLS:

1. **`profiles`**:
   - `SELECT`: Terbuka untuk semua pengguna terotentikasi.
   - `UPDATE`: Hanya pemilik akun (`auth.uid() = id`) yang dapat memperbarui profilnya sendiri.

2. **`face_descriptors`**:
   - `SELECT`: Pengguna hanya dapat membaca data biometrik miliknya sendiri, kecuali pengguna dengan role `ADMIN` atau `OPERATOR`.
   - `INSERT / UPDATE`: Hanya dapat dilakukan oleh pengguna terkait untuk profil miliknya.

3. **`scan_logs`**:
   - `SELECT`: Pengguna dapat membaca log dirinya sendiri; peran `ADMIN` / `OPERATOR` dapat melihat log seluruh terminal.
   - `INSERT`: Diizinkan untuk aplikasi backend atau terminal presensi yang memiliki otoritas.

---

## 3. Supabase Storage Buckets

Dua bucket penyimpanan telah dikonfigurasi pada migrasi awal:

1. **`face-images`**:
   - Menyimpan gambar referensi pendaftaran wajah.
   - Hak akses: Publik untuk pembacaan avatar resmi; unggahan hanya untuk pengguna terotentikasi.
2. **`scan-captures`**:
   - Menyimpan foto snapshot hasil pemindaian setiap sesi kehadiran.
   - Hak akses: Terisolasi untuk log pemeriksaan visual administrator.

---

## 4. Fungsi & Trigger Otomatis (Automated Triggers)

- **`on_auth_user_created`**: Ketika ada registrasi baru di `auth.users`, trigger ini secara otomatis membuat baris profil di `public.profiles`.
- **`trigger_sync_face_registration`**: Otomatis memperbarui kolom `has_face_registered = true` pada tabel `profiles` saat wajah baru berhasil didaftarkan ke `face_descriptors`.
- **`trigger_set_profiles_updated_at`**: Memperbarui cap waktu `updated_at` setiap kali profil diubah.

---

## 5. Cara Menjalankan Migrasi ke Supabase Proyek Anda

Jika menggunakan **Supabase Cloud Dashboard**:
1. Masuk ke Dashboard Supabase -> Pilih Proyek Anda.
2. Buka menu **SQL Editor**.
3. Buka file [supabase/migrations/20261103000001_initial_schema.sql](../supabase/migrations/20261103000001_initial_schema.sql).
4. Salin seluruh isi file dan tekan **Run**.
5. Salin isi file [supabase/seed.sql](../supabase/seed.sql) untuk mengisi data simulasi awal.

Jika menggunakan **Supabase CLI**:
```bash
supabase link --project-ref your-project-id
supabase db push
```
