import { Router } from 'express'
import { authRateLimiter } from '../middleware/rateLimiter'
import { authService } from '../services/authService'
import { authenticate } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'

const router = Router()

router.post('/register', authRateLimiter as any, async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({ success: true, message: 'Registered successfully', data: result })
  } catch (err) { next(err) }
})

router.post('/login', authRateLimiter as any, async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw createError('Email and password required', 400)
    const result = await authService.login(email, password, req.ip, req.headers['user-agent'] as string)
    res.json({ success: true, message: 'Login successful', data: result })
  } catch (err) { next(err) }
})

router.post('/logout', authenticate as any, async (req: any, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    await authService.logout(req.user.id, token || '')
    res.json({ success: true, message: 'Logged out' })
  } catch (err) { next(err) }
})

router.get('/me', authenticate as any, async (req: any, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

router.post('/forgot-password', authRateLimiter as any, async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw createError('Email required', 400)
    await authService.requestPasswordReset(email)
    res.json({ success: true, message: 'If email exists, reset link sent' })
  } catch (err) { next(err) }
})

router.post('/reset-password', authRateLimiter as any, async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) throw createError('Token and password required', 400)
    await authService.resetPassword(token, password)
    res.json({ success: true, message: 'Password reset successful' })
  } catch (err) { next(err) }
})

export const authRoutes = router
