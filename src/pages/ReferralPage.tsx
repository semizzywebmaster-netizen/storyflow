
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function ReferralPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Referral System" description="Invite friends, earn bonus credits. Anti-abuse protected." />
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Your Referral Code</h3>
            <div className="flex gap-2 mb-4"><Input defaultValue="MIZZY2024" readOnly /><Button variant="studio">Copy Link</Button></div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="text-sm">Share: <span className="font-mono">aistorystudio.com/r/MIZZY2024</span></div>
              <div className="text-xs text-muted-foreground mt-1">You get 100 credits, friend gets 50 credits</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="p-3 rounded-xl bg-muted/50"><div className="text-xl font-bold">12</div><div className="text-xs">Invites</div></div>
              <div className="p-3 rounded-xl bg-muted/50"><div className="text-xl font-bold">8</div><div className="text-xs">Converted</div></div>
              <div className="p-3 rounded-xl bg-primary/10"><div className="text-xl font-bold text-primary">800</div><div className="text-xs">Credits Earned</div></div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">How It Works</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Share your referral link</li>
              <li>• Friend signs up with your code</li>
              <li>• Friend gets 50 bonus credits</li>
              <li>• You get 100 credits after first generation</li>
              <li>• Anti-abuse: IP + device + email checks</li>
            </ul>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
