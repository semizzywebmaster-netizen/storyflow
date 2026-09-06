import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { AppShell } from '@/components/layout/AppShell'
import { getCharacterService } from '@/services'
import { useToast } from '@/hooks/useToast'
import { Lock, Unlock, Sparkles, Plus, Trash2, Users, Save, Loader2 } from 'lucide-react'

type Character = Record<string, any>

const emptyCharacter: Character = {
  id: '', name: '', role: 'SUPPORTING', age: '', gender: '', skin_tone: '', hair_style: '',
  appearance: '', personality: '', background: '', clothing_style: '', is_locked: false,
}

function field(c: Character, snake: string, camel: string) { return c[snake] ?? c[camel] ?? '' }

export function CharacterBiblePage() {
  const [params] = useSearchParams()
  const projectId = params.get('projectId') || localStorage.getItem('storyflow_project_id') || ''
  const { success, error } = useToast()
  const service = useMemo(() => getCharacterService(), [])
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [form, setForm] = useState<Character>(emptyCharacter)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [biblePrompt, setBiblePrompt] = useState('Create the main characters for this story with distinct personalities, believable backgrounds, and consistent visual traits.')

  const loadCharacters = useCallback(async () => {
    if (!projectId) { setLoading(false); return }
    setLoading(true)
    try {
      const response: any = await service.then(s => s.list(projectId))
      const rows = Array.isArray(response?.data) ? response.data : []
      setCharacters(rows)
      if (rows.length) {
        const current = rows.find((c: Character) => c.id === selectedId) || rows[0]
        setSelectedId(current.id)
        setForm({ ...current })
      } else {
        setSelectedId(''); setForm({ ...emptyCharacter })
      }
    } catch (e: any) { error(e?.message || 'Unable to load characters') }
    finally { setLoading(false) }
  }, [projectId, selectedId, service, error])

  useEffect(() => { loadCharacters() }, [projectId])

  const selectCharacter = (character: Character) => { setSelectedId(character.id); setForm({ ...character }) }
  const set = (key: string, value: any) => setForm((prev: Character) => ({ ...prev, [key]: value }))

  const newCharacter = () => { setSelectedId(''); setForm({ ...emptyCharacter }) }

  const saveCharacter = async () => {
    if (!projectId || !String(form.name || '').trim()) return error('Character name is required')
    setSaving(true)
    try {
      const payload = {
        name: String(form.name).trim(), role: form.role, age: form.age === '' ? null : Number(form.age),
        gender: form.gender, appearance: form.appearance, personality: form.personality, background: form.background,
        clothingStyle: form.clothing_style, skinTone: form.skin_tone, hairStyle: form.hair_style,
      }
      const response: any = selectedId
        ? await service.then(s => s.update(projectId, selectedId, payload))
        : await service.then(s => s.create(projectId, payload))
      const saved = response?.data
      if (saved) {
        setCharacters(prev => selectedId ? prev.map(c => c.id === saved.id ? saved : c) : [...prev, saved])
        setSelectedId(saved.id); setForm(saved)
      }
      success(selectedId ? 'Character updated' : 'Character created')
    } catch (e: any) { error(e?.message || 'Unable to save character') }
    finally { setSaving(false) }
  }

  const toggleLock = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const locked = Boolean(form.is_locked)
      const response: any = locked
        ? await service.then(s => s.unlockCharacter(projectId, selectedId))
        : await service.then(s => s.lockCharacter(projectId, selectedId))
      const updated = response?.data || { ...form, is_locked: !locked }
      setForm(updated)
      setCharacters(prev => prev.map(c => c.id === selectedId ? updated : c))
      success(locked ? 'Character unlocked' : 'Character locked')
    } catch (e: any) { error(e?.message || 'Unable to change lock state') }
    finally { setSaving(false) }
  }

  const deleteCharacter = async () => {
    if (!selectedId || !window.confirm('Delete this character?')) return
    setSaving(true)
    try {
      await service.then(s => s.delete(projectId, selectedId))
      const remaining = characters.filter(c => c.id !== selectedId)
      setCharacters(remaining)
      if (remaining.length) selectCharacter(remaining[0]); else newCharacter()
      success('Character deleted')
    } catch (e: any) { error(e?.message || 'Unable to delete character') }
    finally { setSaving(false) }
  }

  const generateBible = async () => {
    if (!projectId || biblePrompt.trim().length < 10) return error('Enter a character-generation prompt')
    setGenerating(true)
    try {
      const response: any = await service.then(s => s.generate(projectId, biblePrompt.trim()))
      const created = response?.data?.characters || []
      if (created.length) {
        await loadCharacters()
        success(`${created.length} characters generated and saved`)
      }
    } catch (e: any) { error(e?.message || 'Character generation failed') }
    finally { setGenerating(false) }
  }

  return (
    <AppShell>
      <PageContainer>
        <PageHeader title="Character Bible" description="Create, edit, generate and lock characters for consistency across your story." action={<Button variant="studio" onClick={newCharacter}><Plus className="mr-2 h-4 w-4" /> New Character</Button>} />

        {!projectId ? (
          <Card><CardContent className="py-10 text-center text-muted-foreground">Open the Character Bible from a project to manage its characters.</CardContent></Card>
        ) : loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="text-sm font-medium mb-2">AI Character Bible</div>
                <Textarea value={biblePrompt} onChange={e => setBiblePrompt(e.target.value)} rows={4} />
                <Button variant="studio" className="w-full mt-3" onClick={generateBible} disabled={generating}><Sparkles className="mr-2 h-4 w-4" /> {generating ? 'Generating…' : 'Generate Characters (5 credits)'}</Button>
              </Card>
              {characters.length === 0 && <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No characters yet. Create one or generate a Character Bible.</CardContent></Card>}
              {characters.map(c => {
                const locked = Boolean(c.is_locked ?? c.locked)
                return <Card key={c.id} onClick={() => selectCharacter(c)} className={`p-4 cursor-pointer transition-all ${selectedId === c.id ? 'ring-2 ring-primary' : ''} ${locked ? 'border-primary/30 bg-primary/5' : ''}`}>
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><Users className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold truncate">{c.name}</span>{locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3 text-muted-foreground" />}</div><div className="text-xs text-muted-foreground">{c.role || 'SUPPORTING'}{c.age ? ` • ${c.age}yo` : ''}</div><Badge variant={locked ? 'studio' : 'outline'} className="mt-1 text-[10px]">{locked ? 'Locked' : 'Unlocked'}</Badge></div>
                  </div>
                </Card>
              })}
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> {selectedId ? `${form.name || 'Character'} Profile` : 'New Character'}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4"><Input label="Name" value={form.name || ''} onChange={e => set('name', e.target.value)} disabled={Boolean(form.is_locked)} /><Select label="Role" value={form.role || 'SUPPORTING'} onChange={e => set('role', e.target.value)} disabled={Boolean(form.is_locked)} options={[{ value: 'PROTAGONIST', label: 'Protagonist' }, { value: 'ANTAGONIST', label: 'Antagonist' }, { value: 'SUPPORTING', label: 'Supporting' }]} /></div>
                  <div className="grid md:grid-cols-3 gap-4"><Input label="Age" type="number" value={form.age ?? ''} onChange={e => set('age', e.target.value)} disabled={Boolean(form.is_locked)} /><Input label="Gender" value={form.gender || ''} onChange={e => set('gender', e.target.value)} disabled={Boolean(form.is_locked)} /><Input label="Skin Tone" value={form.skin_tone || ''} onChange={e => set('skin_tone', e.target.value)} disabled={Boolean(form.is_locked)} /></div>
                  <Input label="Hair Style" value={form.hair_style || ''} onChange={e => set('hair_style', e.target.value)} disabled={Boolean(form.is_locked)} />
                  <Textarea label="Appearance" value={form.appearance || ''} onChange={e => set('appearance', e.target.value)} rows={2} disabled={Boolean(form.is_locked)} />
                  <Textarea label="Personality" value={form.personality || ''} onChange={e => set('personality', e.target.value)} rows={2} disabled={Boolean(form.is_locked)} />
                  <Textarea label="Backstory" value={form.background || ''} onChange={e => set('background', e.target.value)} rows={2} disabled={Boolean(form.is_locked)} />
                  <Textarea label="Clothing Style" value={form.clothing_style || ''} onChange={e => set('clothing_style', e.target.value)} rows={2} disabled={Boolean(form.is_locked)} />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="studio" onClick={saveCharacter} disabled={saving || Boolean(form.is_locked)}><Save className="mr-2 h-4 w-4" /> {saving ? 'Saving…' : 'Save Character'}</Button>
                    {selectedId && <Button variant="outline" onClick={toggleLock} disabled={saving}>{form.is_locked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}{form.is_locked ? 'Unlock' : 'Lock Character'}</Button>}
                    {selectedId && !form.is_locked && <Button variant="outline" onClick={deleteCharacter} disabled={saving}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>}
                  </div>
                  <p className="text-xs text-muted-foreground">Locked characters cannot be edited or deleted until unlocked. Reference image and voice generation will be enabled when their production services are connected.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  )
}
