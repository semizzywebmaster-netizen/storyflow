
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { rateLimiter } from './middleware/rateLimiter'
import { xssProtection } from './middleware/securityAudit'
import { authRoutes } from './routes/auth.routes'
import { projectRoutes } from './routes/project.routes'
import { storyRoutes } from './routes/story.routes'
import { characterRoutes } from './routes/character.routes'
import { sceneRoutes } from './routes/scene.routes'
import { assetRoutes } from './routes/asset.routes'
import { generationRoutes } from './routes/generation.routes'
import { creditRoutes } from './routes/credit.routes'
import { walletRoutes } from './routes/wallet.routes'
import { paymentRoutes } from './routes/payment.routes'
import { subscriptionRoutes } from './routes/subscription.routes'
import { couponRoutes } from './routes/coupon.routes'
import { notificationRoutes } from './routes/notification.routes'
import { announcementRoutes } from './routes/announcement.routes'
import { adsRoutes } from './routes/ads.routes'
import { advancedAIRoutes } from './routes/advancedAI.routes'
import { agencyRoutes } from './routes/agency.routes'
import { marketplaceRoutes } from './routes/marketplace.routes'
import { analyticsRoutes } from './routes/analytics.routes'
import { monitoringRoutes } from './routes/monitoring.routes'
import { adminRoutes } from './routes/admin.routes'

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for dev, enable strict in production
  crossOriginEmbedderPolicy: false,
}))
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000', 'https://aistorystudio.com'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)
app.use(rateLimiter)
app.use(xssProtection)

// Health check - public
app.get('/health', async (req, res) => {
  const { monitoringService } = await import('./services/monitoringService')
  const health = await monitoringService.getHealth()
  res.status(health.status === 'ok' ? 200 : 503).json(health)
})

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/scenes', sceneRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/generations', generationRoutes)
app.use('/api/credits', creditRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/ads', adsRoutes)
app.use('/api/advanced', advancedAIRoutes)
app.use('/api/agency', agencyRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/monitoring', monitoringRoutes)
app.use('/api/admin', adminRoutes)

// API docs
app.get('/api', (req, res) => {
  res.json({
    name: 'AI Story Studio API',
    version: '1.0.0',
    status: 'ok',
    endpoints: [
      '/api/auth',
      '/api/projects',
      '/api/stories',
      '/api/characters',
      '/api/scenes',
      '/api/assets',
      '/api/generations',
      '/api/credits',
      '/api/wallet',
      '/api/payments',
      '/api/subscriptions',
      '/api/coupons',
      '/api/notifications',
      '/api/announcements',
      '/api/ads',
      '/api/advanced',
      '/api/agency',
      '/api/marketplace',
      '/api/analytics',
      '/api/monitoring',
      '/api/admin',
    ],
    docs: '/docs/API.md',
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.path })
})

// Error handler - must be last
app.use(errorHandler)

const PORT = config.port
app.listen(PORT, () => {
  console.log(`🚀 AI Story Studio Backend running on port ${PORT}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔒 Master AI Kill Switch: ${config.masterAiKillSwitch ? 'ENABLED' : 'DISABLED'}`)
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`)
  console.log(`💳 Payments: Paystack ${config.payments.paystackSecretKey ? 'configured' : 'NOT configured (mock mode)'}, Flutterwave ${config.payments.flutterwaveSecretKey ? 'configured' : 'NOT configured'}`)
  console.log(`🤖 AI Providers: ${Object.entries(config.ai).filter(([k,v]) => v).map(([k]) => k).join(', ') || 'none (mock mode)'}`)
  console.log(`📦 R2: ${config.r2.bucket} ${config.r2.accountId ? 'configured' : 'NOT configured'}`)
})

export default app
