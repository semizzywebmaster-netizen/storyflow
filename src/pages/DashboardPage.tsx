
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { useAuthStore } from "@/stores/authStore"
import { Sparkles, FolderKanban, Clock, CreditCard, TrendingUp, Play, Plus, Zap, Video, Image as ImageIcon, Mic } from "lucide-react"

export function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={`Welcome back, ${user?.displayName || 'Creator'} 👋`}
          description="Your AI content production studio. Create stories, characters, videos, and viral content."
          action={
            <div className="flex gap-3">
              <Link to="/projects"><Button variant="outline">View Projects</Button></Link>
              <Link to="/projects/new"><Button variant="studio"><Plus className="mr-2 h-4 w-4" /> New Project</Button></Link>
            </div>
          }
        />

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Credits</span><CreditCard className="h-4 w-4 text-primary" /></div>
            <div className="text-2xl font-bold">{user?.credits || 1847}</div>
            <div className="text-xs text-muted-foreground mt-1">50 used today • 1,800 left</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Projects</span><FolderKanban className="h-4 w-4 text-primary" /></div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground mt-1">3 in progress • 9 completed</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Videos Generated</span><Video className="h-4 w-4 text-primary" /></div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs text-green-600 mt-1">+12 this week</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Wallet</span><TrendingUp className="h-4 w-4 text-primary" /></div>
            <div className="text-2xl font-bold">₦25,000</div>
            <div className="text-xs text-muted-foreground mt-1">Non-withdrawable • Platform only</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Projects</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "The Return - Nigerian Family Drama", status: "In Progress", progress: 68, thumb: "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=200" },
                  { title: "Lagos Love Story", status: "Completed", progress: 100, thumb: "https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=200" },
                  { title: "Ancient Kingdom of Oyo", status: "Draft", progress: 20, thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200" },
                ].map(p => (
                  <Link key={p.title} to="/projects/proj_001" className="flex gap-4 p-3 rounded-xl border hover:bg-accent transition-colors">
                    <img src={p.thumb} alt={p.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{p.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={p.status === "Completed" ? "success" : "secondary"} className="text-[10px]">{p.status}</Badge>
                        <span className="text-xs text-muted-foreground">{p.progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-muted rounded-full mt-2"><div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} /></div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Sparkles, label: "New Story", href: "/studio/story", desc: "5 credits" },
                  { icon: ImageIcon, label: "Generate Image", href: "/studio/images", desc: "5 credits" },
                  { icon: Mic, label: "Voice Studio", href: "/studio/voices", desc: "4 credits" },
                  { icon: Video, label: "Create Video", href: "/studio/video", desc: "20 credits" },
                ].map(a => (
                  <Link key={a.label} to={a.href} className="p-4 rounded-xl border hover:bg-accent text-center space-y-2 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center"><a.icon className="h-5 w-5 text-primary" /></div>
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-[11px] text-muted-foreground">{a.desc}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 studio-gradient-subtle border-primary/20">
              <div className="flex items-center gap-2 mb-3"><Zap className="h-5 w-5 text-primary" /><span className="font-semibold">Content Factory</span><Badge variant="studio" className="ml-auto text-[10px]">BETA</Badge></div>
              <p className="text-sm text-muted-foreground mb-4">One topic → 30 ideas, hooks, scripts, captions, hashtags, thumbnails</p>
              <Link to="/studio/factory"><Button variant="studio" className="w-full" size="sm">Launch Factory</Button></Link>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Credit Usage</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Story Generation</span><span className="text-muted-foreground">-45 credits</span></div>
                <div className="flex justify-between"><span>Image Generation</span><span className="text-muted-foreground">-120 credits</span></div>
                <div className="flex justify-between"><span>Voice Generation</span><span className="text-muted-foreground">-32 credits</span></div>
                <div className="flex justify-between"><span>Video Generation</span><span className="text-muted-foreground">-200 credits</span></div>
                <div className="border-t pt-3 flex justify-between font-semibold"><span>Total Used</span><span>397 credits</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Announcements</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                  <div className="font-medium">Nigerian Pidgin Voices Added!</div>
                  <div className="text-xs text-muted-foreground mt-1">Now generate voices in Yoruba, Igbo, Hausa, Pidgin.</div>
                </div>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm">
                  <div className="font-medium">Auto-Clips BETA Live</div>
                  <div className="text-xs text-muted-foreground mt-1">Turn long videos into viral shorts automatically.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
