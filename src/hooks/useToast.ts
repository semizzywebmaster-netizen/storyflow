import { useUIStore } from '@/stores/uiStore'

export function useToast() {
  const { addToast, removeToast, toasts } = useUIStore()

  const toast = (opts: { title: string; description?: string; type?: 'success' | 'error' | 'warning' | 'info' }) => {
    addToast(opts)
  }

  const success = (title: string, description?: string) => toast({ title, description, type: 'success' })
  const error = (title: string, description?: string) => toast({ title, description, type: 'error' })
  const warning = (title: string, description?: string) => toast({ title, description, type: 'warning' })
  const info = (title: string, description?: string) => toast({ title, description, type: 'info' })

  return {
    toast,
    success,
    error,
    warning,
    info,
    toasts,
    dismiss: removeToast
  }
}
