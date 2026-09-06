import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { config } from '../config'
import { storageService } from '../services/storageService'

const router = Router()
router.use(authenticate)

function trustedStorageKeyFromUrl(value: string): string | null {
  try {
    const assetUrl = new URL(value)
    const publicBase = new URL(config.r2.publicUrl)
    const basePath = publicBase.pathname.replace(/\/$/, '')
    if (assetUrl.protocol !== 'https:' || assetUrl.origin !== publicBase.origin) return null
    if (!assetUrl.pathname.startsWith(`${basePath}/`)) return null
    const key = decodeURIComponent(assetUrl.pathname.slice(basePath.length + 1))
    return key || null
  } catch {
    return null
  }
}

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.query
    const result = await query(`SELECT a.* FROM assets a LEFT JOIN projects p ON p.id = a.project_id WHERE a.user_id = $1 AND a.deleted_at IS NULL AND ($2::uuid IS NULL OR (a.project_id = $2::uuid AND p.user_id = $1 AND p.deleted_at IS NULL)) ORDER BY a.created_at DESC`, [req.user!.id, projectId ?? null])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.get('/:id/signed-url', async (req: AuthRequest, res, next) => {
  try {
    const result = await query('SELECT id,url,metadata FROM assets WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL LIMIT 1', [req.params.id, req.user!.id])
    if (!result.rows.length) return next(createError('Asset not found', 404))
    const asset = result.rows[0]
    const metadataKey = typeof asset.metadata?.storageKey === 'string' ? asset.metadata.storageKey : null
    const key = metadataKey || trustedStorageKeyFromUrl(asset.url)
    if (!key) return next(createError('Asset does not reference a trusted StoryFlow storage object', 400))
    const expiresInRaw = Number(req.query.expiresIn ?? 3600)
    const expiresIn = Number.isFinite(expiresInRaw) ? Math.min(Math.max(Math.floor(expiresInRaw), 60), 3600) : 3600
    const signedUrl = await storageService.getSignedUrl(key, expiresIn)
    return res.json({ success: true, data: { signedUrl, expiresIn } })
  } catch (error) { next(error) }
})

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query('SELECT * FROM assets WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL LIMIT 1', [req.params.id, req.user!.id])
    if (!result.rows.length) return next(createError('Asset not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query('UPDATE assets SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id', [req.params.id, req.user!.id])
    if (!result.rows.length) return next(createError('Asset not found', 404))
    return res.json({ success: true, message: 'Asset deleted successfully' })
  } catch (error) { next(error) }
})

router.post('/upload', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, sceneId, type, url, thumbnailUrl, fileSize, mimeType, width, height, durationSeconds, prompt, model, metadata } = req.body ?? {}
    if (!url || !type) return next(createError('url and type are required', 400))
    if (!trustedStorageKeyFromUrl(String(url))) return next(createError('Asset URL must reference a StoryFlow R2 storage object', 400))
    if (thumbnailUrl && !trustedStorageKeyFromUrl(String(thumbnailUrl))) return next(createError('thumbnailUrl must reference a StoryFlow R2 storage object', 400))
    if (projectId) { const project = await query('SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id]); if (!project.rows.length) return next(createError('Project not found', 404)) }
    if (sceneId) { const scene = await query('SELECT s.id FROM scenes s INNER JOIN projects p ON p.id = s.project_id WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL', [sceneId, req.user!.id]); if (!scene.rows.length) return next(createError('Scene not found', 404)) }
    const safeMetadata = { ...(metadata && typeof metadata === 'object' ? metadata : {}), storageKey: trustedStorageKeyFromUrl(String(url)) }
    const result = await query(`INSERT INTO assets (user_id, project_id, scene_id, type, url, thumbnail_url, file_size, mime_type, width, height, duration_seconds, prompt, model, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`, [req.user!.id, projectId ?? null, sceneId ?? null, type, url, thumbnailUrl ?? null, fileSize ?? null, mimeType ?? null, width ?? null, height ?? null, durationSeconds ?? null, prompt ?? null, model ?? null, JSON.stringify(safeMetadata)])
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const assetRoutes = router
