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
    const { projectId, storyId, title, sceneIndex, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))

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
      `INSERT INTO scenes
       (project_id, story_id, scene_index, title, location, time_of_day, action, dialogue, narration, emotion, camera_angle, visual_style, visual_prompt, duration_seconds, transition)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [projectId, storyId ?? null, sceneIndex ?? 0, title ?? null, location ?? null, timeOfDay ?? null, action ?? null, dialogue ?? null, narration ?? null, emotion ?? null, cameraAngle ?? null, visualStyle ?? null, visualPrompt ?? null, durationSeconds ?? 10, transition ?? null]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const sceneRoutes = router
