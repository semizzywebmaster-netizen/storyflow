
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Image as ImageIcon, Sparkles, Eye } from "lucide-react"

export function ThumbnailStudioPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Thumbnail Studio" description="Generate multiple concepts with emotional impact, curiosity, and clarity scoring." action={<Badge variant="outline">2 credits per concept</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=400",
                "https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=400",
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400",
              ].map((img, i) => (
                <Card key={i} className="overflow-hidden group">
                  <div className="relative aspect-video">
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white font-bold text-lg leading-tight">HE RETURNED AFTER 15 YEARS...</div>
                      <div className="text-white/80 text-xs mt-1">What his father hid will shock you</div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="secondary" className="text-[10px] bg-green-500 text-white">Impact 92</Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Emotional: 88</span><span>Curiosity: 94</span><span>Clarity: 85</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1"><Eye className="h-3 w-3 mr-1" /> Preview</Button>
                      <Button size="sm" variant="studio" className="flex-1">Use Thumbnail</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Generate Thumbnails</h3>
              <Input placeholder="Thumbnail text: HE RETURNED..." className="mb-3" />
              <Input placeholder="Sub-text (optional)" className="mb-3" />
              <Button variant="studio" className="w-full"><Sparkles className="mr-2 h-4 w-4" /> Generate 4 Concepts (2 cr)</Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Drama", "Shock", "Mystery", "Romance", "Comedy", "Nollywood"].map(t => <div key={t} className="p-2 rounded-lg border text-center text-xs hover:border-primary cursor-pointer">{t}</div>)}
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
