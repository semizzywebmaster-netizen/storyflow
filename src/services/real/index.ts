/**
 * Real Services - Frontend ↔ Backend Integration
 * Service contracts mirror the domain interfaces so production does not
 * silently fall back to demo story data.
 */

import { apiClient } from '@/lib/api-client'

export const realAuthService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password }, { skipAuth: true })
    if (res.data) {
      const token = (res.data as any).token || (res.data as any).accessToken
      if (token) localStorage.setItem('auth_token', token)
    }
    return res
  },
  register: (data: any) => apiClient.post('/auth/register', data, { skipAuth: true }),
  logout: async () => {
    const res = await apiClient.post('/auth/logout')
    localStorage.removeItem('auth_token')
    return res
  },
  getCurrentUser: () => apiClient.get('/auth/me'),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }, { skipAuth: true }),
  resetPassword: (token: string, password: string) => apiClient.post('/auth/reset-password', { token, password }, { skipAuth: true }),
}

export const realProjectService = {
  getProjects: () => apiClient.get('/projects'),
  getProject: (id: string) => apiClient.get(`/projects/${id}`),
  createProject: (data: any) => apiClient.post('/projects', data),
  updateProject: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/projects/${id}`),
}

export const realStoryService = {
  generate: (projectId: string, prompt: string, options: any) =>
    apiClient.post('/stories/generate', {
      projectId,
      prompt,
      genre: options.genre,
      tone: options.tone,
      lengthMinutes: options.length === 'short' ? 5 : options.length === 'long' ? 30 : 15,
      language: options.language || 'en',
      culturalMode: options.culturalMode,
      targetAudience: options.targetAudience,
    }),
  getStory: (projectId: string) => apiClient.get(`/stories/project/${projectId}`),
  updateStory: (projectId: string, data: any) => apiClient.put(`/stories/project/${projectId}`, data),
  rewrite: (projectId: string, instruction: string, selection?: string) =>
    apiClient.post(`/stories/project/${projectId}/rewrite`, { instruction, selection }),
  getVersions: (projectId: string) => apiClient.get(`/stories/project/${projectId}/versions`),
  restoreVersion: (projectId: string, versionId: string) =>
    apiClient.post(`/stories/project/${projectId}/versions/${versionId}/restore`),
  doctorAnalyze: (projectId: string) => apiClient.post(`/stories/project/${projectId}/doctor`),
}

/** Production Character Bible API. */
export const realCharacterService = {
  list: (projectId: string) => apiClient.get(`/characters/project/${projectId}`),
  getById: (_projectId: string, characterId: string) => apiClient.get(`/characters/${characterId}`),
  create: (projectId: string, data: any) => apiClient.post('/characters', { projectId, ...data }),
  update: (_projectId: string, characterId: string, data: any) => apiClient.put(`/characters/${characterId}`, data),
  delete: (_projectId: string, characterId: string) => apiClient.delete(`/characters/${characterId}`),
  generate: (projectId: string, prompt: string) => apiClient.post('/characters/generate-bible', { projectId, prompt, characterCount: 4 }),
  lockCharacter: (_projectId: string, characterId: string) => apiClient.put(`/characters/${characterId}/lock`),
  unlockCharacter: (_projectId: string, characterId: string) => apiClient.put(`/characters/${characterId}/unlock`),
  generateReference: () => Promise.reject(new Error('Character reference generation is not available yet')),
}

export const realGenerationService = {
  generateStory: (data: any) => apiClient.post('/stories/generate', data),
  generateImage: (data: any) => apiClient.post('/generations/image', data),
  generateVoice: (data: any) => apiClient.post('/generations/voice', data),
  generateVideo: (data: any) => apiClient.post('/generations/video', data),
  getJob: (id: string) => apiClient.get(`/generations/job/${id}`),
  generateContentFactory: (data: any) => apiClient.post('/advanced/content-factory', data),
  generateSeriesEpisode: (seriesId: string, data: any) => apiClient.post(`/advanced/series/${seriesId}/episode`, data),
  generateAutoClips: (data: any) => apiClient.post('/advanced/auto-clips', data),
  launchContentAgent: (data: any) => apiClient.post('/advanced/content-agent/launch', data),
  analyzeViral: (data: any) => apiClient.post('/advanced/viral/analyze', data),
  generateThumbnails: (data: any) => apiClient.post('/advanced/thumbnails', data),
}

export const realCreditService = {
  getBalance: () => apiClient.get('/credits/balance'),
  getHistory: () => apiClient.get('/credits/history'),
  purchase: (data: any) => apiClient.post('/credits/purchase', data),
}

export const realWalletService = {
  getWallet: () => apiClient.get('/wallet'),
  getTransactions: () => apiClient.get('/wallet/transactions'),
  fund: (data: any) => apiClient.post('/wallet/fund', data),
}

export const realSubscriptionService = {
  getPlans: () => apiClient.get('/subscriptions/plans'),
  getCurrent: () => apiClient.get('/subscriptions/current'),
  upgrade: (plan: string, idempotencyKey?: string) => apiClient.post('/subscriptions/upgrade', { plan, idempotencyKey }),
  downgrade: (plan: string, idempotencyKey?: string) => apiClient.post('/subscriptions/downgrade', { plan, idempotencyKey }),
  cancel: () => apiClient.post('/subscriptions/cancel'),
  checkFeature: (featureKey: string) => apiClient.get(`/subscriptions/features/${featureKey}/check`),
}

export const realCouponService = {
  validate: (code: string, context: any) => apiClient.post('/coupons/validate', { code, ...context }),
  redeem: (code: string, context: any) => apiClient.post('/coupons/redeem', { code, ...context }),
  getHistory: () => apiClient.get('/coupons/history'),
}

export const realNotificationService = {
  getNotifications: (params?: any) => apiClient.get(`/notifications?${new URLSearchParams(params || {}).toString()}`),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  getPreferences: () => apiClient.get('/notifications/preferences'),
  updatePreferences: (prefs: any) => apiClient.put('/notifications/preferences', { preferences: prefs }),
}

export const realAdsService = {
  getAds: (placement: string) => apiClient.get(`/ads/for-me?placement=${placement}`),
  trackImpression: (id: string, placement: string) => apiClient.post(`/ads/${id}/impression`, { placement }),
  trackClick: (id: string, placement: string) => apiClient.post(`/ads/${id}/click`, { placement }),
  claimReward: (adId: string, verificationToken: string, idempotencyKey?: string) => apiClient.post('/ads/rewarded/claim', { adId, verificationToken, idempotencyKey }),
}

export const realMarketplaceService = {
  getItems: (filters?: any) => apiClient.get(`/marketplace/items?${new URLSearchParams(filters || {}).toString()}`),
  purchase: (itemId: string, paymentRef: string, idempotencyKey: string, provider?: string) => apiClient.post('/marketplace/purchase', { itemId, paymentReference: paymentRef, idempotencyKey, paymentProvider: provider }),
  getMyPurchases: () => apiClient.get('/marketplace/my-purchases'),
}

export const realAgencyService = {
  getWorkspaces: () => apiClient.get('/agency/workspaces'),
  createWorkspace: (data: any) => apiClient.post('/agency/workspaces', data),
  inviteMember: (workspaceId: string, data: any) => apiClient.post(`/agency/workspaces/${workspaceId}/members/invite`, data),
}
