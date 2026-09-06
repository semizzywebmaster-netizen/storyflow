
import { Router } from 'express'
const router = Router()
router.get('/project/:projectId', (req, res) => { res.json({ success: true, data: [{ id: 'scene_001', index: 1, title: 'The Call' }] }) })
router.post('/', (req, res) => { res.json({ success: true, data: { id: 'scene_new', ...req.body } }) })
export const sceneRoutes = router
