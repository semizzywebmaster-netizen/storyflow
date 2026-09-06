
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Film, Camera, Sun, Palette, Clapperboard } from "lucide-react"

export function AIDirectorPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Director" description="Control cinematic style, camera, lighting, and mood. Your virtual director for consistent visual storytelling." action={<Badge variant="outline">CREATOR+ • Pro models available</Badge>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Camera & Shot</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Select label="Shot Type" options={[{ value: "close-up", label: "Close-Up" }, { value: "medium", label: "Medium Shot" }, { value: "wide", label: "Wide Shot" }, { value: "extreme-wide", label: "Extreme Wide" }, { value: "over-shoulder", label: "Over Shoulder" }]} placeholder="Medium Shot" />
                <Select label="Camera Angle" options={[{ value: "eye-level", label: "Eye Level" }, { value: "low", label: "Low Angle" }, { value: "high", label: "High Angle" }, { value: "dutch", label: "Dutch Angle" }, { value: "bird-eye", label: "Bird's Eye" }]} placeholder="Eye Level" />
                <Select label="Lens" options={[{ value: "35mm", label: "35mm - Natural" }, { value: "50mm", label: "50mm - Portrait" }, { value: "85mm", label: "85mm - Cinematic" }, { value: "24mm", label: "24mm - Wide" }]} placeholder="50mm" />
                <Select label="Movement" options={[{ value: "static", label: "Static" }, { value: "dolly", label: "Dolly In/Out" }, { value: "pan", label: "Pan" }, { value: "tracking", label: "Tracking" }]} placeholder="Static" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Sun className="h-5 w-5" /> Lighting & Atmosphere</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Select label="Lighting Style" options={[{ value: "natural", label: "Natural" }, { value: "dramatic", label: "Dramatic" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }, { value: "golden-hour", label: "Golden Hour" }]} placeholder="Natural" />
                <Select label="Time of Day" options={[{ value: "dawn", label: "Dawn" }, { value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }, { value: "golden", label: "Golden Hour" }, { value: "night", label: "Night" }]} placeholder="Afternoon" />
                <div className="md:col-span-2"><Slider label="Atmosphere Intensity" defaultValue={60} /></div>
                <Select label="Weather" options={[{ value: "clear", label: "Clear" }, { value: "cloudy", label: "Cloudy" }, { value: "rain", label: "Rain" }, { value: "harmattan", label: "Harmattan Haze" }]} placeholder="Clear" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Visual Style</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {["Cinematic", "Realistic", "Animation", "Anime", "Cartoon", "African Art", "Nollywood", "Documentary", "Fantasy", "Children's", "Comic", "Vintage"].map(style => (
                    <div key={style} className="p-3 rounded-xl border hover:border-primary cursor-pointer text-center">
                      <div className="w-full aspect-video bg-muted rounded-lg mb-2" />
                      <div className="text-xs font-medium">{style}</div>
                    </div>
                  ))}
                </div>
                <Select label="Color Palette" options={[{ value: "warm", label: "Warm Nigerian Sunset" }, { value: "vibrant", label: "Vibrant Lagos" }, { value: "earthy", label: "Earthy Traditional" }, { value: "cool", label: "Cool Modern" }]} placeholder="Warm Nigerian Sunset" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Director Preset</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start"><Clapperboard className="mr-2 h-4 w-4" /> Nollywood Drama</Button>
                <Button variant="outline" className="w-full justify-start"><Film className="mr-2 h-4 w-4" /> African Epic</Button>
                <Button variant="outline" className="w-full justify-start"><Camera className="mr-2 h-4 w-4" /> Modern Lagos</Button>
                <Button variant="studio" className="w-full mt-4">Apply to All Scenes</Button>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Preview</h3>
              <div className="aspect-video bg-muted rounded-xl mb-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=400" alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-muted-foreground">Medium Shot • Eye Level • 50mm • Natural Lighting • Cinematic • Warm Palette</div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
