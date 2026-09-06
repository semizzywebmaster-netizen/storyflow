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

const CHARACTER_BIBLE_CREDIT_COST = 5

function providerApiKey(name: string): string {
  const key = name.toUpperCase().replace(/[^A-Z0-9]+/g, '')
  const keys: Record<string, string> = {
    OPENAI: config.ai.openaiApiKey,
    GROQ: config.ai.groqApiKey,
    ANTHROPIC: config.ai.anthropicApiKey,
  }
  return keys[key] || ''
}

function isOpenAICompatible(name: string): boolean {
  return ['OPENAI', 'GROQ'].includes(name.toUpperCase().replace(/[^A-Z0-9]+/g, ''))
}

async function generateCharacterBible(provider: any, model: string, prompt: string): Promise<any[]> {
  if (!isOpenAICompatible(provider.name)) throw new Error(`Provider ${provider.name} is not supported by the character executor`)
  const apiKey = providerApiKey(provider.name)
  if (!apiKey) throw new Error(`API key is not configured for provider ${provider.name}`)
  const baseUrl = (provider.baseUrl || (provider.name.toUpperCase().includes('GROQ') ? 'https://api.groq.com/openai/v1' : 'https://api.openai.com/v1')).replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0.7, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'You are StoryFlow character bible generation engine. Return valid JSON only with a characters array. Each character must include name, role, age, gender, appearance, personality, background, clothingStyle, skinTone and hairStyle.' }, { role: 'user', content: prompt }] }),
      signal: controller.signal,
    })
    const body = await response.text()
    if (!response.ok) throw new Error(`AI provider ${provider.name} returned HTTP ${response.status}: ${body.slice(0, 300)}`)
    const payload = JSON.parse(body)
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) throw new Error('AI provider returned an empty character bible')
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed.characters) || parsed.characters.length === 0) throw new Error('AI provider returned no characters')
    return parsed.characters
  } finally { clearTimeout(timeout) }
}

router.get('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT c.* FROM characters c INNER JOIN projects p ON p.id = c.project_id WHERE c.project_id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL ORDER BY c.created_at ASC`, [req.params.projectId, req.user!.id])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/generate-bible', aiRateLimiter, async (req: AuthRequest, res, next) => {
  let generationId: string | null = null
  try {
    const { projectId, prompt, characterCount } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (typeof prompt !== 'string' || prompt.trim().length < 10) return next(createError('prompt must contain at least 10 characters', 400))
    const count = Math.min(Math.max(Number(characterCount || 4), 1), 12)
    const project = await query('SELECT id, title, description, genre, cultural_mode FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id])
    if (!project.rows.length) return next(createError('Project not found', 404))
    const user = await query('SELECT plan, credits FROM users WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL', [req.user!.id])
    if (!user.rows.length) return next(createError('User account not found', 404))
    const plan = String(user.rows[0].plan)
    const credits = Number(user.rows[0].credits)
    const route = await aiProviderRouter.route({ capability: 'TEXT', prompt: prompt.trim(), userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: CHARACTER_BIBLE_CREDIT_COST } })
    const generation = await query(`INSERT INTO generations (user_id, project_id, type, prompt, provider, model, status, credits_reserved, metadata) VALUES ($1, $2, 'CHARACTER', $3, $4, $5, 'PENDING', $6, $7) RETURNING id`, [req.user!.id, projectId, prompt.trim(), route.provider.name, route.model, CHARACTER_BIBLE_CREDIT_COST, JSON.stringify({ characterCount: count })])
    generationId = generation.rows[0].id
    await creditService.reserveCredits(req.user!.id, CHARACTER_BIBLE_CREDIT_COST, generationId, 'Character Bible generation')
    await query(`UPDATE generations SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`, [generationId])
    const requestPrompt = JSON.stringify({ request: prompt.trim(), characterCount: count, projectTitle: project.rows[0].title, projectDescription: project.rows[0].description, genre: project.rows[0].genre, culturalMode: project.rows[0].cultural_mode })
    const characters = await aiProviderRouter.executeWithFallback({ capability: 'TEXT', prompt: requestPrompt, userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: CHARACTER_BIBLE_CREDIT_COST, model: route.model } }, (provider, model) => generateCharacterBible(provider, model, requestPrompt))
    const created = []
    for (const character of characters.slice(0, count)) {
      if (!character?.name || !String(character.name).trim()) continue
      const saved = await query(`INSERT INTO characters (project_id, name, role, age, gender, appearance, personality, background, clothing_style, skin_tone, hair_style) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [projectId, String(character.name).trim(), character.role ?? null, character.age ?? null, character.gender ?? null, character.appearance ?? null, character.personality ?? null, character.background ?? null, character.clothingStyle ?? null, character.skinTone ?? null, character.hairStyle ?? null])
      created.push(saved.rows[0])
    }
    if (!created.length) throw new Error('AI returned no valid characters')
    await creditService.consumeReservedCredits(req.user!.id, generationId)
    await query(`UPDATE generations SET status = 'COMPLETED', credits_consumed = credits_reserved, updated_at = NOW() WHERE id = $1`, [generationId])
    return res.status(201).json({ success: true, message: 'Character Bible generated successfully', data: { generationId, characters: created } })
  } catch (error: any) {
    if (generationId) {
      try {
        const generation = await query('SELECT credits_reserved, status FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user!.id])
        if (generation.rows[0]?.status === 'PROCESSING' || generation.rows[0]?.status === 'PENDING') {
          await creditService.releaseReservedCredits(req.user!.id, Number(generation.rows[0].credits_reserved), generationId, 'Character Bible generation failed')
          await query(`UPDATE generations SET status = 'FAILED', error_message = $2, updated_at = NOW() WHERE id = $1`, [generationId, String(error?.message || 'Character Bible generation failed').slice(0, 1000)])
        }
      } catch (cleanupError) { console.error('[CHARACTER] Generation cleanup failed:', cleanupError) }
    }
    next(error)
  }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, name, role, age, gender, appearance, personality, background, clothingStyle, skinTone, hairStyle } = req.body ?? {}
    if (!projectId || !name?.trim()) return next(createError('projectId and name are required', 400))
    const project = await query('SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id])
    if (project.rows.length === 0) return next(createError('Project not found', 404))
    const result = await query(`INSERT INTO characters (project_id, name, role, age, gender, appearance, personality, background, clothing_style, skin_tone, hair_style) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [projectId, name.trim(), role ?? null, age ?? null, appearance ?? null, personality ?? null, background ?? null, clothingStyle ?? null, skinTone ?? null, hairStyle ?? null])
    return res.status(201).json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const characterRoutes = router
