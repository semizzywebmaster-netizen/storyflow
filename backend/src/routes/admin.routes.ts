import { Router } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate as any, authorize('SUPER_ADMIN', 'ADMIN') as any)

router.get('/stats', async (_req: AuthRequest, res, next) => {
  try {
    const [users, revenue, jobs] = await Promise.all([
      query(`SELECT COUNT(*)::int AS count FROM users WHERE deleted_at IS NULL`),
      query(`SELECT COALESCE(SUM(amount),0)::numeric AS total FROM payments WHERE status='SUCCESS'`),
      query(`SELECT COUNT(*)::int AS count FROM generations`),
    ])
    return res.json({ success: true, data: { users: users.rows[0].count, revenue: Number(revenue.rows[0].total), aiJobs: jobs.rows[0].count } })
  } catch (error) { next(error) }
})

router.get('/features', async (_req, res, next) => {
  try {
    const result = await query(`SELECT * FROM features ORDER BY priority ASC, key ASC`)
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.put('/features/:key', async (req, res, next) => {
  try {
    if (typeof req.body?.isEnabled !== 'boolean') return next(createError('isEnabled must be boolean', 400))
    const result = await query(`UPDATE features SET is_enabled=$2, updated_at=NOW() WHERE key=$1 RETURNING *`, [req.params.key, req.body.isEnabled])
    if (!result.rows.length) return next(createError('Feature not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.post('/kill-switch', async (req: AuthRequest, res, next) => {
  try {
    if (typeof req.body?.enabled !== 'boolean') return next(createError('enabled must be boolean', 400))
    await query(`INSERT INTO system_settings (key,value,description,updated_by,updated_at) VALUES ('MASTER_AI_KILL_SWITCH',$1,'Global kill switch for all AI operations',$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by,updated_at=NOW()`, [JSON.stringify(req.body.enabled), req.user!.id])
    return res.json({ success: true, enabled: req.body.enabled })
  } catch (error) { next(error) }
})

router.get('/providers', async (_req, res, next) => {
  try {
    const result = await query(`SELECT id,name,type,is_enabled AS "isEnabled",priority,cost_per_unit AS "costPerUnit",quota_limit AS "quotaLimit",quota_used AS "quotaUsed",health_status AS "healthStatus",last_health_check AS "lastHealthCheck",metadata FROM ai_providers ORDER BY priority ASC,name ASC`)
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

export const adminRoutes = router
