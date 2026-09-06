
import { Card } from "@/components/ui/card"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
export function AdminAnnouncementsPage() { return <AppShell><PageContainer><PageHeader title="Admin Announcements" description="Targeting, channels, scheduling, expiration" /><Card className="p-6">Announcement targeting: All users, Free/Creator/Pro/Agency, Active/New/Low-activity. Channels: in-app, email, push, WhatsApp, SMS</Card></PageContainer></AppShell> }
