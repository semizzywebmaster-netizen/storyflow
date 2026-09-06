
import { Card } from "@/components/ui/card"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function AdminFinancePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Admin Finance" description="Payments, wallet deposits, credit purchases, subscriptions, refunds, reports" />
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6"><div className="text-2xl font-bold">₦1,247,000</div><div className="text-sm text-muted-foreground">Total Revenue</div></Card>
          <Card className="p-6"><div className="text-2xl font-bold">₦340,000</div><div className="text-sm text-muted-foreground">Wallet Deposits</div></Card>
          <Card className="p-6"><div className="text-2xl font-bold">₦89,000</div><div className="text-sm text-muted-foreground">Refunds Pending</div></Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
