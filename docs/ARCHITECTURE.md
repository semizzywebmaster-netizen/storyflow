# AI Story Studio - Architecture Blueprint (Phase 00)

## Overview
Production-grade AI Story-to-Video SaaS platform transforming IDEA → STORY → CHARACTERS → SCENES → IMAGES → VOICE → MUSIC/SFX → VIDEO → SUBTITLES → THUMBNAIL → SOCIAL MEDIA CONTENT

## Frontend First Strategy
Build entire frontend with mock services, then replace with real backend without UI rewrite.

## Service Abstraction
All domain logic goes through service interfaces:

```
src/services/interfaces/index.ts
  - IAuthService
  - IProjectService
  - IStoryService
  - ICharacterService
  - ISceneService
  - IImageService
  - IVoiceService
  - IVideoService
  - ICreditService
  - IWalletService
  - IPaymentService
  - INotificationService
  - IAdminService
  - IAnalyticsService
```

Implementation:
- `src/services/mock/*` - Mock services (Phase 00-50)
- `src/services/api/*` - Real API services (Phase 71+)

Factory: `src/services/index.ts` - `getAuthService()`, `getProjectService()`, etc.

## API Client
`src/lib/api-client.ts`
- Centralized fetch wrapper
- Auth token injection
- Mock router integration when VITE_ENABLE_MOCK=true
- Latency simulation for realism

## Mock Router
`src/services/mock/mockRouter.ts`
- Intercepts API calls in mock mode
- Returns realistic data
- Will be bypassed when real backend connects

## Config
`src/config/index.ts` - Central app config
`src/config/features.ts` - Feature flags with plan access, credit cost, kill switch

## State Management
Zustand stores:
- `authStore` - Authentication state, persisted
- `projectStore` - Projects & current project
- `uiStore` - Sidebar, toasts, theme

## Routing
`src/router/index.tsx` - createBrowserRouter with placeholder pages for future phases
- Home (Phase 02)
- Auth (Phase 03)
- Dashboard (Phase 04)
- Projects (Phase 05)
- Studio modules (Phase 06-26)

## Design System
`src/components/ui/` - Primitives: Button, Card, Input, Badge, Skeleton, Toast
- Studio gradient branding
- Dark mode default (premium studio feel)
- Responsive, accessible
- Tailwind CSS 3.4

## PWA
vite-plugin-pwa configured with manifest and workbox caching

## Database Blueprint (PostgreSQL) - Progressive Implementation
See main prompt section 19 for full table list. Phase 00 only documents, does not create tables.

Core domains:
- Authentication: users, roles, permissions, sessions
- Workspace: workspaces, teams
- Creative: projects, stories, characters, scenes, assets
- AI: generations, providers, voices
- Editing: timelines, subtitles, exports
- Monetization: credits, wallets, subscriptions, payments
- Platform: features, settings
- Marketing: coupons, announcements, ads
- Communication: notifications, email, whatsapp

## Security Principles
- No secrets in frontend
- VITE_ prefix only for safe public vars
- API keys backend only
- RBAC planned
- Audit logs planned

## Zero-Cost MVP Infrastructure
- Frontend: Cloudflare Pages
- Backend: Free/low-cost Node host
- DB: PostgreSQL (Neon/Supabase free tier)
- Storage: Cloudflare R2
- Video: FFmpeg

Migration-friendly to VPS/cPanel later.

## Next Phases
- Phase 01: Design System & UI Foundation
- Phase 02: Landing Page
- Phase 03: Authentication UI
- ...
- Phase 51-70: Backend
- Phase 71-82: Integration & Launch
