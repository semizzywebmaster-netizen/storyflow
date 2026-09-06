
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { couponService } from '../services/couponService'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.post('/validate', authenticate as any, async (req: any, res, next) => {
  try {
    const { code, plan, amount, type } = req.body
    if (!code) throw createError('Coupon code required', 400)
    const result = await couponService.validateCoupon(code, req.user.id, { plan, amount, type })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/redeem', authenticate as any, async (req: any, res, next) => {
  try {
    const { code, amount, plan, paymentReference, idempotencyKey } = req.body
    if (!code) throw createError('Coupon code required', 400)
    const result = await couponService.redeemCoupon(code, req.user.id, { amount, plan, paymentReference, idempotencyKey })
    res.json({ success: true, message: 'Coupon redeemed', data: result })
  } catch (err) { next(err) }
})

router.get('/history', authenticate as any, async (req: any, res, next) => {
  try {
    const history = await couponService.getRedemptionHistory(req.user.id)
    res.json({ success: true, data: history })
  } catch (err) { next(err) }
})

// Admin
router.post('/admin/create', authenticate as any, authorize('SUPER_ADMIN', 'FINANCE_MANAGER') as any, async (req: any, res, next) => {
  try {
    const coupon = await couponService.createCoupon({ ...req.body, createdBy: req.user.id })
    res.json({ success: true, data: coupon })
  } catch (err) { next(err) }
})

router.get('/admin/analytics', authenticate as any, authorize('SUPER_ADMIN', 'FINANCE_MANAGER') as any, async (req, res, next) => {
  try {
    const analytics = await couponService.getAnalytics()
    res.json({ success: true, data: analytics })
  } catch (err) { next(err) }
})

export const couponRoutes = router
