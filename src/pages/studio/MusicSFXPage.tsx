
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Music, Play, Search } from "lucide-react"

const categories = ["Suspense", "Horror", "Romance", "Action", "Comedy", "Emotional", "African Atmosphere", "Traditional Drums", "Highlife", "Afrobeats"]

export function MusicSFXPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Music & SFX Studio" description="African-inspired music, environmental SFX, and atmospheric sounds." action={<Badge variant="outline">3 credits per track</Badge>} />
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(c => <Badge key={c} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground px-3 py-1">{c}</Badge>)}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search music, SFX, African drums..." className="pl-10" /></div>
                <Button variant="outline">Filter</Button>
              </div>
            </Card>

            {[
              { title: "Emotional Piano - Homecoming", mood: "Emotional", duration: "2:34", african: false },
              { title: "Talking Drums - Village Square", mood: "African Atmosphere", duration: "1:45", african: true },
              { title: "Highlife Guitar - Lagos Night", mood: "Romance", duration: "3:12", african: true },
              { title: "Suspense Strings - Midnight Call", mood: "Suspense", duration: "0:45", african: false },
              { title: "Market Ambience - Oshodi", mood: "SFX", duration: "2:00", african: true },
              { title: "Rain on Zinc Roof - Village", mood: "SFX", duration: "1:30", african: true },
            ].map((track, i) => (
              <Card key={i} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Music className="h-6 w-6 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-medium truncate">{track.title}</span>{track.african && <Badge variant="studio" className="text-[10px]">African</Badge>}<Badge variant="outline" className="text-[10px]">{track.mood}</Badge></div>
                    <div className="text-xs text-muted-foreground">{track.duration} • 320kbps • Free preview</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Play className="h-4 w-4" /></Button>
                    <Button size="sm" variant="secondary">Add to Scene</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Project Soundtrack</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Emotional Piano</span><span className="text-muted-foreground">Scenes 1,7,12</span></div>
                <div className="flex justify-between"><span>Village Drums</span><span className="text-muted-foreground">Scenes 3,5</span></div>
                <div className="flex justify-between"><span>Market SFX</span><span className="text-muted-foreground">Scene 2</span></div>
              </CardContent>
            </Card>
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Generate Custom Music</h3>
              <p className="text-xs text-muted-foreground mb-3">Describe mood and style, AI will compose African-inspired track</p>
              <Input placeholder="Sad Igbo highlife with talking drums..." className="mb-3" />
              <Button variant="studio" className="w-full" size="sm">Generate (3 cr)</Button>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
