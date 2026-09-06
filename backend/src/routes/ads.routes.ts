
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { adsService } from '../services/adsService'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.get('/for-me', authenticate as any, async (req: any, res, next) => {
  try {
    const { placement = 'all' } = req.query
    const ads = await adsService.getAdsForUser(req.user.id, req.user.plan || 'FREE', placement)
    res.json({ success: true, data: ads })
  } catch (err) { next(err) }
})

router.post('/:id/impression', authenticate as any, async (req: any, res, next) => {
  try {
    const { placement } = req.body
    await adsService.trackImpression(req.params.id, req.user.id, placement || 'unknown')
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.post('/:id/click', authenticate as any, async (req: any, res, next) => {
  try {
    const { placement } = req.body
    await adsService.trackClick(req.params.id, req.user.id, placement || 'unknown')
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.post('/rewarded/claim', authenticate as any, async (req: any, res, next) => {
  try {
    const { adId, verificationToken, idempotencyKey } = req.body
    if (!adId || !verificationToken) throw createError('adId and verificationToken required', 400)
    const result = await adsService.claimRewardedAd(req.user.id, adId, verificationToken, idempotencyKey)
    res.json({ success: true, message: `+${result.creditsAdded} credits added!`, data: result })
  } catch (err) { next(err) }
})

// Admin
router.post('/admin/campaign', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req: any, res, next) => {
  try {
    const campaign = await adsService.createCampaign({ ...req.body, createdBy: req.user.id })
    res.json({ success: true, data: campaign })
  } catch (err) { next(err) }
})

router.get('/admin/analytics', authenticate as any, authorize('SUPER_ADMIN') as any, async (req, res, next) => {
  try {
    const analytics = await adsService.getAnalytics()
    res.json({ success: true, data: analytics })
  } catch (err) { next(err) }
})

export const adsRoutes = router
