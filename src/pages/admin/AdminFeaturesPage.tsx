
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

const features = [
  { key: "story_generation", enabled: true, plans: "all", cost: 5, provider: "openai" },
  { key: "character_lock", enabled: true, plans: "creator+", cost: 3, provider: "flux" },
  { key: "video_generation", enabled: true, plans: "all", cost: 20, provider: "kling" },
  { key: "content_factory", enabled: true, plans: "creator+", cost: 10, provider: "groq" },
  { key: "auto_clips", enabled: true, plans: "pro+", cost: 15, provider: "ffmpeg" },
]

export function AdminFeaturesPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Feature Control Center" description="Enable/disable, plan access, credit cost, limits, provider, model, priority, quality. MASTER KILL SWITCH." action={<Button variant="destructive">MASTER AI KILL SWITCH: OFF</Button>} />
        <div className="space-y-4">
          {features.map(f => (
            <Card key={f.key} className="p-4">
              <div className="flex items-center justify-between">
                <div><div className="font-mono font-bold text-sm">{f.key}</div><div className="text-xs text-muted-foreground flex gap-2 mt-1"><Badge variant="outline" className="text-[10px]">{f.plans}</Badge><Badge variant="outline" className="text-[10px]">{f.cost} cr</Badge><Badge variant="outline" className="text-[10px]">{f.provider}</Badge></div></div>
                <div className="flex items-center gap-3"><Switch defaultChecked={f.enabled} /><Button size="sm" variant="outline">Edit</Button></div>
              </div>
            </Card>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  )
}
