
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Scissors, Split, Trash2, Volume2, Plus } from "lucide-react"

export function VideoEditorPage() {
  return (
    <AppShell>
      <PageContainer maxWidth="full">
        <PageHeader title="Video Editor" description="Timeline editor with tracks for video, voice, music, SFX, text, captions." action={<Button variant="studio">Export Video</Button>} />
        <div className="h-[600px] border rounded-2xl bg-card overflow-hidden flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <img src="https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=800" alt="Preview" className="max-h-full max-w-full object-contain" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full"><Scissors className="h-4 w-4" /></Button>
              <Button size="icon" variant="secondary" className="rounded-full"><Split className="h-4 w-4" /></Button>
              <Button size="icon" variant="secondary" className="rounded-full"><Trash2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="secondary" className="rounded-full"><Volume2 className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="h-48 border-t bg-muted/20 p-4 space-y-2 overflow-y-auto">
            {[
              { type: "VIDEO", color: "bg-blue-500", label: "Scenes" },
              { type: "VOICE", color: "bg-green-500", label: "Voiceover" },
              { type: "MUSIC", color: "bg-purple-500", label: "Music" },
              { type: "SFX", color: "bg-amber-500", label: "SFX" },
              { type: "SUBTITLE", color: "bg-pink-500", label: "Captions" },
            ].map(track => (
              <div key={track.type} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium">{track.label}</div>
                <div className="flex-1 h-8 bg-background border rounded-lg relative overflow-hidden flex">
                  <div className={`h-full ${track.color} opacity-80`} style={{ width: `${60 + Math.random()*30}%` }} />
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6"><Plus className="h-3 w-3" /></Button>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
