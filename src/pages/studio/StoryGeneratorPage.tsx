import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { useToast } from '@/hooks/useToast'
import { getStoryService } from '@/services'
import { realProjectService } from '@/services/real'
import { Sparkles, Globe, Clock, Users, Zap } from 'lucide-react'
import type { CulturalMode } from '@/types'

const culturalModes = [
  { value: 'NIGERIAN', label: 'Nigerian' }, { value: 'YORUBA', label: 'Yoruba' }, { value: 'IGBO', label: 'Igbo' },
  { value: 'HAUSA', label: 'Hausa' }, { value: 'NIGERIAN_PIDGIN', label: 'Nigerian Pidgin' }, { value: 'AFRICAN', label: 'African' },
  { value: 'AMERICAN', label: 'American' }, { value: 'INDIAN', label: 'Indian' }, { value: 'KOREAN', label: 'Korean' },
]
const unwrap = <T,>(res: any): T => (res?.data?.data ?? res?.data ?? res) as T

export function StoryGeneratorPage() {
  const navigate = useNavigate(); const { success, error } = useToast()
  const [idea, setIdea] = useState('Create a Nigerian family drama about a young man returning home after many years abroad.')
  const [title, setTitle] = useState(''); const [genre, setGenre] = useState('drama'); const [culturalMode, setCulturalMode] = useState<CulturalMode>('NIGERIAN')
  const [tone, setTone] = useState('emotional'); const [length, setLength] = useState<'short'|'medium'|'long'>('medium'); const [audience, setAudience] = useState('adults')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (idea.trim().length < 10) { error('Story idea required', 'Please enter a more detailed story idea.'); return }
    setIsGenerating(true)
    try {
      const project = unwrap<any>(await realProjectService.createProject({ title: title.trim() || 'Untitled Story', description: idea, status: 'DRAFT', culturalMode, language: 'en', genre }))
      const projectId = project?.id
      if (!projectId) throw new Error('Project could not be created')
      const service = await getStoryService()
      const job = unwrap<any>(await service.generate(projectId, idea, { culturalMode, genre, tone, length, targetAudience: audience }))
      success('Story generation started', 'Your story is being created. Opening the workspace...')
      navigate(`/projects/${projectId}`, { state: { generationId: job?.id } })
    } catch (e: any) { error('Generation failed', e?.message || 'Unable to generate the story. Please try again.') }
    finally { setIsGenerating(false) }
  }

  return <AppShell><PageContainer maxWidth="xl">
    <PageHeader title="Story Generator" description="Transform your idea into a full story with characters, scenes, and cultural authenticity." action={<Badge variant="outline" className="bg-primary/10">5 credits • AI</Badge>} />
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> Your Story</CardTitle></CardHeader><CardContent className="space-y-4">
        <Textarea label="Story Idea" value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Describe your story idea..." rows={6}/>
        <div className="grid md:grid-cols-2 gap-4"><Input label="Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} placeholder="The Return"/><Select label="Genre" value={genre} onChange={e=>setGenre(e.target.value)} options={[{value:'drama',label:'Drama'},{value:'romance',label:'Romance'},{value:'comedy',label:'Comedy'},{value:'folklore',label:'Folklore'},{value:'thriller',label:'Thriller'},{value:'action',label:'Action'}]}/></div>
        <div className="grid md:grid-cols-3 gap-4"><Select label="Cultural Mode" value={culturalMode} onChange={e=>setCulturalMode(e.target.value as CulturalMode)} options={culturalModes}/><Select label="Tone" value={tone} onChange={e=>setTone(e.target.value)} options={[{value:'emotional',label:'Emotional'},{value:'dramatic',label:'Dramatic'},{value:'funny',label:'Funny'},{value:'suspenseful',label:'Suspenseful'}]}/><Select label="Length" value={length} onChange={e=>setLength(e.target.value as any)} options={[{value:'short',label:'Short (5 min)'},{value:'medium',label:'Medium (15 min)'},{value:'long',label:'Long (30 min)'}]}/></div>
        <Select label="Target Audience" value={audience} onChange={e=>setAudience(e.target.value)} options={[{value:'adults',label:'Adults'},{value:'youth',label:'Youth'},{value:'family',label:'Family'},{value:'general',label:'General Audience'}]}/>
        <Button variant="studio" size="lg" className="w-full h-12" isLoading={isGenerating} onClick={handleGenerate}><Zap className="mr-2 h-4 w-4"/> Generate Story (5 credits)</Button>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3"/> AI generation</span><span className="flex items-center gap-1"><Globe className="h-3 w-3"/> Cultural authenticity</span><span className="flex items-center gap-1"><Users className="h-3 w-3"/> Story workspace</span></div>
      </CardContent></Card></div>
      <div className="space-y-6"><Card className="p-6"><h3 className="font-semibold mb-3">Generation</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Story generation</span><span>5 credits</span></div><div className="flex justify-between"><span>Characters & scenes</span><span className="text-green-600">Included</span></div><div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>5 credits</span></div></div></Card><Card className="p-6"><h3 className="font-semibold mb-3">Workflow</h3><div className="space-y-3 text-sm text-muted-foreground"><p>1. Generate your story with AI</p><p>2. Edit and save the generated content</p><p>3. Rewrite sections with AI</p><p>4. Review versions and restore any version</p><p>5. Run Story Doctor for quality checks</p></div></Card></div>
    </div>
  </PageContainer></AppShell>
}
