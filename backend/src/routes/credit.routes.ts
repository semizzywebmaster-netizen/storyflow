
import { Router } from 'express'
const router = Router()
router.get('/balance', (req, res) => { res.json({ success: true, data: { balance: 1847, usedThisMonth: 397, monthlyAllowance: 2000 } }) })
router.get('/history', (req, res) => { res.json({ success: true, data: [{ id: 'tx_001', amount: -5, type: 'GENERATION', description: 'Story generation' }] }) })
router.post('/purchase', (req, res) => { res.json({ success: true, data: { transactionId: 'tx_new', balance: 2347 } }) })
export const creditRoutes = router
