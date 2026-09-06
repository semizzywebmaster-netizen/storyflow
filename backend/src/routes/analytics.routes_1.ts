
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { analyticsService } from '../services/analyticsService'

const router = Router()

router.post('/event', async (req, res, next) => {
  try {
    const { eventType, eventData, userId } = req.body
    await analyticsService.trackEvent(userId || req.headers['x-user-id'] as string || null, eventType, eventData, req)
    res.json({ success: true, message: 'Event tracked' })
  } catch (err) { next(err) }
})

router.get('/dashboard', authenticate as any, authorize('SUPER_ADMIN', 'AI_MANAGER', 'FINANCE_MANAGER') as any, async (req, res, next) => {
  try {
    const metrics = await analyticsService.getDashboardMetrics()
    res.json({ success: true, data: metrics })
  } catch (err) { next(err) }
})

router.get('/providers', authenticate as any, authorize('SUPER_ADMIN', 'AI_MANAGER') as any, async (req, res, next) => {
  try {
    const usage = await analyticsService.getProviderUsage()
    res.json({ success: true, data: usage })
  } catch (err) { next(err) }
})

router.get('/features', authenticate as any, authorize('SUPER_ADMIN') as any, async (req, res, next) => {
  try {
    const usage = await analyticsService.getFeatureUsage()
    res.json({ success: true, data: usage })
  } catch (err) { next(err) }
})

router.get('/daily', authenticate as any, authorize('SUPER_ADMIN') as any, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    const aggregates = await analyticsService.getDailyAggregates(days)
    res.json({ success: true, data: aggregates })
  } catch (err) { next(err) }
})

export const analyticsRoutes = router
