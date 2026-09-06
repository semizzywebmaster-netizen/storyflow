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

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT s.* FROM scenes s
       INNER JOIN projects p ON p.id = s.project_id
       WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Scene not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, storyId, title, sceneIndex, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (sceneIndex !== undefined && (!Number.isInteger(Number(sceneIndex)) || Number(sceneIndex) < 0)) return next(createError('sceneIndex must be a non-negative integer', 400))
    if (durationSeconds !== undefined && (!Number.isFinite(Number(durationSeconds)) || Number(durationSeconds) <= 0)) return next(createError('durationSeconds must be greater than 0', 400))

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
  } catch (error: any) {
    if (error?.code === '23505') return next(createError('A scene with this sceneIndex already exists in the project', 409))
    next(error)
  }
})

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { title, sceneIndex, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition, status } = req.body ?? {}
    if (sceneIndex !== undefined && (!Number.isInteger(Number(sceneIndex)) || Number(sceneIndex) < 0)) return next(createError('sceneIndex must be a non-negative integer', 400))
    if (durationSeconds !== undefined && (!Number.isFinite(Number(durationSeconds)) || Number(durationSeconds) <= 0)) return next(createError('durationSeconds must be greater than 0', 400))
    const allowedStatus = ['DRAFT', 'READY', 'GENERATING', 'COMPLETED', 'FAILED']
    if (status !== undefined && !allowedStatus.includes(String(status))) return next(createError('Invalid scene status', 400))

    const result = await query(
      `UPDATE scenes s SET
        title = COALESCE($1, s.title), scene_index = COALESCE($2, s.scene_index), location = COALESCE($3, s.location),
        time_of_day = COALESCE($4, s.time_of_day), action = COALESCE($5, s.action), dialogue = COALESCE($6, s.dialogue),
        narration = COALESCE($7, s.narration), emotion = COALESCE($8, s.emotion), camera_angle = COALESCE($9, s.camera_angle),
        visual_style = COALESCE($10, s.visual_style), visual_prompt = COALESCE($11, s.visual_prompt),
        duration_seconds = COALESCE($12, s.duration_seconds), transition = COALESCE($13, s.transition),
        status = COALESCE($14, s.status), updated_at = NOW()
       FROM projects p
       WHERE s.id = $15 AND s.project_id = p.id AND p.user_id = $16 AND p.deleted_at IS NULL
       RETURNING s.*`,
      [title, sceneIndex, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition, status, req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Scene not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    if (error?.code === '23505') return next(createError('A scene with this sceneIndex already exists in the project', 409))
    next(error)
  }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `DELETE FROM scenes s USING projects p
       WHERE s.id = $1 AND s.project_id = p.id AND p.user_id = $2 AND p.deleted_at IS NULL
       RETURNING s.id`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Scene not found', 404))
    return res.json({ success: true, message: 'Scene deleted' })
  } catch (error) { next(error) }
})

export const sceneRoutes = router
