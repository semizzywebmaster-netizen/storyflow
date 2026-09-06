import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { randomUUID } from 'crypto'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const wallet = await query(`SELECT balance, total_funded AS "totalFunded", total_spent AS "totalSpent" FROM wallets WHERE user_id = $1`, [req.user!.id])
    return res.json({ success: true, data: wallet.rows[0] || { balance: 0, totalFunded: 0, totalSpent: 0 } })
  } catch (error) { next(error) }
})

router.get('/transactions', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.user!.id])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/fund', async (_req: AuthRequest, _res, next) => {
  return next(createError('Use POST /api/payments/initialize to fund your wallet', 410))
})

export const walletRoutes = router
