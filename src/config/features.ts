/**
 * Feature Flags - Centralized control
 * Every major feature must be controllable
 * Admin will eventually override these via API
 */

export interface FeatureFlag {
  enabled: boolean
  plans: Array<'FREE' | 'CREATOR' | 'PRO' | 'AGENCY'>
  beta?: boolean
  comingSoon?: boolean
  creditCost?: number
  dailyLimit?: number | null
  monthlyLimit?: number | null
}

export const featureFlags = {
  // Core Creation Pipeline
  storyGenerator: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 5 } as FeatureFlag,
  storyWorkspace: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  characterBible: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  characterLock: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'], creditCost: 3 } as FeatureFlag,
  advancedCharacterLock: { enabled: true, plans: ['PRO', 'AGENCY'], beta: true } as FeatureFlag,
  sceneEngine: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  aiDirector: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  storyDoctor: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  rewriteStudio: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,

  // Media Generation
  imageStudio: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 5 } as FeatureFlag,
  voiceStudio: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 4 } as FeatureFlag,
  musicSfxStudio: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'], creditCost: 3 } as FeatureFlag,
  videoGeneration: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 20 } as FeatureFlag,
  videoEditor: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  subtitleStudio: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 3 } as FeatureFlag,
  thumbnailStudio: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'], creditCost: 2 } as FeatureFlag,
  socialMediaStudio: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'], creditCost: 5 } as FeatureFlag,

  // Advanced AI
  contentFactory: { enabled: true, plans: ['CREATOR', 'PRO', 'AGENCY'], creditCost: 10, beta: true } as FeatureFlag,
  seriesBuilder: { enabled: true, plans: ['PRO', 'AGENCY'], creditCost: 15, beta: true } as FeatureFlag,
  autoClips: { enabled: true, plans: ['PRO', 'AGENCY'], creditCost: 15 } as FeatureFlag,
  contentAgent: { enabled: true, plans: ['PRO', 'AGENCY'], creditCost: 20, beta: true } as FeatureFlag,
  viralOptimizer: { enabled: true, plans: ['PRO', 'AGENCY'], creditCost: 8 } as FeatureFlag,

  // Workspace
  assetLibrary: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  brandKit: { enabled: true, plans: ['PRO', 'AGENCY'] } as FeatureFlag,
  agencyWorkspace: { enabled: true, plans: ['AGENCY'] } as FeatureFlag,
  marketplace: { enabled: false, plans: ['CREATOR', 'PRO', 'AGENCY'], comingSoon: true } as FeatureFlag,
  referralSystem: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  socialScheduling: { enabled: true, plans: ['PRO', 'AGENCY'], beta: true } as FeatureFlag,

  // Monetization
  credits: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  subscriptions: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  wallet: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  payments: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  coupons: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  ads: { enabled: true, plans: ['FREE'] } as FeatureFlag,

  // Platform
  notifications: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  pwa: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,
  analytics: { enabled: true, plans: ['PRO', 'AGENCY'] } as FeatureFlag,
  announcements: { enabled: true, plans: ['FREE', 'CREATOR', 'PRO', 'AGENCY'] } as FeatureFlag,

  // Admin
  adminDashboard: { enabled: true, plans: ['AGENCY'] } as FeatureFlag,
  featureControl: { enabled: true, plans: ['AGENCY'] } as FeatureFlag,
  aiProviderManager: { enabled: true, plans: ['AGENCY'] } as FeatureFlag,

  // Kill Switch
  killSwitch: { enabled: false, plans: [] } as FeatureFlag, // MASTER AI KILL SWITCH - when true, blocks all AI
} as const

export type FeatureKey = keyof typeof featureFlags

export function isFeatureEnabled(key: FeatureKey, userPlan: string = 'FREE'): boolean {
  const flag = featureFlags[key]
  if (!flag) return false
  if (featureFlags.killSwitch.enabled && key !== 'killSwitch') {
    // If kill switch is on, block AI features
    const aiFeatures: FeatureKey[] = ['storyGenerator', 'imageStudio', 'voiceStudio', 'videoGeneration', 'contentFactory', 'seriesBuilder', 'autoClips', 'contentAgent']
    if (aiFeatures.includes(key)) return false
  }
  if (!flag.enabled) return false
  return flag.plans.includes(userPlan as any)
}

export function getFeatureCost(key: FeatureKey): number {
  return featureFlags[key]?.creditCost || 0
}
