"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioUpload } from "@/components/ui/file-upload";
import { Edit, GripVertical, Music, Pause, Play, Plus, Trash2 } from "lucide-react";

export interface AudioSample {
  id?: number;
  sample_id: string;
  name: string;
  audio_url: string;
  category: string;
  duration?: number;
}

interface AudioSampleManagerProps {
  actorId: string;
  samples: AudioSample[];
  onSamplesChange: (samples: AudioSample[]) => void;
}

const DEFAULT_SAMPLE = {
  name: "სარეკლამო რგოლი",
  audio_url: "",
};

export function AudioSampleManager({
  actorId,
  samples,
  onSamplesChange,
}: AudioSampleManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [newSample, setNewSample] = useState(DEFAULT_SAMPLE);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});

  const stopAll = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  useEffect(() => () => stopAll(), []);

  const handleAddSample = () => {
    if (!newSample.name.trim() || !newSample.audio_url) return;

    onSamplesChange([
      ...samples,
      {
        sample_id: `${actorId}.${samples.length + 1}`,
        name: newSample.name.trim(),
        audio_url: newSample.audio_url,
        category: "audio",
      },
    ]);
    setNewSample(DEFAULT_SAMPLE);
    setIsAddingNew(false);
  };

  const handlePlayPause = (index: number) => {
    const selectedAudio = audioRefs.current[index];
    if (!selectedAudio) return;

    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (audio && Number(key) !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (playingIndex === index && !selectedAudio.paused) {
      selectedAudio.pause();
      setPlayingIndex(null);
    } else {
      selectedAudio.play().catch(() => setPlayingIndex(null));
      setPlayingIndex(index);
    }
  };

  const handleDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const reorderedSamples = [...samples];
    const [draggedSample] = reorderedSamples.splice(draggedIndex, 1);
    reorderedSamples.splice(dropIndex, 0, draggedSample);
    onSamplesChange(reorderedSamples);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">აუდიო ნიმუშები</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            ბარათზე გამოჩნდება ამ სიაში მითითებული სახელები და თანმიმდევრობა.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          ნიმუშის დამატება
        </Button>
      </div>

      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ახალი აუდიო ნიმუში</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ნიმუშის სახელი</Label>
              <Input
                value={newSample.name}
                onChange={(event) =>
                  setNewSample((sample) => ({ ...sample, name: event.target.value }))
                }
                placeholder="მაგ: სარეკლამო რგოლი"
              />
            </div>
            <div className="space-y-2">
              <Label>აუდიო ფაილი</Label>
              <AudioUpload
                currentUrl={newSample.audio_url}
                onUpload={(url) => setNewSample((sample) => ({ ...sample, audio_url: url }))}
                onRemove={() => setNewSample((sample) => ({ ...sample, audio_url: "" }))}
                folder={actorId}
                dirOverride="audios"
                fileName={`${actorId}.${samples.length + 1}.wav`}
                placeholder="აუდიო ფაილის ატვირთვა"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddSample}
                disabled={!newSample.name.trim() || !newSample.audio_url}
              >
                დამატება
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                გაუქმება
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {samples.map((sample, index) => (
          <Card
            key={sample.sample_id || index}
            draggable={editingIndex !== index}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
            onDragEnd={() => setDraggedIndex(null)}
            className={draggedIndex === index ? "opacity-50" : undefined}
          >
            <CardContent className="p-4">
              {editingIndex === index ? (
                <EditSampleForm
                  sample={sample}
                  onCancel={() => setEditingIndex(null)}
                  onSave={(updatedSample) => {
                    const updatedSamples = [...samples];
                    updatedSamples[index] = { ...sample, ...updatedSample };
                    onSamplesChange(updatedSamples);
                    setEditingIndex(null);
                  }}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-muted-foreground" />
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <audio
                    ref={(element) => {
                      audioRefs.current[index] = element;
                      if (element) element.onended = () => setPlayingIndex(null);
                    }}
                    src={sample.audio_url}
                    preload="none"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handlePlayPause(index)}>
                    {playingIndex === index ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium">{sample.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">ID: {sample.sample_id}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEditingIndex(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onSamplesChange(samples.filter((_, sampleIndex) => sampleIndex !== index))}
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
            <Music className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">აუდიო ნიმუშები არ არის</p>
            <p className="mb-4 text-muted-foreground">დაამატეთ აუდიო ნიმუშები ამ მსახიობისთვის.</p>
            <Button type="button" onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              პირველი ნიმუშის დამატება
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EditSampleForm({
  sample,
  onSave,
  onCancel,
}: {
  sample: AudioSample;
  onSave: (sample: Partial<AudioSample>) => void;
  onCancel: () => void;
}) {
  const [editedSample, setEditedSample] = useState({
    name: sample.name,
    audio_url: sample.audio_url,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>ნიმუშის სახელი</Label>
        <Input
          value={editedSample.name}
          onChange={(event) =>
            setEditedSample((current) => ({ ...current, name: event.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>აუდიო ფაილი</Label>
        <AudioUpload
          currentUrl={editedSample.audio_url}
          onUpload={(url) => setEditedSample((current) => ({ ...current, audio_url: url }))}
          onRemove={() => setEditedSample((current) => ({ ...current, audio_url: "" }))}
          folder={sample.sample_id.split(".")[0]}
          dirOverride="audios"
          fileName={`${sample.sample_id}.wav`}
          placeholder="აუდიო ფაილის შეცვლა"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => onSave(editedSample)}
          disabled={!editedSample.name.trim() || !editedSample.audio_url}
        >
          შენახვა
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          გაუქმება
        </Button>
      </div>
    </div>
  );
}
