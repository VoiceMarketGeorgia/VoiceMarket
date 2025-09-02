"use client";

import { useState, useMemo } from "react";
import { VoiceCard, AudioSample, Talent } from "./voice-card";
import { Mic2, Headphones, BookOpen, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TalentWithDuration extends Talent {
  duration: number; // Duration in minutes for pricing
}

export function AllTalents() {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    durationRange: [1, 60] as [number, number], // 1-60 minutes
  });

  // Number of samples per actor (based on actual audio folder structure)
  const samplesPerActor = [
    3, 2, 2, 2, 3, 3, 3, 3, 3, 3, // 1-10
    3, 3, 3, 3, 4, 3, 3, 3, 2, 3, // 11-20
    3, 4, 3, 3, 3, 3, 3, 2, 3, 2, // 21-30
    3, 2, 2, 3, 2, 2, 3, 3, 3, 4, // 31-40
    2, 2, 2, 2, 2, 3, 2, // 41-47
  ];

  const sampleNames = [
    { name: "სარეკლამო რგოლი", icon: <Mic2 className="h-4 w-4" /> },
    { name: "ავტომოპასუხე", icon: <Headphones className="h-4 w-4" /> },
    { name: "მხატვრული", icon: <BookOpen className="h-4 w-4" /> },
    { name: "დოკუმენტური", icon: <Mic2 className="h-4 w-4" /> },
  ];

  // Available tags for filtering
  const availableTags = [
    "Commercial",
    "Narration", 
    "Documentary",
    "Character",
    "E-Learning",
    "Animation",
    "News",
    "Corporate"
  ];

  // Generate all 47 talents
  const allTalents: TalentWithDuration[] = useMemo(() => {
    return Array.from({ length: 47 }, (_, i) => {
      const id = `${i + 1}`;
      const audiosFolder = `/audios/${id}`;

      const samples: AudioSample[] = [];
      const count = samplesPerActor[i] || 0;

      for (let idx = 0; idx < count; idx++) {
        const sampleIndex = idx % sampleNames.length;
        samples.push({
          id: `${id}-${idx + 1}`,
          name: sampleNames[sampleIndex].name,
          url: `${audiosFolder}/${id}.${idx + 1}.wav`,
          icon: sampleNames[sampleIndex].icon,
        });
      }

      // Assign diverse tags to actors
      const actorTags = [];
      if (i % 4 === 0) actorTags.push("Commercial");
      if (i % 3 === 0) actorTags.push("Narration");
      if (i % 5 === 0) actorTags.push("Documentary");
      if (i % 7 === 0) actorTags.push("Character");
      if (i % 6 === 0) actorTags.push("E-Learning");
      if (i % 8 === 0) actorTags.push("Animation");
      if (i % 9 === 0) actorTags.push("News");
      if (i % 10 === 0) actorTags.push("Corporate");
      
      // Ensure each actor has at least 2 tags
      if (actorTags.length < 2) {
        actorTags.push("Commercial", "Narration");
      }

      // Random duration for pricing (5-45 minutes)
      const duration = Math.floor(Math.random() * 40) + 5;

      return {
        id,
        name: `Actor ${id}`,
        image: `/photos/${id}.jpg`,
        samples,
        gradient: `from-orange-${400 + (i % 3) * 100} to-cyan-${500 + (i % 3) * 100}`,
        rating: 4.5 + Math.random() * 0.5,
        reviews: 50 + i * 5,
        languages: ["Georgian", ...(i % 3 === 0 ? ["English"] : [])],
        tags: actorTags,
        duration,
      };
    });
  }, []);

  // Filter talents based on selected filters
  const filteredTalents = useMemo(() => {
    return allTalents.filter((talent) => {
      // Filter by tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => talent.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Filter by duration range
      if (talent.duration < filters.durationRange[0] || talent.duration > filters.durationRange[1]) {
        return false;
      }

      return true;
    });
  }, [allTalents, filters]);

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  const toggleTagFilter = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleDurationChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      durationRange: [value[0], value[1]] as [number, number]
    }));
  };

  const resetFilters = () => {
    setFilters({
      tags: [],
      durationRange: [1, 60],
    });
  };

  const activeFilterCount = filters.tags.length + (filters.durationRange[0] !== 1 || filters.durationRange[1] !== 60 ? 1 : 0);

  return (
    <div className="bg-white dark:bg-background">
      <div className="container mx-auto p-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-foreground mb-2">
              ჩვენი მსახიობები
            </h1>
            <p className="text-gray-600 dark:text-muted-foreground">
              {filteredTalents.length} მსახიობი მოიძებნა
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mt-4 md:mt-0"
          >
            <Filter className="h-4 w-4" />
            ფილტრები
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-card rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">ფილტრები</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags Filter */}
              <div>
                <h4 className="font-medium mb-3">ტეგები</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => toggleTagFilter(tag)}
                      />
                      <Label htmlFor={tag} className="text-sm">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration Range Filter */}
              <div>
                <h4 className="font-medium mb-3">
                  ხანგრძლივობა (წუთი): {filters.durationRange[0]} - {filters.durationRange[1]}
                </h4>
                <Slider
                  value={filters.durationRange}
                  onValueChange={handleDurationChange}
                  max={60}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 წუთი</span>
                  <span>60 წუთი</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-1"
              >
                გადატვირთვა
              </Button>
            </div>
          </div>
        )}

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTalents.map((talent) => (
            <VoiceCard
              key={talent.id}
              talent={talent}
              currentlyPlayingId={currentlyPlayingId}
              onTogglePlay={handleTogglePlay}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-muted-foreground text-lg">
              არ მოიძებნა მსახიობი შერჩეული ფილტრებით
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="mt-4"
            >
              ფილტრების გადატვირთვა
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
