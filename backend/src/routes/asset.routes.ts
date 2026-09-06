
import { Router } from 'express'
const router = Router()
router.get('/', (req, res) => { res.json({ success: true, data: [{ id: 'asset_001', type: 'IMAGE', url: 'https://example.com/image.jpg' }] }) })
router.post('/upload', (req, res) => { res.json({ success: true, data: { url: 'https://r2.example.com/upload.jpg' } }) })
export const assetRoutes = router
