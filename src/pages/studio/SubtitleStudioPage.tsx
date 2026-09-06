
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Subtitles, Sparkles, Download } from "lucide-react"

export function SubtitleStudioPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Subtitle Studio" description="Automatic captions, manual editing, animated styles, SRT/VTT export, burn-in." action={<Badge variant="outline">3 credits per generation</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Subtitles className="h-5 w-5" /> Captions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: "00:00:01 - 00:00:04", speaker: "Emeka", text: "Mama? What happened? Is it Papa?" },
                  { time: "00:00:05 - 00:00:09", speaker: "Mama (V.O.)", text: "Your father... he is asking for you." },
                  { time: "00:00:10 - 00:00:15", speaker: "Narrator", text: "Fifteen years of silence broken in a single phone call." },
                ].map((cap, i) => (
                  <Card key={i} className="p-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>{cap.time}</span><Badge variant="outline" className="text-[10px]">{cap.speaker}</Badge></div>
                    <div className="text-sm">{cap.text}</div>
                  </Card>
                ))}
                <div className="flex gap-2">
                  <Button variant="studio" className="flex-1"><Sparkles className="mr-2 h-4 w-4" /> Auto-Generate Captions (3 cr)</Button>
                  <Button variant="outline"><Download className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Caption Styles</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Classic", "Bold", "TikTok", "YouTube", "Nollywood", "Animated"].map(s => <div key={s} className="p-3 rounded-xl border text-center text-xs cursor-pointer hover:border-primary">{s}</div>)}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Export</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Download SRT</Button>
                <Button variant="outline" className="w-full justify-start">Download VTT</Button>
                <Button variant="studio" className="w-full justify-start">Burn-in to Video</Button>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
