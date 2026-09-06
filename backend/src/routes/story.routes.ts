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

const STORY_CREDIT_COST = 5

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

async function generateStory(provider: any, model: string, prompt: string): Promise<any> {
  if (!isOpenAICompatible(provider.name)) {
    throw new Error(`Provider ${provider.name} is not supported by the story executor`)
  }
  const apiKey = providerApiKey(provider.name)
  if (!apiKey) throw new Error(`API key is not configured for provider ${provider.name}`)

  const baseUrl = (provider.baseUrl || (provider.name.toUpperCase().includes('GROQ') ? 'https://api.groq.com/openai/v1' : 'https://api.openai.com/v1')).replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are StoryFlow story generation engine. Return valid JSON only with keys title, synopsis, fullStory, script, genre, tone, lengthMinutes, language, wordCount. Create original content from the user request. Do not mention being an AI.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    })
    const body = await response.text()
    if (!response.ok) throw new Error(`AI provider ${provider.name} returned HTTP ${response.status}: ${body.slice(0, 300)}`)
    const payload = JSON.parse(body)
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) throw new Error('AI provider returned an empty story response')
    const parsed = JSON.parse(content)
    if (!parsed.title || !parsed.fullStory) throw new Error('AI provider returned incomplete story data')
    return parsed
  } finally {
    clearTimeout(timeout)
  }
}

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  let generationId: string | null = null
  try {
    const { projectId, prompt, genre, tone, lengthMinutes, language } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (typeof prompt !== 'string' || prompt.trim().length < 10) return next(createError('prompt must contain at least 10 characters', 400))

    const project = await query('SELECT id, title, description, genre, cultural_mode FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id])
    if (project.rows.length === 0) return next(createError('Project not found', 404))

    const user = await query('SELECT plan, credits FROM users WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL', [req.user!.id])
    if (!user.rows.length) return next(createError('User account not found', 404))
    const credits = Number(user.rows[0].credits)
    const plan = String(user.rows[0].plan)
    const route = await aiProviderRouter.route({ capability: 'TEXT', prompt: prompt.trim(), userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: STORY_CREDIT_COST } })

    const generation = await query(`INSERT INTO generations (user_id, project_id, type, prompt, provider, model, status, credits_reserved, metadata) VALUES ($1, $2, 'STORY', $3, $4, $5, 'PENDING', $6, $7) RETURNING id`, [req.user!.id, projectId, prompt.trim(), route.provider.name, route.model, STORY_CREDIT_COST, JSON.stringify({ genre, tone, lengthMinutes, language })])
    generationId = generation.rows[0].id

    await creditService.reserveCredits(req.user!.id, STORY_CREDIT_COST, generationId, 'Story generation')
    await query(`UPDATE generations SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`, [generationId])

    const requestPrompt = JSON.stringify({ request: prompt.trim(), genre: genre || project.rows[0].genre, tone, lengthMinutes, language: language || 'en', projectTitle: project.rows[0].title, projectDescription: project.rows[0].description, culturalMode: project.rows[0].cultural_mode })
    const story = await aiProviderRouter.executeWithFallback({ capability: 'TEXT', prompt: requestPrompt, userId: req.user!.id, plan, creditsAvailable: credits, metadata: { credits: STORY_CREDIT_COST, model: route.model } }, (provider, model) => generateStory(provider, model, requestPrompt))

    const saved = await query(`INSERT INTO stories (project_id, title, synopsis, full_story, script, genre, tone, length_minutes, language, version, word_count, is_current) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, $10, TRUE) RETURNING *`, [projectId, story.title, story.synopsis || null, story.fullStory, story.script || null, story.genre || genre || project.rows[0].genre || null, story.tone || tone || null, Number(story.lengthMinutes || lengthMinutes || 1), story.language || language || 'en', Number(story.wordCount || String(story.fullStory).trim().split(/\s+/).length)])

    await creditService.consumeReservedCredits(req.user!.id, generationId)
    await query(`UPDATE generations SET status = 'COMPLETED', credits_consumed = credits_reserved, updated_at = NOW() WHERE id = $1`, [generationId])
    return res.status(201).json({ success: true, message: 'Story generated successfully', data: { generationId, story: saved.rows[0] } })
  } catch (error: any) {
    if (generationId) {
      try {
        const generation = await query('SELECT credits_reserved, status FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user!.id])
        if (generation.rows[0]?.status === 'PROCESSING' || generation.rows[0]?.status === 'PENDING') {
          await creditService.releaseReservedCredits(req.user!.id, Number(generation.rows[0].credits_reserved), generationId, 'Story generation failed')
          await query(`UPDATE generations SET status = 'FAILED', error_message = $2, updated_at = NOW() WHERE id = $1`, [generationId, String(error?.message || 'Story generation failed').slice(0, 1000)])
        }
      } catch (cleanupError) {
        console.error('[STORY] Generation cleanup failed:', cleanupError)
      }
    }
    next(error)
  }
})

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT s.* FROM stories s INNER JOIN projects p ON p.id = s.project_id WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL LIMIT 1`, [req.params.id, req.user!.id])
    if (result.rows.length === 0) return next(createError('Story not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const storyRoutes = router
