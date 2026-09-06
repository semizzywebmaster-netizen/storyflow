
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, PageHeader } from "@/components/layout/PageContainer"
import { AppShell } from "@/components/layout/AppShell"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, Search, Grid, List, MoreVertical, FolderKanban, Clock, Users } from "lucide-react"
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"

const mockProjects = [
  { id: "proj_001", title: "The Return - Nigerian Family Drama", desc: "A young man returns home after many years abroad", status: "IN_PROGRESS", culture: "NIGERIAN", updated: "2 hours ago", thumb: "https://images.unsplash.com/photo-1523803326055-9729b9a04e5b?w=400", scenes: 12, characters: 3 },
  { id: "proj_002", title: "Lagos Love Story", desc: "Modern romance in Lagos", status: "COMPLETED", culture: "YORUBA", updated: "1 day ago", thumb: "https://images.unsplash.com/photo-1516026672322-bc52d61a55e5?w=400", scenes: 8, characters: 2 },
  { id: "proj_003", title: "Ancient Kingdom of Oyo", desc: "Epic Yoruba folklore", status: "DRAFT", culture: "YORUBA", updated: "3 days ago", thumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400", scenes: 4, characters: 5 },
]

export function ProjectsPage() {
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Projects"
          description="Manage your story universes. 3 projects • 2.4GB used"
          action={
            <div className="flex gap-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 w-64" /></div>
              <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>{view === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}</Button>
              <Link to="/projects/new"><Button variant="studio"><Plus className="mr-2 h-4 w-4" /> New Project</Button></Link>
            </div>
          }
        />

        {mockProjects.length === 0 ? (
          <EmptyState icon={<FolderKanban className="h-8 w-8" />} title="No projects yet" description="Create your first Nigerian drama, TikTok story, or YouTube series" action={{ label: "Create Project", onClick: () => {} }} />
        ) : (
          <div className={view === "grid" ? "grid md:grid-cols-3 gap-6" : "space-y-4"}>
            {mockProjects.map(p => (
              <Card key={p.id} className="group overflow-hidden hover:shadow-xl transition-all">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.thumb} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "IN_PROGRESS" ? "studio" : "secondary"} className="text-[10px]">{p.status}</Badge>
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-[10px]">{p.culture}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Dropdown trigger={<Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white"><MoreVertical className="h-4 w-4" /></Button>}>
                      <DropdownItem>Rename</DropdownItem>
                      <DropdownItem>Duplicate</DropdownItem>
                      <DropdownItem>Archive</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground truncate mt-1">{p.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.updated}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.characters}</span>
                    <span>{p.scenes} scenes</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/projects/${p.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full">Open</Button></Link>
                    <Link to={`/studio/story?project=${p.id}`} className="flex-1"><Button variant="studio" size="sm" className="w-full">Continue</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  )
}
