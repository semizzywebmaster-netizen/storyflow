
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { marketplaceService } from '../services/marketplaceService'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.get('/items', async (req, res, next) => {
  try {
    const items = await marketplaceService.getItems(req.query as any)
    res.json({ success: true, data: items })
  } catch (err) { next(err) }
})

router.post('/purchase', authenticate as any, async (req: any, res, next) => {
  try {
    const { itemId, paymentReference, idempotencyKey, paymentProvider } = req.body
    if (!itemId || !paymentReference || !idempotencyKey) throw createError('itemId, paymentReference, idempotencyKey required', 400)
    const result = await marketplaceService.purchaseItem(req.user.id, itemId, { paymentReference, idempotencyKey, paymentProvider: paymentProvider || 'PAYSTACK' })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.get('/my-purchases', authenticate as any, async (req: any, res, next) => {
  try {
    const purchases = await marketplaceService.getUserPurchases(req.user.id)
    res.json({ success: true, data: purchases })
  } catch (err) { next(err) }
})

router.post('/listings', authenticate as any, async (req: any, res, next) => {
  try {
    const listing = await marketplaceService.createListing(req.user.id, req.body)
    res.json({ success: true, data: listing })
  } catch (err) { next(err) }
})

// Admin moderation
router.post('/admin/:id/moderate', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req: any, res, next) => {
  try {
    const result = await marketplaceService.moderateItem(req.params.id, req.user.id, req.body.action, req.body.reason)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

export const marketplaceRoutes = router
