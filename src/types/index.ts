/* Global TypeScript Interfaces for AI Story Studio */

// === Auth ===
export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  plan: 'FREE' | 'CREATOR' | 'PRO' | 'AGENCY'
  credits: number
  walletBalance: number
  emailVerified: boolean
  onboardingCompleted: boolean
  createdAt: string
  lastLoginAt?: string
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export interface AuthSession {
  token: string
  refreshToken: string
  user: User
  expiresAt: string
}

// === Projects ===
export interface Project {
  id: string
  userId: string
  title: string
  description?: string
  thumbnail?: string
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  culturalMode: CulturalMode
  language: string
  genre: string
  createdAt: string
  updatedAt: string
  story?: Story
  characters: Character[]
  scenes: Scene[]
  assets: Asset[]
  settings: ProjectSettings
}

export interface ProjectSettings {
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '21:9'
  resolution: '720p' | '1080p' | '4K'
  frameRate: 24 | 30 | 60
  defaultVoice?: string
  defaultMusicMood?: string
  subtitleEnabled: boolean
  watermarkEnabled: boolean
}

// === Story ===
export type CulturalMode = 
  | 'AMERICAN' | 'INDIAN' | 'CHINESE' | 'KOREAN' 
  | 'NIGERIAN' | 'AFRICAN' | 'JAPANESE' | 'TURKISH' 
  | 'SPANISH' | 'FRENCH' | 'BRAZILIAN' | 'SOUTH_AFRICAN'
  | 'GHANAIAN' | 'KENYAN' | 'YORUBA' | 'IGBO' | 'HAUSA'
  | 'NIGERIAN_PIDGIN' | 'UNIVERSAL'

export interface Story {
  id: string
  projectId: string
  title: string
  logline: string
  synopsis: string
  fullStory: string
  genre: string
  tone: string
  culturalMode: CulturalMode
  targetAudience: string
  estimatedDuration: number
  wordCount: number
  versions: StoryVersion[]
  currentVersionId: string
  createdAt: string
  updatedAt: string
}

export interface StoryVersion {
  id: string
  version: number
  content: string
  changeNotes?: string
  createdAt: string
}

// === Characters ===
export interface Character {
  id: string
  projectId: string
  name: string
  role: 'PROTAGONIST' | 'ANTAGONIST' | 'SUPPORTING' | 'MINOR' | 'NARRATOR'
  age?: number
  gender?: string
  description: string
  personality: string
  backstory: string
  appearance: string
  voiceId?: string
  referenceImages: string[]
  locked: boolean
  relationships: CharacterRelationship[]
  createdAt: string
  updatedAt: string
}

export interface CharacterRelationship {
  characterId: string
  targetCharacterId: string
  type: 'FAMILY' | 'FRIEND' | 'ENEMY' | 'LOVER' | 'MENTOR' | 'COLLEAGUE' | 'OTHER'
  description: string
}

export interface CharacterReference {
  id: string
  characterId: string
  imageUrl: string
  type: 'PORTRAIT' | 'FULL_BODY' | 'EXPRESSION' | 'OUTFIT'
  isPrimary: boolean
}

// === Scenes ===
export interface Scene {
  id: string
  projectId: string
  index: number
  title: string
  description: string
  location: string
  timeOfDay: 'DAWN' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'MIDNIGHT'
  mood: string
  duration: number
  dialogue: DialogueLine[]
  action: string
  characterIds: string[]
  imagePrompt: string
  imageUrl?: string
  voiceUrl?: string
  videoUrl?: string
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface DialogueLine {
  id: string
  characterId: string
  text: string
  emotion: string
  voiceSettings?: VoiceSettings
}

// === Assets ===
export type AssetType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE' | 'MUSIC' | 'SFX' | 'SUBTITLE' | 'THUMBNAIL'

export interface Asset {
  id: string
  projectId: string
  type: AssetType
  url: string
  thumbnailUrl?: string
  name: string
  size: number
  mimeType: string
  metadata?: Record<string, any>
  createdAt: string
}

// === Voice ===
export interface Voice {
  id: string
  name: string
  provider: 'ELEVENLABS' | 'GOOGLE' | 'AZURE' | 'POLLY' | 'MOCK'
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL'
  age: 'YOUNG' | 'ADULT' | 'MATURE' | 'ELDERLY'
  accent: string
  language: string
  previewUrl?: string
  isPremium: boolean
}

export interface VoiceSettings {
  voiceId: string
  stability: number
  similarity: number
  style: number
  speed: number
  pitch: number
}

// === Video ===
export interface VideoJob {
  id: string
  projectId: string
  status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  progress: number
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  error?: string
  createdAt: string
  updatedAt: string
}

export interface Timeline {
  id: string
  projectId: string
  tracks: TimelineTrack[]
  duration: number
}

export interface TimelineTrack {
  id: string
  type: 'VIDEO' | 'AUDIO' | 'VOICE' | 'MUSIC' | 'SFX' | 'SUBTITLE' | 'EFFECT'
  items: TimelineItem[]
  locked: boolean
  muted: boolean
}

export interface TimelineItem {
  id: string
  assetId: string
  startTime: number
  duration: number
  offset: number
  volume?: number
  properties?: Record<string, any>
}

// === Credits & Wallet ===
export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  type: 'EARN' | 'SPEND' | 'BONUS' | 'REFUND' | 'PURCHASE'
  description: string
  relatedId?: string
  balanceAfter: number
  createdAt: string
}

export interface WalletTransaction {
  id: string
  userId: string
  amount: number
  type: 'DEPOSIT' | 'SPEND' | 'REFUND' | 'BONUS'
  description: string
  paymentId?: string
  balanceAfter: number
  createdAt: string
}

export interface Subscription {
  id: string
  userId: string
  plan: 'FREE' | 'CREATOR' | 'PRO' | 'AGENCY'
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
}

// === API ===
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface GenerationJob {
  id: string
  type: 'STORY' | 'IMAGE' | 'VOICE' | 'VIDEO' | 'MUSIC' | 'SUBTITLE' | 'THUMBNAIL' | 'SOCIAL'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  result?: any
  error?: string
  creditCost: number
  createdAt: string
  updatedAt: string
}

// === UI ===
export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export interface Breadcrumb {
  label: string
  href?: string
  active?: boolean
}

// === Admin ===
export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalRevenue: number
  creditUsage: number
  activeSubscriptions: Record<string, number>
}
