export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'AI Story Studio',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  // Mocks are development-only. A production build can never enable demo services.
  enableMock: import.meta.env.MODE !== 'production' && import.meta.env.VITE_ENABLE_MOCK === 'true',
  enablePwa: import.meta.env.VITE_ENABLE_PWA !== 'false',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  env: import.meta.env.MODE,
  defaultPageSize: 20,
  maxUploadSizeMB: 100,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/mov'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  defaultStoryLength: 'medium',
  defaultImageAspectRatio: '16:9',
  defaultVideoResolution: '1080p',
  storageKeys: {
    authToken: 'auth_token',
    refreshToken: 'studio_refresh_token',
    user: 'studio_user',
    theme: 'studio_theme',
    onboarding: 'studio_onboarding',
    recentProjects: 'studio_recent_projects'
  },
  routes: {
    home: '/', login: '/login', register: '/register', dashboard: '/dashboard', projects: '/projects', projectDetail: '/projects/:id',
    story: '/studio/story', characters: '/studio/characters', scenes: '/studio/scenes', images: '/studio/images', voices: '/studio/voices',
    video: '/studio/video', library: '/library', settings: '/settings', admin: '/admin'
  },
  creditCosts: {
    storyGeneration: 5, characterGeneration: 3, sceneGeneration: 2, imageGeneration: 5, imageVariation: 2,
    voiceGeneration: 4, videoGeneration: 20, subtitleGeneration: 3, thumbnailGeneration: 2, socialPackage: 5,
    autoClips: 15, contentFactory: 10, viralAnalysis: 8
  },
  plans: {
    FREE: { name: 'Free', price: 0, credits: 50, label: 'FREE' },
    CREATOR: { name: 'Creator', price: 19, credits: 500, label: 'CREATOR' },
    PRO: { name: 'Pro', price: 49, credits: 2000, label: 'PRO' },
    AGENCY: { name: 'Agency', price: 99, credits: 5000, label: 'AGENCY' }
  }
} as const

export type AppConfig = typeof appConfig
