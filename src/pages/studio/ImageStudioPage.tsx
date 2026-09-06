import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { useToast } from '@/hooks/useToast'
import { getImageService, apiClient } from '@/services'
import { Image as ImageIcon, Sparkles, Download, RefreshCw, Trash2 } from 'lucide-react'

const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res
export function ImageStudioPage() {
  const { success, error } = useToast()
  const [prompt, setPrompt] = useState('A young Nigerian man in traditional Igbo attire standing in a village square at sunset, cinematic lighting, emotional, 4K')
  const [projectId, setProjectId] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('cinematic')
  const [assets, setAssets] = useState<any[]>([])
  const [busy, setBusy] = useState(false)

  const load = useCallback(async (id?: string) => { try { const service = await getImageService(); const res = await service.getHistory(id ? { projectId: id } : undefined); const value = unwrap(res); setAssets(Array.isArray(value) ? value : value?.data || []) } catch (e: any) { error('Image history unavailable', e?.message || 'Unable to load image history') } }, [error])
  useEffect(() => { (async () => { try { const value = unwrap(await apiClient.get('/projects')); const list = Array.isArray(value) ? value : value?.data || []; setProjects(list); const stored = localStorage.getItem('storyflow_project_id') || list[0]?.id || ''; setProjectId(stored); if (stored) await load(stored) } catch (e: any) { error('Projects unavailable', e?.message || 'Unable to load projects') } })() }, [error, load])
  const generate = async () => { if (prompt.trim().length < 5) return error('Prompt required', 'Describe the image you want to generate.'); setBusy(true); try { const service = await getImageService(); const result: any = await service.generate(prompt.trim(), { projectId: projectId || undefined, style, aspectRatio }); const asset = unwrap(result)?.asset; if (asset) setAssets(current => [asset, ...current]); else await load(projectId); success('Image generated', 'The image was generated and saved to your asset library.') } catch (e: any) { error('Image generation failed', e?.message || 'Unable to generate image') } finally { setBusy(false) } }
  const remove = async (id: string) => { if (!window.confirm('Delete this image?')) return; try { await (await getImageService()).delete(id); setAssets(current => current.filter(a => a.id !== id)); success('Image deleted', 'Asset removed from the library.') } catch (e: any) { error('Delete failed', e?.message || 'Unable to delete image') } }
  const quick = (text: string) => setPrompt(text)
  return <AppShell><PageContainer><PageHeader title="AI Image Studio" description="Generate production images and keep them in your StoryFlow asset library." action={<Badge variant="outline">5 credits per image</Badge>} />
    <Card className="mb-6 p-4"><Select label="Active Project" value={projectId} onChange={e => { setProjectId(e.target.value); localStorage.setItem('storyflow_project_id', e.target.value); load(e.target.value) }} options={projects.map(p => ({ value: p.id, label: p.title || p.name || p.id }))} placeholder={projects.length ? 'Select a project' : 'No projects found'} /></Card>
    <div className="grid md:grid-cols-3 gap-6"><div className="md:col-span-2 space-y-6"><Card className="p-6"><div className="space-y-4"><Textarea label="Prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} placeholder="Describe your image..." /><div className="grid md:grid-cols-2 gap-4"><Select label="Aspect Ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} options={[{value:'16:9',label:'16:9 Landscape'},{value:'9:16',label:'9:16 Portrait'},{value:'1:1',label:'1:1 Square'}]} /><Select label="Style" value={style} onChange={e => setStyle(e.target.value)} options={[{value:'cinematic',label:'Cinematic'},{value:'realistic',label:'Realistic'},{value:'anime',label:'Anime'},{value:'african',label:'African Art'}]} /></div><Button variant="studio" className="w-full h-12" onClick={generate} isLoading={busy}><Sparkles className="mr-2 h-4 w-4" /> Generate Image (5 credits)</Button></div></Card>
    <div className="grid md:grid-cols-2 gap-4">{assets.length === 0 ? <Card className="md:col-span-2 p-10 text-center"><ImageIcon className="mx-auto h-10 w-10 mb-3 text-muted-foreground" /><h3 className="font-semibold">No generated images yet</h3><p className="text-sm text-muted-foreground mt-2">Generate your first production image above.</p></Card> : assets.map(asset => <Card key={asset.id} className="group overflow-hidden"><div className="aspect-[4/3] overflow-hidden bg-muted"><img src={asset.url} alt={asset.prompt || 'Generated image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div><CardContent className="p-3"><p className="text-xs line-clamp-2">{asset.prompt}</p><div className="flex gap-2 mt-3"><Button size="sm" variant="outline" asChild><a href={asset.url} target="_blank" rel="noreferrer"><Download className="mr-1 h-3 w-3" /> Open</a></Button><Button size="sm" variant="outline" onClick={() => quick(asset.prompt || '')}><RefreshCw className="mr-1 h-3 w-3" /> Reuse</Button><Button size="sm" variant="outline" onClick={() => remove(asset.id)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button></div></CardContent></Card>)}</div></div>
    <div className="space-y-6"><Card className="p-6"><h3 className="font-semibold mb-3">Quick Prompts</h3><div className="space-y-2">{['Yoruba king palace interior','Lagos danfo at night','Igbo traditional wedding','African folklore spirit'].map(p => <button key={p} type="button" onClick={() => quick(p)} className="w-full text-left p-2 rounded-lg border hover:bg-accent text-xs">{p}</button>)}</div></Card><Card className="p-6"><h3 className="font-semibold mb-3">Production Tips</h3><p className="text-xs text-muted-foreground">Use character appearance, location, lighting, camera angle and emotion in prompts for more consistent cinematic results.</p></Card></div></div>
  </PageContainer></AppShell>
}
