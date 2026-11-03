# 🚀 Getting Started & Local Development Guide

## 1. Prerequisites

- **Node.js**: v18.x, v20.x, or v24.x
- **npm**: v9.x or later
- Modern browser supporting WebAssembly and MediaDevices API (Chrome, Edge, Firefox, Safari).

---

## 2. Installation

Clone the repository and install all dependencies:

```bash
# Clone repository
git clone https://github.com/ejaliusbong-cell/learndetection.git
cd FaceScan

# Install root, client, and server dependencies
npm run install:all
```

---

## 3. Environment Configuration

Copy the example configuration to your local `.env.local` or `.env`:

```bash
cp .env.example .env.local
```

### Key Variables:
- `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://fvpbaxlbdiedghesetba.supabase.co`).
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_JWT_SECRET`: Your Supabase JWT Secret (`fKLL83cYh5I/bTFswwVqEgzW7ZrBTPa2nBWiDx6ekV2ukWYBxcrAHFJJpJlHk7fIbYwrxaVLztyHXZbdwGI8HQ==`).
- `DATABASE_URL`: Connection string to your Google Cloud SQL / Supabase PostgreSQL database.

*(Note: The server includes a high-speed in-memory store adapter that activates automatically if the live PostgreSQL database is not reachable, enabling seamless local UI and camera testing!)*

---

## 4. Running Development Servers

Start both frontend and backend concurrently:

```bash
npm run dev
```

This launches:
- **Frontend React Client**: [http://localhost:5173](http://localhost:5173)
- **Backend Express Server**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 5. Instant Test Exploration

1. Navigate to [http://localhost:5173](http://localhost:5173).
2. Click **Sign In** -> Click **Instant Demo Session** to test immediately with a mock session, or sign in with your live Google account.
3. Open **Analyze Studio**, allow camera permissions, and observe real-time 478-node facial landmark tracking and expression classifications!
4. Click **Start Recording Session**, perform different expressions, and click **Stop & Save Summary** to persist to the database.
5. Visit the **History** tab to inspect and audit your recorded sessions.
