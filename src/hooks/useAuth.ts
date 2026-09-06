import { useAuthStore } from '@/stores/authStore'
import { useCallback } from 'react'
import { getAuthService } from '@/services'

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, setAuth, clearAuth, setLoading, setError } = useAuthStore()

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const authService = await getAuthService()
      const response = await authService.login(email, password)
      if (response.success && response.data) {
        setAuth(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading, setError])

  const logout = useCallback(async () => {
    try {
      const authService = await getAuthService()
      await authService.logout()
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  const register = useCallback(async (data: { email: string; password: string; username: string; displayName: string }) => {
    setLoading(true)
    setError(null)
    try {
      const authService = await getAuthService()
      const response = await authService.register(data)
      if (response.success && response.data) {
        setAuth(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (err: any) {
      const message = err.message || 'Registration failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setAuth, setLoading, setError])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register
  }
}
