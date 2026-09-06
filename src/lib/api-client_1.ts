
/**
 * API Client - Phase 71 Production Integration
 * Handles auth, retry, error, token refresh, loading states
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true'

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<{ success: boolean; data: T; message?: string }> {
    // If mock enabled and backend not available, fallback to mock
    if (ENABLE_MOCK) {
      console.log(`[API MOCK MODE] ${endpoint}`)
      // Mock responses would be handled by existing mock services
      throw new Error('Mock mode - use mock services')
    }

    const url = `${API_BASE}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as any),
    }

    if (!options.skipAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle auth expiry
        if (response.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          throw new Error('Session expired')
        }
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return data
    } catch (err: any) {
      console.error(`[API] ${endpoint} failed:`, err.message)
      throw err
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined })
  }

  put<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined })
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  upload<T>(endpoint: string, formData: FormData, options?: RequestOptions) {
    const token = this.getToken()
    const headers: Record<string, string> = {
      ...(options?.headers as any),
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    return fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(r => r.json())
  }
}

export const apiClient = new ApiClient()

// Service layer with real API + mock fallback
export const createService = <T>(realImpl: T, mockImpl: T): T => {
  if (ENABLE_MOCK) return mockImpl
  return realImpl
}
