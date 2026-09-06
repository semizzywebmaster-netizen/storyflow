
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function AgencyPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Agency Workspace" description="Teams, client workspaces, roles, brand kits, approvals, collaboration" action={<Badge variant="studio">AGENCY PLAN</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle className="text-base">Team Members</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span>mizzy@agency.com</span><Badge variant="outline">Owner</Badge></div><div className="flex justify-between"><span>editor@agency.com</span><Badge variant="outline">Editor</Badge></div><Button size="sm" variant="outline" className="w-full mt-2">Invite Member</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Client Workspaces</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="p-2 rounded-lg border">Lagos Restaurant - 5 projects</div><div className="p-2 rounded-lg border">Real Estate Brand - 12 projects</div><Button size="sm" variant="studio" className="w-full mt-2">New Workspace</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base">Approvals</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><div className="p-2 rounded-lg bg-amber-500/10">The Return - Awaiting client approval</div><div className="p-2 rounded-lg bg-green-500/10">Lagos Love - Approved</div></CardContent></Card>
        </div>
      </PageContainer>
    </AppShell>
  )
}
