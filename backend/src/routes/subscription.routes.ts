import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.get('/plans', async (_req, res, next) => {
  try {
    const result = await query(`SELECT id,name,display_name AS "displayName",price_monthly AS "priceMonthly",price_yearly AS "priceYearly",credits_monthly AS "creditsMonthly",features,limits FROM subscription_plans WHERE is_active=TRUE ORDER BY price_monthly ASC NULLS FIRST`)
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.get('/current', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT s.*, p.name AS plan, p.display_name AS "displayName", p.features, p.limits FROM subscriptions s INNER JOIN subscription_plans p ON p.id=s.plan_id WHERE s.user_id=$1 AND s.status='ACTIVE' ORDER BY s.current_period_end DESC NULLS LAST LIMIT 1`, [req.user!.id])
    if (!result.rows.length) return res.json({ success: true, data: { plan: 'FREE', status: 'ACTIVE', expiresAt: null } })
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.post('/upgrade', authenticate, async (_req: AuthRequest, _res, next) => {
  return next(createError('Subscription checkout is not yet enabled. Use the payment flow after a plan checkout is created.', 501))
})

export const subscriptionRoutes = router
