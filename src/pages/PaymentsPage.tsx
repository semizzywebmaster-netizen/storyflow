
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { CreditCard, Shield } from "lucide-react"

export function PaymentsPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Payments" description="Paystack & Flutterwave integration. Wallet funding, credit purchase, subscriptions." action={<Badge variant="success"><Shield className="mr-1 h-3 w-3" /> Secure - Backend Verified</Badge>} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3"><CreditCard className="h-5 w-5" /><div><div className="font-medium text-sm">Card ending 4242</div><div className="text-xs text-muted-foreground">Paystack • Default</div></div></div>
                <Badge variant="success">Verified</Badge>
              </div>
              <Button variant="outline" className="w-full">Add New Method</Button>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <strong>Security:</strong> Frontend never trusts payment success. All payments verified server-side via Paystack/Flutterwave webhooks with idempotency. (Phase 61/74)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { desc: "Wallet Fund - ₦10,000", status: "SUCCESS", date: "2 hours ago", ref: "PSK_abc123" },
                { desc: "Pro Subscription", status: "SUCCESS", date: "3 days ago", ref: "PSK_def456" },
                { desc: "Credits 500 pack", status: "SUCCESS", date: "1 week ago", ref: "FLW_ghi789" },
                { desc: "Wallet Fund - ₦5,000", status: "PENDING", date: "Just now", ref: "PSK_jkl012" },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl border">
                  <div><div className="font-medium">{p.desc}</div><div className="text-xs text-muted-foreground">{p.date} • {p.ref}</div></div>
                  <Badge variant={p.status === "SUCCESS" ? "success" : "warning"} className="text-[10px]">{p.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
