
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function AdminProvidersPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="AI Provider Manager" description="Add/remove, enable/disable, credentials, models, priority, limits, cost, fallback, health." />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "OpenAI", type: "TEXT", status: "ONLINE", models: "GPT-4o, GPT-4o-mini", cost: "$0.005/1k" },
            { name: "Groq", type: "TEXT", status: "ONLINE", models: "Llama 3.1 70B", cost: "$0.0008/1k" },
            { name: "Flux Pro", type: "IMAGE", status: "ONLINE", models: "Flux.1 Pro", cost: "$0.05/img" },
            { name: "ElevenLabs", type: "VOICE", status: "ONLINE", models: "Multilingual v2", cost: "$0.18/1k chars" },
            { name: "Kling", type: "VIDEO", status: "ONLINE", models: "Kling 1.5", cost: "$0.50/sec" },
            { name: "fal.ai", type: "IMAGE/VIDEO", status: "DEGRADED", models: "Multiple", cost: "Varies" },
          ].map(p => (
            <Card key={p.name} className="p-4">
              <div className="flex justify-between mb-2"><span className="font-bold text-sm">{p.name}</span><Badge variant={p.status === "ONLINE" ? "success" : "warning"} className="text-[10px]">{p.status}</Badge></div>
              <div className="text-xs text-muted-foreground">{p.type} • {p.models}</div>
              <div className="text-xs mt-1">{p.cost}</div>
              <div className="flex gap-2 mt-3"><Button size="sm" variant="outline" className="flex-1">Config</Button><Button size="sm" variant="outline" className="flex-1">Health</Button></div>
            </Card>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  )
}
