"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { VoiceCard, AudioSample, Talent, ActorPricing } from "./voice-card";
import { useRouter } from "next/navigation";
import { Mic2, Headphones, BookOpen, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllVoiceActors, convertToTalent } from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";

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
    voiceStyles: [] as string[],
    languages: [] as string[],
    genders: [] as string[],
    audioCategories: [] as string[],
    durationRange: [1, 60] as [number, number], // 1-60 minutes
  });
  const [talents, setTalents] = useState<TalentWithDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Infinite scrolling state
  const [limit, setLimit] = useState(4); // Dynamic limit based on screen size
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Intersection Observer refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Function to calculate responsive limit based on screen size using percentages
  const calculateResponsiveLimit = useCallback(() => {
    if (typeof window === 'undefined') return 4; // Default for SSR
    
    const width = window.innerWidth;
    
    // Calculate batch size as percentage of screen width
    // Assuming each card is approximately 300px wide with gaps
    const cardWidth = 320; // Approximate card width including gaps
    const cardsPerRow = Math.floor(width / cardWidth);
    
    // Load 2 rows worth of content in advance
    const batchSize = Math.max(1, cardsPerRow * 2);
    
    // Set reasonable limits to prevent too large or too small batches
    const minBatch = 2;
    const maxBatch = 12;
    
    return Math.min(maxBatch, Math.max(minBatch, batchSize));
  }, []);

  // Update limit when screen size changes
  useEffect(() => {
    const handleResize = () => {
      const newLimit = calculateResponsiveLimit();
      if (newLimit !== limit) {
        setLimit(newLimit);
        // Reset pagination when limit changes to avoid issues
        setOffset(0);
        setHasMore(true);
      }
    };

    // Set initial limit
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateResponsiveLimit, limit]);

  // Load more actors function for infinite scrolling
  const loadMoreActors = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      
      // Use Supabase range to get the next batch
      const { data, error } = await supabase
        .from('voice_actors')
        .select(`
          *,
          pricing:actor_pricing(*),
          samples:audio_samples(*)
        `)
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) {
        console.error('Error loading more actors:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Convert to TalentWithDuration format
        const newTalents: TalentWithDuration[] = data.map(actor => {
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
        
        // Append new talents to existing ones
        setTalents(prev => [...prev, ...newTalents]);
        setOffset(prev => prev + limit);
        
        // Check if we got fewer results than requested (end of data)
        if (data.length < limit) {
          setHasMore(false);
        }
      } else {
        // No more data
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more actors:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset, limit, hasMore, isLoadingMore]);

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

  // Load initial talents from Supabase (first batch)
  useEffect(() => {
    async function loadInitialTalents() {
      try {
        setLoading(true);
        setError(null);
        
        // Load first batch using the same logic as loadMoreActors
        const { data, error } = await supabase
          .from('voice_actors')
          .select(`
            *,
            pricing:actor_pricing(*),
            samples:audio_samples(*)
          `)
          .eq('is_active', true)
          .order('id', { ascending: true })
          .range(0, limit - 1);
        
        if (error) {
          console.error('Error loading initial talents:', error);
          setError('Failed to load voice actors');
          return;
        }
        
        if (data && data.length > 0) {
          const talentsWithDuration: TalentWithDuration[] = data.map(actor => {
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
          setOffset(limit); // Set offset for next batch
          
          // Check if we got fewer results than requested (end of data)
          if (data.length < limit) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error loading initial talents:', err);
        setError('Failed to load voice actors');
      } finally {
        setLoading(false);
      }
    }

    loadInitialTalents();
  }, [limit, calculateResponsiveLimit]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreActors();
        }
      },
      {
        root: null, // Use viewport
        rootMargin: '100px', // Start loading 100px before reaching the element
        threshold: 0.1,
      }
    );
    
    observerRef.current = observer;
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMoreActors]);

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
      // Filter by voice styles
      if (filters.voiceStyles.length > 0) {
        const hasMatchingStyle = filters.voiceStyles.some(style => 
          (talent as any).voice_style?.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      // Filter by languages
      if (filters.languages.length > 0) {
        const hasMatchingLanguage = filters.languages.some(lang => 
          talent.languages?.includes(lang)
        );
        if (!hasMatchingLanguage) return false;
      }

      // Filter by genders
      if (filters.genders.length > 0) {
        const hasMatchingGender = filters.genders.includes((talent as any).gender);
        if (!hasMatchingGender) return false;
      }

      // Filter by audio categories (from samples)
      if (filters.audioCategories.length > 0) {
        const sampleCategories = talent.samples.map((s: any) => s.category).filter(Boolean);
        const hasMatchingCategory = filters.audioCategories.some(cat => 
          sampleCategories.includes(cat)
        );
        if (!hasMatchingCategory) return false;
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

  const toggleVoiceStyleFilter = (style: string) => {
    setFilters(prev => ({
      ...prev,
      voiceStyles: prev.voiceStyles.includes(style)
        ? prev.voiceStyles.filter(s => s !== style)
        : [...prev.voiceStyles, style]
    }));
  };

  const toggleLanguageFilter = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleGenderFilter = (gender: string) => {
    setFilters(prev => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter(g => g !== gender)
        : [...prev.genders, gender]
    }));
  };

  const toggleAudioCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      audioCategories: prev.audioCategories.includes(category)
        ? prev.audioCategories.filter(c => c !== category)
        : [...prev.audioCategories, category]
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
      voiceStyles: [],
      languages: [],
      genders: [],
      audioCategories: [],
      durationRange: [1, 60],
    });
  };

  const activeFilterCount = 
    filters.voiceStyles.length + 
    filters.languages.length + 
    filters.genders.length + 
    filters.audioCategories.length + 
    (filters.durationRange[0] !== 1 || filters.durationRange[1] !== 60 ? 1 : 0);

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
              <span className="ml-2 text-xs text-gray-400">
                (იტვირთება {limit} ერთდროულად - {Math.floor((window?.innerWidth || 1200) / 320)} ზედიზედ)
              </span>
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

            <div className="space-y-6">
              {/* Voice Styles Filter */}
              <div>
                <h4 className="font-medium mb-3">ხმის სტილი</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {VOICE_STYLE_OPTIONS.map((style) => (
                    <div key={style.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`voice-${style.value}`}
                        checked={filters.voiceStyles.includes(style.value)}
                        onCheckedChange={() => toggleVoiceStyleFilter(style.value)}
                      />
                      <Label htmlFor={`voice-${style.value}`} className="text-sm">
                        {style.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages Filter */}
              <div>
                <h4 className="font-medium mb-3">ენები</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <div key={language.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${language.value}`}
                        checked={filters.languages.includes(language.value)}
                        onCheckedChange={() => toggleLanguageFilter(language.value)}
                      />
                      <Label htmlFor={`lang-${language.value}`} className="text-sm">
                        {language.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <h4 className="font-medium mb-3">სქესი</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {GENDER_OPTIONS.map((gender) => (
                    <div key={gender.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender-${gender.value}`}
                        checked={filters.genders.includes(gender.value)}
                        onCheckedChange={() => toggleGenderFilter(gender.value)}
                      />
                      <Label htmlFor={`gender-${gender.value}`} className="text-sm">
                        {gender.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Category Filter - Dropdown */}
              <div>
                <h4 className="font-medium mb-3">აუდიო კატეგორია</h4>
                <Select 
                  value={filters.audioCategories[0] || "all"} 
                  onValueChange={(value) => {
                    if (value && value !== "all") {
                      setFilters(prev => ({ ...prev, audioCategories: [value] }));
                    } else {
                      setFilters(prev => ({ ...prev, audioCategories: [] }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ კატეგორია" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა კატეგორია</SelectItem>
                    {AUDIO_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 dark:text-muted-foreground">
                    იტვირთება მეტი მსახიობი...
                  </p>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && talents.length > 0 && !isLoadingMore && (
              <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">
                <p>ყველა მსახიობი ნაჩვენებია</p>
              </div>
            )}

            {/* Intersection Observer Target - invisible element at the bottom */}
            {hasMore && !isLoadingMore && (
              <div ref={loadMoreRef} className="h-1" />
            )}

            {/* No Results */}
            {filteredTalents.length === 0 && talents.length === 0 && (
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
