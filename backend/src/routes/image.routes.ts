import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { aiProviderRouter } from '../services/aiProviderRouter'
import { creditService } from '../services/creditService'
import { config } from '../config'

const router = Router()
router.use(authenticate)
const IMAGE_CREDIT_COST = 5

async function generateImage(provider: any, model: string, prompt: string, size: string) {
  if (provider.name.toUpperCase() !== 'OPENAI') throw new Error(`Provider ${provider.name} is not supported by the image executor`)
  const apiKey = config.ai.openaiApiKey
  if (!apiKey) throw new Error('API key is not configured for provider OPENAI')
  const baseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)
  try {
    const response = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, prompt, size, n: 1, response_format: 'url' }), signal: controller.signal,
    })
    const body = await response.text()
    if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}: ${body.slice(0, 300)}`)
    const image = JSON.parse(body)?.data?.[0]
    if (!image?.url) throw new Error('AI provider returned no image URL')
    return { url: image.url, revisedPrompt: image.revised_prompt }
  } finally { clearTimeout(timeout) }
}

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  let generationId: string | null = null
  try {
    const { projectId, sceneId, prompt, size = '1024x1024' } = req.body ?? {}
    if (typeof prompt !== 'string' || prompt.trim().length < 5) return next(createError('prompt must contain at least 5 characters', 400))
    if (!['1024x1024', '1536x1024', '1024x1536'].includes(String(size))) return next(createError('Invalid image size', 400))
    if (projectId) {
      const p = await query('SELECT id FROM projects WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL', [projectId, req.user!.id])
      if (!p.rows.length) return next(createError('Project not found', 404))
    }
    if (sceneId) {
      const s = await query('SELECT s.id FROM scenes s INNER JOIN projects p ON p.id=s.project_id WHERE s.id=$1 AND p.user_id=$2 AND p.deleted_at IS NULL', [sceneId, req.user!.id])
      if (!s.rows.length) return next(createError('Scene not found', 404))
    }
    const user = await query('SELECT plan, credits FROM users WHERE id=$1 AND is_active=TRUE AND deleted_at IS NULL', [req.user!.id])
    if (!user.rows.length) return next(createError('User account not found', 404))
    const plan = String(user.rows[0].plan), credits = Number(user.rows[0].credits)
    const route = await aiProviderRouter.route({ capability: 'IMAGE', prompt: prompt.trim(), userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: IMAGE_CREDIT_COST } })
    const generation = await query(`INSERT INTO generations (user_id,project_id,type,prompt,provider,model,status,credits_reserved,metadata) VALUES ($1,$2,'IMAGE',$3,$4,$5,'PENDING',$6,$7) RETURNING id`, [req.user!.id, projectId ?? null, prompt.trim(), route.provider.name, route.model, IMAGE_CREDIT_COST, JSON.stringify({ sceneId: sceneId || null, size })])
    generationId = generation.rows[0].id
    await creditService.reserveCredits(req.user!.id, IMAGE_CREDIT_COST, generationId, 'Image generation')
    await query(`UPDATE generations SET status='PROCESSING',updated_at=NOW() WHERE id=$1`, [generationId])
    const result = await aiProviderRouter.executeWithFallback({ capability: 'IMAGE', prompt: prompt.trim(), userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: IMAGE_CREDIT_COST, model: route.model } }, (provider, model) => generateImage(provider, model, prompt.trim(), String(size)))
    const asset = await query(`INSERT INTO assets (user_id,project_id,scene_id,type,url,mime_type,prompt,model,metadata) VALUES ($1,$2,$3,'IMAGE',$4,'image/*',$5,$6,$7) RETURNING *`, [req.user!.id, projectId ?? null, sceneId ?? null, result.url, prompt.trim(), route.model, JSON.stringify({ generationId, size, revisedPrompt: result.revisedPrompt || null })])
    await creditService.consumeReservedCredits(req.user!.id, generationId)
    await query(`UPDATE generations SET status='COMPLETED',credits_consumed=credits_reserved,result_url=$2,updated_at=NOW() WHERE id=$1`, [generationId, result.url])
    return res.status(201).json({ success: true, message: 'Image generated successfully', data: { generationId, asset: asset.rows[0] } })
  } catch (error: any) {
    if (generationId) {
      try {
        const g = await query('SELECT credits_reserved,status FROM generations WHERE id=$1 AND user_id=$2', [generationId, req.user!.id])
        if (['PROCESSING','PENDING'].includes(g.rows[0]?.status)) {
          await creditService.releaseReservedCredits(req.user!.id, Number(g.rows[0].credits_reserved), generationId, 'Image generation failed')
          await query(`UPDATE generations SET status='FAILED',error_message=$2,updated_at=NOW() WHERE id=$1`, [generationId, String(error?.message || 'Image generation failed').slice(0, 1000)])
        }
      } catch (cleanupError) { console.error('[IMAGE] Generation cleanup failed:', cleanupError) }
    }
    next(error)
  }
})

export const imageRoutes = router
