import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toast'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Outlet />
      <Toaster />
    </div>
  )
}
