import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { aiRateLimiter } from '../middleware/rateLimiter'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { creditService } from '../services/creditService'
import { storageService } from '../services/storageService'
import { config } from '../config'
import { randomUUID } from 'crypto'

const router = Router()
router.use(authenticate)

const VOICE_CREDIT_COST = 4
const MAX_TEXT = 40000

router.get('/voices', aiRateLimiter, async (_req: AuthRequest, res, next) => {
  try {
    if (!config.ai.elevenlabsApiKey) return next(createError('Voice provider is not configured', 503))
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': config.ai.elevenlabsApiKey },
      signal: AbortSignal.timeout(30000),
    })
    const body = await response.text()
    if (!response.ok) throw new Error(`ElevenLabs returned HTTP ${response.status}: ${body.slice(0, 500)}`)
    const payload = JSON.parse(body)
    const voices = Array.isArray(payload.voices) ? payload.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category ?? null,
      labels: voice.labels ?? {},
      previewUrl: voice.preview_url ?? null,
    })) : []
    return res.json({ success: true, data: voices })
  } catch (error) { next(error) }
})

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  let generationId: string | null = null
  try {
    const { projectId, sceneId, text, voiceId, modelId, languageCode } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (typeof text !== 'string' || text.trim().length < 1) return next(createError('text is required', 400))
    if (text.length > MAX_TEXT) return next(createError(`text cannot exceed ${MAX_TEXT} characters`, 400))
    if (typeof voiceId !== 'string' || !voiceId.trim()) return next(createError('voiceId is required', 400))
    if (!config.ai.elevenlabsApiKey) return next(createError('Voice provider is not configured', 503))

    const project = await query('SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id])
    if (!project.rows.length) return next(createError('Project not found', 404))

    if (sceneId) {
      const scene = await query(`SELECT s.id FROM scenes s INNER JOIN projects p ON p.id = s.project_id WHERE s.id = $1 AND s.project_id = $2 AND p.user_id = $3 AND p.deleted_at IS NULL`, [sceneId, projectId, req.user!.id])
      if (!scene.rows.length) return next(createError('Scene not found', 404))
    }

    const generation = await query(`INSERT INTO generations (user_id, project_id, type, prompt, provider, model, status, credits_reserved, metadata) VALUES ($1, $2, 'VOICE', $3, 'ELEVENLABS', $4, 'PENDING', $5, $6) RETURNING id`, [req.user!.id, projectId, text.trim(), modelId || 'eleven_multilingual_v2', VOICE_CREDIT_COST, JSON.stringify({ sceneId: sceneId ?? null, voiceId, languageCode: languageCode ?? null })])
    generationId = generation.rows[0].id

    await creditService.reserveCredits(req.user!.id, VOICE_CREDIT_COST, generationId, 'Voice generation')
    await query(`UPDATE generations SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`, [generationId])

    const params = new URLSearchParams({ output_format: 'mp3_44100_128' })
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?${params.toString()}`, {
      method: 'POST',
      headers: { 'xi-api-key': config.ai.elevenlabsApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), model_id: modelId || 'eleven_multilingual_v2', ...(languageCode ? { language_code: languageCode } : {}) }),
      signal: AbortSignal.timeout(120000),
    })
    const body = Buffer.from(await response.arrayBuffer())
    if (!response.ok) throw new Error(`ElevenLabs returned HTTP ${response.status}: ${body.toString('utf8').slice(0, 500)}`)
    if (!body.length) throw new Error('Voice provider returned empty audio')

    const key = `users/${req.user!.id}/projects/${projectId}/voice/${randomUUID()}.mp3`
    const stored = await storageService.uploadFile(body, key, 'audio/mpeg', { userId: req.user!.id, maxSize: 50 * 1024 * 1024 })
    const asset = await query(`INSERT INTO assets (user_id, project_id, scene_id, type, url, file_size, mime_type, prompt, model, metadata) VALUES ($1,$2,$3,'AUDIO',$4,$5,'audio/mpeg',$6,$7,$8) RETURNING *`, [req.user!.id, projectId, sceneId ?? null, stored.url, stored.size, text.trim(), modelId || 'eleven_multilingual_v2', JSON.stringify({ generationId, voiceId })])

    await creditService.consumeReservedCredits(req.user!.id, generationId)
    await query(`UPDATE generations SET status = 'COMPLETED', credits_consumed = credits_reserved, result_url = $2, updated_at = NOW() WHERE id = $1`, [generationId, stored.url])
    return res.status(201).json({ success: true, data: { generationId, asset: asset.rows[0] } })
  } catch (error: any) {
    if (generationId) {
      try {
        const generation = await query('SELECT credits_reserved, status FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user!.id])
        if (['PENDING', 'PROCESSING'].includes(generation.rows[0]?.status)) {
          await creditService.releaseReservedCredits(req.user!.id, Number(generation.rows[0].credits_reserved), generationId, 'Voice generation failed')
          await query(`UPDATE generations SET status = 'FAILED', error_message = $2, updated_at = NOW() WHERE id = $1`, [generationId, String(error?.message || 'Voice generation failed').slice(0, 1000)])
        }
      } catch (cleanupError) { console.error('[VOICE] Cleanup failed:', cleanupError) }
    }
    next(error)
  }
})

export const voiceRoutes = router
