import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { Mic, Play, Download, Loader2, RefreshCw } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { realVoiceService } from '@/services/real'
import { useToast } from '@/hooks/useToast'

type Voice = { id: string; name: string; category?: string | null; labels?: Record<string, string>; previewUrl?: string | null }
type Project = { id: string; name: string }
type Asset = { id: string; url: string; prompt?: string; model?: string; created_at?: string; metadata?: Record<string, any> }

const fallbackText = "Mama's voice cracked over the phone. 'Emeka, your father... he is asking for you.' Fifteen years of silence broken in a single sentence."

export function VoiceStudioPage() {
  const { toast } = useToast()
  const [voices, setVoices] = useState<Voice[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [projectId, setProjectId] = useState(localStorage.getItem('storyflow_project_id') || '')
  const [text, setText] = useState(fallbackText)
  const [language, setLanguage] = useState('en-NG')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [audioUrl, setAudioUrl] = useState('')

  const selected = useMemo(() => voices.find(v => v.id === selectedVoice), [voices, selectedVoice])

  const load = async () => {
    setLoading(true)
    try {
      const [voiceRes, projectRes] = await Promise.all([realVoiceService.listVoices(), apiClient.get('/projects')])
      const voiceData: any = voiceRes.data
      const projectData: any = projectRes.data
      const nextVoices = Array.isArray(voiceData) ? voiceData : voiceData?.data ?? []
      const nextProjects = Array.isArray(projectData) ? projectData : projectData?.data ?? []
      setVoices(nextVoices)
      setProjects(nextProjects)
      if (!projectId && nextProjects[0]?.id) {
        setProjectId(nextProjects[0].id)
        localStorage.setItem('storyflow_project_id', nextProjects[0].id)
      }
      if (!selectedVoice && nextVoices[0]?.id) setSelectedVoice(nextVoices[0].id)
    } catch (error: any) {
      toast({ title: 'Unable to load voice studio', description: error?.message || 'Check your provider configuration.', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  const loadHistory = async (id: string) => {
    if (!id) return
    try {
      const res: any = await realVoiceService.getHistory(id)
      const data = res.data
      const rows = Array.isArray(data) ? data : data?.data ?? []
      setAssets(rows.filter((asset: Asset) => asset.metadata?.voiceId || (asset as any).mime_type?.startsWith?.('audio/') || (asset as any).type === 'AUDIO'))
    } catch { setAssets([]) }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (projectId) loadHistory(projectId) }, [projectId])

  const generate = async () => {
    if (!projectId || !selectedVoice || !text.trim()) {
      toast({ title: 'Missing information', description: 'Select a project and voice, then enter text.', variant: 'destructive' })
      return
    }
    setBusy(true)
    try {
      const res: any = await realVoiceService.generate({ projectId, text: text.trim(), voiceId: selectedVoice, languageCode: language || undefined })
      const asset = res.data?.asset
      if (asset?.url) setAudioUrl(asset.url)
      toast({ title: 'Voice generated', description: 'Audio was saved to your StoryFlow asset library.' })
      await loadHistory(projectId)
    } catch (error: any) {
      toast({ title: 'Voice generation failed', description: error?.message || 'Please try again.', variant: 'destructive' })
    } finally { setBusy(false) }
  }

  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Voice Studio" description="Generate production-ready narration and character voices with your configured voice provider." action={<Badge variant="outline">4 credits per generation</Badge>} />
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Available Voices</h3><Button size="icon" variant="ghost" onClick={load} disabled={loading}><RefreshCw className="h-4 w-4" /></Button></div>
            {loading ? <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div> : voices.length === 0 ? <p className="text-sm text-muted-foreground py-8">No voices returned by the provider.</p> : <div className="space-y-3 max-h-[600px] overflow-auto">{voices.map(v => <div key={v.id} className={`p-3 rounded-xl border cursor-pointer ${selectedVoice === v.id ? 'border-primary bg-primary/5' : ''}`} onClick={() => setSelectedVoice(v.id)}><div className="flex items-start justify-between gap-2"><div><div className="font-medium text-sm">{v.name}</div><div className="text-xs text-muted-foreground">{v.labels?.language || v.labels?.accent || v.category || 'Voice provider'}</div></div><Badge variant="outline" className="text-[10px]">{selectedVoice === v.id ? 'Selected' : 'Select'}</Badge></div>{v.previewUrl && <div className="mt-2"><audio controls preload="none" src={v.previewUrl} className="w-full h-8" /></div>}</div>)}</div>}
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Mic className="h-5 w-5" /> Generate Voice</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select label="Project" value={projectId} onChange={(e: any) => { setProjectId(e.target.value); localStorage.setItem('storyflow_project_id', e.target.value) }} options={projects.map(p => ({ value: p.id, label: p.name }))} placeholder="Select project" />
                <Textarea label="Text to speak" value={text} onChange={(e: any) => setText(e.target.value)} rows={7} maxLength={40000} />
                <div className="grid md:grid-cols-2 gap-4">
                  <Select label="Language" value={language} onChange={(e: any) => setLanguage(e.target.value)} options={[{ value: 'en', label: 'English' }, { value: 'en-NG', label: 'English (Nigerian)' }, { value: 'pcm', label: 'Nigerian Pidgin' }, { value: 'yo', label: 'Yoruba' }, { value: 'ig', label: 'Igbo' }, { value: 'ha', label: 'Hausa' }]} />
                  <Select label="Selected voice" value={selectedVoice} onChange={(e: any) => setSelectedVoice(e.target.value)} options={voices.map(v => ({ value: v.id, label: v.name }))} placeholder="Select voice" />
                </div>
                {selected && <div className="text-xs text-muted-foreground">Using <span className="font-medium text-foreground">{selected.name}</span> • Provider voice ID: {selected.id}</div>}
                <Button variant="studio" className="w-full" onClick={generate} disabled={busy || loading || !projectId || !selectedVoice}><>{busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mic className="h-4 w-4 mr-2" />}</> {busy ? 'Generating…' : 'Generate Voice (4 credits)'}</Button>
                {audioUrl && <Card className="p-4 bg-muted/30"><div className="text-sm font-medium mb-2">Latest Generated Audio</div><audio controls src={audioUrl} className="w-full" /><div className="flex justify-end mt-2"><Button size="sm" variant="outline" asChild><a href={audioUrl} download><Download className="h-4 w-4 mr-1" /> Download</a></Button></div></Card>}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Voice History</CardTitle></CardHeader><CardContent>{assets.length === 0 ? <p className="text-sm text-muted-foreground">Generated voice assets will appear here.</p> : <div className="space-y-3">{assets.map(asset => <div key={asset.id} className="p-3 rounded-xl border flex items-center gap-3"><Button size="icon" variant="ghost" onClick={() => setAudioUrl(asset.url)}><Play className="h-4 w-4" /></Button><div className="flex-1 min-w-0"><div className="text-sm truncate">{asset.prompt || 'Generated voice'}</div><div className="text-xs text-muted-foreground">{asset.model || 'Voice generation'}</div></div><Button size="icon" variant="ghost" asChild><a href={asset.url} download><Download className="h-4 w-4" /></a></Button></div>)}</div>}</CardContent></Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
}
