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
    const { projectId, name, role, age, gender, appearance, personality, background, clothingStyle, skinTone, hairStyle } = req.body ?? {}
    if (!projectId || !name?.trim()) return next(createError('projectId and name are required', 400))

    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [projectId, req.user!.id]
    )
    if (project.rows.length === 0) return next(createError('Project not found', 404))

    const result = await query(
      `INSERT INTO characters
       (project_id, name, role, age, gender, appearance, personality, background, clothing_style, skin_tone, hair_style)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [projectId, name.trim(), role ?? null, age ?? null, gender ?? null, appearance ?? null, personality ?? null, background ?? null, clothingStyle ?? null, skinTone ?? null, hairStyle ?? null]
    )
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { name, role, age, gender, appearance, personality, background, clothingStyle, skinTone, hairStyle } = req.body ?? {}
    if (name !== undefined && !String(name).trim()) return next(createError('name cannot be empty', 400))

    const result = await query(
      `UPDATE characters c SET
        name = COALESCE($1, c.name), role = COALESCE($2, c.role), age = COALESCE($3, c.age),
        gender = COALESCE($4, c.gender), appearance = COALESCE($5, c.appearance),
        personality = COALESCE($6, c.personality), background = COALESCE($7, c.background),
        clothing_style = COALESCE($8, c.clothing_style), skin_tone = COALESCE($9, c.skin_tone),
        hair_style = COALESCE($10, c.hair_style), updated_at = NOW()
       FROM projects p
       WHERE c.id = $11 AND c.project_id = p.id AND p.user_id = $12
         AND p.deleted_at IS NULL AND c.is_locked = FALSE
       RETURNING c.*`,
      [name !== undefined ? String(name).trim() : null, role, age, gender, appearance, personality, background, clothingStyle, skinTone, hairStyle, req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Character not found or locked', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `DELETE FROM characters c USING projects p
       WHERE c.id = $1 AND c.project_id = p.id AND p.user_id = $2
         AND p.deleted_at IS NULL AND c.is_locked = FALSE
       RETURNING c.id`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Character not found or locked', 404))
    return res.json({ success: true, message: 'Character deleted' })
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
