
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { advancedAIService } from '../services/advancedAIService'
import { aiRateLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/content-factory', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const { topic, count, platform, culturalMode } = req.body
    if (!topic) throw new Error('Topic required')
    const result = await advancedAIService.generateContentFactory(req.user.id, topic, { count, platform, culturalMode })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/series/:seriesId/episode', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const { seasonNumber, episodeNumber } = req.body
    const result = await advancedAIService.generateSeriesEpisode(req.user.id, req.params.seriesId, { seasonNumber, episodeNumber })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/auto-clips', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const { videoId, maxClips, formats } = req.body
    if (!videoId) throw new Error('videoId required')
    const result = await advancedAIService.generateAutoClips(req.user.id, videoId, { maxClips, formats })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/content-agent/launch', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const { request, weekOf, focus } = req.body
    if (!request) throw new Error('Request description required')
    const result = await advancedAIService.launchContentAgent(req.user.id, request, { weekOf, focus })
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/viral/analyze', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const result = await advancedAIService.analyzeViralPotential(req.user.id, req.body)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

router.post('/thumbnails', authenticate as any, aiRateLimiter as any, async (req: any, res, next) => {
  try {
    const result = await advancedAIService.generateThumbnails(req.user.id, req.body)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
})

export const advancedAIRoutes = router
