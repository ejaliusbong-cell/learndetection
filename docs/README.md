# 📚 FaceScan AI - Technical Engineering & Architecture Documentation

Welcome to the official documentation for **FaceScan AI**, a production-grade, privacy-first web application for real-time facial expression analysis powered by **Google MediaPipe FaceLandmarker WebAssembly**, **Supabase Auth (Google OAuth)**, and **Google Cloud SQL PostgreSQL**.

---

## 📑 Documentation Index

| Document | Description |
| :--- | :--- |
| 🏗️ [**SYSTEM_ARCHITECTURE.md**](./SYSTEM_ARCHITECTURE.md) | High-level system architecture, client-side WebAssembly inference, and Cloud Run deployment. |
| 🧠 [**COMPUTER_VISION_PIPELINE.md**](./COMPUTER_VISION_PIPELINE.md) | 478-landmark extraction, 52 blendshape FACS mapping to 7 basic expressions, and temporal EMA smoothing. |
| 🛡️ [**AUTH_SECURITY_PRIVACY.md**](./AUTH_SECURITY_PRIVACY.md) | Supabase Google OAuth flow, JWT verification, zero-video upload guarantee, and GDPR compliance. |
| 🗄️ [**DATABASE_DESIGN.md**](./DATABASE_DESIGN.md) | PostgreSQL schema (`profiles`, `analysis_sessions`, `expression_results`, `user_preferences`, `consent_records`). |
| 🔌 [**API_REFERENCE.md**](./API_REFERENCE.md) | Complete Express REST API specification, payload formats, error codes, and authentication headers. |
| 🚀 [**GETTING_STARTED.md**](./GETTING_STARTED.md) | Local development setup, camera permissions, environment variables, and execution steps. |
| 🚢 [**PRODUCTION_DEPLOYMENT.md**](./PRODUCTION_DEPLOYMENT.md) | Guide to deploying frontend (Vercel/Cloud Storage) and backend (Google Cloud Run + Cloud SQL). |

---

## 🏛️ Project Directory Structure

```text
FaceScan/
├── client/                     # 🌐 Frontend React 18 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── ai/                 # Computer Vision & Inference Engine
│   │   │   ├── faceLandmarker.ts       # MediaPipe FaceLandmarker loader & cache
│   │   │   ├── expressionClassifier.ts # FACS Blendshapes -> 7 Expressions + EMA smoothing
│   │   │   └── drawingUtils.ts         # Canvas mesh & contour rendering (478 landmarks)
│   │   ├── components/         # Modular UI Components
│   │   │   ├── analyze/        # CameraViewport, ExpressionMetrics, SessionRecorder
│   │   │   ├── common/         # ProtectedRoute, Modals
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── context/            # AuthContext (Google OAuth & Supabase session)
│   │   ├── pages/              # LandingPage, AuthPage, DashboardPage, AnalyzePage, HistoryPage, ProfilePage
│   │   ├── services/           # Supabase SDK client & authenticated REST API client
│   │   └── types/              # TypeScript definitions for expressions, sessions, users
│   ├── vite.config.ts          # Proxy configuration to backend on port 5000
│   └── package.json
│
├── server/                     # ⚙️ Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # Environment parsing & PostgreSQL pool (Cloud SQL / Supabase)
│   │   ├── middleware/         # Supabase JWT Verification, Zod error handler, CORS, Helmet
│   │   ├── routes/             # REST Endpoints: /api/auth, /api/profile, /api/analysis, /api/preferences, /api/consent
│   │   ├── services/           # Database business logic (Profile, Analysis Sessions, Preferences)
│   │   └── index.ts            # Express server entrypoint
│   └── package.json
│
├── sql/
│   └── schema.sql              # PostgreSQL DDL Schema with triggers and indexes
├── docs/                       # Technical Engineering & Compliance Documentation
├── .env.example                # Unified Environment template
├── package.json                # Root concurrent scripts
└── README.md                   # Project overview & quickstart
```
