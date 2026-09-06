
import { Router } from 'express'
import { monitoringService } from '../services/monitoringService'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/health', async (req, res) => {
  const health = await monitoringService.getHealth()
  const status = health.status === 'ok' ? 200 : 503
  res.status(status).json(health)
})

router.get('/metrics', authenticate as any, authorize('SUPER_ADMIN') as any, async (req, res, next) => {
  try {
    const metrics = await monitoringService.getMetrics()
    res.json({ success: true, data: metrics })
  } catch (err) { next(err) }
})

router.get('/failures', authenticate as any, authorize('SUPER_ADMIN', 'AI_MANAGER') as any, async (req, res, next) => {
  try {
    const failures = await monitoringService.getFailedJobs(50)
    res.json({ success: true, data: failures })
  } catch (err) { next(err) }
})

export const monitoringRoutes = router
