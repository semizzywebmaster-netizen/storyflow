
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { CreditCard, Zap, TrendingUp, AlertTriangle } from "lucide-react"

export function CreditsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Credits" description="Balance, usage, history, purchase. Credits power all AI generations." action={<Button variant="studio"><CreditCard className="mr-2 h-4 w-4" /> Buy Credits</Button>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div><div className="text-3xl font-bold">1,847 credits</div><div className="text-sm text-muted-foreground">≈ ₦18,470 value • Pro plan • Resets monthly</div></div>
              <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Low soon</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-muted/50"><div className="text-xl font-bold">397</div><div className="text-xs text-muted-foreground">Used this month</div></div>
              <div className="p-3 rounded-xl bg-muted/50"><div className="text-xl font-bold">2,000</div><div className="text-xs text-muted-foreground">Monthly allowance</div></div>
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20"><div className="text-xl font-bold text-primary">1,603</div><div className="text-xs text-muted-foreground">Remaining</div></div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Cost Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  { op: "Story", cost: "5 cr" },
                  { op: "Character", cost: "3 cr" },
                  { op: "Image", cost: "5 cr" },
                  { op: "Voice", cost: "4 cr" },
                  { op: "Video", cost: "20 cr" },
                  { op: "Subtitle", cost: "3 cr" },
                  { op: "Thumbnail", cost: "2 cr" },
                  { op: "Social Pack", cost: "5 cr" },
                ].map(item => <div key={item.op} className="p-3 rounded-xl border flex justify-between"><span>{item.op}</span><span className="font-medium">{item.cost}</span></div>)}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Buy Credits</h3>
              <div className="space-y-2">
                {[
                  { pack: "100 credits", price: "₦1,500", bonus: "" },
                  { pack: "500 credits", price: "₦6,500", bonus: "+50 bonus" },
                  { pack: "1000 credits", price: "₦12,000", bonus: "+150 bonus" },
                  { pack: "2500 credits", price: "₦27,500", bonus: "+500 bonus" },
                ].map(p => <div key={p.pack} className="flex justify-between items-center p-3 rounded-xl border hover:border-primary cursor-pointer"><div><div className="font-medium text-sm">{p.pack}</div><div className="text-xs text-green-600">{p.bonus}</div></div><div className="font-bold text-sm">{p.price}</div></div>)}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Story gen</span><span className="text-red-600">-5</span></div>
                <div className="flex justify-between"><span>Image gen x3</span><span className="text-red-600">-15</span></div>
                <div className="flex justify-between"><span>Pro monthly</span><span className="text-green-600">+2000</span></div>
                <div className="flex justify-between"><span>Rewarded ad</span><span className="text-green-600">+10</span></div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
