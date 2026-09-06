
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Video, Play, Pause, RefreshCw, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function VideoGenerationPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Video Generation Workspace" description="Story → Scenes → Images → Voice → Music → SFX → Video. Full pipeline assembly." action={<Badge variant="studio">20 credits per video</Badge>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> Generation Queue</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "1", project: "The Return", status: "PROCESSING", progress: 78, current: "Scene 7/12 - Rendering with FFmpeg", time: "2m 34s left" },
                  { id: "2", project: "Lagos Love Story", status: "QUEUED", progress: 0, current: "Waiting in queue", time: "Estimated 5m" },
                  { id: "3", project: "Ancient Kingdom", status: "COMPLETED", progress: 100, current: "Ready for export", time: "Completed 1h ago" },
                ].map(job => (
                  <Card key={job.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${job.status === "PROCESSING" ? "bg-amber-500 animate-pulse" : job.status === "COMPLETED" ? "bg-green-500" : "bg-muted-foreground"}`} />
                        <span className="font-medium text-sm">{job.project}</span>
                        <Badge variant={job.status === "COMPLETED" ? "success" : job.status === "PROCESSING" ? "warning" : "secondary"} className="text-[10px]">{job.status}</Badge>
                      </div>
                      <div className="flex gap-1">
                        {job.status === "PROCESSING" ? <Button size="icon" variant="ghost" className="h-7 w-7"><Pause className="h-3 w-3" /></Button> : null}
                        {job.status === "COMPLETED" ? <Button size="icon" variant="ghost" className="h-7 w-7"><Play className="h-3 w-3" /></Button> : null}
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <Progress value={job.progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{job.current}</span><span>{job.time}</span></div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Assembly Pipeline</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { step: "Story & Scenes", status: "done", desc: "12 scenes validated" },
                    { step: "Images", status: "done", desc: "12 images generated" },
                    { step: "Voiceovers", status: "done", desc: "24 dialogue lines • 12 narration" },
                    { step: "Music & SFX", status: "done", desc: "3 tracks • 4 SFX" },
                    { step: "Timeline Assembly", status: "processing", desc: "FFmpeg composing..." },
                    { step: "Subtitles", status: "pending", desc: "Burn-in captions" },
                    { step: "Final Export", status: "pending", desc: "1080p • 16:9 • 24fps" },
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-3 p-3 rounded-xl border">
                      {s.status === "done" ? <CheckCircle className="h-5 w-5 text-green-500" /> : s.status === "processing" ? <Clock className="h-5 w-5 text-amber-500 animate-spin" /> : <div className="h-5 w-5 rounded-full border-2 border-muted" />}
                      <div className="flex-1"><div className="text-sm font-medium">{s.step}</div><div className="text-xs text-muted-foreground">{s.desc}</div></div>
                      <Badge variant={s.status === "done" ? "success" : s.status === "processing" ? "warning" : "secondary"} className="text-[10px]">{s.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="studio" className="w-full mt-6 h-12">Generate Video (20 credits)</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <div className="aspect-video bg-muted rounded-xl mb-3 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=400" alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center"><Button size="icon" variant="secondary" className="h-12 w-12 rounded-full"><Play className="h-6 w-6" /></Button></div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/30 rounded-full"><div className="h-full w-[78%] bg-white rounded-full" /></div>
              </div>
              <div className="text-sm font-medium">The Return - Preview</div>
              <div className="text-xs text-muted-foreground">1080p • 12:34 • 24fps</div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Export Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Resolution</span><span>1080p</span></div>
                <div className="flex justify-between"><span>Aspect</span><span>16:9</span></div>
                <div className="flex justify-between"><span>FPS</span><span>24</span></div>
                <div className="flex justify-between"><span>Subtitles</span><span>Burn-in</span></div>
                <div className="flex justify-between"><span>Watermark</span><span>None (PRO)</span></div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
