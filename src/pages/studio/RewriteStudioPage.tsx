
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function RewriteStudioPage() {
  const [original] = useState("Emeka sat in his apartment. The phone rang. It was Mama.")
  const [rewritten, setRewritten] = useState("The shrill ring shattered the 3 AM silence. Emeka's heart pounded as Mama's name glowed on the screen - an omen he had dreaded for fifteen years.")

  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Rewrite Studio" description="Transform your story with different emotions, tones, and styles. Preview before applying." />
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Original</CardTitle></CardHeader>
            <CardContent><Textarea value={original} rows={6} readOnly /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center justify-between">Rewritten <Badge variant="studio">Dramatic</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={rewritten} onChange={e => setRewritten(e.target.value)} rows={6} />
              <div className="flex flex-wrap gap-2">
                {["Emotional", "Dramatic", "Suspenseful", "Funny", "Scary", "Romantic", "Shorter", "Longer", "Cinematic"].map(s => <Badge key={s} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">{s}</Badge>)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Regenerate</Button>
                <Button variant="studio" className="flex-1">Apply Rewrite</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
