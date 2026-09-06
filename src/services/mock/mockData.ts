import type { User, Project, Story, Character, Scene, Voice, Asset } from '@/types'

export const mockUser: User = {
  id: 'user_001',
  email: 'creator@aistorystudio.com',
  username: 'african_storyteller',
  displayName: 'Mizzy Creator',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mizzy',
  plan: 'PRO',
  credits: 1847,
  walletBalance: 25000,
  emailVerified: true,
  onboardingCompleted: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastLoginAt: new Date().toISOString(),
  role: 'USER'
}

export const mockVoices: Voice[] = [
  { id: 'voice_001', name: 'Amara - Warm Nigerian Female', provider: 'ELEVENLABS', gender: 'FEMALE', age: 'ADULT', accent: 'Nigerian', language: 'en-NG', previewUrl: '', isPremium: false },
  { id: 'voice_002', name: 'Chike - Deep Nigerian Male', provider: 'ELEVENLABS', gender: 'MALE', age: 'ADULT', accent: 'Nigerian', language: 'en-NG', previewUrl: '', isPremium: false },
  { id: 'voice_003', name: 'Zainab - Hausa Female', provider: 'ELEVENLABS', gender: 'FEMALE', age: 'YOUNG', accent: 'Hausa', language: 'ha-NG', previewUrl: '', isPremium: true },
  { id: 'voice_004', name: 'David - American Storyteller', provider: 'ELEVENLABS', gender: 'MALE', age: 'MATURE', accent: 'American', language: 'en-US', previewUrl: '', isPremium: false }
]

export const mockProjects: Project[] = [
  { id: 'proj_001', userId: 'user_001', title: 'The Return - Nigerian Family Drama', description: 'A young man returns home after many years abroad to face family secrets.', thumbnail: 'https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=600', status: 'IN_PROGRESS', culturalMode: 'NIGERIAN', language: 'en-NG', genre: 'Drama', createdAt: '2024-12-01T10:00:00Z', updatedAt: new Date().toISOString(), characters: [], scenes: [], assets: [], settings: { aspectRatio: '16:9', resolution: '1080p', frameRate: 24, subtitleEnabled: true, watermarkEnabled: false } },
  { id: 'proj_002', userId: 'user_001', title: 'Lagos Love Story', description: 'Modern romance set in the heart of Lagos.', thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=600', status: 'COMPLETED', culturalMode: 'YORUBA', language: 'en-NG', genre: 'Romance', createdAt: '2024-11-20T08:00:00Z', updatedAt: '2024-11-28T15:00:00Z', characters: [], scenes: [], assets: [], settings: { aspectRatio: '9:16', resolution: '1080p', frameRate: 30, subtitleEnabled: true, watermarkEnabled: false } },
  { id: 'proj_003', userId: 'user_001', title: 'Ancient Kingdom of Oyo', description: 'Epic tale from Yoruba folklore.', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', status: 'DRAFT', culturalMode: 'YORUBA', language: 'en-NG', genre: 'Folklore', createdAt: '2024-12-10T09:00:00Z', updatedAt: '2024-12-10T09:00:00Z', characters: [], scenes: [], assets: [], settings: { aspectRatio: '21:9', resolution: '4K', frameRate: 24, subtitleEnabled: true, watermarkEnabled: true } }
]

export const mockStory: Story = {
  id: 'story_001', projectId: 'proj_001', title: 'The Return',
  logline: "After 15 years in America, Emeka returns to his village in Anambra to discover his father's hidden legacy and confront his own identity.",
  synopsis: "Emeka, a 32-year-old Nigerian-American software engineer, receives news that his estranged father is ill. He returns to his hometown after 15 years to find family secrets, cultural conflicts, and a chance for redemption.",
  fullStory: `CHAPTER 1: THE CALL\n\nThe phone rang at 3:47 AM. Emeka stared at the screen - Mama. His mother never called at this hour unless...\n\n"Emeka, your father..." Her voice cracked. "He is asking for you."\n\nFifteen years. Fifteen years since he left the village with a scholarship and a promise to return. Fifteen years of unanswered calls, of WhatsApp messages left on read, of his father's stern voice on the rare occasions they spoke.\n\n"I will come," he whispered.\n\nCHAPTER 2: HOMECOMING\n\nMurtala Muhammed Airport smelled the same - heat, diesel, and possibility. Lagos had grown while he was gone, towers of glass rising beside familiar danfos...`,
  genre: 'Drama', tone: 'Emotional, Reflective, Hopeful', culturalMode: 'NIGERIAN', targetAudience: 'Adults 25-45, Diaspora Nigerians, Family drama lovers', estimatedDuration: 12, wordCount: 2450,
  versions: [
    { id: 'v1', version: 1, content: 'Initial draft', createdAt: '2024-12-01T10:00:00Z' },
    { id: 'v2', version: 2, content: 'Extended version with more cultural details', changeNotes: 'Added Igbo cultural elements', createdAt: '2024-12-02T10:00:00Z' }
  ], currentVersionId: 'v2', createdAt: '2024-12-01T10:00:00Z', updatedAt: new Date().toISOString()
}

export const mockCharacters: Character[] = [
  { id: 'char_001', projectId: 'proj_001', name: 'Emeka Okafor', role: 'PROTAGONIST', age: 32, gender: 'Male', description: 'A Nigerian-American software engineer returning home after 15 years', personality: 'Intelligent but conflicted, carries guilt, seeks redemption, proud but humble', backstory: 'Left Nigeria at 17 for scholarship in US, built successful career but lost connection to family', appearance: 'Tall, athletic build, well-groomed beard, wears modern casual with traditional touches, warm eyes', voiceId: 'voice_002', referenceImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'], locked: true, relationships: [], createdAt: '2024-12-01T11:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'char_002', projectId: 'proj_001', name: 'Papa Okafor', role: 'SUPPORTING', age: 68, gender: 'Male', description: 'Patriarch of the Okafor family, traditional Igbo elder', personality: 'Stern but loving, principled, wise, holds family honor above all', backstory: 'Retired school principal, community leader, built family from nothing', appearance: 'Elderly, grey hair, traditional Igbo attire, walking stick, dignified presence', voiceId: 'voice_004', referenceImages: ['https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'], locked: true, relationships: [], createdAt: '2024-12-01T11:05:00Z', updatedAt: new Date().toISOString() },
  { id: 'char_003', projectId: 'proj_001', name: 'Adaeze', role: 'SUPPORTING', age: 28, gender: 'Female', description: 'Emeka\'s younger sister, vibrant and independent', personality: 'Bold, modern Nigerian woman, bridge between tradition and progress', backstory: 'Studied law in Lagos, runs family business, kept family together during Emeka\'s absence', appearance: 'Beautiful, natural hair, ankara mixed with modern fashion, confident smile', voiceId: 'voice_001', referenceImages: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400'], locked: false, relationships: [], createdAt: '2024-12-01T11:10:00Z', updatedAt: new Date().toISOString() }
]

export const mockScenes: Scene[] = [
  { id: 'scene_001', projectId: 'proj_001', index: 0, title: 'The Midnight Call', description: 'Emeka receives life-changing call in his New York apartment', location: 'New York Apartment - Night', timeOfDay: 'NIGHT', mood: 'Tense, Emotional', duration: 90, dialogue: [{ id: 'd1', characterId: 'char_001', text: 'Mama? What happened? Is it Papa?', emotion: 'Worried', voiceSettings: { voiceId: 'voice_002', stability: 0.8, similarity: 0.7, style: 0.5, speed: 1, pitch: 0 } }], action: 'Emeka sits up in bed, phone light illuminating his worried face', characterIds: ['char_001'], imagePrompt: 'A young Nigerian man in a modern New York apartment at 3AM, phone call, dramatic lighting, emotional', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', status: 'COMPLETED', createdAt: '2024-12-01T12:00:00Z', updatedAt: new Date().toISOString() },
  { id: 'scene_002', projectId: 'proj_001', index: 1, title: 'Lagos Arrival', description: 'Emeka arrives at Lagos airport, overwhelmed by memories', location: 'Murtala Muhammed Airport - Day', timeOfDay: 'AFTERNOON', mood: 'Nostalgic, Overwhelming', duration: 120, dialogue: [], action: 'Emeka walks through bustling airport, people staring, sounds of Pidgin', characterIds: ['char_001'], imagePrompt: 'Busy Lagos airport, Nigerian travelers, vibrant colors, cinematic', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', status: 'COMPLETED', createdAt: '2024-12-01T12:05:00Z', updatedAt: new Date().toISOString() }
]

export const mockAssets: Asset[] = [
  { id: 'asset_001', projectId: 'proj_001', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=200', name: 'Village Sunset', size: 2450000, mimeType: 'image/jpeg', createdAt: new Date().toISOString() }
]
