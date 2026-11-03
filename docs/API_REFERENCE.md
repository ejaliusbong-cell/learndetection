# 🔌 Referensi REST API (API Reference)

Dokumen ini memuat spesifikasi lengkap endpoint REST API yang disediakan oleh Backend Service (`apps/api`).

**Base URL**: `http://localhost:4000/api`

---

## Standar Format Respon (Response Envelope)

Seluruh endpoint mengembalikan format JSON yang konsisten:

```json
{
  "success": true,
  "message": "Deskripsi hasil operasi",
  "data": { ... },
  "error": null,
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 1. Health Check

Memeriksa ketersediaan dan status server backend.

- **Method**: `GET`
- **Endpoint**: `/health`
- **Autentikasi**: Tidak diperlukan

#### Contoh Respon (200 OK):
```json
{
  "success": true,
  "message": "FaceScan API Service is healthy and active",
  "data": {
    "uptime": 128.45,
    "timestamp": "2026-11-03T16:00:00.000Z",
    "service": "FaceScan Express API"
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 2. Pemindaian & Verifikasi Wajah (Face Verification)

Memverifikasi gambar wajah dan mencocokkannya dengan basis data Supabase.

- **Method**: `POST`
- **Endpoint**: `/scans/verify`
- **Autentikasi**: Publik / Terminal Key

#### Request Body:
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "descriptorVector": [0.12, 0.45, -0.23, 0.88, ...],
  "scanType": "ATTENDANCE",
  "location": "Gate Lobby Utama",
  "deviceInfo": "Webcam Terminal #1",
  "expectedUserId": "a0000000-0000-0000-0000-000000000002"
}
```

| Bidang | Tipe | Wajib | Keterangan |
| :--- | :--- | :--- | :--- |
| `imageBase64` | `string` | Ya | Gambar tangkapan kamera dalam format base64 |
| `descriptorVector` | `number[]` | Tidak | Array vektor float hasil kalkulasi model wajah |
| `scanType` | `string` | Tidak | `'ATTENDANCE'`, `'VERIFICATION'`, `'ACCESS_CONTROL'` (Default: `'ATTENDANCE'`) |
| `location` | `string` | Tidak | Nama lokasi fisik terminal |
| `deviceInfo` | `string` | Tidak | Keterangan model kamera / user agent |
| `expectedUserId` | `string` | Tidak | UUID pengguna spesifik jika ingin verifikasi 1:1 |

#### Contoh Respon Berhasil (200 OK):
```json
{
  "success": true,
  "message": "Wajah berhasil diverifikasi (Budi Santoso)",
  "data": {
    "verified": true,
    "confidence": 96.5,
    "userId": "a0000000-0000-0000-0000-000000000002",
    "userName": "Budi Santoso",
    "userEmail": "budi.santoso@facescan.local",
    "scanLogId": "c0000000-0000-0000-0000-000000000001",
    "capturedImageUrl": "https://supabase-bucket-url.com/scan_123.jpg",
    "message": "Wajah berhasil diverifikasi (Budi Santoso)"
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 3. Pendaftaran Biometrik Wajah (Register Face)

Mendaftarkan vektor biometrik baru dan foto referensi untuk akun pengguna.

- **Method**: `POST`
- **Endpoint**: `/scans/register`
- **Autentikasi**: Bearer Token / Admin

#### Request Body:
```json
{
  "userId": "a0000000-0000-0000-0000-000000000002",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "descriptorVector": [0.12, 0.45, -0.23, 0.88, ...]
}
```

#### Contoh Respon (201 Created):
```json
{
  "success": true,
  "message": "Data biometrik wajah berhasil didaftarkan",
  "data": {
    "id": "b0000000-0000-0000-0000-000000000001",
    "user_id": "a0000000-0000-0000-0000-000000000002",
    "face_image_url": "https://storage.../ref_123.jpg",
    "confidence_threshold": 85.0,
    "is_active": true
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 4. Riwayat Pemindaian (Scan History)

Mengambil daftar log pemindaian dengan paginasi dan filter status.

- **Method**: `GET`
- **Endpoint**: `/scans/history`
- **Query Params**:
  - `page` *(number, default: 1)*
  - `limit` *(number, default: 20)*
  - `status` *(string: `'VERIFIED'`, `'FAILED'`, `'SUSPICIOUS'`)*
  - `scanType` *(string: `'ATTENDANCE'`, dll)*
  - `userId` *(string UUID)*

#### Contoh Respon (200 OK):
```json
{
  "success": true,
  "message": "Riwayat scan berhasil diambil",
  "data": {
    "items": [
      {
        "id": "c0000000-0000-0000-0000-000000000001",
        "user_id": "a0000000-0000-0000-0000-000000000002",
        "scan_type": "ATTENDANCE",
        "status": "VERIFIED",
        "confidence_score": 96.4,
        "location": "Gate Lobby Utama",
        "created_at": "2026-11-03T14:00:00.000Z",
        "profiles": {
          "full_name": "Budi Santoso",
          "email": "budi.santoso@facescan.local"
        }
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 5. Ringkasan Statistik Dashboard (Dashboard Stats)

- **Method**: `GET`
- **Endpoint**: `/stats/dashboard`

#### Contoh Respon (200 OK):
```json
{
  "success": true,
  "message": "Statistik dashboard berhasil dimuat",
  "data": {
    "totalScansToday": 148,
    "successfulScansToday": 142,
    "failedScansToday": 6,
    "activeUsers": 34,
    "averageConfidence": 96.8,
    "recentLogs": [ ... ]
  },
  "timestamp": "2026-11-03T16:00:00.000Z"
}
```

---

## 6. Kode Status & Penanganan Error

| Kode Status | Makna | Keterangan |
| :--- | :--- | :--- |
| `200 OK` | Berhasil | Permintaan berhasil diproses |
| `201 Created` | Dibuat | Entri data baru berhasil ditambahkan |
| `400 Bad Request` | Validasi Gagal | Payload Zod tidak valid atau format salah |
| `401 Unauthorized` | Belum Login | Token JWT Supabase kosong atau telah kedaluwarsa |
| `403 Forbidden` | Ditolak | Peran pengguna tidak memiliki hak akses |
| `404 Not Found` | Tidak Ditemukan | Rute atau data rekaman tidak ditemukan |
| `500 Server Error` | Kesalahan Server | Masalah internal server atau koneksi database |
