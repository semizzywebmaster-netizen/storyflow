import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { Video, Play, Download, RefreshCw, Save, Plus, Minus } from 'lucide-react'

type Clip = { id: string; sceneId?: string; title: string; start: number; duration: number; transition?: string }
type Timeline = { version: number; fps: number; aspectRatio: string; tracks: Array<{ id: string; type: string; name: string; clips: Clip[] }> }
type Project = { id: string; title?: string }
type Job = { id: string; url?: string; resultUrl?: string; durationSeconds?: number }

const dataOf = (r: any) => Array.isArray(r?.data) ? r.data : r?.data?.data ?? r?.data ?? []

export function VideoGenerationPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const clips = timeline?.tracks?.find(t => t.type === 'VIDEO')?.clips ?? []
  const duration = clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0)

  const load = async (id: string) => {
    if (!id) return
    setBusy(true); setNotice('')
    try {
      const [t, a]: any[] = await Promise.all([apiClient.get(`/videos/timeline/${id}`), apiClient.get(`/assets?projectId=${encodeURIComponent(id)}`)])
      const td = t.data?.data ?? t.data
      setTimeline(td?.timeline ?? td)
      setJobs(dataOf(a).filter((x: any) => x.type === 'VIDEO').map((x: any) => ({ id: x.id, url: x.url, resultUrl: x.url, durationSeconds: x.duration_seconds ?? x.durationSeconds })))
      localStorage.setItem('storyflow_project_id', id)
    } catch (e: any) { setNotice(e?.message || 'Unable to load timeline') }
    finally { setBusy(false) }
  }

  useEffect(() => {
    apiClient.get('/projects').then((r: any) => {
      const list = dataOf(r); setProjects(list)
      const saved = localStorage.getItem('storyflow_project_id')
      setProjectId(list.some((p: Project) => p.id === saved) ? saved! : list[0]?.id || '')
    }).catch((e: any) => setNotice(e?.message || 'Unable to load projects'))
  }, [])

  useEffect(() => { if (projectId) void load(projectId) }, [projectId])

  const resize = (id: string, amount: number) => setTimeline(t => t ? ({ ...t, tracks: t.tracks.map(track => ({ ...track, clips: track.clips.map(c => c.id === id ? { ...c, duration: Math.max(1, c.duration + amount) } : c) })) }) : t)
  const save = async () => {
    if (!timeline || !projectId) return
    setBusy(true); setNotice('')
    try { const r: any = await apiClient.put(`/videos/timeline/${projectId}`, timeline); const d = r.data?.data ?? r.data; setTimeline(d.timeline ?? d); setNotice('Timeline saved') }
    catch (e: any) { setNotice(e?.message || 'Unable to save timeline') }
    finally { setBusy(false) }
  }
  const render = async () => {
    if (!projectId || !clips.length) return setNotice('Select a project with scenes first')
    setBusy(true); setNotice('Rendering video…')
    try { await save(); await apiClient.post('/videos/render', { projectId, sceneIds: clips.map(c => c.sceneId || c.id) }); setNotice('Video render completed'); await load(projectId) }
    catch (e: any) { setNotice(e?.message || 'Video rendering failed') }
    finally { setBusy(false) }
  }

  return <AppShell><PageContainer>
    <PageHeader title="Video Editor & Timeline" description="Arrange scenes, adjust timing, save and render your video." action={<Badge variant="studio">20 credits</Badge>} />
    <Card className="mb-6"><CardContent className="p-4 flex flex-col md:flex-row gap-3">
      <select value={projectId} onChange={e => setProjectId(e.target.value)} className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"><option value="">Select a project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title || p.id}</option>)}</select>
      <Button variant="outline" disabled={!projectId || busy} onClick={() => void load(projectId)}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      <Button variant="outline" disabled={!timeline || busy} onClick={() => void save()}><Save className="h-4 w-4 mr-2" />Save</Button>
      <Button variant="studio" disabled={!clips.length || busy} onClick={() => void render()}><Video className="h-4 w-4 mr-2" />{busy ? 'Working…' : 'Generate Video'}</Button>
    </CardContent></Card>
    {notice && <div className="mb-6 rounded-lg border px-4 py-3 text-sm text-muted-foreground">{notice}</div>}
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card><CardHeader><CardTitle className="flex justify-between"><span>Timeline</span><span className="text-sm font-normal text-muted-foreground">{clips.length} clips • {duration}s</span></CardTitle></CardHeader><CardContent className="space-y-3">
          {!clips.length && <div className="py-12 text-center text-sm text-muted-foreground">Select a project with scenes to build its timeline.</div>}
          {clips.map((c, i) => <div key={c.id} className="border rounded-xl p-3 flex items-center gap-3"><Badge variant="secondary">{i + 1}</Badge><div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{c.title}</div><div className="text-xs text-muted-foreground">Start {c.start}s • {c.duration}s • {c.transition || 'CUT'}</div></div><Button size="icon" variant="ghost" onClick={() => resize(c.id, -1)}><Minus className="h-4 w-4" /></Button><span className="text-sm w-8 text-center">{c.duration}s</span><Button size="icon" variant="ghost" onClick={() => resize(c.id, 1)}><Plus className="h-4 w-4" /></Button></div>)}
        </CardContent></Card>
      </div>
      <div className="space-y-6">
        <Card className="p-4"><div className="aspect-video bg-muted rounded-xl flex items-center justify-center overflow-hidden">{jobs[0]?.url ? <video src={jobs[0].url} controls className="w-full h-full" /> : <div className="text-center text-muted-foreground"><Play className="h-10 w-10 mx-auto mb-2" /><p className="text-sm">Rendered video preview</p></div>}</div><div className="mt-3 text-sm font-medium">Video Preview</div><div className="text-xs text-muted-foreground">{timeline?.aspectRatio || '16:9'} • {duration}s • {timeline?.fps || 30}fps</div></Card>
        <Card><CardHeader><CardTitle className="text-base">Rendered Videos</CardTitle></CardHeader><CardContent className="space-y-3">{!jobs.length && <div className="text-sm text-muted-foreground">No rendered videos yet.</div>}{jobs.slice(0, 5).map(j => <div key={j.id} className="flex items-center gap-2 text-sm"><Video className="h-4 w-4" /><span className="flex-1">{j.durationSeconds ? `${j.durationSeconds}s render` : 'Video render'}</span>{j.url && <a href={j.url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /></a>}</div>)}</CardContent></Card>
      </div>
    </div>
  </PageContainer></AppShell>
}
