
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Film, Mic, Music, Video, Subtitles, Image as ImageIcon, Zap, Package, BarChart3, Check, Play, Star, ArrowRight, Globe, Shield, Clock } from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg studio-gradient flex items-center justify-center text-white font-bold">A</div>
            <span className="font-display font-bold text-xl">AI Story Studio</span>
            <Badge variant="studio" className="ml-2 hidden md:flex">PRODUCTION BUILD</Badge>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#pricing" className="hover:text-primary">Pricing</a>
            <a href="#how" className="hover:text-primary">How it works</a>
            <a href="#faq" className="hover:text-primary">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium">Sign in</Link>
            <Link to="/dashboard"><Button variant="studio" size="sm">Launch Studio <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 studio-gradient-subtle" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="success" className="px-3 py-1"><Zap className="w-3 h-3 mr-1" /> Now with Nigerian Story Modes</Badge>
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight leading-[0.95]">
                Turn One Idea Into
                <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent block">A Full Video Studio</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Professional AI platform that transforms IDEA → STORY → CHARACTERS → SCENES → IMAGES → VOICE → MUSIC → VIDEO → SUBTITLES → THUMBNAIL → SOCIAL — in one click.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard"><Button variant="studio" size="lg" className="h-12 px-8">Start Creating Free <Play className="ml-2 h-4 w-4" /></Button></Link>
                <Button variant="outline" size="lg" className="h-12 px-8">Watch Demo</Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9/5 (2.4k creators)</div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> No watermark on Pro</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> 2min to video</div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden aspect-[16/10]">
                <img src="https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=800" alt="Studio preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="studio">Nigerian Family Drama</Badge>
                    <Badge variant="secondary">16:9 • 1080p</Badge>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-white rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-white/80 mt-2">
                    <span>Generating video... Scene 7/12</span>
                    <span>78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20 border-t bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How AI Story Studio Works</h2>
            <p className="text-muted-foreground">One idea → Full production pipeline. No crew needed.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {[
              { icon: Sparkles, label: "IDEA" },
              { icon: Film, label: "STORY" },
              { icon: Users, label: "CHARACTERS" },
              { icon: Film, label: "SCENES" },
              { icon: ImageIcon, label: "IMAGES" },
              { icon: Mic, label: "VOICE" },
              { icon: Music, label: "MUSIC/SFX" },
              { icon: Video, label: "VIDEO" },
              { icon: Subtitles, label: "SUBTITLES" },
              { icon: ImageIcon, label: "THUMBNAIL" },
              { icon: BarChart3, label: "SOCIAL PACK" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border bg-card min-w-[90px]">
                  <step.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold tracking-wider">{step.label}</span>
                </div>
                {i < 10 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Character Lock", desc: "Lock character faces, outfits, voices across all scenes.", badge: "CREATOR" },
              { icon: Film, title: "AI Director", desc: "Control shot type, camera angle, lens, lighting, mood.", badge: "PRO" },
              { icon: Sparkles, title: "Story Doctor", desc: "Detects plot holes, contradictions, timeline errors.", badge: "CREATOR" },
              { icon: Zap, title: "Content Factory", desc: "One topic → 30 ideas, hooks, scripts, captions.", badge: "BETA" },
              { icon: Package, title: "Series Builder", desc: "Build seasons & episodes with character memory.", badge: "PRO" },
              { icon: Video, title: "Auto-Clips", desc: "Long video → viral short clips with captions.", badge: "PRO" },
            ].map(f => (
              <Card key={f.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><f.icon className="h-5 w-5 text-primary" /></div>
                  <Badge variant="outline" className="text-[10px]">{f.badge}</Badge>
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 border-t bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Simple Pricing, Serious Power</h2>
            <p className="text-muted-foreground">Start free, upgrade when you grow.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "FREE", price: "₦0", credits: "50 credits", features: ["Watermark", "Basic models", "Limited video", "Ads"], cta: "Start Free", popular: false },
              { name: "CREATOR", price: "₦7,500", credits: "500 credits", features: ["No watermark", "Character Lock", "Story Doctor", "AI Director"], cta: "Go Creator", popular: false },
              { name: "PRO", price: "₦18,000", credits: "2,000 credits", features: ["Everything Creator", "Series Builder", "Auto-Clips", "Brand Kit"], cta: "Go Pro", popular: true },
              { name: "AGENCY", price: "₦38,000", credits: "5,000 credits", features: ["Everything Pro", "Team members", "API access", "Bulk generation"], cta: "Go Agency", popular: false },
            ].map(plan => (
              <Card key={plan.name} className={`p-6 relative ${plan.popular ? "border-primary shadow-xl scale-[1.02]" : ""}`}>
                {plan.popular && <Badge variant="studio" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                <h3 className="font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-2"><span className="text-3xl font-bold">{plan.price}</span><span className="text-sm text-muted-foreground">/mo</span></div>
                <div className="text-sm text-primary font-medium mt-1">{plan.credits}</div>
                <ul className="mt-6 space-y-2 text-sm">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {f}</li>)}
                </ul>
                <Button variant={plan.popular ? "studio" : "outline"} className="w-full mt-6">{plan.cta}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">© 2026 AI Story Studio • Lagos • Built for creators</div>
      </footer>
    </div>
  )
}
