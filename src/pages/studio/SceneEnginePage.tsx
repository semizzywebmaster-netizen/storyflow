
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Plus, Clock, MapPin, Users, Film, Sparkles, GripVertical } from "lucide-react"

const scenes = [
  { id: "1", index: 1, title: "The Midnight Call", location: "New York Apartment - Night", mood: "Tense", duration: 90, status: "COMPLETED", thumb: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
  { id: "2", index: 2, title: "Lagos Arrival", location: "MM Airport - Day", mood: "Nostalgic", duration: 120, status: "COMPLETED", thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200" },
  { id: "3", index: 3, title: "Village Homecoming", location: "Anambra Village - Afternoon", mood: "Emotional", duration: 150, status: "PENDING", thumb: "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=200" },
]

export function SceneEnginePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Scene Engine" description="12 scenes • 12 min total • Manage location, time, characters, action, dialogue, visuals" action={<div className="flex gap-2"><Button variant="outline">Auto-Generate Scenes (2 cr)</Button><Button variant="studio"><Plus className="mr-2 h-4 w-4" /> New Scene</Button></div>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            {scenes.map(s => (
              <Card key={s.id} className="p-3 hover:shadow-md cursor-pointer">
                <div className="flex gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-2" />
                  <img src={s.thumb} alt={s.title} className="w-20 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-xs font-bold">SCENE {s.index}</span><Badge variant={s.status === "COMPLETED" ? "success" : "secondary"} className="text-[10px]">{s.status}</Badge></div>
                    <div className="font-medium truncate text-sm">{s.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="h-3 w-3" /> {s.location} • {s.duration}s</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Film className="h-5 w-5" /> Scene 1 - The Midnight Call</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Scene Title" defaultValue="The Midnight Call" />
                  <Input label="Location" defaultValue="New York Apartment - Night" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input label="Time of Day" defaultValue="NIGHT" />
                  <Input label="Mood" defaultValue="Tense, Emotional" />
                  <Input label="Duration (sec)" defaultValue="90" />
                </div>
                <Textarea label="Action" defaultValue="Emeka sits up in bed, phone light illuminating his worried face. Mama's voice cracks on the other end." rows={2} />
                <Textarea label="Dialogue" defaultValue="EMEKA: Mama? What happened? Is it Papa?&#10;MAMA (V.O.): Your father... he is asking for you." rows={3} />
                <Textarea label="Visual Prompt (for image generation)" defaultValue="A young Nigerian man in a modern New York apartment at 3AM, phone call, dramatic lighting, emotional, cinematic, 16:9" rows={2} />
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-3"><div className="text-xs font-medium mb-2">Characters in Scene</div><div className="flex gap-2"><Badge variant="studio">Emeka Okafor</Badge></div></Card>
                  <Card className="p-3"><div className="text-xs font-medium mb-2">Assets</div><div className="text-xs text-muted-foreground">Image: Generated • Voice: Pending • Music: Suspense</div></Card>
                </div>
                <div className="flex gap-2">
                  <Button variant="studio" className="flex-1"><Sparkles className="mr-2 h-4 w-4" /> Generate Scene Image (5 cr)</Button>
                  <Button variant="outline" className="flex-1">Direct with AI (2 cr)</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
