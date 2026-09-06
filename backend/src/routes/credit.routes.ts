import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { creditService } from '../services/creditService'

const router = Router()
router.use(authenticate as any)

router.get('/balance', async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).user!.id
    const balance = await creditService.getBalance(userId)
    const usage = await query(`SELECT COALESCE(SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END), 0) AS used_this_month FROM credit_transactions WHERE user_id = $1 AND created_at >= date_trunc('month', NOW())`, [userId])
    res.json({ success: true, data: { balance, usedThisMonth: Number(usage.rows[0]?.used_this_month || 0) } })
  } catch (error) { next(error) }
})

router.get('/history', async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).user!.id
    const rawLimit = Number(req.query.limit ?? 50)
    const history = await creditService.getHistory(userId, Number.isFinite(rawLimit) ? rawLimit : 50)
    res.json({ success: true, data: history })
  } catch (error) { next(error) }
})

router.post('/purchase', async (_req, res) => {
  res.status(501).json({ success: false, message: 'Credit purchases are not configured yet. Use the payment flow once payment integration is enabled.' })
})

export const creditRoutes = router
