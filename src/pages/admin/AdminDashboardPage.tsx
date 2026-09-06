
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Users, DollarSign, Cpu, CreditCard, Wallet, Video, HardDrive, Activity } from "lucide-react"

export function AdminDashboardPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Admin Dashboard" description="Users, revenue, AI usage, credits, wallet, subscriptions, jobs, storage, health." action={<Badge variant="destructive">MASTER AI KILL SWITCH: OFF</Badge>} />
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {[
            { icon: Users, label: "Users", value: "2,447", change: "+12%" },
            { icon: DollarSign, label: "Revenue", value: "₦1.2M", change: "+8%" },
            { icon: Cpu, label: "AI Jobs", value: "1,234", change: "Active" },
            { icon: CreditCard, label: "Credits Used", value: "450K", change: "Today" },
            { icon: Wallet, label: "Wallet Balance", value: "₦3.4M", change: "Platform" },
            { icon: Video, label: "Videos Generated", value: "12,847", change: "+23%" },
            { icon: HardDrive, label: "Storage Used", value: "2.4TB", change: "R2" },
            { icon: Activity, label: "Health", value: "99.9%", change: "Uptime" },
          ].map(stat => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between mb-2"><stat.icon className="h-4 w-4 text-muted-foreground" /><Badge variant="outline" className="text-[10px]">{stat.change}</Badge></div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="text-base">Recent Users</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>mizzy@example.com</span><Badge variant="outline">PRO</Badge></div><div className="flex justify-between"><span>creator@lagos.com</span><Badge variant="outline">CREATOR</Badge></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">System Health</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>API</span><Badge variant="success">Healthy</Badge></div><div className="flex justify-between"><span>AI Providers</span><Badge variant="success">5/5 Online</Badge></div><div className="flex justify-between"><span>Queue</span><Badge variant="warning">12 jobs</Badge></div></CardContent></Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
