
# API Documentation - AI Story Studio (Phase 54)

## Base URL
- Development: http://localhost:5000/api
- Production: https://api.aistorystudio.com/api

## Authentication
All endpoints except /auth/* require Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /auth/me

### Projects
- GET /projects
- POST /projects
- GET /projects/:id
- PUT /projects/:id
- DELETE /projects/:id

### Stories
- POST /stories/generate (AI, 5 credits, rate limited)
- GET /stories/:id

### Characters
- GET /characters/project/:projectId
- POST /characters
- PUT /characters/:id/lock

### Scenes
- GET /scenes/project/:projectId
- POST /scenes

### Assets
- GET /assets
- POST /assets/upload (R2, 100MB max)

### Generations
- POST /generations/:type (story,image,voice,video,music)
- GET /generations/job/:id

### Credits (Financial Safety)
- GET /credits/balance
- GET /credits/history
- POST /credits/reserve (transactional)
- POST /credits/consume
- POST /credits/release

### Wallet (No Withdrawal)
- GET /wallet
- GET /wallet/transactions
- POST /wallet/fund (initiates Paystack/Flutterwave)

### Payments (Server-side verification)
- POST /payments/verify
- POST /payments/webhook/paystack (idempotency)
- POST /payments/webhook/flutterwave
- GET /payments/history

### Subscriptions
- GET /subscriptions/plans
- GET /subscriptions/current
- POST /subscriptions/upgrade

### Admin (RBAC)
- GET /admin/stats
- GET /admin/features
- PUT /admin/features/:key
- POST /admin/kill-switch
- GET /admin/providers

### Notifications
- GET /notifications
- PUT /notifications/:id/read
- GET /notifications/preferences

### Analytics
- POST /analytics/event
- GET /analytics/dashboard

## Financial Safety
- All money operations use PostgreSQL transactions
- Idempotency keys prevent duplicate payments
- Wallet balance check: CHECK (balance >= 0)
- Credits check: CHECK (credits >= 0)
- Never trust frontend payment success
- Server-side verification via Paystack/Flutterwave APIs

## Rate Limiting
- Global: 100 req/15min
- AI: 10 req/min
- Auth: 5 req/15min

## Error Handling
All errors return:
```json
{ "success": false, "message": "Error description" }
```
No stack traces in production.
