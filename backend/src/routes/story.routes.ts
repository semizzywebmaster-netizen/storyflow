import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.use(authenticate)

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.body ?? {}

    if (!projectId) {
      return next(createError('projectId is required', 400))
    }

    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [projectId, req.user!.id]
    )

    if (project.rows.length === 0) {
      return next(createError('Project not found', 404))
    }

    return next(createError('Story generation service is not configured', 501))
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT s.*
       FROM stories s
       INNER JOIN projects p ON p.id = s.project_id
       WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL
       LIMIT 1`,
      [req.params.id, req.user!.id]
    )

    if (result.rows.length === 0) {
      return next(createError('Story not found', 404))
    }

    return res.json({ success: true, data: result.rows[0] })
  } catch (error) {
    next(error)
  }
})

export const storyRoutes = router
