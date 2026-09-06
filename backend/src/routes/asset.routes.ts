import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.query
    const result = await query(
      `SELECT a.* FROM assets a
       LEFT JOIN projects p ON p.id = a.project_id
       WHERE a.user_id = $1
         AND a.deleted_at IS NULL
         AND ($2::uuid IS NULL OR (a.project_id = $2::uuid AND p.user_id = $1 AND p.deleted_at IS NULL))
       ORDER BY a.created_at DESC`,
      [req.user!.id, projectId ?? null]
    )
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/upload', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, sceneId, type, url, thumbnailUrl, fileSize, mimeType, width, height, durationSeconds, prompt, model, metadata } = req.body ?? {}
    if (!url || !type) return next(createError('url and type are required', 400))

    if (projectId) {
      const project = await query(
        'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
        [projectId, req.user!.id]
      )
      if (project.rows.length === 0) return next(createError('Project not found', 404))
    }

    if (sceneId) {
      const scene = await query(
        `SELECT s.id FROM scenes s
         INNER JOIN projects p ON p.id = s.project_id
         WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL`,
        [sceneId, req.user!.id]
      )
      if (scene.rows.length === 0) return next(createError('Scene not found', 404))
    }

    const result = await query(
      `INSERT INTO assets
       (user_id, project_id, scene_id, type, url, thumbnail_url, file_size, mime_type, width, height, duration_seconds, prompt, model, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [req.user!.id, projectId ?? null, sceneId ?? null, type, url, thumbnailUrl ?? null, fileSize ?? null, mimeType ?? null, width ?? null, height ?? null, durationSeconds ?? null, prompt ?? null, model ?? null, metadata ?? {}]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const assetRoutes = router
