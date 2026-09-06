
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function CouponsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Coupons & Promotions" description="Promo codes, discounts, bonus credits, free features." />
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6">
            <div className="flex gap-3 mb-6"><Input placeholder="Enter promo code: e.g., NAIJA50" className="flex-1" /><Button variant="studio">Apply Code</Button></div>
            <div className="space-y-3">
              {[
                { code: "NAIJA50", desc: "50% off Creator plan", discount: "50% OFF", expiry: "Dec 31", eligible: "All" },
                { code: "WELCOME100", desc: "100 bonus credits for new users", discount: "+100 CR", expiry: "Jan 15", eligible: "New users" },
                { code: "PROLAUNCH", desc: "Free Pro features for 7 days", discount: "FREE PRO", expiry: "Dec 20", eligible: "Free plan" },
              ].map(c => (
                <Card key={c.code} className="p-4 flex items-center justify-between">
                  <div><div className="font-mono font-bold">{c.code}</div><div className="text-sm text-muted-foreground">{c.desc}</div><div className="text-xs text-muted-foreground mt-1">Expires {c.expiry} • {c.eligible}</div></div>
                  <div className="text-right"><Badge variant="studio">{c.discount}</Badge><Button size="sm" variant="outline" className="mt-2 block w-full">Apply</Button></div>
                </Card>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">How Coupons Work</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Percentage & fixed discounts</li>
              <li>• Bonus credits</li>
              <li>• Free features/generations</li>
              <li>• Usage limits & expiration</li>
              <li>• Plan eligibility checks</li>
              <li>• Anti-abuse protection</li>
            </ul>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
