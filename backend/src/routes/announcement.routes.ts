
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { announcementService } from '../services/announcementService'

const router = Router()

router.get('/for-me', authenticate as any, async (req: any, res, next) => {
  try {
    const announcements = await announcementService.getAnnouncementsForUser(req.user.id, req.user.plan || 'FREE')
    res.json({ success: true, data: announcements })
  } catch (err) { next(err) }
})

router.put('/:id/read', authenticate as any, async (req: any, res, next) => {
  try {
    await announcementService.markAsRead(req.user.id, req.params.id)
    res.json({ success: true, message: 'Marked as read' })
  } catch (err) { next(err) }
})

// Admin routes
router.get('/admin/all', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req, res, next) => {
  try {
    const all = await announcementService.getAllAnnouncements()
    res.json({ success: true, data: all })
  } catch (err) { next(err) }
})

router.post('/admin/create', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req: any, res, next) => {
  try {
    const ann = await announcementService.createAnnouncement({ ...req.body, createdBy: req.user.id })
    res.json({ success: true, data: ann })
  } catch (err) { next(err) }
})

router.put('/admin/:id', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req, res, next) => {
  try {
    const updated = await announcementService.updateAnnouncement(req.params.id, req.body)
    res.json({ success: true, data: updated })
  } catch (err) { next(err) }
})

router.delete('/admin/:id', authenticate as any, authorize('SUPER_ADMIN') as any, async (req, res, next) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id)
    res.json({ success: true, message: 'Deleted' })
  } catch (err) { next(err) }
})

router.post('/admin/:id/publish', authenticate as any, authorize('SUPER_ADMIN', 'CONTENT_MANAGER') as any, async (req, res, next) => {
  try {
    await announcementService.publishAnnouncement(req.params.id)
    res.json({ success: true, message: 'Published' })
  } catch (err) { next(err) }
})

export const announcementRoutes = router
