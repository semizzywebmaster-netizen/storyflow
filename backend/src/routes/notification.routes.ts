import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [req.user!.id])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.put('/:id/read', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2 RETURNING *`, [req.params.id, req.user!.id])
    if (!result.rows.length) return next(createError('Notification not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.get('/preferences', async (_req: AuthRequest, _res, next) => next(createError('Notification preferences are not configured yet', 501)))

export const notificationRoutes = router
