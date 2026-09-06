
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Megaphone, Gift, Sparkles, Zap } from "lucide-react"

export function AnnouncementsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Announcements & Marketing" description="Promotional banners, campaign notifications, new features, system updates." />
        <div className="space-y-4">
          {[
            { icon: Sparkles, title: "Nigerian Pidgin Voices Launched!", desc: "Now create content in Yoruba, Igbo, Hausa, and Nigerian Pidgin. Authentic African storytelling.", type: "NEW FEATURE", date: "2 hours ago", cta: "Try Now" },
            { icon: Gift, title: "50% Off Creator Plan - Naija Celebration", desc: "Use code NAIJA50 for 50% off. Limited to first 500 creators.", type: "PROMOTION", date: "1 day ago", cta: "Claim Offer" },
            { icon: Zap, title: "Auto-Clips BETA is Live!", desc: "Turn long videos into viral TikTok/Reels automatically. Pro plan feature.", type: "NEW FEATURE", date: "3 days ago", cta: "Explore" },
            { icon: Megaphone, title: "System Maintenance Completed", desc: "Video processing queue optimized. Faster generation times.", type: "SYSTEM", date: "1 week ago", cta: null },
          ].map((a, i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><a.icon className="h-5 w-5 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><Badge variant={a.type === "NEW FEATURE" ? "studio" : a.type === "PROMOTION" ? "warning" : "secondary"} className="text-[10px]">{a.type}</Badge><span className="text-xs text-muted-foreground">{a.date}</span></div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{a.desc}</div>
                </div>
                {a.cta && <Button size="sm" variant="studio" className="shrink-0">{a.cta}</Button>}
              </div>
            </Card>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  )
}
