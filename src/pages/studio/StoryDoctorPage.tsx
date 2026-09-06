
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Stethoscope, AlertTriangle, CheckCircle, Sparkles } from "lucide-react"

export function StoryDoctorPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Story Doctor" description="Detects plot holes, contradictions, character inconsistencies, timeline errors, and weak endings." action={<Badge variant="studio">CREATOR+ • 8 credits per analysis</Badge>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5" /> Diagnosis Report</h3>
                <Button variant="studio"><Sparkles className="mr-2 h-4 w-4" /> Analyze Story (8 cr)</Button>
              </div>

              <div className="space-y-4">
                <Alert variant="warning" title="Plot Hole Detected - Scene 4">
                  Character Adaeze mentions father's illness in Scene 4, but she wasn't present in Scene 1 when the call was received. Timeline inconsistency.
                </Alert>
                <Alert variant="destructive" title="Character Inconsistency - Emeka">
                  Emeka's age changes from 32 in Scene 1 to 30 in Scene 7. Character bible says 32.
                </Alert>
                <Alert variant="info" title="Weak Ending">
                  Current ending lacks emotional payoff. Consider adding reconciliation scene with Papa Okafor for stronger resolution.
                </Alert>
                <Alert variant="success" title="Strong Opening">
                  Midnight call hook is compelling. Maintains tension and cultural authenticity.
                </Alert>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Suggested Fixes</h4>
                <div className="space-y-3">
                  {[
                    { issue: "Timeline fix", fix: "Add Mama informing Adaeze off-screen between Scene 1-2", auto: true },
                    { issue: "Age consistency", fix: "Update Scene 7 dialogue to reflect age 32", auto: true },
                    { issue: "Ending strength", fix: "Generate new final scene: Father-son reconciliation under udala tree", auto: false },
                  ].map((item, i) => (
                    <Card key={i} className="p-4 flex items-center justify-between">
                      <div><div className="font-medium text-sm">{item.issue}</div><div className="text-xs text-muted-foreground">{item.fix}</div></div>
                      <Button size="sm" variant={item.auto ? "studio" : "outline"}>{item.auto ? "Auto-Fix" : "Generate Fix"}</Button>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Health Score</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-500">72</div>
                <div className="text-sm text-muted-foreground">Good, but needs fixes</div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span>Plot Coherence</span><span className="text-amber-500">68%</span></div>
                  <div className="flex justify-between"><span>Character Consistency</span><span className="text-red-500">55%</span></div>
                  <div className="flex justify-between"><span>Timeline Logic</span><span className="text-amber-500">70%</span></div>
                  <div className="flex justify-between"><span>Emotional Impact</span><span className="text-green-500">85%</span></div>
                  <div className="flex justify-between"><span>Cultural Authenticity</span><span className="text-green-500">92%</span></div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Checks Performed</h3>
              <div className="space-y-2 text-sm">
                {[
                  { check: "Plot holes", status: "fail" },
                  { check: "Contradictions", status: "pass" },
                  { check: "Character arcs", status: "pass" },
                  { check: "Timeline errors", status: "fail" },
                  { check: "Location consistency", status: "pass" },
                  { check: "Weak endings", status: "warn" },
                  { check: "Repeated scenes", status: "pass" },
                ].map(c => (
                  <div key={c.check} className="flex items-center justify-between"><span>{c.check}</span>{c.status === "pass" ? <CheckCircle className="h-4 w-4 text-green-500" /> : c.status === "fail" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}</div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
