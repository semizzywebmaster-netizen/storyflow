# AI STORY STUDIO - Professional AI Story-to-Video SaaS

> IDEA → STORY → CHARACTERS → SCENES → IMAGES → VOICE → MUSIC/SFX → VIDEO → SUBTITLES → THUMBNAIL → SOCIAL MEDIA CONTENT

Production-grade SaaS platform for AI content creation.

## Tech Stack

**Frontend:** React 18 + Vite + TypeScript, Tailwind CSS, React Router, Zustand, PWA.

**Backend:** Node.js + Express + TypeScript, PostgreSQL, Cloudflare R2, FFmpeg, AI Provider Router.

## Production Architecture

The frontend can be deployed as static assets. The complete backend requires a persistent Node.js runtime, PostgreSQL, Cloudflare R2, configured AI/payment providers, and FFmpeg. A static-only frontend host cannot run the complete backend/video workload.

Recommended split-origin setup:

- Frontend: `https://storyfoundry.online`
- API: `https://api.storyfoundry.online`

Alternatively, use a reverse proxy so `/api/*` on the frontend origin routes to the Node backend.

## Production Deployment

1. Configure production environment variables from `backend/.env.example`.
2. Set frontend `VITE_API_URL` to the public API base, such as `https://api.storyfoundry.online/api` for split-origin deployment.
3. Keep all AI, database, R2 and payment secrets server-side; never put them in `VITE_*` variables.
4. Set `ENABLE_MOCK=false` on the backend and frontend.
5. Build and deploy the backend with FFmpeg available.
6. Run `npm run migrate:prod` from the backend release before serving traffic.
7. Verify `GET /health` returns HTTP 200.
8. Configure HTTPS and the payment webhook endpoints under `/api/payments/webhook/*`.
9. Test authentication, project ownership, credits, R2, AI generation, payments and video rendering before live launch.

The production Dockerfile installs FFmpeg, runs the application as a non-root user, and includes database migration SQL files. The migration runner uses a PostgreSQL advisory transaction lock to protect concurrent deployments.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Service Layer

```text
authService
projectService
storyService
characterService
sceneService
imageService
voiceService
videoService
creditService
walletService
paymentService
notificationService
adminService
analyticsService
```

## Launch Policy

CI passing confirms the code builds; it does not prove that external production credentials, domains, databases, payment webhooks, AI providers, R2 or FFmpeg are configured. Those integrations must be verified separately before launch.
