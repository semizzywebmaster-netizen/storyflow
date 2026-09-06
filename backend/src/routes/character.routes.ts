import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate)

router.get('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT c.* FROM characters c
       INNER JOIN projects p ON p.id = c.project_id
       WHERE c.project_id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL
       ORDER BY c.created_at ASC`,
      [req.params.projectId, req.user!.id]
    )
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, name, description, traits, appearance } = req.body ?? {}
    if (!projectId || !name?.trim()) return next(createError('projectId and name are required', 400))

    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [projectId, req.user!.id]
    )
    if (project.rows.length === 0) return next(createError('Project not found', 404))

    const result = await query(
      `INSERT INTO characters (project_id, name, description, traits, appearance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [projectId, name.trim(), description ?? null, traits ?? null, appearance ?? null]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.put('/:id/lock', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `UPDATE characters c SET is_locked = TRUE, updated_at = NOW()
       FROM projects p
       WHERE c.id = $1 AND c.project_id = p.id AND p.user_id = $2 AND p.deleted_at IS NULL
       RETURNING c.*`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Character not found', 404))
    return res.json({ success: true, message: 'Character locked', data: result.rows[0] })
  } catch (error) { next(error) }
})

export const characterRoutes = router
