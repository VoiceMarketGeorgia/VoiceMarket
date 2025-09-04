'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AudioUpload } from '@/components/ui/file-upload'
import { Music, Play, Pause, Edit, Trash2, Plus } from 'lucide-react'

export interface AudioSample {
  id?: number
  sample_id: string
  name: string
  audio_url: string
  category: string
  duration?: number
}

interface AudioSampleManagerProps {
  actorId: string
  samples: AudioSample[]
  onSamplesChange: (samples: AudioSample[]) => void
}

const AUDIO_CATEGORIES = [
  { value: 'კომერციული', label: 'კომერციული' },
  { value: 'გახმოვანება', label: 'გახმოვანება' },
  { value: 'დოკუმენტური', label: 'დოკუმენტური' },
  { value: 'პერსონაჟი', label: 'პერსონაჟი' },
  { value: 'ელექტრონული სწავლება', label: 'ელექტრონული სწავლება' },
  { value: 'ანიმაცია', label: 'ანიმაცია' },
  { value: 'სარეკლამო', label: 'სარეკლამო' },
  { value: 'ავტომოპასუხე', label: 'ავტომოპასუხე' }
]

export function AudioSampleManager({ actorId, samples, onSamplesChange }: AudioSampleManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [newSample, setNewSample] = useState<Partial<AudioSample>>({
    name: '',
    category: 'კომერციული',
    audio_url: ''
  })

  const handleAddSample = () => {
    if (!newSample.name || !newSample.audio_url) return

    const sample: AudioSample = {
      sample_id: `${actorId}-${samples.length + 1}`,
      name: newSample.name,
      audio_url: newSample.audio_url,
      category: newSample.category || 'კომერციული'
    }

    onSamplesChange([...samples, sample])
    setNewSample({ name: '', category: 'კომერციული', audio_url: '' })
    setIsAddingNew(false)
  }

  const handleUpdateSample = (index: number, updatedSample: Partial<AudioSample>) => {
    const updatedSamples = [...samples]
    updatedSamples[index] = { ...updatedSamples[index], ...updatedSample }
    onSamplesChange(updatedSamples)
    setEditingIndex(null)
  }

  const handleDeleteSample = (index: number) => {
    const updatedSamples = samples.filter((_, i) => i !== index)
    onSamplesChange(updatedSamples)
  }

  const handlePlayPause = (index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null)
      // Pause audio logic here
    } else {
      setPlayingIndex(index)
      // Play audio logic here
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'კომერციული': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'გახმოვანება': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'დოკუმენტური': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'პერსონაჟი': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'ელექტრონული სწავლება': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'ანიმაცია': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'სარეკლამო': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'ავტომოპასუხე': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">აუდიო ნიმუშები</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          ნიმუშის დამატება
        </Button>
      </div>

      {/* Add new sample form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ახალი აუდიო ნიმუში</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ნიმუშის სახელი</Label>
                <Input
                  value={newSample.name || ''}
                  onChange={(e) => setNewSample({ ...newSample, name: e.target.value })}
                  placeholder="მაგ: სარეკლამო რგოლი"
                />
              </div>
              <div className="space-y-2">
                <Label>კატეგორია</Label>
                <Select 
                  value={newSample.category} 
                  onValueChange={(value) => setNewSample({ ...newSample, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIO_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>აუდიო ფაილი</Label>
              <AudioUpload
                currentUrl={newSample.audio_url}
                onUpload={(url) => setNewSample({ ...newSample, audio_url: url })}
                onRemove={() => setNewSample({ ...newSample, audio_url: '' })}
                folder={`actor-${actorId}`}
                placeholder="აუდიო ფაილის ატვირთვა"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddSample} disabled={!newSample.name || !newSample.audio_url}>
                დამატება
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                გაუქმება
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing samples */}
      <div className="space-y-3">
        {samples.map((sample, index) => (
          <Card key={sample.sample_id || index}>
            <CardContent className="p-4">
              {editingIndex === index ? (
                <EditSampleForm
                  sample={sample}
                  onSave={(updatedSample) => handleUpdateSample(index, updatedSample)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => handlePlayPause(index)}
                  >
                    {playingIndex === index ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate">{sample.name}</span>
                      <Badge className={getCategoryColor(sample.category)}>
                        {sample.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ID: {sample.sample_id}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSample(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {samples.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">აუდიო ნიმუშები არ არის</p>
            <p className="text-muted-foreground mb-4">
              დაამატეთ აუდიო ნიმუშები ამ მსახიობისთვის
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              პირველი ნიმუშის დამატება
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Edit form component
function EditSampleForm({ 
  sample, 
  onSave, 
  onCancel 
}: { 
  sample: AudioSample
  onSave: (sample: Partial<AudioSample>) => void
  onCancel: () => void
}) {
  const [editedSample, setEditedSample] = useState<Partial<AudioSample>>({
    name: sample.name,
    category: sample.category,
    audio_url: sample.audio_url
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ნიმუშის სახელი</Label>
          <Input
            value={editedSample.name || ''}
            onChange={(e) => setEditedSample({ ...editedSample, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>კატეგორია</Label>
          <Select 
            value={editedSample.category} 
            onValueChange={(value) => setEditedSample({ ...editedSample, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIO_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>აუდიო ფაილი</Label>
        <AudioUpload
          currentUrl={editedSample.audio_url}
          onUpload={(url) => setEditedSample({ ...editedSample, audio_url: url })}
          onRemove={() => setEditedSample({ ...editedSample, audio_url: '' })}
          folder={`actor-${sample.sample_id?.split('-')[0]}`}
          placeholder="აუდიო ფაილის შეცვლა"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(editedSample)}>
          შენახვა
        </Button>
        <Button variant="outline" onClick={onCancel}>
          გაუქმება
        </Button>
      </div>
    </div>
  )
}
