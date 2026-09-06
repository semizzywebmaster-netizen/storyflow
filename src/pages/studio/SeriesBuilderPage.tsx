
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function SeriesBuilderPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Series Builder" description="Series → Seasons → Episodes → Scenes. Maintain character memory, relationships, timeline." action={<Badge variant="studio">PRO • 15 credits per episode</Badge>} />
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Series</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl border bg-primary/5 border-primary/20"><div className="font-medium text-sm">The Return</div><div className="text-xs text-muted-foreground">Season 1 • 3 episodes</div></div>
              <Button variant="outline" size="sm" className="w-full">New Series</Button>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Season 1</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded-lg bg-muted">Episode 1: The Call - Completed</div>
              <div className="p-2 rounded-lg bg-muted">Episode 2: Homecoming - In Progress</div>
              <div className="p-2 rounded-lg border border-dashed">Episode 3: Reconciliation - Draft</div>
              <Button size="sm" variant="studio" className="w-full mt-2">Generate Next Episode (15 cr)</Button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-4">
            <h3 className="font-semibold mb-3">Character Memory</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-muted/50"><strong>Emeka:</strong> Returned after 15 years, guilt about leaving, father ill, sister Adaeze kept family together. Previous events: midnight call, Lagos arrival.</div>
              <div className="p-3 rounded-xl bg-muted/50"><strong>Relationships:</strong> Emeka-Papa strained, Emeka-Adaeze close but tense, Mama mediator.</div>
              <div className="p-3 rounded-xl bg-muted/50"><strong>Unresolved:</strong> Father's hidden legacy, family business debt, Adaeze's marriage pressure.</div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
