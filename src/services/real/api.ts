
import { apiClient } from '@/lib/api-client'

// Real API services that replace mocks when backend is ready (Phase 71)
// All services maintain same interface as mocks - service contracts enforced

export const realAuthService = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

export const realProjectService = {
  getProjects: () => apiClient.get('/projects'),
  getProject: (id: string) => apiClient.get(`/projects/${id}`),
  createProject: (data: any) => apiClient.post('/projects', data),
  updateProject: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/projects/${id}`),
}

export const realGenerationService = {
  generateStory: (data: any) => apiClient.post('/generations/story', data),
  generateImage: (data: any) => apiClient.post('/generations/image', data),
  generateVoice: (data: any) => apiClient.post('/generations/voice', data),
  generateVideo: (data: any) => apiClient.post('/generations/video', data),
  getJob: (id: string) => apiClient.get(`/generations/job/${id}`),
}

// Credit service with reserve pattern
export const realCreditService = {
  getBalance: () => apiClient.get('/credits/balance'),
  getHistory: () => apiClient.get('/credits/history'),
  reserve: (amount: number, ref: string) => apiClient.post('/credits/reserve', { amount, referenceId: ref }),
  consume: (ref: string) => apiClient.post('/credits/consume', { referenceId: ref }),
  release: (amount: number, ref: string, reason: string) => apiClient.post('/credits/release', { amount, referenceId: ref, reason }),
}
