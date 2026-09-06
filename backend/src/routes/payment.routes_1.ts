
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { paymentService } from '../services/paymentService'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.post('/verify', authenticate as any, async (req: any, res, next) => {
  try {
    const { reference, provider } = req.body
    if (!reference) throw createError('Reference required', 400)
    
    let result
    if (provider === 'FLUTTERWAVE') {
      result = await paymentService.verifyFlutterwavePayment(reference)
    } else {
      result = await paymentService.verifyPaystackPayment(reference)
    }
    
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/webhook/paystack', async (req, res, next) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string
    await paymentService.handlePaystackWebhook(req.body, signature)
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.post('/webhook/flutterwave', async (req, res, next) => {
  try {
    const signature = req.headers['verif-hash'] as string || req.headers['x-flutterwave-signature'] as string
    await paymentService.handleFlutterwaveWebhook(req.body, signature)
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.post('/fund-wallet', authenticate as any, async (req: any, res, next) => {
  try {
    const { amount, provider, reference, idempotencyKey } = req.body
    if (!amount || !reference || !idempotencyKey) throw createError('amount, reference, idempotencyKey required', 400)
    const result = await paymentService.fundWallet(req.user.id, amount, provider || 'PAYSTACK', reference, idempotencyKey)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.get('/history', authenticate as any, async (req: any, res, next) => {
  try {
    const { query } = await import('../database/connection')
    const result = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [req.user.id])
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
})

export const paymentRoutes = router
