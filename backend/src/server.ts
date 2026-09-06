import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { rateLimiter } from './middleware/rateLimiter'
import { authRoutes } from './routes/auth.routes'
import { projectRoutes } from './routes/project.routes'
import { storyRoutes } from './routes/story.routes'
import { characterRoutes } from './routes/character.routes'
import { sceneRoutes } from './routes/scene.routes'
import { imageRoutes } from './routes/image.routes'
import { voiceRoutes } from './routes/voice.routes'
import { sfxRoutes } from './routes/sfx.routes'
import { videoRoutes } from './routes/video.routes'
import { assetRoutes } from './routes/asset.routes'
import { generationRoutes } from './routes/generation.routes'
import { creditRoutes } from './routes/credit.routes'
import { walletRoutes } from './routes/wallet.routes'
import { paymentRoutes } from './routes/payment.routes'
import { subscriptionRoutes } from './routes/subscription.routes'
import { adminRoutes } from './routes/admin.routes'
import { notificationRoutes } from './routes/notification.routes'
import { analyticsRoutes } from './routes/analytics.routes'

const app = express()
app.disable('x-powered-by')
app.use(helmet())
const allowedOrigins = [config.frontendUrl, ...(config.nodeEnv === 'development' ? ['http://localhost:5173', 'http://localhost:3000'] : [])]
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => { (req as any).rawBody = Buffer.from(buf) },
}))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(requestLogger)
app.use(rateLimiter)

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' }))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/scenes', sceneRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/voice', voiceRoutes)
app.use('/api/sfx', sfxRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/generations', generationRoutes)
app.use('/api/credits', creditRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found', path: req.path }))
app.use(errorHandler)

const PORT = config.port
app.listen(PORT, () => {
  console.log(`🚀 AI Story Studio Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔒 Master AI Kill Switch: ${config.masterAiKillSwitch ? 'ENABLED' : 'DISABLED'}`)
})

export default app
