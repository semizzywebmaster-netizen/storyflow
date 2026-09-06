
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function AdsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Ads System" description="Banner, native, sponsored, rewarded, video ads. Free users, ad-free paid." action={<Badge variant="outline">Free Plan Only • 10 credits for rewarded ad</Badge>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Ad Placements (Free Users)</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed bg-muted/20">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-2">BANNER AD - Dashboard Top</div>
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-xl flex items-center justify-center text-sm">Your Ad Could Be Here • 728x90 • Sponsored</div>
                </div>
                <div className="p-4 rounded-xl border">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-2">NATIVE AD - Project Feed</div>
                  <div className="flex gap-3 p-3 rounded-xl bg-muted/50"><div className="w-12 h-12 rounded-lg bg-primary/10" /><div className="flex-1"><div className="text-sm font-medium">Grow Your Audience with Pro</div><div className="text-xs text-muted-foreground">Sponsored • Upgrade to remove ads</div></div><Button size="sm" variant="outline">Upgrade</Button></div>
                </div>
                <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-2">REWARDED AD - Bonus Credits</div>
                  <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Watch ad, get 10 credits free</div><div className="text-xs text-muted-foreground">Max 3 per day • Free users only</div></div><Button size="sm" variant="studio">Watch & Earn</Button></div>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Ad Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Frequency</span><span>Every 10 min</span></div>
                <div className="flex justify-between"><span>Reward Amount</span><span>10 credits</span></div>
                <div className="flex justify-between"><span>Target Plan</span><span>Free</span></div>
                <div className="flex justify-between"><span>Daily Limit</span><span>3 rewarded</span></div>
              </div>
            </Card>
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2">Go Ad-Free</h3>
              <p className="text-sm text-muted-foreground mb-3">Upgrade to Creator or Pro to remove all ads and get premium features.</p>
              <Button variant="studio" className="w-full" size="sm">Upgrade to Creator - ₦7,500</Button>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
