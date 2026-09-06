
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Check, Crown, Zap } from "lucide-react"

export function SubscriptionPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Subscription" description="Free, Creator, Pro, Agency. Compare plans, upgrade, billing." action={<Badge variant="studio">Current: PRO</Badge>} />
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "FREE", price: "₦0", credits: "50", features: ["Watermark", "Basic models", "Limited video", "Ads"], current: false, cta: "Downgrade" },
            { name: "CREATOR", price: "₦7,500", credits: "500", features: ["No watermark", "Character Lock", "Story Doctor", "AI Director", "Content Factory"], current: false, cta: "Downgrade" },
            { name: "PRO", price: "₦18,000", credits: "2,000", features: ["Everything Creator", "Series Builder", "Auto-Clips", "Content Agent", "Brand Kit", "4K", "Priority"], current: true, cta: "Current Plan" },
            { name: "AGENCY", price: "₦38,000", credits: "5,000", features: ["Everything Pro", "Teams", "Client workspaces", "API", "Bulk", "Approval"], current: false, cta: "Upgrade" },
          ].map(plan => (
            <Card key={plan.name} className={`p-6 ${plan.current ? "border-primary shadow-xl" : ""}`}>
              <div className="flex items-center justify-between mb-2"><h3 className="font-bold flex items-center gap-2">{plan.name} {plan.current && <Crown className="h-4 w-4 text-amber-500" />}</h3>{plan.current && <Badge variant="studio">Current</Badge>}</div>
              <div className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <div className="text-sm text-primary">{plan.credits} credits/mo</div>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map(f => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> {f}</li>)}
              </ul>
              <Button variant={plan.current ? "outline" : "studio"} className="w-full mt-6" disabled={plan.current}>{plan.cta}</Button>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">Billing & Usage</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div><div className="text-muted-foreground">Current Plan</div><div className="font-medium">PRO - ₦18,000/month</div><div className="text-xs text-muted-foreground">Renews Dec 15, 2024</div></div>
            <div><div className="text-muted-foreground">Credits Used</div><div className="font-medium">397 / 2,000</div><div className="text-xs text-muted-foreground">1,603 remaining</div></div>
            <div><div className="text-muted-foreground">Payment Method</div><div className="font-medium">Paystack • Card ending 4242</div><div className="text-xs text-primary cursor-pointer">Change</div></div>
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  )
}
