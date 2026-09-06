
import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => { res.json({ success: true, data: [{ id: 'proj_001', title: 'The Return', status: 'IN_PROGRESS' }] }) })
router.post('/', (req, res) => { res.json({ success: true, data: { id: 'proj_new', ...req.body } }) })
router.get('/:id', (req, res) => { res.json({ success: true, data: { id: req.params.id, title: 'The Return' } }) })
router.put('/:id', (req, res) => { res.json({ success: true, data: { id: req.params.id, ...req.body } }) })
router.delete('/:id', (req, res) => { res.json({ success: true, message: 'Deleted' }) })
export const projectRoutes = router
