
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { notificationService } from '../services/notificationService'

const router = Router()

router.get('/', authenticate as any, async (req: any, res, next) => {
  try {
    const { limit, offset, unreadOnly } = req.query
    const notifications = await notificationService.getNotifications(req.user.id, {
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      unreadOnly: unreadOnly === 'true',
    })
    res.json({ success: true, data: notifications })
  } catch (err) { next(err) }
})

router.put('/:id/read', authenticate as any, async (req: any, res, next) => {
  try {
    await notificationService.markAsRead(req.user.id, req.params.id)
    res.json({ success: true, message: 'Marked as read' })
  } catch (err) { next(err) }
})

router.put('/read-all', authenticate as any, async (req: any, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id)
    res.json({ success: true, message: 'All marked as read' })
  } catch (err) { next(err) }
})

router.get('/preferences', authenticate as any, async (req: any, res, next) => {
  try {
    const prefs = await notificationService.getPreferences(req.user.id)
    res.json({ success: true, data: prefs })
  } catch (err) { next(err) }
})

router.put('/preferences', authenticate as any, async (req: any, res, next) => {
  try {
    await notificationService.updatePreferences(req.user.id, req.body.preferences || req.body)
    res.json({ success: true, message: 'Preferences updated' })
  } catch (err) { next(err) }
})

export const notificationRoutes = router
