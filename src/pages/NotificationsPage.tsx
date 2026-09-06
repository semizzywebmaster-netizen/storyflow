
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Bell, CheckCircle, AlertCircle, CreditCard, Video, Gift } from "lucide-react"

export function NotificationsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Notification Center" description="In-app, email, push, WhatsApp preferences. All generation events." action={<div className="flex gap-2"><Button variant="outline" size="sm">Mark All Read</Button><Button variant="outline" size="sm">Preferences</Button></div>} />
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All (12)</TabsTrigger>
            <TabsTrigger value="unread">Unread (3)</TabsTrigger>
            <TabsTrigger value="generations">Generations</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6 space-y-3">
            {[
              { icon: CheckCircle, title: "Video Ready", desc: "The Return - Episode 1 video is ready for export", time: "2 min ago", unread: true, type: "success" },
              { icon: Video, title: "Image Generated", desc: "3 character images generated for Scene 5", time: "1 hour ago", unread: true, type: "info" },
              { icon: CreditCard, title: "Credits Low", desc: "You have 1,847 credits remaining. Consider buying more.", time: "3 hours ago", unread: true, type: "warning" },
              { icon: Gift, title: "Bonus Credits Earned", desc: "You earned 10 credits from rewarded ad", time: "5 hours ago", unread: false, type: "success" },
              { icon: AlertCircle, title: "Generation Failed", desc: "Voice generation failed for Scene 7 - credit refunded", time: "1 day ago", unread: false, type: "error" },
              { icon: Bell, title: "New Feature: Pidgin Voices", desc: "Nigerian Pidgin, Yoruba, Igbo, Hausa voices now available", time: "2 days ago", unread: false, type: "info" },
            ].map((n, i) => (
              <Card key={i} className={`p-4 ${n.unread ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex gap-3">
                  <n.icon className={`h-5 w-5 mt-0.5 ${n.type === "success" ? "text-green-500" : n.type === "warning" ? "text-amber-500" : n.type === "error" ? "text-red-500" : "text-blue-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-medium text-sm">{n.title}</span>{n.unread && <Badge variant="studio" className="text-[10px] h-4">New</Badge>}<span className="text-xs text-muted-foreground ml-auto">{n.time}</span></div>
                    <div className="text-sm text-muted-foreground mt-1">{n.desc}</div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}
