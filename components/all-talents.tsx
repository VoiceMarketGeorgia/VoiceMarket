"use client";

import { useState, useMemo, useEffect } from "react";
import { VoiceCard, AudioSample, Talent, ActorPricing } from "./voice-card";
import { useRouter } from "next/navigation";
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
import { getAllVoiceActors, convertToTalent } from "@/lib/supabase-queries";

interface TalentWithDuration {
  id: string;
  name: string;
  image: string;
  samples: AudioSample[];
  gradient: string;
  languages: string[];
  tags: string[];
  pricing: ActorPricing;
  duration: number; // Duration in minutes for pricing
}

export function AllTalents() {
  const router = useRouter();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    durationRange: [1, 60] as [number, number], // 1-60 minutes
  });
  const [talents, setTalents] = useState<TalentWithDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    "კომერციული",
    "გახმოვანება", 
    "დოკუმენტური",
    "პერსონაჟი",
    "ელექტრონული სწავლება",
    "ანიმაცია",
    "ახალი ამბები",
    "კორპორატიული"
  ];

  // Load talents from Supabase
  useEffect(() => {
    async function loadTalents() {
      try {
        setLoading(true);
        const voiceActors = await getAllVoiceActors();
        
        const talentsWithDuration: TalentWithDuration[] = voiceActors.map(actor => {
          const talent = convertToTalent(actor);
          
          // Add proper icons to samples
          const samplesWithIcons = talent.samples.map((sample: any) => ({
            ...sample,
            icon: getSampleIcon(sample.name)
          }));

          return {
            ...talent,
            samples: samplesWithIcons,
            duration: Math.floor(Math.random() * 40) + 5, // Random duration for pricing
          };
        });

        setTalents(talentsWithDuration);
        setError(null);
      } catch (err) {
        console.error('Error loading talents:', err);
        setError('Failed to load voice actors');
      } finally {
        setLoading(false);
      }
    }

    loadTalents();
  }, []);

  // Helper function to get icon for sample type
  const getSampleIcon = (sampleName: string) => {
    switch (sampleName) {
      case "სარეკლამო რგოლი":
        return <Mic2 className="h-4 w-4" />;
      case "ავტომოპასუხე":
        return <Headphones className="h-4 w-4" />;
      case "მხატვრული":
        return <BookOpen className="h-4 w-4" />;
      case "დოკუმენტური":
        return <Mic2 className="h-4 w-4" />;
      default:
        return <Mic2 className="h-4 w-4" />;
    }
  };

  // Filter talents based on selected filters
  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
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
  }, [talents, filters]);

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  const handleCardClick = (talentId: string) => {
    router.push(`/talents/${talentId}`);
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

        {/* ფილტრები Panel */}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-muted-foreground text-lg">
              იტვირთება...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              თავიდან ცდა
            </Button>
          </div>
        )}

        {/* Talents Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTalents.map((talent) => (
                <VoiceCard
                  key={talent.id}
                  talent={talent as Talent}
                  currentlyPlayingId={currentlyPlayingId}
                  onTogglePlay={handleTogglePlay}
                  onClick={() => handleCardClick(talent.id)}
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
                  გადატვირთვა ფილტრები
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
