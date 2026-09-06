import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate)

const allowedTypes = new Set(['story', 'character', 'image', 'voice', 'video', 'music', 'subtitle', 'thumbnail', 'social'])

router.post('/:type', aiRateLimiter, async (req: AuthRequest, res, next) => {
  try {
    const type = String(req.params.type).toLowerCase()
    if (!allowedTypes.has(type)) return next(createError('Unsupported generation type', 400))

    const { projectId, prompt } = req.body ?? {}
    if (projectId) {
      const project = await query(
        'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
        [projectId, req.user!.id]
      )
      if (project.rows.length === 0) return next(createError('Project not found', 404))
    }

    return next(createError('Generation service is not configured', 501))
  } catch (error) { next(error) }
})

router.get('/job/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM generations WHERE id = $1 AND user_id = $2 LIMIT 1',
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Generation job not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const generationRoutes = router
