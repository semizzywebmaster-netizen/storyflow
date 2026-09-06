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
  if (!isOpenAICompatible(provider.name)) throw new Error(`Provider ${provider.name} is not supported by the story executor`)
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

async function getOwnedProject(projectId: string, userId: string) {
  const result = await query(
    `SELECT id, title, description, genre, cultural_mode
     FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL LIMIT 1`,
    [projectId, userId]
  )
  return result.rows[0]
}

async function getCurrentStory(projectId: string) {
  const result = await query(
    `SELECT * FROM stories WHERE project_id = $1 AND is_current = TRUE ORDER BY version DESC, updated_at DESC LIMIT 1`,
    [projectId]
  )
  return result.rows[0]
}

async function saveStoryVersion(projectId: string, story: any, version: number) {
  await query(`UPDATE stories SET is_current = FALSE, updated_at = NOW() WHERE project_id = $1 AND is_current = TRUE`, [projectId])
  const saved = await query(
    `INSERT INTO stories
      (project_id, title, synopsis, full_story, script, genre, tone, length_minutes, language, version, word_count, is_current)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,TRUE) RETURNING *`,
    [
      projectId,
      story.title || null,
      story.synopsis || null,
      story.fullStory || story.full_story || null,
      story.script || null,
      story.genre || null,
      story.tone || null,
      Number(story.lengthMinutes || story.length_minutes || 1),
      story.language || 'en',
      version,
      Number(story.wordCount || story.word_count || String(story.fullStory || story.full_story || '').trim().split(/\s+/).filter(Boolean).length),
    ]
  )
  return saved.rows[0]
}

async function runPaidStoryGeneration(req: AuthRequest, project: any, prompt: string, metadata: any) {
  const user = await query('SELECT plan, credits FROM users WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL', [req.user!.id])
  if (!user.rows.length) throw createError('User account not found', 404)
  const credits = Number(user.rows[0].credits)
  const plan = String(user.rows[0].plan)
  const route = await aiProviderRouter.route({
    capability: 'TEXT',
    prompt,
    userId: req.user!.id,
    plan,
    creditsAvailable: credits,
    metadata: { credits: STORY_CREDIT_COST },
  })
  const generation = await query(
    `INSERT INTO generations (user_id, project_id, type, prompt, provider, model, status, credits_reserved, metadata)
     VALUES ($1,$2,'STORY',$3,$4,$5,'PENDING',$6,$7) RETURNING id`,
    [req.user!.id, project.id, prompt, route.provider.name, route.model, STORY_CREDIT_COST, JSON.stringify(metadata || {})]
  )
  const generationId = generation.rows[0].id
  try {
    await creditService.reserveCredits(req.user!.id, STORY_CREDIT_COST, generationId, 'Story generation')
    await query(`UPDATE generations SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`, [generationId])
    const story = await aiProviderRouter.executeWithFallback(
      {
        capability: 'TEXT', prompt, userId: req.user!.id, plan, creditsAvailable: credits,
        metadata: { credits: STORY_CREDIT_COST, model: route.model },
      },
      (provider, model) => generateStory(provider, model, prompt)
    )
    await creditService.consumeReservedCredits(req.user!.id, generationId)
    await query(`UPDATE generations SET status = 'COMPLETED', credits_consumed = credits_reserved, updated_at = NOW() WHERE id = $1`, [generationId])
    return { story, generationId }
  } catch (error: any) {
    try {
      const generationState = await query('SELECT credits_reserved, status FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user!.id])
      if (['PROCESSING', 'PENDING'].includes(generationState.rows[0]?.status)) {
        await creditService.releaseReservedCredits(req.user!.id, Number(generationState.rows[0].credits_reserved), generationId, 'Story generation failed')
        await query(`UPDATE generations SET status = 'FAILED', error_message = $2, updated_at = NOW() WHERE id = $1`, [generationId, String(error?.message || 'Story generation failed').slice(0, 1000)])
      }
    } catch (cleanupError) {
      console.error('[STORY] Generation cleanup failed:', cleanupError)
    }
    throw error
  }
}

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { projectId, prompt, genre, tone, lengthMinutes, language } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (typeof prompt !== 'string' || prompt.trim().length < 10) return next(createError('prompt must contain at least 10 characters', 400))
    const project = await getOwnedProject(projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const requestPrompt = JSON.stringify({
      request: prompt.trim(), genre: genre || project.genre, tone, lengthMinutes,
      language: language || 'en', projectTitle: project.title, projectDescription: project.description,
      culturalMode: project.cultural_mode,
    })
    const result = await runPaidStoryGeneration(req, project, requestPrompt, { genre, tone, lengthMinutes, language })
    const current = await getCurrentStory(projectId)
    const saved = await saveStoryVersion(projectId, result.story, Number(current?.version || 0) + 1)
    return res.status(201).json({ success: true, message: 'Story generated successfully', data: { generationId: result.generationId, story: saved } })
  } catch (error) {
    next(error)
  }
})

router.get('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const story = await getCurrentStory(req.params.projectId)
    if (!story) return next(createError('Story not found', 404))
    return res.json({ success: true, data: story })
  } catch (error) { next(error) }
})

router.put('/project/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const current = await getCurrentStory(req.params.projectId)
    if (!current) return next(createError('Story not found', 404))
    const allowed = ['title', 'synopsis', 'full_story', 'fullStory', 'script', 'genre', 'tone', 'length_minutes', 'lengthMinutes', 'language']
    const body = req.body || {}
    const nextStory = {
      ...current,
      ...Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key))),
    }
    if (!nextStory.full_story && !nextStory.fullStory) return next(createError('full_story is required', 400))
    const saved = await saveStoryVersion(req.params.projectId, nextStory, Number(current.version || 0) + 1)
    return res.json({ success: true, message: 'Story updated successfully', data: saved })
  } catch (error) { next(error) }
})

router.post('/project/:projectId/rewrite', aiRateLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { instruction, selection } = req.body || {}
    if (typeof instruction !== 'string' || instruction.trim().length < 3) return next(createError('instruction must contain at least 3 characters', 400))
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const current = await getCurrentStory(req.params.projectId)
    if (!current) return next(createError('Story not found', 404))
    const prompt = JSON.stringify({
      task: 'Rewrite the story while preserving continuity and returning the complete updated story.',
      instruction: instruction.trim(), selection: selection || null,
      currentStory: { title: current.title, synopsis: current.synopsis, fullStory: current.full_story, script: current.script, genre: current.genre, tone: current.tone, lengthMinutes: current.length_minutes, language: current.language },
      project: { title: project.title, description: project.description, genre: project.genre, culturalMode: project.cultural_mode },
    })
    const result = await runPaidStoryGeneration(req, project, prompt, { operation: 'rewrite', selection: Boolean(selection) })
    const saved = await saveStoryVersion(req.params.projectId, result.story, Number(current.version || 0) + 1)
    return res.status(201).json({ success: true, message: 'Story rewritten successfully', data: { generationId: result.generationId, story: saved } })
  } catch (error) { next(error) }
})

router.get('/project/:projectId/versions', async (req: AuthRequest, res, next) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const result = await query('SELECT * FROM stories WHERE project_id = $1 ORDER BY version DESC, created_at DESC', [req.params.projectId])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

router.post('/project/:projectId/versions/:versionId/restore', async (req: AuthRequest, res, next) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const selected = await query('SELECT * FROM stories WHERE id = $1 AND project_id = $2 LIMIT 1', [req.params.versionId, req.params.projectId])
    if (!selected.rows.length) return next(createError('Story version not found', 404))
    const current = await getCurrentStory(req.params.projectId)
    await query('UPDATE stories SET is_current = FALSE, updated_at = NOW() WHERE project_id = $1 AND is_current = TRUE', [req.params.projectId])
    const restored = await query(
      `INSERT INTO stories (project_id,title,synopsis,full_story,script,genre,tone,length_minutes,language,version,word_count,is_current)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,TRUE) RETURNING *`,
      [req.params.projectId, selected.rows[0].title, selected.rows[0].synopsis, selected.rows[0].full_story, selected.rows[0].script, selected.rows[0].genre, selected.rows[0].tone, selected.rows[0].length_minutes, selected.rows[0].language, Number(current?.version || selected.rows[0].version || 0) + 1, selected.rows[0].word_count]
    )
    return res.json({ success: true, message: 'Story version restored successfully', data: restored.rows[0] })
  } catch (error) { next(error) }
})

router.post('/project/:projectId/doctor', async (req: AuthRequest, res, next) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user!.id)
    if (!project) return next(createError('Project not found', 404))
    const story = await getCurrentStory(req.params.projectId)
    if (!story) return next(createError('Story not found', 404))
    const text = String(story.full_story || '')
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const issues: string[] = []
    const suggestions: string[] = []
    if (!story.title?.trim()) issues.push('Story title is missing')
    if (!story.synopsis?.trim()) issues.push('Synopsis is missing')
    if (words < 100) issues.push('Story is very short')
    if (!story.script?.trim()) suggestions.push('Add a screenplay/script version for video production')
    if (story.tone == null) suggestions.push('Set a tone to keep future rewrites stylistically consistent')
    if (words > 0 && words < 300) suggestions.push('Consider expanding character development, conflict, and resolution')
    const score = Math.max(0, Math.min(100, 100 - issues.length * 15 - suggestions.length * 5))
    return res.json({ success: true, data: { score, issues, suggestions } })
  } catch (error) { next(error) }
})

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const result = await query(
      `SELECT s.* FROM stories s INNER JOIN projects p ON p.id = s.project_id
       WHERE s.id = $1 AND p.user_id = $2 AND p.deleted_at IS NULL LIMIT 1`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Story not found', 404))
    return res.json({ success: true, data: result.rows[0] })
  } catch (error) { next(error) }
})

export const storyRoutes = router
