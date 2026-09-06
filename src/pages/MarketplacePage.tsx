
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function MarketplacePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Marketplace" description="Templates, characters, story packs, music, SFX, assets. Sellers, orders, commission." />
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "Nollywood Drama Template Pack", seller: "Mizzy", price: "₦2,500", type: "Template" },
            { title: "Igbo King Character", seller: "Culture Studio", price: "₦1,200", type: "Character" },
            { title: "Lagos Street Ambience Pack", seller: "Sound Naija", price: "₦800", type: "SFX" },
            { title: "Yoruba Folklore Stories (10)", seller: "Heritage", price: "₦5,000", type: "Story Pack" },
          ].map((item, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted" />
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-[10px]">{item.type}</Badge><span className="text-[10px] text-muted-foreground">{item.seller}</span></div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="flex justify-between items-center mt-2"><span className="font-bold text-sm">{item.price}</span><Button size="sm" variant="studio" className="h-7 text-xs">Buy</Button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  )
}
