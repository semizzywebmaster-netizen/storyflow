import { Router } from 'express'
import { query } from '../database/connection'
import { authenticate, AuthRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'

const router = Router()

// All project operations are scoped to the authenticated owner.
router.use(authenticate as any)

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, description, genre, cultural_mode, status, thumbnail_url, is_favorite, created_at, updated_at
       FROM projects WHERE user_id = $1 AND deleted_at IS NULL ORDER BY updated_at DESC`,
      [req.user!.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { title, description, genre, culturalMode, status, thumbnailUrl, metadata } = req.body
    if (!title || typeof title !== 'string' || !title.trim()) throw createError('Project title is required', 400)

    const result = await query(
      `INSERT INTO projects (user_id, title, description, genre, cultural_mode, status, thumbnail_url, metadata)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'DRAFT'), $7, COALESCE($8, '{}'))
       RETURNING id, title, description, genre, cultural_mode, status, thumbnail_url, metadata, created_at, updated_at`,
      [req.user!.id, title.trim(), description || null, genre || null, culturalMode || null, status || null, thumbnailUrl || null, metadata || {}]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) { next(err) }
})

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, description, genre, cultural_mode, status, thumbnail_url, metadata, is_favorite, created_at, updated_at
       FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) throw createError('Project not found', 404)
    res.json({ success: true, data: result.rows[0] })
  } catch (err) { next(err) }
})

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { title, description, genre, culturalMode, status, thumbnailUrl, metadata, isFavorite } = req.body
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) throw createError('Project title cannot be empty', 400)

    const result = await query(
      `UPDATE projects SET title = COALESCE($1, title), description = COALESCE($2, description),
       genre = COALESCE($3, genre), cultural_mode = COALESCE($4, cultural_mode), status = COALESCE($5, status),
       thumbnail_url = COALESCE($6, thumbnail_url), metadata = COALESCE($7, metadata),
       is_favorite = COALESCE($8, is_favorite), updated_at = NOW()
       WHERE id = $9 AND user_id = $10 AND deleted_at IS NULL
       RETURNING id, title, description, genre, cultural_mode, status, thumbnail_url, metadata, is_favorite, created_at, updated_at`,
      [title !== undefined ? title.trim() : null, description ?? null, genre ?? null, culturalMode ?? null,
       status ?? null, thumbnailUrl ?? null, metadata ?? null, isFavorite ?? null, req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) throw createError('Project not found', 404)
    res.json({ success: true, data: result.rows[0] })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `UPDATE projects SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) throw createError('Project not found', 404)
    res.json({ success: true, message: 'Project deleted' })
  } catch (err) { next(err) }
})

export const projectRoutes = router
