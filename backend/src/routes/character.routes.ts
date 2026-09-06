
import { Router } from 'express'
const router = Router()
router.get('/project/:projectId', (req, res) => { res.json({ success: true, data: [{ id: 'char_001', name: 'Emeka' }] }) })
router.post('/', (req, res) => { res.json({ success: true, data: { id: 'char_new', ...req.body } }) })
router.put('/:id/lock', (req, res) => { res.json({ success: true, message: 'Character locked', data: { id: req.params.id, isLocked: true } }) })
export const characterRoutes = router
