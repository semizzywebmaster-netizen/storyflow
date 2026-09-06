
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { subscriptionService } from '../services/subscriptionService'
import { createError } from '../middleware/errorHandler'

const router = Router()

// Public - get plans
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await subscriptionService.getPlans()
    res.json({ success: true, data: plans })
  } catch (err) { next(err) }
})

// Protected routes
router.get('/current', authenticate as any, async (req: any, res, next) => {
  try {
    const sub = await subscriptionService.getCurrentSubscription(req.user.id)
    res.json({ success: true, data: sub })
  } catch (err) { next(err) }
})

router.post('/upgrade', authenticate as any, async (req: any, res, next) => {
  try {
    const { plan, idempotencyKey } = req.body
    if (!plan) throw createError('Plan required', 400)
    const result = await subscriptionService.upgradeSubscription(req.user.id, plan, idempotencyKey)
    res.json({ success: true, message: `Upgraded to ${plan}`, data: result })
  } catch (err) { next(err) }
})

router.post('/downgrade', authenticate as any, async (req: any, res, next) => {
  try {
    const { plan, idempotencyKey } = req.body
    if (!plan) throw createError('Plan required', 400)
    const result = await subscriptionService.downgradeSubscription(req.user.id, plan, idempotencyKey)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/cancel', authenticate as any, async (req: any, res, next) => {
  try {
    const result = await subscriptionService.cancelSubscription(req.user.id)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/create', authenticate as any, async (req: any, res, next) => {
  try {
    const { plan, idempotencyKey, paymentReference } = req.body
    if (!plan) throw createError('Plan required', 400)
    const result = await subscriptionService.createSubscription(req.user.id, plan, { idempotencyKey, paymentReference })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.get('/features/:featureKey/check', authenticate as any, async (req: any, res, next) => {
  try {
    const hasAccess = await subscriptionService.checkFeatureAccess(req.user.id, req.params.featureKey)
    res.json({ success: true, data: { hasAccess, feature: req.params.featureKey } })
  } catch (err) { next(err) }
})

export const subscriptionRoutes = router
