
import { Card } from "@/components/ui/card"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
export function AnalyticsPage() { return <AppShell><PageContainer><PageHeader title="Analytics" description="Users, projects, stories, AI usage, revenue, credits, wallet, ads, retention" /><div className="grid md:grid-cols-3 gap-6"><Card className="p-6"><div className="text-2xl font-bold">2,447</div><div className="text-sm text-muted-foreground">Total Users</div></Card><Card className="p-6"><div className="text-2xl font-bold">12,847</div><div className="text-sm text-muted-foreground">Videos Generated</div></Card><Card className="p-6"><div className="text-2xl font-bold">₦1.2M</div><div className="text-sm text-muted-foreground">Revenue</div></Card></div></PageContainer></AppShell> }
