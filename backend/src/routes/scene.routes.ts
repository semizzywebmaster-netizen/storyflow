import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
import { authenticate, AuthRequest } from '../middleware/auth'
import { pool, query } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { aiProviderRouter } from '../services/aiProviderRouter'
import { creditService } from '../services/creditService'
import { config } from '../config'

const router = Router()
router.use(authenticate)

const SCENE_CREDIT_COST = 5
const SCENE_STATUSES = ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'FAILED']

function providerApiKey(name: string): string {
  const key = name.toUpperCase().replace(/[^A-Z0-9]+/g, '')
  const keys: Record<string, string> = {
    OPENAI: config.ai.openaiApiKey,
    GROQ: config.ai.groqApiKey,
  }
  return keys[key] || ''
}

function isOpenAICompatible(name: string): boolean {
  return ['OPENAI', 'GROQ'].includes(name.toUpperCase().replace(/[^A-Z0-9]+/g, ''))
}

async function executeSceneGeneration(provider: any, model: string, prompt: string): Promise<any> {
  if (!isOpenAICompatible(provider.name)) {
    throw new Error(`Provider ${provider.name} is not supported by the scene executor`)
  }
  const apiKey = providerApiKey(provider.name)
  if (!apiKey) throw new Error(`API key is not configured for provider ${provider.name}`)

  const baseUrl = (provider.baseUrl || (provider.name.toUpperCase().includes('GROQ')
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1')).replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.75,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are StoryFlow Scene Engine. Return valid JSON only. Generate one production-ready cinematic scene. Required keys: title, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition. durationSeconds must be a positive integer. Keep dialogue as a string or array of speaker/dialogue objects. Do not mention being an AI.'
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    })

    const body = await response.text()
    if (!response.ok) throw new Error(`AI provider ${provider.name} returned HTTP ${response.status}: ${body.slice(0, 300)}`)
    const payload = JSON.parse(body)
    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) throw new Error('AI provider returned an empty scene response')
    const parsed = JSON.parse(content)
    if (!parsed.title || !parsed.action || !parsed.visualPrompt) throw new Error('AI provider returned incomplete scene data')
    return parsed
  } finally {
    clearTimeout(timeout)
  }
}

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

router.post('/generate', aiRateLimiter, async (req: AuthRequest, res, next) => {
  let generationId: string | null = null
  let sceneId: string | null = null
  try {
    const {
      projectId, storyId, prompt, sceneIndex, durationSeconds, visualStyle,
      cameraAngle, tone, language, characterIds,
    } = req.body ?? {}

    if (!projectId) return next(createError('projectId is required', 400))
    if (typeof prompt !== 'string' || prompt.trim().length < 10) return next(createError('prompt must contain at least 10 characters', 400))
    if (!Number.isInteger(Number(sceneIndex)) || Number(sceneIndex) < 0) return next(createError('sceneIndex must be a non-negative integer', 400))
    if (durationSeconds !== undefined && (!Number.isFinite(Number(durationSeconds)) || Number(durationSeconds) <= 0)) return next(createError('durationSeconds must be greater than 0', 400))

    const project = await query(
      `SELECT id, title, description, genre, cultural_mode FROM projects
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [projectId, req.user!.id]
    )
    if (!project.rows.length) return next(createError('Project not found', 404))

    let story: any = null
    if (storyId) {
      const storyResult = await query(
        `SELECT id, title, synopsis, full_story, script, genre, tone, language
         FROM stories WHERE id = $1 AND project_id = $2`,
        [storyId, projectId]
      )
      if (!storyResult.rows.length) return next(createError('Story not found', 404))
      story = storyResult.rows[0]
    }

    const requestedCharacterIds = Array.isArray(characterIds) ? characterIds.filter((id: any) => typeof id === 'string').slice(0, 20) : []
    let characters: any[] = []
    if (requestedCharacterIds.length) {
      const result = await query(
        `SELECT id, name, role, age, gender, appearance, personality, background, clothing_style, skin_tone, hair_style
         FROM characters WHERE project_id = $1 AND id = ANY($2::uuid[])`,
        [projectId, requestedCharacterIds]
      )
      if (result.rows.length !== requestedCharacterIds.length) return next(createError('One or more characters do not belong to this project', 400))
      characters = result.rows
    }

    const user = await query('SELECT plan, credits FROM users WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL', [req.user!.id])
    if (!user.rows.length) return next(createError('User account not found', 404))
    const plan = String(user.rows[0].plan)
    const credits = Number(user.rows[0].credits)

    const route = await aiProviderRouter.route({
      capability: 'TEXT', prompt: prompt.trim(), userId: req.user!.id, plan,
      creditsAvailable: credits, metadata: { credits: SCENE_CREDIT_COST },
    })

    const generation = await query(
      `INSERT INTO generations (user_id, project_id, type, prompt, provider, model, status, credits_reserved, metadata)
       VALUES ($1, $2, 'SCENE', $3, $4, $5, 'PENDING', $6, $7)
       RETURNING id`,
      [
        req.user!.id, projectId, prompt.trim(), route.provider.name, route.model, SCENE_CREDIT_COST,
        JSON.stringify({ storyId: storyId || null, sceneIndex: Number(sceneIndex), characterIds: requestedCharacterIds, durationSeconds, visualStyle, cameraAngle, tone, language }),
      ]
    )
    generationId = generation.rows[0].id

    await creditService.reserveCredits(req.user!.id, SCENE_CREDIT_COST, generationId, 'Scene generation')
    await query(`UPDATE generations SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`, [generationId])

    const requestPrompt = JSON.stringify({
      request: prompt.trim(),
      sceneIndex: Number(sceneIndex),
      durationSeconds: Number(durationSeconds || 10),
      visualStyle: visualStyle || 'cinematic',
      cameraAngle: cameraAngle || 'medium shot',
      tone: tone || story?.tone || null,
      language: language || story?.language || 'en',
      project: { title: project.rows[0].title, description: project.rows[0].description, genre: project.rows[0].genre, culturalMode: project.rows[0].cultural_mode },
      story: story ? { title: story.title, synopsis: story.synopsis, fullStory: story.full_story, script: story.script, genre: story.genre } : null,
      characters,
    })

    const generated = await aiProviderRouter.executeWithFallback(
      {
        capability: 'TEXT', prompt: requestPrompt, userId: req.user!.id, plan,
        creditsAvailable: credits, metadata: { credits: SCENE_CREDIT_COST, model: route.model },
      },
      (provider, model) => executeSceneGeneration(provider, model, requestPrompt)
    )

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const inserted = await client.query(
        `INSERT INTO scenes
         (project_id, story_id, scene_index, title, location, time_of_day, action, dialogue, narration, emotion, camera_angle, visual_style, visual_prompt, duration_seconds, transition, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'COMPLETED')
         RETURNING *`,
        [
          projectId, storyId || null, Number(sceneIndex), generated.title, generated.location || null,
          generated.timeOfDay || null, generated.action, typeof generated.dialogue === 'string' ? generated.dialogue : JSON.stringify(generated.dialogue || null),
          generated.narration || null, generated.emotion || null, generated.cameraAngle || cameraAngle || null,
          generated.visualStyle || visualStyle || null, generated.visualPrompt,
          Number(generated.durationSeconds || durationSeconds || 10), generated.transition || null,
        ]
      )
      sceneId = inserted.rows[0].id
      await client.query(`UPDATE generations SET status = 'COMPLETED', credits_consumed = credits_reserved, updated_at = NOW(), metadata = metadata || $2::jsonb WHERE id = $1`, [generationId, JSON.stringify({ sceneId })])
      await client.query('COMMIT')
      await creditService.consumeReservedCredits(req.user!.id, generationId)
      return res.status(201).json({ success: true, message: 'Scene generated successfully', data: { generationId, scene: inserted.rows[0] } })
    } catch (error: any) {
      await client.query('ROLLBACK')
      if (error?.code === '23505') throw createError('A scene with this sceneIndex already exists in the project', 409)
      throw error
    } finally {
      client.release()
    }
  } catch (error: any) {
    if (generationId) {
      try {
        const generation = await query('SELECT credits_reserved, status FROM generations WHERE id = $1 AND user_id = $2', [generationId, req.user!.id])
        if (generation.rows[0]?.status === 'PROCESSING' || generation.rows[0]?.status === 'PENDING') {
          await creditService.releaseReservedCredits(req.user!.id, Number(generation.rows[0].credits_reserved), generationId, 'Scene generation failed')
          await query(`UPDATE generations SET status = 'FAILED', error_message = $2, updated_at = NOW() WHERE id = $1`, [generationId, String(error?.message || 'Scene generation failed').slice(0, 1000)])
        }
      } catch (cleanupError) {
        console.error('[SCENE] Generation cleanup failed:', cleanupError)
      }
    }
    next(error)
  }
})

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { projectId, storyId, title, sceneIndex, location, timeOfDay, action, dialogue, narration, emotion, cameraAngle, visualStyle, visualPrompt, durationSeconds, transition } = req.body ?? {}
    if (!projectId) return next(createError('projectId is required', 400))
    if (sceneIndex !== undefined && (!Number.isInteger(Number(sceneIndex)) || Number(sceneIndex) < 0)) return next(createError('sceneIndex must be a non-negative integer', 400))
    if (durationSeconds !== undefined && (!Number.isFinite(Number(durationSeconds)) || Number(durationSeconds) <= 0)) return next(createError('durationSeconds must be greater than 0', 400))

    const project = await query('SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [projectId, req.user!.id])
    if (project.rows.length === 0) return next(createError('Project not found', 404))
    if (storyId) {
      const story = await query('SELECT id FROM stories WHERE id = $1 AND project_id = $2', [storyId, projectId])
      if (story.rows.length === 0) return next(createError('Story not found', 404))
    }
    const result = await query(
      `INSERT INTO scenes (project_id, story_id, scene_index, title, location, time_of_day, action, dialogue, narration, emotion, camera_angle, visual_style, visual_prompt, duration_seconds, transition)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
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
    if (status !== undefined && !SCENE_STATUSES.includes(String(status))) return next(createError('Invalid scene status', 400))

    const result = await query(
      `UPDATE scenes s SET title = COALESCE($1, s.title), scene_index = COALESCE($2, s.scene_index), location = COALESCE($3, s.location),
       time_of_day = COALESCE($4, s.time_of_day), action = COALESCE($5, s.action), dialogue = COALESCE($6, s.dialogue), narration = COALESCE($7, s.narration),
       emotion = COALESCE($8, s.emotion), camera_angle = COALESCE($9, s.camera_angle), visual_style = COALESCE($10, s.visual_style), visual_prompt = COALESCE($11, s.visual_prompt),
       duration_seconds = COALESCE($12, s.duration_seconds), transition = COALESCE($13, s.transition), status = COALESCE($14, s.status), updated_at = NOW()
       FROM projects p WHERE s.id = $15 AND s.project_id = p.id AND p.user_id = $16 AND p.deleted_at IS NULL RETURNING s.*`,
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
      `DELETE FROM scenes s USING projects p WHERE s.id = $1 AND s.project_id = p.id AND p.user_id = $2 AND p.deleted_at IS NULL RETURNING s.id`,
      [req.params.id, req.user!.id]
    )
    if (result.rows.length === 0) return next(createError('Scene not found', 404))
    return res.json({ success: true, message: 'Scene deleted' })
  } catch (error) { next(error) }
})

export const sceneRoutes = router
