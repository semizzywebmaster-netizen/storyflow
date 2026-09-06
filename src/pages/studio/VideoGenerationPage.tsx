import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { Video, Play, Download, RefreshCw, Save, Plus, Minus, Volume2, Music2, Waves } from 'lucide-react'

type Clip = { id: string; sceneId?: string; title: string; start: number; duration: number; transition?: string }
type AudioClip = { id: string; assetId?: string; title: string; start: number; duration: number; volume?: number; muted?: boolean; kind: 'VOICE' | 'MUSIC' | 'SFX' }
type Track = { id: string; type: string; name: string; clips: any[] }
type Timeline = { version: number; fps: number; aspectRatio: string; tracks: Track[] }
type Project = { id: string; title?: string }
type Asset = { id: string; type: string; url: string; duration_seconds?: number; durationSeconds?: number; prompt?: string; metadata?: any }
type Job = { id: string; url?: string; resultUrl?: string; durationSeconds?: number }

const dataOf = (r: any) => Array.isArray(r?.data) ? r.data : r?.data?.data ?? r?.data ?? []
const audioTypes = new Set(['AUDIO', 'MUSIC', 'SFX'])
const trackTypes = new Set(['AUDIO', 'VOICE', 'MUSIC', 'SFX'])

export function VideoGenerationPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const clips = timeline?.tracks?.find(t => t.type === 'VIDEO')?.clips ?? []
  const audioTracks = timeline?.tracks?.filter(t => trackTypes.has(t.type)) ?? []
  const duration = (timeline?.tracks ?? []).flatMap(t => t.clips || []).reduce((max, c) => Math.max(max, Number(c.start || 0) + Number(c.duration || 0)), 0)
  const audioAssets = assets.filter(a => audioTypes.has(a.type) && a.url)

  const load = async (id: string) => {
    if (!id) return
    setBusy(true); setNotice('')
    try {
      const [t, a]: any[] = await Promise.all([apiClient.get(`/videos/timeline/${id}`), apiClient.get(`/assets?projectId=${encodeURIComponent(id)}`)])
      const td = t.data?.data ?? t.data
      const rawTimeline = td?.timeline ?? td
      const loadedAssets = dataOf(a)
      const nextTimeline: Timeline = rawTimeline?.tracks ? rawTimeline : { version: 1, fps: 30, aspectRatio: '16:9', tracks: [] }
      setTimeline({ ...nextTimeline, tracks: nextTimeline.tracks.map(track => ({ ...track, clips: track.clips || [] })) })
      setAssets(loadedAssets)
      setJobs(loadedAssets.filter((x: any) => x.type === 'VIDEO').map((x: any) => ({ id: x.id, url: x.url, resultUrl: x.url, durationSeconds: x.duration_seconds ?? x.durationSeconds })))
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

  const resize = (id: string, amount: number) => setTimeline(t => t ? ({ ...t, tracks: t.tracks.map(track => ({ ...track, clips: track.clips.map(c => c.id === id ? { ...c, duration: Math.max(1, Number(c.duration || 1) + amount) } : c) })) }) : t)
  const addAudioTrack = (kind: 'VOICE' | 'MUSIC' | 'SFX', asset: Asset) => {
    setTimeline(t => {
      if (!t) return t
      const type = kind
      const existing = t.tracks.find(x => x.type === type)
      const clip: AudioClip = { id: `${asset.id}-${Date.now()}`, assetId: asset.id, title: asset.prompt || `${kind} track`, start: 0, duration: Math.min(Number(asset.duration_seconds || asset.durationSeconds || duration || 5), 3600), volume: 1, muted: false, kind }
      if (existing) return { ...t, tracks: t.tracks.map(x => x.id === existing.id ? { ...x, clips: [...x.clips, clip] } : x) }
      return { ...t, tracks: [...t.tracks, { id: `${kind.toLowerCase()}-${Date.now()}`, type, name: kind === 'VOICE' ? 'Voiceover' : kind === 'MUSIC' ? 'Music' : 'Sound Effects', clips: [clip] }] }
    })
  }
  const removeAudio = (trackId: string, clipId: string) => setTimeline(t => t ? ({ ...t, tracks: t.tracks.map(x => x.id === trackId ? { ...x, clips: x.clips.filter(c => c.id !== clipId) } : x) }) : t)
  const save = async () => {
    if (!timeline || !projectId) return
    setBusy(true); setNotice('')
    try { const r: any = await apiClient.put(`/videos/timeline/${projectId}`, timeline); const d = r.data?.data ?? r.data; setTimeline(d.timeline ?? d); setNotice('Timeline and audio tracks saved') }
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
    <PageHeader title="Video Editor & Timeline" description="Arrange scenes, voiceover, music and sound effects." action={<Badge variant="studio">20 credits</Badge>} />
    <Card className="mb-6"><CardContent className="p-4 flex flex-col md:flex-row gap-3">
      <select value={projectId} onChange={e => setProjectId(e.target.value)} className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"><option value="">Select a project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title || p.id}</option>)}</select>
      <Button variant="outline" disabled={!projectId || busy} onClick={() => void load(projectId)}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      <Button variant="outline" disabled={!timeline || busy} onClick={() => void save()}><Save className="h-4 w-4 mr-2" />Save</Button>
      <Button variant="studio" disabled={!clips.length || busy} onClick={() => void render()}><Video className="h-4 w-4 mr-2" />{busy ? 'Working…' : 'Generate Video'}</Button>
    </CardContent></Card>
    {notice && <div className="mb-6 rounded-lg border px-4 py-3 text-sm text-muted-foreground">{notice}</div>}
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card><CardHeader><CardTitle className="flex justify-between"><span>Timeline</span><span className="text-sm font-normal text-muted-foreground">{clips.length} scenes • {audioTracks.length} audio tracks • {duration.toFixed(1)}s</span></CardTitle></CardHeader><CardContent className="space-y-3">
          {!clips.length && <div className="py-8 text-center text-sm text-muted-foreground">Select a project with scenes to build its timeline.</div>}
          {clips.map((c, i) => <div key={c.id} className="border rounded-xl p-3 flex items-center gap-3"><Badge variant="secondary">{i + 1}</Badge><div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{c.title}</div><div className="text-xs text-muted-foreground">Start {c.start}s • {c.duration}s • {c.transition || 'CUT'}</div></div><Button size="icon" variant="ghost" onClick={() => resize(c.id, -1)}><Minus className="h-4 w-4" /></Button><span className="text-sm w-8 text-center">{c.duration}s</span><Button size="icon" variant="ghost" onClick={() => resize(c.id, 1)}><Plus className="h-4 w-4" /></Button></div>)}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Audio, Music & SFX</CardTitle></CardHeader><CardContent className="space-y-4">
          {audioTracks.map(track => <div key={track.id} className="rounded-xl border p-3"><div className="flex items-center gap-2 font-medium text-sm mb-2">{track.type === 'VOICE' ? <Volume2 className="h-4 w-4" /> : track.type === 'MUSIC' ? <Music2 className="h-4 w-4" /> : <Waves className="h-4 w-4" />}{track.name}</div>{track.clips.map((clip: AudioClip) => <div key={clip.id} className="flex items-center gap-2 text-xs py-1"><span className="flex-1 truncate">{clip.title}</span><span>{clip.start}s–{(Number(clip.start)+Number(clip.duration)).toFixed(1)}s</span><Button size="sm" variant="ghost" onClick={() => removeAudio(track.id, clip.id)}>Remove</Button></div>)}</div>)}
          {!audioTracks.length && <p className="text-sm text-muted-foreground">No audio tracks attached yet.</p>}
          {audioAssets.length > 0 && <div className="grid sm:grid-cols-2 gap-2">{audioAssets.slice(0, 12).map(asset => <div key={asset.id} className="rounded-lg border p-2"><div className="text-xs font-medium truncate">{asset.prompt || asset.type}</div><div className="text-[11px] text-muted-foreground mb-2">{asset.type} • {asset.duration_seconds || asset.durationSeconds || '—'}s</div><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => addAudioTrack('VOICE', asset)}>Voice</Button><Button size="sm" variant="outline" onClick={() => addAudioTrack('MUSIC', asset)}>Music</Button><Button size="sm" variant="outline" onClick={() => addAudioTrack('SFX', asset)}>SFX</Button></div></div>)}</div>}
        </CardContent></Card>
      </div>
      <div className="space-y-6">
        <Card className="p-4"><div className="aspect-video bg-muted rounded-xl flex items-center justify-center overflow-hidden">{jobs[0]?.url ? <video src={jobs[0].url} controls className="w-full h-full" /> : <div className="text-center text-muted-foreground"><Play className="h-10 w-10 mx-auto mb-2" /><p className="text-sm">Rendered video preview</p></div>}</div><div className="mt-3 text-sm font-medium">Video Preview</div><div className="text-xs text-muted-foreground">{timeline?.aspectRatio || '16:9'} • {duration.toFixed(1)}s • {timeline?.fps || 30}fps</div></Card>
        <Card><CardHeader><CardTitle className="text-base">Rendered Videos</CardTitle></CardHeader><CardContent className="space-y-3">{!jobs.length && <div className="text-sm text-muted-foreground">No rendered videos yet.</div>}{jobs.slice(0, 5).map(j => <div key={j.id} className="flex items-center gap-2 text-sm"><Video className="h-4 w-4" /><span className="flex-1">{j.durationSeconds ? `${j.durationSeconds}s render` : 'Video render'}</span>{j.url && <a href={j.url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /></a>}</div>)}</CardContent></Card>
      </div>
    </div>
  </PageContainer></AppShell>
}
