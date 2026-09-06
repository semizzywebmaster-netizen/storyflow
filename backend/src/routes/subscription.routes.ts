
import { Router } from 'express'
const router = Router()
router.get('/plans', (req, res) => { res.json({ success: true, data: [{ name: 'FREE', price: 0 }, { name: 'PRO', price: 18000 }] }) })
router.get('/current', (req, res) => { res.json({ success: true, data: { plan: 'PRO', status: 'ACTIVE', expiresAt: '2024-12-15' } }) })
router.post('/upgrade', (req, res) => { res.json({ success: true, message: 'Subscription upgraded', data: { plan: req.body.plan } }) })
export const subscriptionRoutes = router
