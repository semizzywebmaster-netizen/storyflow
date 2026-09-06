# Service Contracts - Frontend Abstraction

All UI components must use these interfaces via factory, never direct fetch.

## Example Usage (Future Phases)

```ts
import { getProjectService } from '@/services'

const projectService = await getProjectService()
const res = await projectService.list({ page: 1, search: 'Nigerian' })
if (res.success) setProjects(res.data.data)
```

## Credit System Frontend
- Show estimated cost before expensive ops
- Check sufficient credits
- Never allow negative balance (backend enforces)

## Wallet Rules
- Wallet money internal only
- No withdrawal UI ever
- Can pay for credits, subscriptions, generations
- Display balance, transactions

## Payment Verification
- Frontend initiates via Paystack/Flutterwave
- Backend verifies via webhook (idempotent)
- Never trust frontend success callback

## Notifications Architecture
EVENT → NOTIFICATION ENGINE → IN-APP, EMAIL, WHATSAPP, PUSH, SMS

## AI Provider Router (Backend - Phase 55)
USER REQUEST → ORCHESTRATOR → CAPABILITY CHECK → PLAN → CREDIT CHECK → PROVIDER HEALTH → QUOTA → COST → MODEL → PRIORITY → BEST PROVIDER → EXECUTE → FALLBACK

Admin controls provider, model, priority.

## Feature Flags
`src/config/features.ts` - Every feature has enabled, plans, creditCost, limits.
Admin will override via API in Phase 38.
MASTER AI KILL SWITCH blocks all AI when enabled.

## Subscription Plans
FREE: limited AI, watermark, ads, limited video
CREATOR: more credits, character lock, story doctor, AI director, voices, content factory, social packages, reduced watermark
PRO: advanced lock, series builder, auto-clips, content agent, premium models, priority queue, brand kit, analytics
AGENCY: team, client workspaces, brand kits, bulk, approval, API access, higher limits

All plan permissions controlled by Admin eventually.
