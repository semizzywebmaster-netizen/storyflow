
# Deployment Guide - Phase 80 Production

## Architecture
GitHub → Cloudflare Pages (Frontend) → Render/Railway (Backend Node) → PostgreSQL (Neon/Supabase) → Cloudflare R2 → Redis (Upstash) + BullMQ → Worker with FFmpeg

## Frontend - Cloudflare Pages

### Build
```
npm install
VITE_API_URL=https://api.aistorystudio.com/api VITE_ENABLE_MOCK=false npm run build
```

### Deploy
- Connect GitHub repo to Cloudflare Pages
- Build command: npm run build
- Output: dist/
- Environment variables:
  VITE_API_URL=https://api.aistorystudio.com/api
  VITE_ENABLE_MOCK=false
  VITE_APP_NAME=AI Story Studio

### Domain
- Add custom domain: aistorystudio.com
- Cloudflare DNS: CNAME to pages.dev
- HTTPS: automatic

### PWA
- manifest.json served from public/
- sw.js served from root
- Icons from public/icons/
- Offline page from public/offline.html

## Backend - Render / Railway

### Environment Variables (NEVER commit)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=32+ chars random secure string - generate with openssl rand -base64 32
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://aistorystudio.com

# R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=ai-story-studio-prod
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# AI Providers (server-side only)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
ELEVENLABS_API_KEY=...
FAL_API_KEY=...
# Add others as configured

# Payments
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
FLW_SECRET_KEY=FLWSECK-...
FLW_PUBLIC_KEY=FLWPUBK-...

# Redis
REDIS_URL=rediss://:pass@host:6379

# Feature Flags
ENABLE_MOCK=false
MASTER_AI_KILL_SWITCH=false
```

### Build & Start
```
cd backend
npm install
npm run build
npm run migrate  # runs schema.sql
npm start
```

### Health Endpoint
GET /health returns { status: ok, version, timestamp, masterKillSwitch }

### API Versioning
/api/v1/ for future versioning - currently /api/

## Database - PostgreSQL (Neon/Supabase)

### Provider
- Neon: serverless PostgreSQL, free tier, branching
- Supabase: PostgreSQL + auth + storage (we use R2 for storage though)
- Self-hosted: on Render/Railway

### Migration
```
psql $DATABASE_URL -f backend/src/database/schema.sql
```
Or via backend migrate script.

### Indexes
Already in schema.sql: idx_users_email, idx_projects_user, etc.

### Backups
- Neon: automatic daily backups
- Manual: pg_dump

## Storage - Cloudflare R2

### Create Bucket
- Dashboard → R2 → Create bucket: ai-story-studio-prod
- Location: automatic
- Public access: custom domain or R2.dev subdomain for public assets

### S3 Compatible API
- Use R2_ACCOUNT_ID, ACCESS_KEY, SECRET_KEY
- Endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
- SDK: aws-sdk S3 client with endpoint override

### CORS
- Allow frontend domain for uploads
- Allow GET for public assets

### Signed URLs
- For private assets, generate signed URLs with expiry (1 hour)

## Queue - Redis + BullMQ

### Redis Provider
- Upstash: serverless Redis, free tier
- Render: Redis addon
- Self-hosted: Docker redis:alpine

### BullMQ
- Workers: separate process or same backend
- Concurrency: 5 for AI, 10 for notifications
- Dashboard: bull-board for monitoring

### Worker with FFmpeg
- Dockerfile must include ffmpeg:
```dockerfile
FROM node:20
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## Environment Configuration
- Development: .env with localhost URLs, mock keys
- Production: environment variables in hosting dashboard, real keys
- Only .env.example committed, never .env

## CORS
- Backend cors origin: [FRONTEND_URL, https://aistorystudio.com]
- Credentials: true
- Methods: GET, POST, PUT, DELETE

## Domain Configuration
- Frontend: aistorystudio.com → Cloudflare Pages
- Backend: api.aistorystudio.com → Render/Railway
- R2 public: assets.aistorystudio.com or pub-xxx.r2.dev

## Logging
- Winston: structured JSON logs
- Request logging: method, path, status, duration
- Error logging: stack traces (not exposed to user)
- In production: send to log aggregator (Logtail, Datadog)

## Backups
- Database: daily automatic + manual pg_dump before migrations
- R2: versioning enabled
- Code: GitHub

## Deployment Documentation
- This file
- docs/API.md
- docs/SECURITY_AUDIT.md
- README.md with quick start
