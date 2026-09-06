import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.post('/event', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { eventType, eventData } = req.body ?? {}
    if (typeof eventType !== 'string' || !eventType.trim()) return next(createError('eventType is required', 400))
    const result = await query(`INSERT INTO analytics_events (user_id,event_type,event_data) VALUES ($1,$2,$3) RETURNING id,created_at`, [req.user!.id, eventType.trim(), eventData ?? {}])
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.get('/dashboard', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const [projects, generations, assets, credits] = await Promise.all([
      query(`SELECT COUNT(*)::int AS count FROM projects WHERE user_id=$1 AND deleted_at IS NULL`, [req.user!.id]),
      query(`SELECT COUNT(*)::int AS count FROM generations WHERE user_id=$1`, [req.user!.id]),
      query(`SELECT COUNT(*)::int AS count FROM assets WHERE user_id=$1 AND deleted_at IS NULL`, [req.user!.id]),
      query(`SELECT COALESCE(SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END),0)::int AS spent FROM credit_transactions WHERE user_id=$1 AND type='GENERATION'`, [req.user!.id]),
    ])
    return res.json({ success: true, data: { projects: projects.rows[0].count, generations: generations.rows[0].count, assets: assets.rows[0].count, creditsSpent: credits.rows[0].spent } })
  } catch (error) { next(error) }
})

export const analyticsRoutes = router
