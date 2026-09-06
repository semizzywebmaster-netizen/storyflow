import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthSession } from '@/types'
import { appConfig } from '@/config'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  setAuth: (session: AuthSession) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (session) => {
        localStorage.setItem(appConfig.storageKeys.authToken, session.token)
        localStorage.setItem(appConfig.storageKeys.refreshToken, session.refreshToken)
        localStorage.setItem(appConfig.storageKeys.user, JSON.stringify(session.user))
        set({
          user: session.user,
          token: session.token,
          refreshToken: session.refreshToken,
          isAuthenticated: true,
          error: null
        })
      },

      setUser: (user) => {
        localStorage.setItem(appConfig.storageKeys.user, JSON.stringify(user))
        set({ user })
      },

      clearAuth: () => {
        localStorage.removeItem(appConfig.storageKeys.authToken)
        localStorage.removeItem(appConfig.storageKeys.refreshToken)
        localStorage.removeItem(appConfig.storageKeys.user)
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
