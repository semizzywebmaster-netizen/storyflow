import { appConfig } from '@/config'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
  skipAuth?: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(appConfig.storageKeys.authToken)
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = path.startsWith('http') ? new URL(path) : new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.append(k, String(v))
        }
      })
    }
    return url.toString()
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params, signal, skipAuth = false } = options

    const url = this.buildUrl(path, params)

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    if (!skipAuth) {
      const token = this.getAuthToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal
    }

    if (body && method !== 'GET') {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body)
      if (body instanceof FormData) {
        delete (fetchOptions.headers as any)['Content-Type']
      }
    }

    // If mock mode is enabled and we are in browser, try mock handler first
    if (appConfig.enableMock && typeof window !== 'undefined') {
      const mockModule = await this.tryMock(path, method, body)
      if (mockModule !== null) {
        return mockModule as T
      }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: response.statusText }))
      throw new ApiError(errorBody.message || 'Request failed', response.status, errorBody)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json() as Promise<T>
  }

  private async tryMock(path: string, method: string, body: any): Promise<any | null> {
    // Dynamic import of mock router - only in mock mode
    try {
      const { mockRouter } = await import('@/services/mock/mockRouter')
      const result = await mockRouter(path, method, body)
      if (result !== null) {
        // Simulate network latency for realism
        await new Promise(r => setTimeout(r, 300 + Math.random() * 400))
        return result
      }
    } catch {
      // Mock not available or no mock for this route
    }
    return null
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'POST', body })
  }

  put<T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  }

  patch<T>(path: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'PATCH', body })
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  upload<T>(path: string, formData: FormData, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set boundary
      }
    })
  }
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const apiClient = new ApiClient(appConfig.apiUrl)
export default apiClient
