
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Mic, Play, Pause, Download } from "lucide-react"

const voices = [
  { id: "1", name: "Amara - Warm Nigerian Female", lang: "en-NG", gender: "Female", accent: "Nigerian", premium: false },
  { id: "2", name: "Chike - Deep Nigerian Male", lang: "en-NG", gender: "Male", accent: "Nigerian", premium: false },
  { id: "3", name: "Zainab - Hausa Female", lang: "ha-NG", gender: "Female", accent: "Hausa", premium: true },
  { id: "4", name: "Tunde - Yoruba Male", lang: "yo-NG", gender: "Male", accent: "Yoruba", premium: true },
]

export function VoiceStudioPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Voice Studio" description="Generate narrator and character voices in English, Pidgin, Yoruba, Igbo, Hausa, French, Swahili." action={<Badge variant="outline">4 credits per generation</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Voices</h3>
              <div className="space-y-3">
                {voices.map(v => (
                  <div key={v.id} className="p-3 rounded-xl border hover:border-primary cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div><div className="font-medium text-sm">{v.name}</div><div className="text-xs text-muted-foreground">{v.lang} • {v.accent}</div></div>
                      {v.premium && <Badge variant="studio" className="text-[10px]">Premium</Badge>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Play className="h-3 w-3 mr-1" /> Preview</Button>
                      <Button size="sm" variant="secondary" className="h-7 text-xs">Select</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Mic className="h-5 w-5" /> Generate Voice</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea label="Text to speak" defaultValue="Mama's voice cracked over the phone. 'Emeka, your father... he is asking for you.' Fifteen years of silence broken in a single sentence." rows={4} />
                <div className="grid md:grid-cols-3 gap-4">
                  <Select label="Language" options={[{ value: "en-NG", label: "English (Nigerian)" }, { value: "pcm", label: "Nigerian Pidgin" }, { value: "yo", label: "Yoruba" }, { value: "ig", label: "Igbo" }, { value: "ha", label: "Hausa" }]} placeholder="English (Nigerian)" />
                  <Select label="Emotion" options={[{ value: "neutral", label: "Neutral" }, { value: "emotional", label: "Emotional" }, { value: "angry", label: "Angry" }, { value: "happy", label: "Happy" }, { value: "sad", label: "Sad" }]} placeholder="Emotional" />
                  <Select label="Speed" options={[{ value: "0.8", label: "Slow" }, { value: "1", label: "Normal" }, { value: "1.2", label: "Fast" }]} placeholder="Normal" />
                </div>
                <div className="space-y-3">
                  <Slider label="Stability" defaultValue={75} />
                  <Slider label="Similarity Boost" defaultValue={60} />
                  <Slider label="Style Exaggeration" defaultValue={40} />
                </div>
                <Button variant="studio" className="w-full">Generate Voice (4 credits)</Button>

                <Card className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Generated Audio • Emeka - Scene 1</div>
                    <Badge variant="success">Ready</Badge>
                  </div>
                  <div className="h-12 bg-background rounded-lg border flex items-center px-3 gap-3">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><Play className="h-4 w-4" /></Button>
                    <div className="flex-1 h-2 bg-muted rounded-full"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
                    <span className="text-xs text-muted-foreground">0:12 / 0:35</span>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
