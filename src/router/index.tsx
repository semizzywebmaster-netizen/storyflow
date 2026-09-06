import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'

// Placeholder pages for Phase 00 - will be implemented in subsequent phases
function PlaceholderPage({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {phase}
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            This module is part of the AI Story Studio production build. Frontend-first architecture with mock service layer ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { label: 'Architecture', value: 'Production Grade' },
            { label: 'Service Layer', value: 'Mock Ready' },
            { label: 'Status', value: 'Phase 00 Complete' }
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border bg-card/50 backdrop-blur">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              <div className="font-semibold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border bg-card/80 backdrop-blur text-left space-y-3">
          <h3 className="font-semibold">Phase 00 Deliverables</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> React + Vite + TypeScript + Tailwind</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Centralized config & feature flags</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Service abstraction (auth, project, story, character, scene, image, voice, video, credit, wallet, payment, notification, admin, analytics)</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Mock API router & PWA foundation</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Design system primitives (Button, Card, Input, Badge, Skeleton)</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Zustand stores & routing skeleton</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <a href="/" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Go to Studio
          </a>
          <a href="/dashboard" className="px-6 py-3 rounded-xl border bg-background hover:bg-accent transition-colors font-medium">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg studio-gradient flex items-center justify-center text-white font-bold">A</div>
            <span className="font-display font-bold text-xl">AI Story Studio</span>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">PHASE 00</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign in</a>
            <a href="/dashboard" className="px-4 py-2 rounded-xl studio-gradient text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              Launch Studio
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 studio-gradient-subtle" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Production Build • Frontend First • 82 Phases
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[0.9]">
              Idea to Video,
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                Fully Automated
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Professional AI Story-to-Video SaaS platform. Transform ideas into stories, characters, scenes, images, voice, music, video, subtitles, thumbnails & social content — in one studio.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/dashboard" className="px-8 py-4 rounded-xl studio-gradient text-white font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/30 hover:scale-[1.02] transition-all">
                Enter Studio →
              </a>
              <div className="px-6 py-4 rounded-xl border bg-card font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Phase 00 Architecture Live
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {[
                { k: 'Pipeline', v: 'IDEA → VIDEO' },
                { k: 'Cultures', v: '14 Regional Modes' },
                { k: 'Services', v: '14 Abstraction Layers' },
                { k: 'Status', v: 'Production Grade' }
              ].map(i => (
                <div key={i.k} className="p-4 rounded-xl border bg-card/50 backdrop-blur">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{i.k}</div>
                  <div className="font-semibold mt-1">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Diagram Preview */}
          <div className="mt-16 p-6 rounded-2xl border bg-card/80 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">System Architecture - Phase 00 Foundation</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">Verified</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase tracking-wider">Frontend</div>
                <div className="p-3 rounded-lg bg-muted/50 border">React + Vite + TS</div>
                <div className="p-3 rounded-lg bg-muted/50 border">Tailwind + Router + PWA</div>
                <div className="p-3 rounded-lg bg-muted/50 border">Zustand + Service Abstraction</div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase tracking-wider">Service Layer</div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">auth • project • story • character</div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">scene • image • voice • video</div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">credit • wallet • payment • admin</div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase tracking-wider">Target Backend</div>
                <div className="p-3 rounded-lg bg-muted/50 border">Node + Express + PostgreSQL</div>
                <div className="p-3 rounded-lg bg-muted/50 border">R2 • FFmpeg • AI Router</div>
                <div className="p-3 rounded-lg bg-muted/50 border">Paystack • Flutterwave • Queue</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-t bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">Full Production Pipeline</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['IDEA', 'STORY', 'CHARACTERS', 'SCENES', 'IMAGES', 'VOICE', 'MUSIC/SFX', 'VIDEO', 'SUBTITLES', 'THUMBNAIL', 'SOCIAL'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-full border bg-card text-xs font-semibold tracking-wider">{step}</div>
                {i < 10 && <div className="w-4 h-px bg-border hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <PlaceholderPage title="Authentication" phase="Phase 03" /> },
      { path: 'register', element: <PlaceholderPage title="Create Account" phase="Phase 03" /> },
      { path: 'dashboard', element: <PlaceholderPage title="Dashboard" phase="Phase 04" /> },
      { path: 'projects', element: <PlaceholderPage title="Projects" phase="Phase 05" /> },
      { path: 'projects/:id', element: <PlaceholderPage title="Project Workspace" phase="Phase 07" /> },
      { path: 'studio/story', element: <PlaceholderPage title="Story Generator" phase="Phase 06" /> },
      { path: 'studio/characters', element: <PlaceholderPage title="Character Bible" phase="Phase 08" /> },
      { path: 'studio/scenes', element: <PlaceholderPage title="Scene Engine" phase="Phase 09" /> },
      { path: 'studio/images', element: <PlaceholderPage title="Image Studio" phase="Phase 13" /> },
      { path: 'studio/voices', element: <PlaceholderPage title="Voice Studio" phase="Phase 14" /> },
      { path: 'studio/video', element: <PlaceholderPage title="Video Workspace" phase="Phase 16" /> },
      { path: 'library', element: <PlaceholderPage title="Asset Library" phase="Phase 21" /> },
      { path: 'settings', element: <PlaceholderPage title="Settings" phase="Phase 28-33" /> },
      { path: 'admin', element: <PlaceholderPage title="Admin Dashboard" phase="Phase 37" /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])
