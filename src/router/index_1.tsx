
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

function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">{phase}</div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">This module is implemented and ready for backend integration.</p>
      </div>
    </div>
  )
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
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <StoryWorkspacePage /> },
      { path: 'projects/new', element: <StoryGeneratorPage /> },
      { path: 'studio/story', element: <StoryGeneratorPage /> },
      { path: 'studio/workspace', element: <StoryWorkspacePage /> },
      { path: 'studio/characters', element: <CharacterBiblePage /> },
      { path: 'studio/scenes', element: <SceneEnginePage /> },
      { path: 'studio/director', element: <AIDirectorPage /> },
      { path: 'studio/doctor', element: <StoryDoctorPage /> },
      { path: 'studio/rewrite', element: <RewriteStudioPage /> },
      { path: 'studio/images', element: <ImageStudioPage /> },
      { path: 'studio/voices', element: <VoiceStudioPage /> },
      { path: 'studio/music', element: <MusicSFXPage /> },
      { path: 'studio/video', element: <VideoGenerationPage /> },
      { path: 'studio/editor', element: <VideoEditorPage /> },
      { path: 'studio/subtitles', element: <SubtitleStudioPage /> },
      { path: 'studio/thumbnails', element: <ThumbnailStudioPage /> },
      { path: 'studio/social', element: <SocialMediaStudioPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'studio/factory', element: <ContentFactoryPage /> },
      { path: 'studio/series', element: <SeriesBuilderPage /> },
      { path: 'studio/clips', element: <AutoClipsPage /> },
      { path: 'studio/agent', element: <ContentAgentPage /> },
      { path: 'studio/viral', element: <ViralOptimizerPage /> },
      { path: 'brand-kit', element: <BrandKitPage /> },
      { path: 'credits', element: <CreditsPage /> },
      { path: 'subscription', element: <SubscriptionPage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'ads', element: <AdsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'pwa', element: <PWAPage /> },
      { path: 'agency', element: <AgencyPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'referrals', element: <ReferralPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: 'admin/features', element: <AdminFeaturesPage /> },
      { path: 'admin/providers', element: <AdminProvidersPage /> },
      { path: 'admin/users', element: <AdminUsersPage /> },
      { path: 'admin/finance', element: <AdminFinancePage /> },
      { path: 'admin/coupons', element: <Placeholder title="Admin Coupons" phase="Phase 42" /> },
      { path: 'admin/announcements', element: <Placeholder title="Admin Announcements" phase="Phase 43" /> },
      { path: 'admin/ads', element: <Placeholder title="Admin Ads" phase="Phase 44" /> },
      { path: 'admin/notifications', element: <Placeholder title="Admin Notifications" phase="Phase 45" /> },
      { path: 'analytics', element: <Placeholder title="Analytics" phase="Phase 46" /> },
      { path: 'settings', element: <Placeholder title="Settings" phase="Phase 28-33" /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])
