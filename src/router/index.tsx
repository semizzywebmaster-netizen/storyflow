import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { StoryGeneratorPage } from '@/pages/studio/StoryGeneratorPage'
import { StoryWorkspacePage } from '@/pages/studio/StoryWorkspacePage'
import { CharacterBiblePage } from '@/pages/studio/CharacterBiblePage'
import { SceneEnginePage } from '@/pages/studio/SceneEnginePage'
import { AIDirectorPage } from '@/pages/studio/AIDirectorPage'
import { StoryDoctorPage } from '@/pages/studio/StoryDoctorPage'
import { RewriteStudioPage } from '@/pages/studio/RewriteStudioPage'
import { ImageStudioPage } from '@/pages/studio/ImageStudioPage'
import { VoiceStudioPage } from '@/pages/studio/VoiceStudioPage'
import { MusicSFXPage } from '@/pages/studio/MusicSFXPage'
import { VideoGenerationPage } from '@/pages/studio/VideoGenerationPage'
import { VideoEditorPage } from '@/pages/studio/VideoEditorPage'
import { SubtitleStudioPage } from '@/pages/studio/SubtitleStudioPage'
import { ThumbnailStudioPage } from '@/pages/studio/ThumbnailStudioPage'
import { SocialMediaStudioPage } from '@/pages/studio/SocialMediaStudioPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { ContentFactoryPage } from '@/pages/studio/ContentFactoryPage'
import { SeriesBuilderPage } from '@/pages/studio/SeriesBuilderPage'
import { AutoClipsPage } from '@/pages/studio/AutoClipsPage'
import { ContentAgentPage } from '@/pages/studio/ContentAgentPage'
import { ViralOptimizerPage } from '@/pages/studio/ViralOptimizerPage'
import { BrandKitPage } from '@/pages/BrandKitPage'
import { CreditsPage } from '@/pages/CreditsPage'
import { SubscriptionPage } from '@/pages/SubscriptionPage'
import { WalletPage } from '@/pages/WalletPage'
import { PaymentsPage } from '@/pages/PaymentsPage'
import { CouponsPage } from '@/pages/CouponsPage'
import { AnnouncementsPage } from '@/pages/AnnouncementsPage'
import { AdsPage } from '@/pages/AdsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { PWAPage } from '@/pages/PWAPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminFeaturesPage } from '@/pages/admin/AdminFeaturesPage'
import { AdminProvidersPage } from '@/pages/admin/AdminProvidersPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminFinancePage } from '@/pages/admin/AdminFinancePage'
import { AgencyPage } from '@/pages/AgencyPage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { ReferralPage } from '@/pages/ReferralPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SocialSchedulingPage } from '@/pages/SocialSchedulingPage'
import { AdminCouponsPage } from '@/pages/admin/AdminCouponsPage'
import { AdminAnnouncementsPage } from '@/pages/admin/AdminAnnouncementsPage'
import { AdminAdsPage } from '@/pages/admin/AdminAdsPage'
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage'
import { useAuthStore } from '@/stores/authStore'

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode
  adminOnly?: boolean
}) {
  const { user, token, isAuthenticated } = useAuthStore()
  const isMockMode = import.meta.env.VITE_ENABLE_MOCK === 'true'
  const authenticated = isAuthenticated || Boolean(token) || Boolean(localStorage.getItem('auth_token'))

  if (!isMockMode && !authenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isMockMode && adminOnly && !['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
      { path: 'projects', element: <ProtectedRoute><ProjectsPage /></ProtectedRoute> },
      { path: 'projects/:id', element: <ProtectedRoute><StoryWorkspacePage /></ProtectedRoute> },
      { path: 'projects/new', element: <ProtectedRoute><StoryGeneratorPage /></ProtectedRoute> },
      { path: 'studio/story', element: <ProtectedRoute><StoryGeneratorPage /></ProtectedRoute> },
      { path: 'studio/workspace', element: <ProtectedRoute><StoryWorkspacePage /></ProtectedRoute> },
      { path: 'studio/characters', element: <ProtectedRoute><CharacterBiblePage /></ProtectedRoute> },
      { path: 'studio/scenes', element: <ProtectedRoute><SceneEnginePage /></ProtectedRoute> },
      { path: 'studio/director', element: <ProtectedRoute><AIDirectorPage /></ProtectedRoute> },
      { path: 'studio/doctor', element: <ProtectedRoute><StoryDoctorPage /></ProtectedRoute> },
      { path: 'studio/rewrite', element: <ProtectedRoute><RewriteStudioPage /></ProtectedRoute> },
      { path: 'studio/images', element: <ProtectedRoute><ImageStudioPage /></ProtectedRoute> },
      { path: 'studio/voices', element: <ProtectedRoute><VoiceStudioPage /></ProtectedRoute> },
      { path: 'studio/music', element: <ProtectedRoute><MusicSFXPage /></ProtectedRoute> },
      { path: 'studio/video', element: <ProtectedRoute><VideoGenerationPage /></ProtectedRoute> },
      { path: 'studio/editor', element: <ProtectedRoute><VideoEditorPage /></ProtectedRoute> },
      { path: 'studio/subtitles', element: <ProtectedRoute><SubtitleStudioPage /></ProtectedRoute> },
      { path: 'studio/thumbnails', element: <ProtectedRoute><ThumbnailStudioPage /></ProtectedRoute> },
      { path: 'studio/social', element: <ProtectedRoute><SocialMediaStudioPage /></ProtectedRoute> },
      { path: 'library', element: <ProtectedRoute><LibraryPage /></ProtectedRoute> },
      { path: 'studio/factory', element: <ProtectedRoute><ContentFactoryPage /></ProtectedRoute> },
      { path: 'studio/series', element: <ProtectedRoute><SeriesBuilderPage /></ProtectedRoute> },
      { path: 'studio/clips', element: <ProtectedRoute><AutoClipsPage /></ProtectedRoute> },
      { path: 'studio/agent', element: <ProtectedRoute><ContentAgentPage /></ProtectedRoute> },
      { path: 'studio/viral', element: <ProtectedRoute><ViralOptimizerPage /></ProtectedRoute> },
      { path: 'brand-kit', element: <ProtectedRoute><BrandKitPage /></ProtectedRoute> },
      { path: 'credits', element: <ProtectedRoute><CreditsPage /></ProtectedRoute> },
      { path: 'subscription', element: <ProtectedRoute><SubscriptionPage /></ProtectedRoute> },
      { path: 'wallet', element: <ProtectedRoute><WalletPage /></ProtectedRoute> },
      { path: 'payments', element: <ProtectedRoute><PaymentsPage /></ProtectedRoute> },
      { path: 'coupons', element: <ProtectedRoute><CouponsPage /></ProtectedRoute> },
      { path: 'announcements', element: <ProtectedRoute><AnnouncementsPage /></ProtectedRoute> },
      { path: 'ads', element: <ProtectedRoute><AdsPage /></ProtectedRoute> },
      { path: 'notifications', element: <ProtectedRoute><NotificationsPage /></ProtectedRoute> },
      { path: 'pwa', element: <PWAPage /> },
      { path: 'agency', element: <ProtectedRoute><AgencyPage /></ProtectedRoute> },
      { path: 'marketplace', element: <ProtectedRoute><MarketplacePage /></ProtectedRoute> },
      { path: 'referrals', element: <ProtectedRoute><ReferralPage /></ProtectedRoute> },
      { path: 'analytics', element: <ProtectedRoute><AnalyticsPage /></ProtectedRoute> },
      { path: 'settings', element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
      { path: 'social-scheduling', element: <ProtectedRoute><SocialSchedulingPage /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute> },
      { path: 'admin/features', element: <ProtectedRoute adminOnly><AdminFeaturesPage /></ProtectedRoute> },
      { path: 'admin/providers', element: <ProtectedRoute adminOnly><AdminProvidersPage /></ProtectedRoute> },
      { path: 'admin/users', element: <ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute> },
      { path: 'admin/finance', element: <ProtectedRoute adminOnly><AdminFinancePage /></ProtectedRoute> },
      { path: 'admin/coupons', element: <ProtectedRoute adminOnly><AdminCouponsPage /></ProtectedRoute> },
      { path: 'admin/announcements', element: <ProtectedRoute adminOnly><AdminAnnouncementsPage /></ProtectedRoute> },
      { path: 'admin/ads', element: <ProtectedRoute adminOnly><AdminAdsPage /></ProtectedRoute> },
      { path: 'admin/notifications', element: <ProtectedRoute adminOnly><AdminNotificationsPage /></ProtectedRoute> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])
