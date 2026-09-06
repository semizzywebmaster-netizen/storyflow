import { appConfig } from '@/config'
import { apiClient } from '@/lib/api-client'
import type { IAuthService, IProjectService, IStoryService, ICharacterService, ISceneService, IImageService, IVoiceService, IVideoService, ICreditService, IWalletService, IPaymentService, INotificationService, IAdminService } from './interfaces'
import { realAuthService, realProjectService, realStoryService, realCharacterService, realSceneService, realImageService, realVoiceService, realVideoService, realCreditService, realWalletService, realNotificationService, realSubscriptionService, realCouponService, realAdsService, realMarketplaceService, realAgencyService } from './real'

let services: { auth?: IAuthService; project?: IProjectService; story?: IStoryService; character?: ICharacterService; scene?: ISceneService; image?: IImageService; voice?: IVoiceService; video?: IVideoService; credit?: ICreditService; wallet?: IWalletService; payment?: IPaymentService; notification?: INotificationService; admin?: IAdminService } = {}

async function loadMock<T>(loader: () => Promise<any>): Promise<T> { const mod = await loader(); return (mod.default || mod) as T }
const unsupported = (feature: string): never => { throw new Error(`${feature} is not available in the production API yet.`) }

const realPaymentService: IPaymentService = {
  initializePayment: async (data) => {
    if (data.type !== 'WALLET') return unsupported(`Payment type ${data.type}`)
    const res: any = await apiClient.post('/payments/initialize', { amount: data.amount, provider: data.provider })
    return { ...res, data: { url: res.data?.paymentUrl, reference: res.data?.reference, accessCode: res.data?.accessCode } }
  },
  verifyPayment: async (reference, provider = 'PAYSTACK') => apiClient.post('/payments/verify', { provider, reference }) as any,
  getHistory: () => apiClient.get('/payments/history') as any,
}

const realAdminService: IAdminService = {
  getStats: () => apiClient.get('/admin/stats') as any,
  getUsers: async () => unsupported('Admin user management'),
  getFeatures: () => apiClient.get('/admin/features') as any,
  updateFeature: (key, config) => apiClient.put(`/admin/features/${encodeURIComponent(key)}`, config) as any,
  getProviders: () => apiClient.get('/admin/providers') as any,
  updateProvider: async () => unsupported('Admin provider updates'),
  getKillSwitch: async () => {
    const res: any = await apiClient.get('/admin/features')
    const feature = Array.isArray(res.data) ? res.data.find((item: any) => item.key === 'MASTER_AI_KILL_SWITCH') : undefined
    return { ...res, data: { enabled: Boolean(feature?.isEnabled) } }
  },
  toggleKillSwitch: async (enabled) => { await apiClient.post('/admin/kill-switch', { enabled }) },
}

export async function getAuthService(): Promise<IAuthService> { if (services.auth) return services.auth; services.auth = appConfig.enableMock ? await loadMock(() => import('./mock/authMockService')) : realAuthService as unknown as IAuthService; return services.auth }
export async function getProjectService(): Promise<IProjectService> { if (services.project) return services.project; services.project = appConfig.enableMock ? await loadMock(() => import('./mock/projectMockService')) : realProjectService as unknown as IProjectService; return services.project }
export async function getStoryService(): Promise<IStoryService> { if (services.story) return services.story; services.story = appConfig.enableMock ? await loadMock(() => import('./mock/storyMockService')) : realStoryService as unknown as IStoryService; return services.story }
export async function getCharacterService(): Promise<ICharacterService> { if (services.character) return services.character; services.character = appConfig.enableMock ? await loadMock(() => import('./mock/characterMockService')) : realCharacterService as unknown as ICharacterService; return services.character }
export async function getSceneService(): Promise<ISceneService> { if (services.scene) return services.scene; services.scene = appConfig.enableMock ? await loadMock(() => import('./mock/sceneMockService')) : realSceneService as unknown as ISceneService; return services.scene }
export async function getImageService(): Promise<IImageService> { if (services.image) return services.image; services.image = appConfig.enableMock ? await loadMock(() => import('./mock/imageMockService')) : realImageService as unknown as IImageService; return services.image }
export async function getVoiceService(): Promise<IVoiceService> { if (services.voice) return services.voice; services.voice = appConfig.enableMock ? await loadMock(() => import('./mock/voiceMockService')) : realVoiceService as unknown as IVoiceService; return services.voice }
export async function getVideoService(): Promise<IVideoService> { if (services.video) return services.video; services.video = appConfig.enableMock ? await loadMock(() => import('./mock/videoMockService')) : realVideoService as unknown as IVideoService; return services.video }
export async function getCreditService(): Promise<ICreditService> { if (services.credit) return services.credit; services.credit = appConfig.enableMock ? await loadMock(() => import('./mock/creditMockService')) : realCreditService as unknown as ICreditService; return services.credit }
export async function getWalletService(): Promise<IWalletService> { if (services.wallet) return services.wallet; services.wallet = appConfig.enableMock ? await loadMock(() => import('./mock/walletMockService')) : realWalletService as unknown as IWalletService; return services.wallet }
export async function getPaymentService(): Promise<IPaymentService> { if (services.payment) return services.payment; services.payment = appConfig.enableMock ? await loadMock(() => import('./mock/paymentMockService')) : realPaymentService; return services.payment }
export async function getNotificationService(): Promise<INotificationService> { if (services.notification) return services.notification; services.notification = appConfig.enableMock ? await loadMock(() => import('./mock/notificationMockService')) : realNotificationService as unknown as INotificationService; return services.notification }
export async function getAdminService(): Promise<IAdminService> { if (services.admin) return services.admin; services.admin = appConfig.enableMock ? await loadMock(() => import('./mock/adminMockService')) : realAdminService; return services.admin }

export { realSubscriptionService, realCouponService, realAdsService, realMarketplaceService, realAgencyService }
export { apiClient }
