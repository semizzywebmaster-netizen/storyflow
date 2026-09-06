import { apiClient } from '@/lib/api-client'
import type { IAuthService } from '@/services/interfaces'

const authMockService: IAuthService = {
  async login(email, password) {
    return apiClient.post('/auth/login', { email, password }) as any
  },
  async register(data) {
    return apiClient.post('/auth/register', data) as any
  },
  async logout() {
    localStorage.removeItem('studio_auth_token')
    localStorage.removeItem('studio_refresh_token')
    localStorage.removeItem('studio_user')
  },
  async getCurrentUser() {
    return apiClient.get('/auth/me') as any
  },
  async refreshToken(refreshToken) {
    return apiClient.post('/auth/refresh', { refreshToken }) as any
  },
  async forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email }) as any
  },
  async resetPassword(token, password) {
    return apiClient.post('/auth/reset-password', { token, password }) as any
  },
  async verifyEmail(token) {
    return apiClient.post('/auth/verify-email', { token }) as any
  },
  async updateProfile(data) {
    return apiClient.put('/auth/profile', data) as any
  }
}

export default authMockService
