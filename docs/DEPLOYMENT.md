
# Deployment Guide - AI Story Studio (Phase 80)

## Initial Architecture

GitHub → Cloudflare Pages (Frontend) → Node Backend (Render/Railway) → PostgreSQL (Neon/Supabase) → Cloudflare R2 → Queue (Redis + BullMQ) → FFmpeg

## Frontend - Cloudflare Pages

1. Build: `npm run build` → dist/
2. Deploy dist/ to Cloudflare Pages
3. Environment variables: VITE_API_URL, VITE_ENABLE_MOCK=false
4. PWA: manifest + service worker included in build

## Backend - Render / Railway / VPS

1. Environment variables (NEVER commit secrets):
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
OPENAI_API_KEY=...
PAYSTACK_SECRET_KEY=...
FLW_SECRET_KEY=...
REDIS_URL=...
MASTER_AI_KILL_SWITCH=false
```

2. Build: `cd backend && npm install && npm run build`
3. Migrate: `npm run migrate` (runs schema.sql)
4. Start: `npm start`

## Database - PostgreSQL

- Provider: Neon, Supabase, or self-hosted
- Run schema.sql
- Indexes on all foreign keys
- Financial tables with CHECK constraints
- Immutable transaction history

## Storage - Cloudflare R2

- Create bucket: ai-story-studio
- S3 compatible API
- Signed URLs for private assets
- Cleanup cron for orphaned files

## Queue - Redis + BullMQ

- Redis for job queue
- BullMQ workers for AI processing
- FFmpeg installed on worker machines
- Auto-retry with exponential backoff

## Monitoring (Phase 81)

- Errors: Sentry
- API: Uptime monitoring
- Providers: Health checks
- Queue: BullMQ dashboard
- Payments: Paystack/Flutterwave dashboards
- Storage: R2 metrics
- Database: Slow query log

## Security Checklist (Phase 76)

- Helmet.js
- CORS restricted to frontend URL
- Rate limiting
- JWT with expiry
- RBAC for admin
- Input validation (Zod)
- No secrets in frontend
- Server-side payment verification
- No wallet withdrawal endpoints
- File upload validation
- SQL injection protected (parameterized queries)

## Post-Deployment

- Test auth flow
- Test AI generation with fallback
- Test payment verification (success/failure/duplicate webhook)
- Test PWA install on Android/iOS
- Verify master kill switch works
