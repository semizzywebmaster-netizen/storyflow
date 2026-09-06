
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Lock, Unlock, Sparkles, Plus, Trash2, Users } from "lucide-react"

const mockChars = [
  { id: "1", name: "Emeka Okafor", role: "PROTAGONIST", age: 32, locked: true, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { id: "2", name: "Papa Okafor", role: "SUPPORTING", age: 68, locked: true, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200" },
  { id: "3", name: "Adaeze", role: "SUPPORTING", age: 28, locked: false, img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200" },
]

export function CharacterBiblePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Character Bible" description="Define characters with appearance, personality, voice, and lock them for consistency across all scenes." action={<Button variant="studio"><Plus className="mr-2 h-4 w-4" /> New Character</Button>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            {mockChars.map(c => (
              <Card key={c.id} className={`p-4 cursor-pointer hover:shadow-md transition-all ${c.locked ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex gap-3">
                  <img src={c.img} alt={c.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-semibold truncate">{c.name}</span>{c.locked ? <Lock className="h-3 w-3 text-primary" /> : <Unlock className="h-3 w-3 text-muted-foreground" />}</div>
                    <div className="text-xs text-muted-foreground">{c.role} • {c.age}yo</div>
                    <Badge variant={c.locked ? "studio" : "outline"} className="mt-1 text-[10px]">{c.locked ? "Locked" : "Unlocked"}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Emeka Okafor - Character Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Name" defaultValue="Emeka Okafor" />
                  <Select label="Role" options={[{ value: "PROTAGONIST", label: "Protagonist" }, { value: "ANTAGONIST", label: "Antagonist" }, { value: "SUPPORTING", label: "Supporting" }]} placeholder="Protagonist" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input label="Age" defaultValue="32" />
                  <Input label="Gender" defaultValue="Male" />
                  <Input label="Skin Tone" defaultValue="Dark brown" />
                </div>
                <Textarea label="Appearance" defaultValue="Tall, athletic build, well-groomed beard, modern casual with traditional touches, warm eyes" rows={2} />
                <Textarea label="Personality" defaultValue="Intelligent but conflicted, carries guilt, seeks redemption, proud but humble" rows={2} />
                <Textarea label="Backstory" defaultValue="Left Nigeria at 17 for scholarship in US, built successful career but lost connection to family" rows={2} />
                <Textarea label="Clothing Style" defaultValue="Modern casual, ankara accents, traditional cap for ceremonies" rows={2} />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-sm font-medium mb-2">Reference Images</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3].map(i => <div key={i} className="aspect-square rounded-xl bg-muted border-2 border-dashed flex items-center justify-center text-xs">Portrait {i}</div>)}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">Generate References (3 cr)</Button>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm font-medium mb-2">Voice</div>
                    <Select label="Voice" options={[{ value: "chike", label: "Chike - Nigerian Male" }, { value: "amara", label: "Amara - Nigerian Female" }]} placeholder="Chike" />
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Preview Voice</Button>
                      <Button variant="studio" size="sm" className="flex-1"><Lock className="mr-1 h-3 w-3" /> Lock Character</Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Locked characters stay consistent across all scenes and generations.</div>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button variant="studio" className="flex-1"><Sparkles className="mr-2 h-4 w-4" /> Generate Character (3 credits)</Button>
                  <Button variant="outline"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
