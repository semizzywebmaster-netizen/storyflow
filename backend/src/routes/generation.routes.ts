
import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
const router = Router()
router.post('/:type', aiRateLimiter, (req, res) => { 
  const creditsMap: any = { story: 5, image: 5, voice: 4, video: 20, music: 3 }
  res.json({ success: true, message: `${req.params.type} generation queued`, data: { jobId: 'job_'+Date.now(), creditsReserved: creditsMap[req.params.type] || 5, status: 'PENDING' } })
})
router.get('/job/:id', (req, res) => { res.json({ success: true, data: { id: req.params.id, status: 'COMPLETED', resultUrl: 'https://example.com/result.mp4' } }) })
export const generationRoutes = router
