
# AI Story Studio - Nigerian Stories

Production-ready full-stack SaaS platform for creating original Nigerian stories with AI.

## Stack
- Frontend: React 18, Vite 4, TypeScript, Tailwind, Zustand, PWA, React Router
- Backend: Node.js, Express, TypeScript, PostgreSQL, Redis, BullMQ, FFmpeg, Cloudflare R2
- Payments: Paystack, Flutterwave
- AI: OpenAI, Groq, Flux, ElevenLabs, Kling (via provider router with fallback)

## Quick Start

### Frontend
```bash
npm install
npm run dev
# http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with DATABASE_URL, JWT_SECRET, etc.
npm run dev
# http://localhost:5000
```

### Environment Variables

Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_MOCK=true # false for production
```

Backend (backend/.env):
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
FRONTEND_URL=http://localhost:5173
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=ai-story-studio
OPENAI_API_KEY=...
PAYSTACK_SECRET_KEY=...
# etc - see backend/.env.example
```

## Features
- Story generation with 14 cultural modes (Yoruba, Igbo, Hausa, Pidgin, etc.)
- Character Bible with Character Lock
- Scene Engine, AI Director, Story Doctor, Rewrite Studio
- Image, Voice (Nigerian), Music & SFX, Video Generation, Editor, Subtitles, Thumbnails, Social
- Content Factory, Series Builder, Auto-Clips, Content Agent, Viral Optimizer
- Brand Kit, Credits, Subscription, Wallet (platform-only), Payments, Coupons, Referrals
- Agency Workspaces, Marketplace, Analytics
- Admin: Dashboard, Feature Control, Provider Manager, Users, Finance
- PWA: Offline shell, installable on Android/iOS/Desktop

## Security
- No wallet withdrawal - enforced by no endpoint
- Server-side payment verification, never trust frontend
- Webhook signature verification + idempotency
- IDOR prevention, RBAC, rate limiting, upload validation, FFmpeg sanitization
- No secrets in frontend

## Docs
- docs/API.md - API documentation
- docs/SECURITY_AUDIT.md - Security audit
- docs/PERFORMANCE.md - Performance optimizations
- docs/PWA_AUDIT.md - PWA audit
- docs/DEPLOYMENT_PRODUCTION.md - Production deployment
- docs/FINAL_LAUNCH.md - Launch readiness

## Deployment
- Frontend: Cloudflare Pages
- Backend: Render/Railway with Docker (FFmpeg)
- DB: Neon/Supabase PostgreSQL
- Storage: Cloudflare R2
- Queue: Upstash Redis + BullMQ

## License
Proprietary - AI Story Studio
