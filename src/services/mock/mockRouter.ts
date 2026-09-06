/**
 * Mock API Router - Simulates backend responses
 * This will be replaced by real API client later without touching UI
 */

import { mockUser, mockProjects, mockStory, mockCharacters, mockScenes, mockVoices, mockAssets } from './mockData'

interface MockResponse {
  success: boolean
  data?: any
  message?: string
  meta?: any
}

export async function mockRouter(path: string, method: string, body: any): Promise<MockResponse | null> {
  const url = path.replace(/^\/api/, '').replace(/\?.*$/, '')

  // Auth endpoints
  if (url.includes('/auth/login') && method === 'POST') {
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        user: mockUser,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }
  }

  if (url.includes('/auth/register') && method === 'POST') {
    return {
      success: true,
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        user: { ...mockUser, email: body?.email || mockUser.email, username: body?.username || mockUser.username },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }
  }

  if (url.includes('/auth/me') && method === 'GET') {
    return { success: true, data: mockUser }
  }

  // Projects
  if (url === '/projects' && method === 'GET') {
    return {
      success: true,
      data: {
        data: mockProjects,
        total: mockProjects.length,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }
    }
  }

  if (url.match(/\/projects\/[\w-]+$/) && method === 'GET') {
    const id = url.split('/').pop()
    const project = mockProjects.find(p => p.id === id) || mockProjects[0]
    return {
      success: true,
      data: {
        ...project,
        story: mockStory,
        characters: mockCharacters,
        scenes: mockScenes,
        assets: mockAssets
      }
    }
  }

  if (url === '/projects' && method === 'POST') {
    const newProject = {
      id: `proj_${Date.now()}`,
      userId: mockUser.id,
      title: body?.title || 'Untitled Project',
      description: body?.description || '',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
      status: 'DRAFT' as const,
      culturalMode: body?.culturalMode || 'NIGERIAN',
      language: 'en-NG',
      genre: body?.genre || 'Drama',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characters: [],
      scenes: [],
      assets: [],
      settings: {
        aspectRatio: '16:9' as const,
        resolution: '1080p' as const,
        frameRate: 24 as const,
        subtitleEnabled: true,
        watermarkEnabled: body?.plan === 'FREE'
      }
    }
    return { success: true, data: newProject }
  }

  // Stories
  if (url.includes('/stories/generate') && method === 'POST') {
    return {
      success: true,
      data: {
        id: `job_${Date.now()}`,
        type: 'STORY',
        status: 'COMPLETED',
        progress: 100,
        result: mockStory,
        creditCost: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  if (url.includes('/stories') && url.includes('/story') && method === 'GET') {
    return { success: true, data: mockStory }
  }

  // Characters
  if (url.includes('/characters') && method === 'GET' && !url.match(/\/characters\/[\w-]+$/)) {
    return { success: true, data: mockCharacters }
  }

  if (url.includes('/characters') && method === 'POST') {
    const newChar = {
      id: `char_${Date.now()}`,
      projectId: body?.projectId || 'proj_001',
      name: body?.name || 'New Character',
      role: body?.role || 'SUPPORTING',
      description: body?.description || '',
      personality: '',
      backstory: '',
      appearance: '',
      referenceImages: [],
      locked: false,
      relationships: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return { success: true, data: newChar }
  }

  // Scenes
  if (url.includes('/scenes') && method === 'GET') {
    return { success: true, data: mockScenes }
  }

  // Voices
  if (url.includes('/voices') && method === 'GET') {
    return {
      success: true,
      data: {
        data: mockVoices,
        total: mockVoices.length,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }
    }
  }

  if (url.includes('/voices/generate') && method === 'POST') {
    return {
      success: true,
      data: {
        id: `job_${Date.now()}`,
        type: 'VOICE',
        status: 'COMPLETED',
        progress: 100,
        result: { url: 'https://example.com/audio.mp3' },
        creditCost: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Images
  if (url.includes('/images/generate') && method === 'POST') {
    return {
      success: true,
      data: {
        id: `job_${Date.now()}`,
        type: 'IMAGE',
        status: 'PROCESSING',
        progress: 45,
        creditCost: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  if (url.includes('/images/history') && method === 'GET') {
    return {
      success: true,
      data: {
        data: mockAssets.filter(a => a.type === 'IMAGE'),
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }
    }
  }

  // Video
  if (url.includes('/videos/generate') && method === 'POST') {
    return {
      success: true,
      data: {
        id: `vjob_${Date.now()}`,
        projectId: body?.projectId || 'proj_001',
        status: 'QUEUED',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  if (url.includes('/videos/jobs') && method === 'GET') {
    return {
      success: true,
      data: [
        {
          id: 'vjob_001',
          projectId: 'proj_001',
          status: 'COMPLETED',
          progress: 100,
          videoUrl: 'https://example.com/video.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=600',
          duration: 125,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }
  }

  // Credits
  if (url.includes('/credits/balance') && method === 'GET') {
    return { success: true, data: { credits: mockUser.credits } }
  }

  if (url.includes('/credits/transactions') && method === 'GET') {
    return {
      success: true,
      data: {
        data: [
          { id: 'ct_001', userId: mockUser.id, amount: -5, type: 'SPEND', description: 'Story generation', relatedId: 'proj_001', balanceAfter: 1847, createdAt: new Date().toISOString() },
          { id: 'ct_002', userId: mockUser.id, amount: 500, type: 'PURCHASE', description: 'Creator Plan credits', balanceAfter: 1852, createdAt: '2024-12-01T10:00:00Z' }
        ],
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }
    }
  }

  // Wallet
  if (url.includes('/wallet/balance') && method === 'GET') {
    return { success: true, data: { balance: mockUser.walletBalance } }
  }

  // Notifications
  if (url.includes('/notifications') && method === 'GET') {
    return {
      success: true,
      data: {
        data: [
          { id: 'n_001', type: 'GENERATION_COMPLETED', title: 'Video ready', message: 'Your video for The Return is ready', read: false, createdAt: new Date().toISOString() },
          { id: 'n_002', type: 'CREDITS_LOW', title: 'Low credits', message: 'You have 50 credits left', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() }
        ],
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1
      }
    }
  }

  // Admin
  if (url.includes('/admin/stats') && method === 'GET') {
    return {
      success: true,
      data: {
        totalUsers: 1247,
        activeUsers: 892,
        totalProjects: 3421,
        totalRevenue: 1250000,
        creditUsage: 45230,
        activeSubscriptions: { FREE: 800, CREATOR: 300, PRO: 120, AGENCY: 27 }
      }
    }
  }

  if (url.includes('/admin/features') && method === 'GET') {
    const { featureFlags } = await import('@/config/features')
    return {
      success: true,
      data: Object.entries(featureFlags).map(([key, flag]) => ({ key, ...flag }))
    }
  }

  // If no mock matched, return null to let real API try
  return null
}
