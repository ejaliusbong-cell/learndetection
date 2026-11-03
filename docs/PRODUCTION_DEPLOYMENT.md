# 🚢 Production Deployment Guide

## 1. Cloud Architecture Overview

```
[ User Browser (Mobile / Desktop) ]
                │
                ├─────────────────────────────┐
                ▼                             ▼
       [ Frontend Client ]           [ Backend API ]
 (Vercel / Cloudflare / GCS)     (Google Cloud Run Container)
                │                             │
                │                             ▼
                │                  [ Google Cloud SQL ]
                │                     (PostgreSQL)
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    [ Supabase Auth Service ]
                     (Google OAuth 2.0 PKCE)
```

---

## 2. Deploying Backend to Google Cloud Run

### A. Dockerfile
Create `Dockerfile` in the root or `server/`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --only=production

EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### B. Build & Deploy via gcloud CLI:
```bash
# Build image with Google Cloud Build
gcloud builds submit --tag gcr.io/[PROJECT-ID]/facescan-api:latest

# Deploy to Cloud Run
gcloud run deploy facescan-api \
  --image gcr.io/[PROJECT-ID]/facescan-api:latest \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars SUPABASE_URL=https://[PROJECT].supabase.co,SUPABASE_JWT_SECRET=[SECRET] \
  --set-cloudsql-instances [PROJECT-ID]:asia-southeast2:facescan-db
```

---

## 3. Database Migration (Google Cloud SQL)

Run the SQL DDL file [sql/schema.sql](../sql/schema.sql) in your Cloud SQL PostgreSQL instance using Cloud Shell or `psql`:

```bash
gcloud sql connect facescan-db --user=postgres < sql/schema.sql
```

---

## 4. Frontend Deployment (Vercel)

1. Connect your repository to Vercel.
2. Set **Root Directory**: `client`.
3. Set **Build Command**: `npm run build`.
4. Set **Output Directory**: `dist`.
5. Provide Environment Variables:
   - `VITE_SUPABASE_URL`: `https://[PROJECT].supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `[ANON_KEY]`
6. Deploy!
