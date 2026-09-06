# AI STORY STUDIO - Professional AI Story-to-Video SaaS

> IDEA → STORY → CHARACTERS → SCENES → IMAGES → VOICE → MUSIC/SFX → VIDEO → SUBTITLES → THUMBNAIL → SOCIAL MEDIA CONTENT

Production-grade SaaS platform for AI content creation.

## Phase Status

- ✅ PHASE 00 - Architecture & Foundation (Current)

## Tech Stack

**Frontend:**
- React 18 + Vite 4 + TypeScript 5
- Tailwind CSS 3.4
- React Router 6
- Zustand
- PWA (vite-plugin-pwa)
- Modular service abstraction

**Target Backend:**
- Node.js + Express + TypeScript
- PostgreSQL
- Cloudflare R2
- FFmpeg
- AI Provider Router

## Architecture Principles

1. **Frontend First** - Build entire frontend with mock services
2. **Service Abstraction** - No direct AI provider coupling
3. **Migration Friendly** - Free tier now, VPS later
4. **Production Grade** - Not a demo
5. **Zero-Cost MVP** - Cloudflare Pages + free tier services

## Service Layer

```
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

## Folder Structure

```
src/
  components/
    ui/           # Design system primitives
    layout/       # Layout components
    features/     # Feature modules
  config/         # Centralized config + feature flags
  services/
    interfaces/   # Service contracts
    mock/         # Mock implementations
    api/          # Real API implementations (later)
  types/          # Global TypeScript interfaces
  lib/            # Utilities
  hooks/          # Custom hooks
  stores/         # Zustand stores
  router/         # Routing config
  pages/          # Route components
  assets/
  styles/
```

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and fill values.

Only `VITE_` prefixed vars are exposed to frontend.

## Commit Convention

```
phase-00-architecture
phase-01-design-system
phase-02-landing-page
...
```
