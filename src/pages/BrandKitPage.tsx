
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function BrandKitPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Brand Kit" description="Logo, colors, fonts, intro/outro, watermark, auto-apply to content." action={<Badge variant="studio">PRO+</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Brand Identity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Brand Name" defaultValue="Mizzy Stories" />
                  <Input label="Tagline" defaultValue="Authentic Nigerian Stories" />
                </div>
                <div>
                  <label className="text-sm font-medium">Logo</label>
                  <div className="mt-2 w-24 h-24 rounded-xl border-2 border-dashed bg-muted flex items-center justify-center text-xs">Upload Logo</div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-sm font-medium">Primary Color</label><div className="mt-2 flex gap-2"><div className="w-8 h-8 rounded-lg bg-primary" /><Input defaultValue="#7c3aed" /></div></div>
                  <div><label className="text-sm font-medium">Secondary</label><div className="mt-2 flex gap-2"><div className="w-8 h-8 rounded-lg bg-pink-500" /><Input defaultValue="#ec4899" /></div></div>
                  <div><label className="text-sm font-medium">Accent</label><div className="mt-2 flex gap-2"><div className="w-8 h-8 rounded-lg bg-amber-500" /><Input defaultValue="#f59e0b" /></div></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Font Heading" defaultValue="Space Grotesk" />
                  <Input label="Font Body" defaultValue="Inter" />
                </div>
                <Input label="Social Handles" placeholder="@mizzystories (YouTube, TikTok, IG)" />
                <Input label="CTA Text" defaultValue="Subscribe for more Nigerian stories!" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Intro / Outro</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-xs">Intro Video (3s)</div>
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-xs">Outro Video (5s) + CTA</div>
                </div>
                <Button variant="outline" className="w-full">Generate Intro/Outro with AI (10 cr)</Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Preview</h3>
              <div className="aspect-video bg-muted rounded-xl mb-3 overflow-hidden relative">
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 text-xs font-bold">Mizzy Stories</div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-primary text-white text-[10px]">Subscribe!</div>
              </div>
              <Button variant="studio" className="w-full" size="sm">Apply to All Videos</Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Watermark</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">MS</div>
                <div className="text-sm"><div>Enabled (PRO)</div><div className="text-xs text-muted-foreground">Bottom-right • 80% opacity</div></div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
