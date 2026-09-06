import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate)

router.get('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT s.* FROM scenes s
       INNER JOIN projects p ON p.id = s.project_id
       WHERE s.project_id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL
       ORDER BY s.scene_index ASC, s.created_at ASC`,
      [req.params.projectId, req.user!.id]
    )
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, storyId, title, description, sceneIndex, prompt } = req.body ?? {}
    if (!projectId || !title?.trim()) return next(createError('projectId and title are required', 400))

    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [projectId, req.user!.id]
    )
    if (project.rows.length === 0) return next(createError('Project not found', 404))

    if (storyId) {
      const story = await query(
        'SELECT id FROM stories WHERE id = $1 AND project_id = $2',
        [storyId, projectId]
      )
      if (story.rows.length === 0) return next(createError('Story not found', 404))
    }

    const result = await query(
      `INSERT INTO scenes (project_id, story_id, title, description, scene_index, prompt)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [projectId, storyId ?? null, title.trim(), description ?? null, sceneIndex ?? 0, prompt ?? null]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const sceneRoutes = router
