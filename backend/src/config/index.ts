import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ai_story_studio',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || 'ai-story-studio',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || '',
    falApiKey: process.env.FAL_API_KEY || '',
    replicateApiKey: process.env.REPLICATE_API_KEY || '',
  },
  payments: {
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    flutterwaveSecretKey: process.env.FLW_SECRET_KEY || '',
    flutterwavePublicKey: process.env.FLW_PUBLIC_KEY || '',
    flutterwaveSecretHash: process.env.FLW_SECRET_HASH || '',
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  enableMock: process.env.ENABLE_MOCK === 'true',
  masterAiKillSwitch: process.env.MASTER_AI_KILL_SWITCH === 'true',
}

if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET || config.jwtSecret === 'dev-jwt-secret-change-in-production') throw new Error('JWT_SECRET must be configured in production')
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured in production')
  if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL must be configured in production')
  if (!config.r2.accountId || !config.r2.accessKeyId || !config.r2.secretAccessKey || !config.r2.publicUrl) throw new Error('R2 storage configuration must be complete in production')
  if (config.enableMock) throw new Error('ENABLE_MOCK must be false in production')
}

export const isProduction = config.nodeEnv === 'production'
export const isDevelopment = config.nodeEnv === 'development'
