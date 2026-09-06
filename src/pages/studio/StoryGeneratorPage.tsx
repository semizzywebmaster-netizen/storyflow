
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { useToast } from "@/hooks/useToast"
import { Sparkles, Globe, Clock, Users, Zap } from "lucide-react"

const culturalModes = [
  { value: "NIGERIAN", label: "Nigerian" },
  { value: "YORUBA", label: "Yoruba" },
  { value: "IGBO", label: "Igbo" },
  { value: "HAUSA", label: "Hausa" },
  { value: "NIGERIAN_PIDGIN", label: "Nigerian Pidgin" },
  { value: "AFRICAN", label: "African" },
  { value: "AMERICAN", label: "American" },
  { value: "INDIAN", label: "Indian" },
  { value: "KOREAN", label: "Korean" },
]

export function StoryGeneratorPage() {
  const [idea, setIdea] = useState("Create a Nigerian family drama about a young man returning home after many years abroad.")
  const [isGenerating, setIsGenerating] = useState(false)
  const { success } = useToast()

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      success("Story generated!", "12 scenes created • 5 credits used")
    }, 2000)
  }

  return (
    <AppShell>
      <PageContainer maxWidth="xl">
        <PageHeader title="Story Generator" description="Transform your idea into a full story with characters, scenes, and cultural authenticity." action={<Badge variant="outline" className="bg-primary/10">5 credits • ~30 seconds</Badge>} />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Your Idea</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea label="Story Idea" value={idea} onChange={e => setIdea(e.target.value)} placeholder="Describe your story idea..." rows={4} />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Title (optional)" placeholder="The Return" />
                  <Select label="Genre" options={[{ value: "drama", label: "Drama" }, { value: "romance", label: "Romance" }, { value: "comedy", label: "Comedy" }, { value: "folklore", label: "Folklore" }]} placeholder="Select genre" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Select label="Cultural Mode" options={culturalModes} placeholder="Nigerian" />
                  <Select label="Tone" options={[{ value: "emotional", label: "Emotional" }, { value: "dramatic", label: "Dramatic" }, { value: "funny", label: "Funny" }, { value: "suspenseful", label: "Suspenseful" }]} placeholder="Emotional" />
                  <Select label="Length" options={[{ value: "short", label: "Short (5 min)" }, { value: "medium", label: "Medium (10 min)" }, { value: "long", label: "Long (20 min)" }]} placeholder="Medium" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Select label="Target Audience" options={[{ value: "adults", label: "Adults" }, { value: "youth", label: "Youth" }, { value: "family", label: "Family" }]} placeholder="Adults 25-45" />
                  <Select label="Ending" options={[{ value: "happy", label: "Happy" }, { value: "sad", label: "Sad" }, { value: "twist", label: "Twist" }, { value: "open", label: "Open" }]} placeholder="Happy" />
                  <Input label="Characters Count" type="number" placeholder="3" />
                </div>
                <Button variant="studio" size="lg" className="w-full h-12" isLoading={isGenerating} onClick={handleGenerate}>
                  <Zap className="mr-2 h-4 w-4" /> Generate Story (5 credits)
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~30 seconds</span>
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Cultural authenticity</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Auto characters</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Generated Story Preview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">Logline</h4>
                  <p className="text-sm text-muted-foreground">After 15 years in America, Emeka returns to his village in Anambra to discover his father's hidden legacy and confront his own identity.</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-2">Synopsis</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">Emeka, a 32-year-old Nigerian-American software engineer, receives news that his estranged father is ill. He returns to his hometown after 15 years to find family secrets, cultural conflicts, and a chance for redemption...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Credit Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Story generation</span><span>5 cr</span></div>
                <div className="flex justify-between"><span>Character auto-create</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between"><span>Scene breakdown</span><span className="text-green-600">Free</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>5 credits</span></div>
                <div className="text-xs text-muted-foreground">Balance after: 1,842 credits</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Cultural Modes</h3>
              <div className="flex flex-wrap gap-2">
                {culturalModes.slice(0, 8).map(m => <Badge key={m.value} variant="outline" className="text-[11px]">{m.label}</Badge>)}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Nigerian modes include Yoruba, Igbo, Hausa traditions, Pidgin, urban & traditional settings, folklore.</p>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
