
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function ViralOptimizerPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Viral Optimizer" description="Scores hook, title, thumbnail, opening, CTA, description. Get improvement suggestions." action={<Badge variant="studio">PRO • 5 credits per analysis</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Viral Score: 78/100 - Good, but improvable</h3>
              <div className="space-y-4">
                {[
                  { metric: "Hook (First 3 seconds)", score: 85, suggestion: "Strong - midnight call creates curiosity. Keep it." },
                  { metric: "Title", score: 92, suggestion: "Excellent - uses curiosity gap + emotional trigger" },
                  { metric: "Thumbnail", score: 88, suggestion: "High impact, but add brighter border for mobile" },
                  { metric: "Opening", score: 65, suggestion: "Weak - start with conflict, not exposition. Cut first 5 seconds." },
                  { metric: "CTA", score: 60, suggestion: "Add specific CTA: 'Comment your own homecoming story'" },
                  { metric: "Description", score: 70, suggestion: "Add timestamps and 2 more hashtags" },
                ].map(m => (
                  <div key={m.metric} className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="font-medium">{m.metric}</span><span className={m.score >= 80 ? "text-green-600" : m.score >= 60 ? "text-amber-600" : "text-red-600"}>{m.score}/100</span></div>
                    <Progress value={m.score} className="h-2" />
                    <div className="text-xs text-muted-foreground">{m.suggestion}</div>
                  </div>
                ))}
              </div>
              <Button variant="studio" className="w-full mt-6">Apply All Improvements (3 cr)</Button>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6 bg-green-500/5 border-green-500/20">
              <h3 className="font-semibold mb-2">Top Improvement</h3>
              <p className="text-sm">Cut opening exposition. Start directly with Mama's cracked voice: 'Emeka, your father...' - increases retention by 23%.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Platform Scores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>YouTube</span><span>78</span></div>
                <div className="flex justify-between"><span>TikTok</span><span>85</span></div>
                <div className="flex justify-between"><span>Instagram Reels</span><span>82</span></div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
