import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Every admin endpoint requires an authenticated admin-level account.
router.use(authenticate as any, authorize('SUPER_ADMIN', 'ADMIN') as any)

router.get('/stats', (req, res) => {
  res.json({ success: true, data: { users: 2447, revenue: 1200000, aiJobs: 1234 } })
})

router.get('/features', (req, res) => {
  res.json({ success: true, data: [{ key: 'story_generation', enabled: true }] })
})

router.put('/features/:key', (req, res) => {
  res.json({ success: true, data: { key: req.params.key, ...req.body } })
})

router.post('/kill-switch', (req, res) => {
  res.json({
    success: true,
    message: `Master AI Kill Switch ${req.body.enabled ? 'ENABLED' : 'DISABLED'}`,
    enabled: req.body.enabled,
  })
})

router.get('/providers', (req, res) => {
  res.json({ success: true, data: [{ name: 'OpenAI', status: 'ONLINE' }] })
})

export const adminRoutes = router
