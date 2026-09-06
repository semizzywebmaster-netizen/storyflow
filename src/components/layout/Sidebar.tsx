import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, FolderKanban, Library, CreditCard, Wallet, Settings, 
  Sparkles, Users, Mic, Image as ImageIcon, Video, Music, FileText, 
  Palette, Hash, Package, Gift, BarChart3, Shield, Zap
} from "lucide-react"
import { useUIStore } from "@/stores/uiStore"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Library", href: "/library", icon: Library },
]

const studioNav = [
  { name: "Story", href: "/studio/story", icon: FileText, badge: "FREE" },
  { name: "Characters", href: "/studio/characters", icon: Users, badge: "PRO" },
  { name: "Scenes", href: "/studio/scenes", icon: Sparkles },
  { name: "Images", href: "/studio/images", icon: ImageIcon, badge: "5 cr" },
  { name: "Voices", href: "/studio/voices", icon: Mic, badge: "4 cr" },
  { name: "Music & SFX", href: "/studio/music", icon: Music },
  { name: "Video", href: "/studio/video", icon: Video, badge: "20 cr" },
  { name: "Subtitles", href: "/studio/subtitles", icon: FileText },
  { name: "Thumbnails", href: "/studio/thumbnails", icon: Palette },
  { name: "Social Media", href: "/studio/social", icon: Hash },
]

const advancedNav = [
  { name: "Content Factory", href: "/studio/factory", icon: Zap, badge: "BETA" },
  { name: "Series Builder", href: "/studio/series", icon: Package, badge: "PRO" },
  { name: "Auto-Clips", href: "/studio/clips", icon: Video, badge: "PRO" },
  { name: "Content Agent", href: "/studio/agent", icon: Sparkles, badge: "BETA" },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen } = useUIStore()

  if (!sidebarOpen) return null

  const NavItem = ({ item, small = false }: { item: any; small?: boolean }) => {
    const isActive = location.pathname === item.href
    const Icon = item.icon
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
          isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          small && "py-2 text-[13px]"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "group-hover:text-foreground")} />
        <span className="flex-1 truncate">{item.name}</span>
        {item.badge && (
          <Badge variant={isActive ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0 h-5">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <aside className="w-64 border-r bg-background/80 backdrop-blur-xl shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">Workspace</div>
          {navigation.map(item => <NavItem key={item.name} item={item} />)}
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">Studio</div>
          {studioNav.map(item => <NavItem key={item.name} item={item} small />)}
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">AI Factory</div>
          {advancedNav.map(item => <NavItem key={item.name} item={item} small />)}
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">Account</div>
          <Link to="/credits" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <CreditCard className="h-4 w-4" /> Credits
          </Link>
          <Link to="/wallet" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <Wallet className="h-4 w-4" /> Wallet
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <Link to="/analytics" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <BarChart3 className="h-4 w-4" /> Analytics
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent">
            <Shield className="h-4 w-4" /> Admin
          </Link>
        </div>

        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg studio-gradient flex items-center justify-center text-white font-bold text-xs">PRO</div>
            <div>
              <div className="text-sm font-semibold">Upgrade to Pro</div>
              <div className="text-xs text-muted-foreground">2,000 credits / mo</div>
            </div>
          </div>
          <button className="w-full mt-2 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Upgrade Now</button>
        </div>
      </div>
    </aside>
  )
}
