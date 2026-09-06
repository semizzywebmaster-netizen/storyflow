
# Security Audit - AI Story Studio (Phase 76)

## Authentication
- Password hashing: bcryptjs
- JWT: 7d expiry, secret from env
- Sessions stored hashed
- Rate limiting on auth (5 attempts/15min)
- Email verification required

## Authorization
- RBAC: Super Admin, AI Manager, Finance Manager, Content Manager, Moderator, Support
- Middleware: authenticate + authorize(...roles)
- Admin routes protected
- No privilege escalation

## Financial Security
- Wallet: NO WITHDRAWAL - enforced by no endpoint existing
- Credits: CHECK (credits >= 0) in DB
- Wallet: CHECK (balance >= 0)
- Transactions: PostgreSQL BEGIN/COMMIT with SELECT FOR UPDATE locking
- Idempotency: idempotency_key UNIQUE prevents duplicate payments
- Payments: Server-side verification only, never trust frontend
- Paystack/Flutterwave webhooks: signature verification + idempotency
- Immutable transaction history

## API Security
- Helmet.js: XSS, clickjacking protection
- CORS: Restricted to frontend URL only
- Rate limiting: Global 100/15min, AI 10/min
- Input validation: Zod schemas
- SQL injection: Parameterized queries only, no string concatenation
- XSS: No dangerouslySetInnerHTML with user data
- CSRF: SameSite cookies, JWT Bearer (not cookie auto-send)
- File uploads: Mime type + size validation, R2 signed URLs

## Storage Security
- Private R2 credentials never exposed to frontend
- Signed URLs with expiry for private assets
- No direct bucket access

## AI Security
- Master Kill Switch: System setting to disable all AI
- Provider API keys: Encrypted, server-side only
- No provider keys in frontend
- Fallback prevents single point of failure

## Audit
- audit_logs table for all admin actions
- IP + user agent logging
- Failed login attempts logged
