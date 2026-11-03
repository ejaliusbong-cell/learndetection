# 🎭 FaceScan AI - Real-Time Facial Expression Analysis Platform

> Production-ready, privacy-first AI web application analyzing 478 facial landmarks and blendshapes in real-time using **MediaPipe WebAssembly**, authenticated via **Supabase Google OAuth**, backed by an **Express.js API** and **PostgreSQL (Google Cloud SQL)**.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceLandmarker%20WASM-teal?logo=google)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Google%20OAuth-3ECF8E?logo=supabase)
![Express](https://img.shields.io/badge/Express-REST%20API-lightgrey?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Cloud%20SQL-336791?logo=postgresql)

---

## 🌟 Key Application Features

1. **Client-Side Computer Vision Engine**:
   - Zero raw video uploaded to any server.
   - Extracts 478 facial mesh landmarks and 52 Action Unit blendshapes in local browser WebAssembly.
   - Standardized FACS mapping across 7 basic expressions: **Happy**, **Neutral**, **Surprised**, **Sad**, **Angry**, **Fearful**, and **Disgusted**.
   - Temporal Exponential Moving Average (EMA) smoothing for jitter-free real-time confidence scores.

2. **Professional SaaS Landing Page**:
   - Hero section with live interactive visualization preview.
   - Features, How it Works, Technology, Ethical AI Charter, and FAQ sections.

3. **Secure Authentication**:
   - Supabase Auth with Google OAuth PKCE flow.
   - Session persistence, token refresh, and instant one-click demo explorer mode.

4. **Interactive Analysis Studio**:
   - Camera device selector with automatic permissions management.
   - Live canvas landmark mesh overlay toggle.
   - Dominant expression badge and dynamic confidence distribution bars.
   - Session Recorder controller: records temporal windows and saves summaries to the database.

5. **Personal History & Audit**:
   - Comprehensive session history table with expression filter.
   - Session Inspector modal showing breakdown charts and session notes.
   - Full session deletion rights.

6. **Profile & Ethical AI Rights**:
   - Google account profile information.
   - Camera and smoothing factor customization.
   - One-click GDPR permanent data deletion (Right to be Forgotten).

---

## 🏛️ Project Directory Structure

```text
FaceScan/
├── client/                     # 🌐 Frontend React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── ai/                 # Computer Vision & Inference Engine
│   │   ├── components/         # Modular UI Components (Studio, Navbar, Metrics)
│   │   ├── context/            # Supabase Auth Context & Session Management
│   │   ├── pages/              # Landing, Auth, Dashboard, Analyze, History, Profile
│   │   ├── services/           # Supabase SDK & REST API client
│   │   └── types/              # TypeScript Interfaces
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # ⚙️ Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # DB Pool (Cloud SQL) & Environment
│   │   ├── middleware/         # Supabase JWT Auth & Error Handling
│   │   ├── routes/             # REST Endpoints
│   │   ├── services/           # Database Query Services
│   │   └── index.ts            # Server Entrypoint
│   └── package.json
│
├── sql/
│   └── schema.sql              # PostgreSQL DDL Schema
├── docs/                       # Comprehensive Architecture & Engineering Guides
├── .env.example                # Unified Environment Template
├── package.json                # Root Concurrent Scripts
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Launch Development Servers
```bash
npm run dev
```

- **Frontend Studio**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📚 Technical Documentation

Explore the [docs/](./docs/README.md) directory for in-depth engineering documentation:
- [Computer Vision Pipeline & FACS Blendshapes](./docs/COMPUTER_VISION_PIPELINE.md)
- [Authentication, Security, and Privacy Architecture](./docs/AUTH_SECURITY_PRIVACY.md)
- [REST API Reference](./docs/API_REFERENCE.md)
- [Getting Started & Local Development](./docs/GETTING_STARTED.md)
- [Production Deployment (Google Cloud Run + Cloud SQL)](./docs/PRODUCTION_DEPLOYMENT.md)

---

## 📄 License
Distributed under the [MIT](LICENSE) License.
