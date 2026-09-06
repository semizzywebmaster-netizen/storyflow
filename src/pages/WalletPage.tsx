
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Wallet, AlertTriangle, Plus, TrendingDown, TrendingUp } from "lucide-react"

export function WalletPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Wallet" description="Platform-only wallet. Fund, purchase credits, subscriptions, services. No withdrawal." action={<Button variant="studio"><Plus className="mr-2 h-4 w-4" /> Fund Wallet</Button>} />
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div><div className="text-sm text-muted-foreground">Wallet Balance</div><div className="text-4xl font-bold">₦25,000</div><div className="text-sm text-muted-foreground">≈ 2,500 credits • Non-withdrawable • Platform only</div></div>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-700"><AlertTriangle className="h-3 w-3 mr-1" /> No Withdrawal</Badge>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm mb-6">
              <strong>Important:</strong> Wallet funds are for platform use only - credits, subscriptions, marketplace. No cash-out, no transfer to other users. This is enforced in backend (Phase 61).
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-muted/50"><div className="font-bold">₦25,000</div><div className="text-xs text-muted-foreground">Current</div></div>
              <div className="p-3 rounded-xl bg-muted/50"><div className="font-bold">₦45,000</div><div className="text-xs text-muted-foreground">Total Funded</div></div>
              <div className="p-3 rounded-xl bg-muted/50"><div className="font-bold">₦20,000</div><div className="text-xs text-muted-foreground">Total Spent</div></div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Fund Wallet</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["₦5,000", "₦10,000", "₦25,000", "₦50,000"].map(amt => <Button key={amt} variant="outline" size="sm">{amt}</Button>)}
              </div>
              <Button variant="studio" className="w-full">Fund with Paystack</Button>
              <div className="text-xs text-muted-foreground mt-2 text-center">Paystack & Flutterwave supported</div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Recent Transactions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> Funded</span><span className="text-green-600">+₦10,000</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-red-500" /> Credits</span><span className="text-red-600">-₦2,000</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-red-500" /> Subscription</span><span className="text-red-600">-₦18,000</span></div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
