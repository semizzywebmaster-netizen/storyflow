
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { FileText, Clock, Users, MapPin, Save, Sparkles, History } from "lucide-react"

export function StoryWorkspacePage() {
  return (
    <AppShell>
      <PageContainer maxWidth="7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">The Return - Story Workspace</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="studio">Nigerian Drama</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 12 min • 2,450 words</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> 3 characters</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><History className="mr-2 h-4 w-4" /> Versions</Button>
            <Button variant="studio"><Save className="mr-2 h-4 w-4" /> Save</Button>
          </div>
        </div>

        <Tabs defaultValue="full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="full">Full Story</TabsTrigger>
            <TabsTrigger value="script">Script</TabsTrigger>
            <TabsTrigger value="dialogue">Dialogue</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader><CardTitle>Synopsis</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Emeka, a 32-year-old Nigerian-American software engineer, receives news that his estranged father is ill. He returns to his hometown after 15 years to find family secrets, cultural conflicts, and a chance for redemption. Set in Anambra with authentic Igbo traditions, the story explores diaspora identity, family honor, and homecoming.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-muted/50"><div className="text-xs text-muted-foreground">GENRE</div><div className="font-medium">Drama, Family</div></div>
                    <div className="p-3 rounded-xl bg-muted/50"><div className="text-xs text-muted-foreground">TONE</div><div className="font-medium">Emotional, Reflective</div></div>
                    <div className="p-3 rounded-xl bg-muted/50"><div className="text-xs text-muted-foreground">AUDIENCE</div><div className="font-medium">Adults 25-45, Diaspora</div></div>
                    <div className="p-3 rounded-xl bg-muted/50"><div className="text-xs text-muted-foreground">ENDING</div><div className="font-medium">Hopeful Reconciliation</div></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Word Count</span><span>2,450</span></div>
                  <div className="flex justify-between"><span>Scenes</span><span>12</span></div>
                  <div className="flex justify-between"><span>Characters</span><span>3</span></div>
                  <div className="flex justify-between"><span>Dialogue Lines</span><span>24</span></div>
                  <div className="flex justify-between"><span>Est. Duration</span><span>12 min</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="full" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-sm max-w-none">
                  <h3>CHAPTER 1: THE CALL</h3>
                  <p>The phone rang at 3:47 AM. Emeka stared at the screen - Mama. His mother never called at this hour unless...</p>
                  <p>"Emeka, your father..." Her voice cracked. "He is asking for you."</p>
                  <p>Fifteen years. Fifteen years since he left the village with a scholarship and a promise to return...</p>
                  <h3 className="mt-8">CHAPTER 2: HOMECOMING</h3>
                  <p>Murtala Muhammed Airport smelled the same - heat, diesel, and possibility. Lagos had grown while he was gone...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="script" className="mt-6">
            <Card className="p-6">
              <div className="space-y-4 font-mono text-sm">
                <div className="p-3 rounded bg-muted/30"><span className="text-muted-foreground">INT. NEW YORK APARTMENT - NIGHT</span><br/>EMEKA (32) sits up in bed, phone light on face.<br/><br/>EMEKA<br/>Mama? What happened?</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="characters" className="mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Emeka Okafor", role: "Protagonist", age: 32 },
                { name: "Papa Okafor", role: "Supporting", age: 68 },
                { name: "Adaeze", role: "Supporting", age: 28 },
              ].map(c => (
                <Card key={c.name} className="p-4"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.role} • {c.age}yo</div></Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}
