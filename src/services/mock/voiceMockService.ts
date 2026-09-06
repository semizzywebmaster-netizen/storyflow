import { apiClient } from '@/lib/api-client'

const voiceMockService: any = {
  async list(...args: any[]) { return apiClient.get('/voices', { params: args[0] }) as any },
  async getById(...args: any[]) { return apiClient.get(`/voices/${args[0]}`) as any },
  async create(...args: any[]) { return apiClient.post('/voices', args[0]) as any },
  async update(...args: any[]) { return apiClient.put(`/voices/${args[0]}`, args[1]) as any },
  async delete(...args: any[]) { return apiClient.delete(`/voices/${args[0]}`) as any },
  // Story specific
  async generate(...args: any[]) { return apiClient.post('/stories/generate', { projectId: args[0], prompt: args[1], options: args[2] }) as any },
  async getStory(projectId: string) { return apiClient.get(`/projects/${projectId}/story`) as any },
  async updateStory(projectId: string, data: any) { return apiClient.put(`/projects/${projectId}/story`, data) as any },
  // Character specific
  async generateReference(projectId: string, characterId: string) { return apiClient.post(`/projects/${projectId}/characters/${characterId}/reference`) as any },
  async lockCharacter(projectId: string, characterId: string) { return apiClient.post(`/projects/${projectId}/characters/${characterId}/lock`) as any },
  async unlockCharacter(projectId: string, characterId: string) { return apiClient.post(`/projects/${projectId}/characters/${characterId}/unlock`) as any },
  // Scene specific
  async generateScenes(projectId: string) { return apiClient.post(`/projects/${projectId}/scenes/generate`) as any },
  async reorder(projectId: string, sceneIds: string[]) { return apiClient.post(`/projects/${projectId}/scenes/reorder`, { sceneIds }) as any },
  // Image specific
  async getHistory(params: any) { return apiClient.get('/images/history', { params }) as any },
  async variation(assetId: string) { return apiClient.post(`/images/${assetId}/variation`) as any },
  async upscale(assetId: string) { return apiClient.post(`/images/${assetId}/upscale`) as any },
  // Voice specific
  async listVoices(filters: any) { return apiClient.get('/voices', { params: filters }) as any },
  // Video specific
  async getJobs(projectId: string) { return apiClient.get(`/projects/${projectId}/videos/jobs`) as any },
  async getJobById(jobId: string) { return apiClient.get(`/videos/jobs/${jobId}`) as any },
  async cancelJob(jobId: string) { return apiClient.post(`/videos/jobs/${jobId}/cancel`) as any },
  async getTimeline(projectId: string) { return apiClient.get(`/projects/${projectId}/timeline`) as any },
  async updateTimeline(projectId: string, timeline: any) { return apiClient.put(`/projects/${projectId}/timeline`, timeline) as any },
  async exportVideo(projectId: string, options: any) { return apiClient.post(`/projects/${projectId}/export`, options) as any },
  // Credit specific
  async getBalance() { return apiClient.get('/credits/balance') as any },
  async getTransactions(params: any) { return apiClient.get('/credits/transactions', { params }) as any },
  async estimateCost(op: string, p: any) { return apiClient.post('/credits/estimate', { operation: op, params: p }) as any },
  async purchaseCredits(packageId: string) { return apiClient.post('/credits/purchase', { packageId }) as any },
  // Wallet
  async fundWallet(amount: number, provider: any) { return apiClient.post('/wallet/fund', { amount, provider }) as any },
  async verifyFunding(ref: string) { return apiClient.post('/wallet/verify', { reference: ref }) as any },
  // Payment
  async initializePayment(data: any) { return apiClient.post('/payments/initialize', data) as any },
  async verifyPayment(ref: string) { return apiClient.post('/payments/verify', { reference: ref }) as any },
  async getHistory() { return apiClient.get('/payments/history') as any },
  // Notification
  async markAsRead(id: string) { return apiClient.post(`/notifications/${id}/read`) as any },
  async markAllAsRead() { return apiClient.post('/notifications/read-all') as any },
  async getPreferences() { return apiClient.get('/notifications/preferences') as any },
  async updatePreferences(prefs: any) { return apiClient.put('/notifications/preferences', prefs) as any },
  async getUnreadCount() { return apiClient.get('/notifications/unread-count') as any },
  // Admin
  async getStats() { return apiClient.get('/admin/stats') as any },
  async getUsers(params: any) { return apiClient.get('/admin/users', { params }) as any },
  async getFeatures() { return apiClient.get('/admin/features') as any },
  async updateFeature(key: string, config: any) { return apiClient.put(`/admin/features/${key}`, config) as any },
  async getProviders() { return apiClient.get('/admin/providers') as any },
  async updateProvider(id: string, config: any) { return apiClient.put(`/admin/providers/${id}`, config) as any },
  async getKillSwitch() { return apiClient.get('/admin/kill-switch') as any },
  async toggleKillSwitch(enabled: boolean) { return apiClient.post('/admin/kill-switch', { enabled }) as any },
}

export default voiceMockService
