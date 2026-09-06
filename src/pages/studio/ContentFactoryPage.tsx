
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Zap, Lightbulb, FileText, Hash, Calendar } from "lucide-react"

export function ContentFactoryPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Content Factory" description="One topic → 30 ideas, hooks, scripts, captions, CTAs, hashtags, thumbnail concepts, publishing schedule." action={<Badge variant="studio">BETA • 10 credits</Badge>} />
        <Card className="p-6 mb-6">
          <div className="flex gap-3">
            <Input placeholder="Enter topic: e.g., Nigerian family traditions, Lagos hustle, Jollof vs Fried Rice debate..." className="flex-1" />
            <Button variant="studio"><Zap className="mr-2 h-4 w-4" /> Generate 30 Ideas (10 cr)</Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Ideas & Hooks</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                "5 Things Your Nigerian Mother Will Never Tell You",
                "POV: You Return Home After 15 Years Abroad",
                "The Secret Ingredient in Mama's Soup",
                "Why Lagos Danfo Drivers Are Philosophers",
              ].map((idea, i) => <div key={i} className="p-2 rounded-lg border hover:bg-accent cursor-pointer">{i+1}. {idea}</div>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Scripts</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-3 rounded-lg bg-muted/50">Hook: Your mother called you at 3AM... (0-3s) Story: ... CTA: Comment your own return story</div>
              <Button variant="outline" size="sm" className="w-full">View All 30 Scripts</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between"><span>Mon - Family Drama</span><span>9:00 AM</span></div>
              <div className="flex justify-between"><span>Tue - Comedy Skit</span><span>6:00 PM</span></div>
              <div className="flex justify-between"><span>Wed - Cultural Education</span><span>12:00 PM</span></div>
              <div className="flex justify-between"><span>Thu - Lagos Life</span><span>7:00 PM</span></div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
