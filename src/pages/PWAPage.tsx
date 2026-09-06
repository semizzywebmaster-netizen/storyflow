
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Smartphone, Download, Wifi, Bell, HardDrive } from "lucide-react"

export function PWAPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="PWA - Install App" description="Install AI Story Studio on Android, iPhone, iPad, Windows, macOS, Linux." action={<Badge variant="success">PWA Ready</Badge>} />
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Smartphone className="h-5 w-5" /> Install</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-muted/20"><div className="font-medium text-sm">Android (Chrome)</div><div className="text-xs text-muted-foreground">Menu → Install App → Add to Home Screen</div></div>
              <div className="p-4 rounded-xl border bg-muted/20"><div className="font-medium text-sm">iPhone (Safari)</div><div className="text-xs text-muted-foreground">Share → Add to Home Screen</div></div>
              <div className="p-4 rounded-xl border bg-muted/20"><div className="font-medium text-sm">Desktop (Chrome/Edge)</div><div className="text-xs text-muted-foreground">Address bar → Install icon</div></div>
              <Button variant="studio" className="w-full"><Download className="mr-2 h-4 w-4" /> Install App</Button>
            </div>
          </Card>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Wifi className="h-4 w-4" /> Offline Capabilities</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Offline shell - works without internet</li>
                <li>• Cached projects - view recent work</li>
                <li>• Local drafts - save without connection</li>
                <li>• Auto-sync when back online</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Bell className="h-4 w-4" /> Features</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Push notifications</li>
                <li>• File upload/download</li>
                <li>• Camera/file picker</li>
                <li>• Share API integration</li>
                <li>• Update system</li>
              </ul>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
