
import { Router } from 'express'
import { aiRateLimiter } from '../middleware/rateLimiter'
const router = Router()
router.post('/generate', aiRateLimiter, (req, res) => { res.json({ success: true, message: 'Story generation queued', data: { jobId: 'job_123', creditsReserved: 5 } }) })
router.get('/:id', (req, res) => { res.json({ success: true, data: { id: req.params.id, title: 'The Return', synopsis: 'Mock story' } }) })
export const storyRoutes = router
