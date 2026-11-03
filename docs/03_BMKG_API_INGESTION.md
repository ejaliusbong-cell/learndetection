# 03. Protokol Ingestion Data BMKG & Bypass WAF 403

## 🌐 Endpoint Terbuka BMKG

Sistem BMKG Open Data (InaTEWS) menyediakan endpoint JSON publik pada domain `data.bmkg.go.id`:

| Endpoint | Kegunaan | Frekuensi Pembaruan |
| :--- | :--- | :--- |
| `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json` | Data 1 gempa bumi paling mutakhir (Headline) | Segera setelah deteksi |
| `https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json` | Daftar 15 gempa bumi dengan Magnitudo M ≥ 5.0 | Berkala |
| `https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json` | Daftar 15 gempa bumi yang dirasakan masyarakat (dilengkapi skala MMI) | Berkala |

---

## 🛡️ Mengatasi Masalah Proteksi WAF (403 Forbidden)

Server web BMKG dilindungi oleh *Web Application Firewall* (WAF) yang memblokir permintaan HTTP tanpa header peramban standar (misalnya permintaan baku dari `curl`, `node-fetch`, atau pustaka backend).

Solusi implementasi pada [lib/bmkg.ts](../lib/bmkg.ts):

```typescript
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 BMKG-Seismic-Client/1.0',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
};
```

---

## 📐 Algoritma Parsing Koordinat Seismik

BMKG mengembalikan format koordinat geografis dalam bentuk teks bahasa Indonesia (misal: `"7.85 LS"` dan `"107.12 BT"`). Fungsi `parseCoordinates` mengonversi teks tersebut menjadi format desimal baku GIS:
- Lintang Selatan (LS) dikonversi menjadi bilangan bertanda negatif (`-7.85`).
- Bujur Timur (BT) tetap bernilai positif (`107.12`).
