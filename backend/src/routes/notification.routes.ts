
import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => { res.json({ success: true, data: [{ id: 'notif_001', title: 'Video Ready', isRead: false }] }) })
router.put('/:id/read', (req, res) => { res.json({ success: true, message: 'Marked as read' }) })
router.get('/preferences', (req, res) => { res.json({ success: true, data: { email: true, push: true, whatsapp: false } }) })
export const notificationRoutes = router
