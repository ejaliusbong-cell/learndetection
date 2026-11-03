# 08. Sintesis Audio Sirine Darurat (Web Audio API)

## 🔊 Keunggulan Sintesis Audio Murni

Alih-alih mengunduh berkas audio berukuran besar (`.mp3` atau `.wav`) yang rentan gagal dimuat atau terblokir jaringan, modul [lib/audio.ts](../lib/audio.ts) memanfaatkan **Web Audio API** bawaan peramban:
- **Ukuran Aset 0 KB**: Dihasilkan secara langsung (*real-time synthesis*) oleh prosesor audio peramban.
- **Kepatuhan Kebijakan Autoplay Peramban**: Mengaktifkan `audioCtx.resume()` hanya setelah interaksi pengguna (penekanan tombol "Sirine Suara" atau interaksi halaman).

---

## 🎛️ Arsitektur Sintesis Suara

```
[ LFO: 0.7 Hz Sine Osc ] ──> [ Modulator Frekuensi: 650Hz - 1050Hz ]
                                          │
    ┌─────────────────────────────────────┴──────────────────┐
    ▼                                                        ▼
[ Osc 1: Sawtooth (650Hz) ]                      [ Osc 2: Sine (325Hz) ]
    │                                                        │
    └──────────────────────┬─────────────────────────────────┘
                           ▼
                 [ GainNode Master: 0.18 ]
                           │
                           ▼
                  [ Audio Destination ]
```
Frekuensi dinaik-turunkan secara ritmis (efek *wailing siren*) menyerupai sirine peringatan dini tsunami BMKG sesungguhnya.
