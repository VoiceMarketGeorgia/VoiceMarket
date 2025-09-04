'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { VoiceActorWithPricing } from '@/lib/supabase'
import { getAllVoiceActorsAdmin, createVoiceActor, updateVoiceActor, deleteVoiceActor, getAudioSamplesByActor, createAudioSample, updateAudioSample, deleteAudioSample } from '@/lib/supabase-queries'
import { ImageUpload } from '@/components/ui/file-upload'
import { AudioSampleManager } from '@/components/admin/audio-sample-manager'
import type { AudioSample } from '@/components/admin/audio-sample-manager'
import { Plus, Edit, Trash2, User, Star, Globe, Calendar, DollarSign, FileAudio, Eye, EyeOff } from 'lucide-react'

interface ActorFormData {
  actor_id: string
  name: string
  bio: string
  languages: string[]
  age_range: string
  accent: string
  voice_style: string[]
  photo_url: string
  is_featured: boolean
  is_active: boolean
  base_price_per_word: number
  rush_multiplier: number
  revision_price: number
  background_music_price: number
  sound_effects_price: number
  audio_samples: AudioSample[]
}

const INITIAL_FORM_DATA: ActorFormData = {
  actor_id: '',
  name: '',
  bio: '',
  languages: ['Georgian'],
  age_range: '25-35',
  accent: 'Georgian Standard',
  voice_style: ['Conversational'],
  photo_url: '',
  is_featured: false,
  is_active: true,
  base_price_per_word: 0.05,
  rush_multiplier: 1.5,
  revision_price: 50,
  background_music_price: 25,
  sound_effects_price: 30,
  audio_samples: []
}

const LANGUAGE_OPTIONS = ['Georgian', 'English', 'Russian', 'Armenian', 'Azerbaijani']
const AGE_RANGE_OPTIONS = ['18-25', '25-35', '35-45', '45-55', '55+']
const ACCENT_OPTIONS = ['Georgian Standard', 'Tbilisi', 'Western Georgian', 'Eastern Georgian', 'English (American)', 'English (British)', 'Russian']
const VOICE_STYLE_OPTIONS = ['Conversational', 'Professional', 'Warm', 'Energetic', 'Dramatic', 'Calm', 'Authoritative', 'Friendly', 'Serious', 'Playful']

export default function ActorsPage() {
  const [actors, setActors] = useState<VoiceActorWithPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingActor, setEditingActor] = useState<VoiceActorWithPricing | null>(null)
  const [formData, setFormData] = useState<ActorFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadActors = async () => {
    try {
      setLoading(true)
      const data = await getAllVoiceActorsAdmin()
      setActors(data)
    } catch (error) {
      console.error('Error loading actors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActors()
  }, [])

  const filteredActors = actors.filter(actor => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && actor.is_active) ||
      (filter === 'inactive' && !actor.is_active) ||
      (filter === 'featured' && actor.is_featured)
    
    const matchesSearch = 
      (actor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (actor.actor_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (actor.bio || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const handleCreateActor = async () => {
    try {
      setIsSubmitting(true)
      
      // Create the actor first
      const newActor = await createVoiceActor(formData)
      
      // Create audio samples if any
      if (formData.audio_samples.length > 0) {
        for (const sample of formData.audio_samples) {
          await createAudioSample({
            voice_actor_id: newActor.id,
            sample_id: sample.sample_id,
            name: sample.name,
            audio_url: sample.audio_url,
            category: sample.category
          })
        }
      }
      
      setIsCreateDialogOpen(false)
      setFormData(INITIAL_FORM_DATA)
      await loadActors()
    } catch (error) {
      console.error('Error creating actor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditActor = async () => {
    if (!editingActor) return
    
    try {
      setIsSubmitting(true)
      
      // Update the actor
      await updateVoiceActor(editingActor.id, formData)
      
      // Handle audio samples - for simplicity, delete all and recreate
      // In production, you'd want to do a more sophisticated diff
      const existingSamples = editingActor.samples || []
      
      // Delete existing samples
      for (const sample of existingSamples) {
        if (sample.id) {
          await deleteAudioSample(sample.id)
        }
      }
      
      // Create new samples
      if (formData.audio_samples.length > 0) {
        for (const sample of formData.audio_samples) {
          await createAudioSample({
            voice_actor_id: editingActor.id,
            sample_id: sample.sample_id,
            name: sample.name,
            audio_url: sample.audio_url,
            category: sample.category
          })
        }
      }
      
      setIsEditDialogOpen(false)
      setEditingActor(null)
      setFormData(INITIAL_FORM_DATA)
      await loadActors()
    } catch (error) {
      console.error('Error updating actor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteActor = async (actorId: number) => {
    try {
      await deleteVoiceActor(actorId)
      await loadActors()
    } catch (error) {
      console.error('Error deleting actor:', error)
    }
  }

  const openEditDialog = async (actor: VoiceActorWithPricing) => {
    setEditingActor(actor)
    
    // Load audio samples for this actor
    const audioSamples = actor.samples?.map(sample => ({
      id: sample.id,
      sample_id: sample.sample_id,
      name: sample.name,
      audio_url: sample.audio_url || '',
      category: sample.category || 'კომერციული'
    })) || []

    setFormData({
      actor_id: actor.actor_id || '',
      name: actor.name || '',
      bio: actor.bio || '',
      languages: actor.languages || ['Georgian'],
      age_range: actor.age_range || '25-35',
      accent: actor.accent || 'Georgian Standard',
      voice_style: actor.voice_style || ['Conversational'],
      photo_url: actor.photo_url || actor.image_url || '',
      is_featured: actor.is_featured || false,
      is_active: actor.is_active || true,
      base_price_per_word: actor.pricing?.[0]?.base_price_per_word || 0.05,
      rush_multiplier: actor.pricing?.[0]?.rush_multiplier || 1.5,
      revision_price: actor.pricing?.[0]?.revision_price || 50,
      background_music_price: actor.pricing?.[0]?.background_music_price || 25,
      sound_effects_price: actor.pricing?.[0]?.sound_effects_price || 30,
      audio_samples: audioSamples
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setEditingActor(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ხმოვანი მსახიობები</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">იტვირთება...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">ხმოვანი მსახიობები</h1>
          <p className="text-sm text-muted-foreground mt-1">მსახიობების პროფილების მართვა</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              ახალი მსახიობი
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ახალი მსახიობის დამატება</DialogTitle>
              <DialogDescription>
                შეავსეთ ფორმა ახალი ხმოვანი მსახიობის დასამატებლად სისტემაში
              </DialogDescription>
            </DialogHeader>
            <ActorForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleCreateActor}
              isSubmitting={isSubmitting}
              submitLabel="მსახიობის შექმნა"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="მსახიობის ძებნა..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა მსახიობი ({actors.length})</SelectItem>
            <SelectItem value="active">აქტიური ({actors.filter(a => a.is_active).length})</SelectItem>
            <SelectItem value="inactive">არააქტიური ({actors.filter(a => !a.is_active).length})</SelectItem>
            <SelectItem value="featured">რჩეული ({actors.filter(a => a.is_featured).length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        სულ: {filteredActors.length} მსახიობი
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActors.map((actor) => (
          <Card key={actor.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {(actor.photo_url || actor.image_url) ? (
                    <img 
                      src={actor.photo_url || actor.image_url} 
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="truncate">{actor.name}</span>
                    {actor.is_featured && <Star className="h-4 w-4 text-yellow-500" />}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">#{actor.actor_id}</span>
                    <Badge variant={actor.is_active ? "default" : "secondary"}>
                      {actor.is_active ? "აქტიური" : "არააქტიური"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{actor.bio}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{(actor.languages || []).join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{actor.age_range} წლის</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${actor.pricing?.[0]?.base_price_per_word || 0.05}/სიტყვა</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileAudio className="h-4 w-4 text-muted-foreground" />
                  <span>{actor.samples?.length || 0} ნიმუში</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {(actor.voice_style || []).slice(0, 3).map((style) => (
                  <Badge key={style} variant="outline" className="text-xs">
                    {style}
                  </Badge>
                ))}
                {(actor.voice_style || []).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(actor.voice_style || []).length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(actor)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  რედაქტირება
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="px-2">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>მსახიობის წაშლა</AlertDialogTitle>
                      <AlertDialogDescription>
                        დარწმუნებული ხართ, რომ გსურთ {actor.name}-ის წაშლა? ეს მოქმედება შეუქცევადია.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteActor(actor.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        წაშლა
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">მსახიობები არ მოიძებნა</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "ძებნის შედეგები არ მოიძებნა" : "მსახიობები ჯერ არ დამატებულა"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>მსახიობის რედაქტირება</DialogTitle>
            <DialogDescription>
              შეცვალეთ მსახიობის ინფორმაცია, ფოტო და აუდიო ნიმუშები
            </DialogDescription>
          </DialogHeader>
          <ActorForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={handleEditActor}
            isSubmitting={isSubmitting}
            submitLabel="ცვლილებების შენახვა"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ActorFormProps {
  formData: ActorFormData
  setFormData: (data: ActorFormData) => void
  onSubmit: () => void
  isSubmitting: boolean
  submitLabel: string
}

function ActorForm({ formData, setFormData, onSubmit, isSubmitting, submitLabel }: ActorFormProps) {
  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        languages: [...formData.languages, language]
      })
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== language)
      })
    }
  }

  const handleVoiceStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        voice_style: [...formData.voice_style, style]
      })
    } else {
      setFormData({
        ...formData,
        voice_style: formData.voice_style.filter(s => s !== style)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="actor_id">მსახიობის ID</Label>
          <Input
            id="actor_id"
            value={formData.actor_id}
            onChange={(e) => setFormData({ ...formData, actor_id: e.target.value })}
            placeholder="01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">სახელი</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="მსახიობის სახელი"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">ბიოგრაფია</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="მსახიობის შესახებ ინფორმაცია"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>მსახიობის ფოტო</Label>
        <ImageUpload
          currentUrl={formData.photo_url}
          onUpload={(url) => setFormData({ ...formData, photo_url: url })}
          onRemove={() => setFormData({ ...formData, photo_url: '' })}
          folder={`actor-${formData.actor_id || 'new'}`}
          placeholder="ფოტოს ატვირთვა (გადმოიტანეთ ან დააკლიკეთ)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ასაკობრივი ჯგუფი</Label>
          <Select value={formData.age_range} onValueChange={(value) => setFormData({ ...formData, age_range: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGE_RANGE_OPTIONS.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>აქცენტი</Label>
          <Select value={formData.accent} onValueChange={(value) => setFormData({ ...formData, accent: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCENT_OPTIONS.map((accent) => (
                <SelectItem key={accent} value={accent}>{accent}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>ენები</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LANGUAGE_OPTIONS.map((language) => (
            <label key={language} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.languages.includes(language)}
                onChange={(e) => handleLanguageChange(language, e.target.checked)}
                className="rounded"
              />
              {language}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>ხმის სტილი</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {VOICE_STYLE_OPTIONS.map((style) => (
            <label key={style} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.voice_style.includes(style)}
                onChange={(e) => handleVoiceStyleChange(style, e.target.checked)}
                className="rounded"
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">ფასები</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ბაზისური ფასი (სიტყვაზე)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.base_price_per_word}
              onChange={(e) => setFormData({ ...formData, base_price_per_word: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>გადაუდებელი მუშაობის კოეფიციენტი</Label>
            <Input
              type="number"
              step="0.1"
              min="1"
              value={formData.rush_multiplier}
              onChange={(e) => setFormData({ ...formData, rush_multiplier: parseFloat(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <Label>შესწორების ფასი</Label>
            <Input
              type="number"
              min="0"
              value={formData.revision_price}
              onChange={(e) => setFormData({ ...formData, revision_price: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>ფონური მუსიკის ფასი</Label>
            <Input
              type="number"
              min="0"
              value={formData.background_music_price}
              onChange={(e) => setFormData({ ...formData, background_music_price: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>ხმოვანი ეფექტების ფასი</Label>
            <Input
              type="number"
              min="0"
              value={formData.sound_effects_price}
              onChange={(e) => setFormData({ ...formData, sound_effects_price: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="rounded"
          />
          რჩეული მსახიობი
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded"
          />
          აქტიური
        </label>
      </div>

      <div className="border-t pt-6">
        <AudioSampleManager
          actorId={formData.actor_id || 'new'}
          samples={formData.audio_samples}
          onSamplesChange={(samples) => setFormData({ ...formData, audio_samples: samples })}
        />
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "მუშავდება..." : submitLabel}
        </Button>
      </div>
    </div>
  )
}
