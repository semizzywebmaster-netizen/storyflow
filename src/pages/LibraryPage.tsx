
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { Search, Grid, List, Heart, Trash2, Download } from "lucide-react"

export function LibraryPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Asset Library" description="Images, videos, audio, music, SFX, thumbnails, posters, subtitles" action={<div className="flex gap-2"><Button variant="outline">Upload</Button><Button variant="studio">Generate New</Button></div>} />
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search assets..." className="pl-10" /></div>
          <Button variant="outline" size="icon"><Grid className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><List className="h-4 w-4" /></Button>
        </div>
        <Tabs defaultValue="images">
          <TabsList>
            <TabsTrigger value="images">Images (47)</TabsTrigger>
            <TabsTrigger value="videos">Videos (12)</TabsTrigger>
            <TabsTrigger value="audio">Audio (23)</TabsTrigger>
            <TabsTrigger value="music">Music (15)</TabsTrigger>
            <TabsTrigger value="thumbnails">Thumbnails (18)</TabsTrigger>
          </TabsList>
          <TabsContent value="images" className="mt-6">
            <div className="grid md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="group overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    <img src={`https://images.unsplash.com/photo-${1523803326055 + i * 1000}?w=300`} alt="Asset" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=300")} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full"><Heart className="h-3 w-3" /></Button>
                      <div className="flex gap-1"><Button size="icon" variant="secondary" className="h-7 w-7 rounded-full"><Download className="h-3 w-3" /></Button><Button size="icon" variant="secondary" className="h-7 w-7 rounded-full"><Trash2 className="h-3 w-3" /></Button></div>
                    </div>
                  </div>
                  <CardContent className="p-2"><div className="text-xs font-medium truncate">Village Sunset {i+1}</div><div className="text-[10px] text-muted-foreground">IMAGE • 2.4MB</div></CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </AppShell>
  )
}
