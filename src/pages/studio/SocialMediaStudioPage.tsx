
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"

export function SocialMediaStudioPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Social Media Studio" description="Generate titles, descriptions, hashtags, captions, CTAs, thumbnail concepts for all platforms." action={<Badge variant="outline">5 credits per package</Badge>} />
        <Tabs defaultValue="youtube">
          <TabsList>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="shorts">YouTube Shorts</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="reels">Instagram Reels</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          <TabsContent value="youtube" className="mt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Title Options</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="p-2 rounded-lg border bg-primary/5">1. He Returned After 15 Years... What His Father Hid SHOCKED Him (Emotional Score: 94)</div>
                  <div className="p-2 rounded-lg border">2. Nigerian Son Returns Home to Face Family Secret</div>
                  <div className="p-2 rounded-lg border">3. The Return: A Story of Forgiveness and Home</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Description + Hashtags</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-3">
                  <p className="text-muted-foreground">After 15 years in America, Emeka returns to Anambra to confront his past. A powerful Nigerian family drama about forgiveness, culture, and homecoming. #NigerianDrama #Family #Nollywood</p>
                  <div className="flex flex-wrap gap-1">
                    {["#NigerianDrama", "#FamilyDrama", "#Nollywood", "#Igbo", "#Homecoming", "#AfricanStory"].map(t => <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>)}
                  </div>
                  <Button variant="studio" size="sm" className="w-full">Generate Social Package (5 cr)</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}
