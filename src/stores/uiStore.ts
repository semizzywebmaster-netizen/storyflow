import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toasts: Array<{ id: string; title: string; description?: string; type: 'success' | 'error' | 'warning' | 'info' }>

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  addToast: (toast: { title: string; description?: string; type?: 'success' | 'error' | 'warning' | 'info' }) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  theme: 'dark',
  toasts: [],

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setTheme: (theme) => set({ theme }),
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast = {
      id,
      title: toast.title,
      description: toast.description,
      type: toast.type || 'info' as const
    }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
    // Auto remove after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}))
