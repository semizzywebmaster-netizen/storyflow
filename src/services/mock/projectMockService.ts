import { apiClient } from '@/lib/api-client'
import type { IProjectService } from '@/services/interfaces'

const projectMockService: IProjectService = {
  async list(params) {
    return apiClient.get('/projects', { params: params as any }) as any
  },
  async getById(id) {
    return apiClient.get(`/projects/${id}`) as any
  },
  async create(data) {
    return apiClient.post('/projects', data) as any
  },
  async update(id, data) {
    return apiClient.put(`/projects/${id}`, data) as any
  },
  async delete(id) {
    return apiClient.delete(`/projects/${id}`) as any
  },
  async duplicate(id) {
    return apiClient.post(`/projects/${id}/duplicate`) as any
  },
  async archive(id) {
    return apiClient.post(`/projects/${id}/archive`) as any
  }
}

export default projectMockService
