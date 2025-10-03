"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
    tags: [] as string[],
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
