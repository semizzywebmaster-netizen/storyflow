import { Link } from "react-router-dom"
import { Bell, Search, Menu, CreditCard, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/authStore"
import { useUIStore } from "@/stores/uiStore"
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown"

export function Header() {
  const { user } = useAuthStore()
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg studio-gradient flex items-center justify-center text-white font-bold">A</div>
            <span className="font-display font-bold hidden md:block">AI Story Studio</span>
            <span className="hidden md:flex text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-2">BETA</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs">
              <CreditCard className="h-3 w-3" />
              <span className="font-semibold">{user?.credits || 1847} credits</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              {user?.plan || "PRO"}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Search className="h-4 w-4" />
          </Button>

          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </Link>

          <Dropdown
            trigger={
              <div className="flex items-center gap-2 pl-2">
                <Avatar src={user?.avatar} name={user?.displayName || "User"} size="sm" />
              </div>
            }
          >
            <div className="p-2">
              <div className="text-sm font-semibold">{user?.displayName || "Mizzy Creator"}</div>
              <div className="text-xs text-muted-foreground">{user?.email || "creator@aistorystudio.com"}</div>
            </div>
            <DropdownSeparator />
            <DropdownItem><User className="mr-2 h-4 w-4" /> Profile</DropdownItem>
            <DropdownItem><CreditCard className="mr-2 h-4 w-4" /> Billing</DropdownItem>
            <DropdownItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
