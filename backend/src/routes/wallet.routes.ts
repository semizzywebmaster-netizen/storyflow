
import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => { res.json({ success: true, data: { balance: 25000, totalFunded: 45000, totalSpent: 20000 } }) })
router.get('/transactions', (req, res) => { res.json({ success: true, data: [{ id: 'wtx_001', amount: 10000, type: 'FUND', status: 'COMPLETED' }] }) })
router.post('/fund', (req, res) => { res.json({ success: true, message: 'Wallet funding initiated', data: { paymentUrl: 'https://paystack.com/pay/mock' } }) })
// CRITICAL: NO WITHDRAWAL ENDPOINT - Wallet is platform-only per spec Phase 61
export const walletRoutes = router
