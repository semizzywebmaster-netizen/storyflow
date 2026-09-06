export interface IAuthService {
  login(email: string, password: string): Promise<ApiResponse<AuthSession>>
  register(data: { email: string; password: string; username: string; displayName: string }): Promise<ApiResponse<AuthSession>>
  logout(): Promise<void>
  getCurrentUser(): Promise<ApiResponse<User>>
  refreshToken(refreshToken: string): Promise<ApiResponse<AuthSession>>
  forgotPassword(email: string): Promise<ApiResponse<void>>
  resetPassword(token: string, password: string): Promise<ApiResponse<void>>
  verifyEmail(token: string): Promise<ApiResponse<void>>
  updateProfile(data: Partial<User>): Promise<ApiResponse<User>>
}

export interface IProjectService {
  list(params?: { page?: number; pageSize?: number; search?: string; status?: string }): Promise<ApiResponse<PaginatedResponse<Project>>>
  getById(id: string): Promise<ApiResponse<Project>>
  create(data: Partial<Project>): Promise<ApiResponse<Project>>
  update(id: string, data: Partial<Project>): Promise<ApiResponse<Project>>
  delete(id: string): Promise<ApiResponse<void>>
  duplicate(id: string): Promise<ApiResponse<Project>>
  archive(id: string): Promise<ApiResponse<Project>>
}

export interface IStoryService {
  generate(projectId: string, prompt: string, options: { culturalMode: CulturalMode; genre: string; tone: string; length: 'short' | 'medium' | 'long'; targetAudience?: string }): Promise<ApiResponse<GenerationJob>>
  getStory(projectId: string): Promise<ApiResponse<Story>>
  updateStory(projectId: string, data: Partial<Story>): Promise<ApiResponse<Story>>
  rewrite(projectId: string, instruction: string, selection?: string): Promise<ApiResponse<GenerationJob>>
  getVersions(projectId: string): Promise<ApiResponse<Story[]>>
  restoreVersion(projectId: string, versionId: string): Promise<ApiResponse<Story>>
  doctorAnalyze(projectId: string): Promise<ApiResponse<{ score: number; issues: string[]; suggestions: string[] }>>
}

export interface ICharacterService {
  list(projectId: string): Promise<ApiResponse<Character[]>>
  getById(projectId: string, characterId: string): Promise<ApiResponse<Character>>
  create(projectId: string, data: Partial<Character>): Promise<ApiResponse<Character>>
  update(projectId: string, characterId: string, data: Partial<Character>): Promise<ApiResponse<Character>>
  delete(projectId: string, characterId: string): Promise<ApiResponse<void>>
  generate(projectId: string, prompt: string): Promise<ApiResponse<GenerationJob>>
  lockCharacter(projectId: string, characterId: string): Promise<ApiResponse<Character>>
  unlockCharacter(projectId: string, characterId: string): Promise<ApiResponse<Character>>
  generateReference(projectId: string, characterId: string, type: string): Promise<ApiResponse<GenerationJob>>
}

export interface ISceneService {
  list(projectId: string): Promise<ApiResponse<Scene[]>>
  getById(projectId: string, sceneId: string): Promise<ApiResponse<Scene>>
  create(projectId: string, data: Partial<Scene>): Promise<ApiResponse<Scene>>
  update(projectId: string, sceneId: string, data: Partial<Scene>): Promise<ApiResponse<Scene>>
  delete(projectId: string, sceneId: string): Promise<ApiResponse<void>>
  generateScenes(projectId: string): Promise<ApiResponse<GenerationJob>>
  reorder(projectId: string, sceneIds: string[]): Promise<ApiResponse<void>>
  directScene(projectId: string, sceneId: string, instruction: string): Promise<ApiResponse<GenerationJob>>
}

export interface IImageService {
  generate(prompt: string, options: { projectId?: string; characterId?: string; sceneId?: string; style?: string; aspectRatio?: string; negativePrompt?: string }): Promise<ApiResponse<GenerationJob>>
  getHistory(params?: { projectId?: string; page?: number }): Promise<ApiResponse<PaginatedResponse<Asset>>>
  getById(id: string): Promise<ApiResponse<Asset>>
  delete(id: string): Promise<ApiResponse<void>>
  variation(assetId: string): Promise<ApiResponse<GenerationJob>>
  upscale(assetId: string): Promise<ApiResponse<GenerationJob>>
}

export interface IVoiceService {
  listVoices(filters?: { language?: string; gender?: string; provider?: string }): Promise<ApiResponse<Voice[]>>
  generate(text: string, options: { voiceId: string; projectId?: string; sceneId?: string; settings?: any }): Promise<ApiResponse<GenerationJob>>
  getHistory(params?: { projectId?: string }): Promise<ApiResponse<PaginatedResponse<Asset>>>
  cloneVoice(name: string, audioFile: File): Promise<ApiResponse<Voice>>
}

export interface IVideoService {
  generate(projectId: string, options: { resolution?: string; includeSubtitles?: boolean; includeMusic?: boolean }): Promise<ApiResponse<VideoJob>>
  getJobs(projectId: string): Promise<ApiResponse<VideoJob[]>>
  getJobById(jobId: string): Promise<ApiResponse<VideoJob>>
  cancelJob(jobId: string): Promise<ApiResponse<void>>
  getTimeline(projectId: string): Promise<ApiResponse<any>>
  updateTimeline(projectId: string, timeline: any): Promise<ApiResponse<any>>
  exportVideo(projectId: string, options: { format: string; quality: string }): Promise<ApiResponse<{ url: string }>>
}

export interface ICreditService {
  getBalance(): Promise<ApiResponse<{ credits: number }>>
  getTransactions(params?: { page?: number; type?: string }): Promise<ApiResponse<PaginatedResponse<CreditTransaction>>>
  estimateCost(operation: string, params?: any): Promise<ApiResponse<{ cost: number; balance: number; sufficient: boolean }>>
  purchaseCredits(packageId: string): Promise<ApiResponse<any>>
}

export interface IWalletService {
  getBalance(): Promise<ApiResponse<{ balance: number }>>
  getTransactions(params?: { page?: number }): Promise<ApiResponse<PaginatedResponse<WalletTransaction>>>
  fundWallet(amount: number, provider: 'PAYSTACK' | 'FLUTTERWAVE'): Promise<ApiResponse<{ paymentUrl: string; reference: string }>>
  verifyFunding(reference: string): Promise<ApiResponse<WalletTransaction>>
}

export interface IPaymentService {
  initializePayment(data: { amount: number; provider: 'PAYSTACK' | 'FLUTTERWAVE'; type: 'CREDITS' | 'SUBSCRIPTION' | 'WALLET'; packageId?: string }): Promise<ApiResponse<{ url: string; reference: string; accessCode?: string }>>
  verifyPayment(reference: string, provider?: 'PAYSTACK' | 'FLUTTERWAVE'): Promise<ApiResponse<any>>
  getHistory(params?: { page?: number }): Promise<ApiResponse<PaginatedResponse<any>>>
}

export interface INotificationService {
  list(params?: { page?: number; unreadOnly?: boolean }): Promise<ApiResponse<PaginatedResponse<any>>>
  markAsRead(id: string): Promise<ApiResponse<void>>
  markAllAsRead(): Promise<ApiResponse<void>>
  getPreferences(): Promise<ApiResponse<any>>
  updatePreferences(prefs: any): Promise<ApiResponse<any>>
  getUnreadCount(): Promise<ApiResponse<{ count: number }>>
}

export interface IAdminService {
  getStats(): Promise<ApiResponse<any>>
  getUsers(params?: any): Promise<ApiResponse<PaginatedResponse<User>>>
  getFeatures(): Promise<ApiResponse<any[]>>
  updateFeature(key: string, config: any): Promise<ApiResponse<any>>
  getProviders(): Promise<ApiResponse<any[]>>
  updateProvider(id: string, config: any): Promise<ApiResponse<any>>
  getKillSwitch(): Promise<ApiResponse<{ enabled: boolean }>>
  toggleKillSwitch(enabled: boolean): Promise<ApiResponse<void>>
}

export interface IAnalyticsService {
  getDashboard(period?: string): Promise<ApiResponse<any>>
  getProjectAnalytics(projectId: string): Promise<ApiResponse<any>>
  trackEvent(event: string, properties?: any): Promise<void>
}
