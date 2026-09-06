
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Scissors, Play, Clock } from "lucide-react"

export function AutoClipsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Auto-Clips" description="Long video → Analyze → Find strongest moments → Short clips with captions, hooks, titles." action={<Badge variant="studio">PRO • 15 credits</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><Scissors className="h-5 w-5" /> Source Video</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-4">Upload long video or select from library</div>
              <Button variant="studio" className="w-full">Analyze & Generate Clips (15 cr)</Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            {[
              { title: "The Shocking Truth (0:32)", hook: "Wait for it...", score: 94, format: "9:16" },
              { title: "Mama's Call (0:18)", hook: "3AM call that changed everything", score: 89, format: "9:16" },
              { title: "Lagos Chaos (0:24)", hook: "Lagos will humble you", score: 87, format: "1:1" },
            ].map((clip, i) => (
              <Card key={i} className="p-3">
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-muted rounded-lg flex items-center justify-center"><Play className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{clip.title}</div>
                    <div className="text-xs text-muted-foreground">{clip.hook}</div>
                    <div className="flex gap-1 mt-1"><Badge variant="outline" className="text-[10px]">{clip.format}</Badge><Badge variant="success" className="text-[10px]">Score {clip.score}</Badge></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
