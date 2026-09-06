
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Bot, Sparkles, CheckCircle, Clock } from "lucide-react"

export function ContentAgentPage() {
  const [task] = useState("Create my content for next week")
  
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Content Agent" description="Autonomous agent: Ideas → Scripts → Scenes → Assets → Voice → Videos → Captions → Thumbnails → Social packages" action={<Badge variant="studio">BETA • PRO+ • 50 credits per week</Badge>} />
        
        <Card className="p-6 mb-6">
          <div className="flex gap-3">
            <Input defaultValue={task} placeholder="Create my content for next week, focus on Nigerian family dramas..." className="flex-1" />
            <Button variant="studio"><Bot className="mr-2 h-4 w-4" /> Launch Agent (50 cr)</Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Agent Execution Log</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm font-mono">
              <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Generated 7 content ideas for next week</div>
              <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Created scripts for 5 videos (Mon-Fri)</div>
              <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Generated 12 character images with lock</div>
              <div className="flex gap-2"><Clock className="h-4 w-4 text-amber-500 animate-spin" /> Generating voiceovers for 3 videos... (45%)</div>
              <div className="flex gap-2"><span className="h-4 w-4 rounded-full border-2 border-muted" /> Queued: Video assembly for Episode 8</div>
              <div className="flex gap-2"><span className="h-4 w-4 rounded-full border-2 border-muted" /> Pending: Thumbnails + Social packages</div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">This Week's Plan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Mon: Family drama</span><Badge variant="success" className="text-[10px]">Done</Badge></div>
                <div className="flex justify-between"><span>Tue: Lagos comedy</span><Badge variant="warning" className="text-[10px]">In Progress</Badge></div>
                <div className="flex justify-between"><span>Wed: Cultural lesson</span><Badge variant="secondary" className="text-[10px]">Queued</Badge></div>
                <div className="flex justify-between"><span>Thu: Romance</span><Badge variant="secondary" className="text-[10px]">Queued</Badge></div>
                <div className="flex justify-between"><span>Fri: Food battle</span><Badge variant="secondary" className="text-[10px]">Queued</Badge></div>
              </div>
            </Card>
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Agent Capabilities</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Understands your brand kit</li>
                <li>• Maintains character consistency</li>
                <li>• Optimizes for viral scores</li>
                <li>• Schedules posts automatically</li>
                <li>• Learns from your best content</li>
              </ul>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
