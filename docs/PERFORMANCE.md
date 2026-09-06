
# Performance Optimization - Phase 77

## Frontend Optimizations

### Code Splitting
- Lazy routes: React.lazy for all studio pages
- Route-based chunks: Landing, Auth, Dashboard, Studio modules, Admin separate
- Component lazy: Heavy components (VideoEditor, ImageStudio) lazy loaded

### Bundle Size
- Vite manual chunks: vendor (react, router, zustand), ui (components), studio (heavy)
- Tree shaking: enabled
- Remove unused: Tailwind purge, dead code elimination

### Image Optimization
- R2 with CDN caching
- Responsive images: srcset for thumbnails
- WebP with JPEG fallback
- Lazy loading: IntersectionObserver for asset grid
- Thumbnail generation: server-side FFmpeg at multiple sizes

### Caching
- API: SWR-like caching in Zustand stores (5 min)
- Assets: R2 Cache-Control headers (1 year immutable for generated assets)
- Service worker: Cache-first for shell, network-first for API
- Browser: ETag, Last-Modified

### Rendering
- Virtualization: react-window for long lists (projects, assets, scenes)
- Memoization: React.memo for expensive components
- Debounce: search inputs (300ms)
- Throttle: scroll handlers

### API Calls
- Pagination: 20 items default, cursor-based for large lists
- Batching: Content Factory batch generation
- Deduplication: same request in flight deduplicated
- Retry: exponential backoff for failed AI jobs

## Backend Optimizations

### Database
- Indexes: all foreign keys, user_id, status, created_at, plan, type
- Connection pooling: pg Pool max 20, idle 30s
- Query efficiency: SELECT only needed columns, no SELECT *
- Slow query log: enabled, monitor >100ms
- Aggregation: daily aggregates materialized view for analytics
- Partitioning: analytics_events by month (future)

### Queue
- BullMQ: concurrency 5 for AI jobs, 10 for notifications
- Priority: Pro users higher priority
- Throughput: batch processing for Content Factory
- Retry: exponential backoff with max 3 attempts
- Dead letter: failed jobs logged, manual retry

### Caching
- Redis: provider health cache (5 min), user plan cache (1 min), feature flags cache
- In-memory: fallback when Redis unavailable

### Storage
- R2: multipart upload for large videos
- Signed URLs: cached, reuse until expiry
- CDN: Cloudflare CDN for R2 public bucket

### AI
- Queue expensive: video generation queued, not immediate
- Avoid duplicate: same prompt+user dedup check (1 hour)
- Retry intelligently: different provider on failure
- Fallback: Groq for text if OpenAI down
- Quota: enforce per-provider quota limits

## Metrics
- API latency target: <200ms for non-AI, <5s for AI queued
- DB query target: <50ms
- Frontend FCP: <1.5s, LCP: <2.5s
- Bundle size target: <500KB initial, <2MB total
