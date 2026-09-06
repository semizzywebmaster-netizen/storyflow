
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Image as ImageIcon, Sparkles, Download, RefreshCw, Heart } from "lucide-react"

export function ImageStudioPage() {
  const [prompt, setPrompt] = useState("A young Nigerian man in traditional Igbo attire standing in a village square at sunset, cinematic lighting, emotional, 4K")

  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Image Studio" description="Generate character portraits, scenes, backgrounds, posters, and thumbnails." action={<Badge variant="outline">5 credits per image</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <Textarea label="Prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} placeholder="Describe your image..." />
                <div className="grid md:grid-cols-3 gap-4">
                  <Select label="Aspect Ratio" options={[{ value: "16:9", label: "16:9 Landscape" }, { value: "9:16", label: "9:16 Portrait" }, { value: "1:1", label: "1:1 Square" }, { value: "21:9", label: "21:9 Cinematic" }]} placeholder="16:9" />
                  <Select label="Style" options={[{ value: "cinematic", label: "Cinematic" }, { value: "realistic", label: "Realistic" }, { value: "anime", label: "Anime" }, { value: "african", label: "African Art" }]} placeholder="Cinematic" />
                  <Select label="Model" options={[{ value: "flux", label: "Flux Pro" }, { value: "sdxl", label: "SDXL" }, { value: "midjourney", label: "Midjourney Style" }]} placeholder="Flux Pro" />
                </div>
                <Button variant="studio" className="w-full h-12"><Sparkles className="mr-2 h-4 w-4" /> Generate Image (5 credits)</Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=400",
                "https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=400",
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400",
              ].map((img, i) => (
                <Card key={i} className="group overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={img} alt="Generated" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 left-2 flex gap-1"><Badge variant="secondary" className="text-[10px]">Character</Badge></div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-between">
                      <div className="flex gap-1">
                        <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full"><Heart className="h-3 w-3" /></Button>
                        <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full"><Download className="h-3 w-3" /></Button>
                      </div>
                      <Button size="sm" variant="secondary" className="h-7 text-xs"><RefreshCw className="h-3 w-3 mr-1" /> Variation (2 cr)</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Emeka portrait</span><span className="text-muted-foreground">5 cr</span></div>
                <div className="flex justify-between"><span>Village sunset</span><span className="text-muted-foreground">5 cr</span></div>
                <div className="flex justify-between"><span>Lagos street</span><span className="text-muted-foreground">5 cr</span></div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Quick Prompts</h3>
              <div className="space-y-2">
                {["Yoruba king palace interior", "Lagos danfo at night", "Igbo traditional wedding", "African folklore spirit"].map(p => (
                  <div key={p} className="p-2 rounded-lg border hover:bg-accent cursor-pointer text-xs">{p}</div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
