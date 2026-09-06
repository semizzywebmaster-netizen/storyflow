
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function AdminUsersPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Admin Users & RBAC" description="Super Admin, AI Manager, Finance Manager, Content Manager, Moderator, Support" />
        <div className="flex gap-3 mb-6"><Input placeholder="Search users..." className="max-w-sm" /><Button variant="outline">Roles</Button><Button variant="outline">Permissions</Button></div>
        <Card className="p-4">
          <div className="space-y-3 text-sm">
            {[
              { email: "admin@aistorystudio.com", role: "Super Admin", status: "Active" },
              { email: "ai@aistorystudio.com", role: "AI Manager", status: "Active" },
              { email: "finance@aistorystudio.com", role: "Finance Manager", status: "Active" },
            ].map(u => <div key={u.email} className="flex justify-between items-center p-3 rounded-xl border"><div><div className="font-medium">{u.email}</div><div className="text-xs text-muted-foreground">{u.role}</div></div><Badge variant="success">{u.status}</Badge></div>)}
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  )
}
