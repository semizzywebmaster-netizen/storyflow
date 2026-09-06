/**
 * Service Factory - Centralized service provider
 * Switches between mock and real implementations based on config
 * UI never imports mock directly - only via this factory
 */

import { appConfig } from '@/config'
import type {
  IAuthService,
  IProjectService,
  IStoryService,
  ICharacterService,
  ISceneService,
  IImageService,
  IVoiceService,
  IVideoService,
  ICreditService,
  IWalletService,
  IPaymentService,
  INotificationService,
  IAdminService,
  IAnalyticsService
} from './interfaces'

// Mock implementations will be lazy loaded
let services: {
  auth?: IAuthService
  project?: IProjectService
  story?: IStoryService
  character?: ICharacterService
  scene?: ISceneService
  image?: IImageService
  voice?: IVoiceService
  video?: IVideoService
  credit?: ICreditService
  wallet?: IWalletService
  payment?: IPaymentService
  notification?: INotificationService
  admin?: IAdminService
  analytics?: IAnalyticsService
} = {}

// Generic service loader with fallback to mock
async function loadService<T>(name: string, mockLoader: () => Promise<{ default: T } & any>): Promise<T> {
  if (!appConfig.enableMock) {
    // In production, load real API services from ./api/
    try {
      const realModule = await import(`./api/${name}Service.ts`)
      return realModule.default as T
    } catch {
      // Fallback to mock if real not implemented yet (frontend-first strategy)
      const mockModule = await mockLoader()
      return (mockModule.default || mockModule) as T
    }
  }

  // Mock mode - load mock services
  const mockModule = await mockLoader()
  return (mockModule.default || mockModule) as T
}

export async function getAuthService(): Promise<IAuthService> {
  if (services.auth) return services.auth
  services.auth = await loadService<IAuthService>('auth', () => import('./mock/authMockService'))
  return services.auth
}

export async function getProjectService(): Promise<IProjectService> {
  if (services.project) return services.project
  services.project = await loadService<IProjectService>('project', () => import('./mock/projectMockService'))
  return services.project
}

export async function getStoryService(): Promise<IStoryService> {
  if (services.story) return services.story
  services.story = await loadService<IStoryService>('story', () => import('./mock/storyMockService'))
  return services.story
}

export async function getCharacterService(): Promise<ICharacterService> {
  if (services.character) return services.character
  services.character = await loadService<ICharacterService>('character', () => import('./mock/characterMockService'))
  return services.character
}

export async function getSceneService(): Promise<ISceneService> {
  if (services.scene) return services.scene
  services.scene = await loadService<ISceneService>('scene', () => import('./mock/sceneMockService'))
  return services.scene
}

export async function getImageService(): Promise<IImageService> {
  if (services.image) return services.image
  services.image = await loadService<IImageService>('image', () => import('./mock/imageMockService'))
  return services.image
}

export async function getVoiceService(): Promise<IVoiceService> {
  if (services.voice) return services.voice
  services.voice = await loadService<IVoiceService>('voice', () => import('./mock/voiceMockService'))
  return services.voice
}

export async function getVideoService(): Promise<IVideoService> {
  if (services.video) return services.video
  services.video = await loadService<IVideoService>('video', () => import('./mock/videoMockService'))
  return services.video
}

export async function getCreditService(): Promise<ICreditService> {
  if (services.credit) return services.credit
  services.credit = await loadService<ICreditService>('credit', () => import('./mock/creditMockService'))
  return services.credit
}

export async function getWalletService(): Promise<IWalletService> {
  if (services.wallet) return services.wallet
  services.wallet = await loadService<IWalletService>('wallet', () => import('./mock/walletMockService'))
  return services.wallet
}

export async function getPaymentService(): Promise<IPaymentService> {
  if (services.payment) return services.payment
  services.payment = await loadService<IPaymentService>('payment', () => import('./mock/paymentMockService'))
  return services.payment
}

export async function getNotificationService(): Promise<INotificationService> {
  if (services.notification) return services.notification
  services.notification = await loadService<INotificationService>('notification', () => import('./mock/notificationMockService'))
  return services.notification
}

export async function getAdminService(): Promise<IAdminService> {
  if (services.admin) return services.admin
  services.admin = await loadService<IAdminService>('admin', () => import('./mock/adminMockService'))
  return services.admin
}

// Synchronous accessors for already loaded services (used in components after initial load)
// For phase 00, we provide a simple direct API client fallback
export { apiClient } from '@/lib/api-client'
