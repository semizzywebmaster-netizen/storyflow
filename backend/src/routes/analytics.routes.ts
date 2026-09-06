
import { Router } from 'express'
const router = Router()
router.post('/event', (req, res) => { res.json({ success: true, message: 'Event tracked' }) })
router.get('/dashboard', (req, res) => { res.json({ success: true, data: { totalUsers: 2447, totalVideos: 12847 } }) })
export const analyticsRoutes = router
