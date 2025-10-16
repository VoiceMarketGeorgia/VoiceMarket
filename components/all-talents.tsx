"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { VoiceCard, AudioSample, Talent, ActorPricing } from "./voice-card";
import { useRouter } from "next/navigation";
import { Mic2, Headphones, BookOpen, Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { getAllVoiceActors, convertToTalent, getActiveAudioCategories } from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";
import { VOICE_STYLE_OPTIONS, LANGUAGE_OPTIONS, GENDER_OPTIONS, AUDIO_CATEGORIES } from "@/lib/constants";
import { getDynamicLanguages, getDynamicVoiceStyles, getDynamicAudioCategories } from "@/lib/dynamic-attributes";
import { getIconElement } from "@/lib/category-icons";

interface TalentWithDuration {
  id: string;
  name: string;
  image: string;
  samples: AudioSample[];
  gradient: string;
  languages: string[];
  tags: string[];
  pricing: ActorPricing;
}

export function AllTalents() {
  const router = useRouter();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  
  // Temporary filters (what user is currently selecting)
  const [tempFilters, setTempFilters] = useState({
    voiceStyles: [] as string[],
    languages: [] as string[],
    genders: [] as string[],
    audioCategories: [] as string[],
  });
  
  // Applied filters (what's actually filtering the results)
  const [appliedFilters, setAppliedFilters] = useState({
    voiceStyles: [] as string[],
    languages: [] as string[],
    genders: [] as string[],
    audioCategories: [] as string[],
  });
  
  const [talents, setTalents] = useState<TalentWithDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Category icon map for dynamic icons
  const [categoryIconMap, setCategoryIconMap] = useState<Map<string, { icon_name: string; color_class: string }>>(new Map());
  
  // Dynamic filter options
  const [languageFilterOptions, setLanguageFilterOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [voiceStyleFilterOptions, setVoiceStyleFilterOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [audioCategoryFilterOptions, setAudioCategoryFilterOptions] = useState<Array<{ value: string; label: string }>>([]);
  
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

  // Load category icon map and filter options on mount
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [categories, languages, voiceStyles] = await Promise.all([
          getDynamicAudioCategories(),
          getDynamicLanguages(),
          getDynamicVoiceStyles(),
        ]);
        
        // Set category icon map
        const map = new Map<string, { icon_name: string; color_class: string }>();
        categories.forEach(cat => {
          if (cat.icon_name && cat.color_class) {
            map.set(cat.value, {
              icon_name: cat.icon_name,
              color_class: cat.color_class
            });
          }
        });
        setCategoryIconMap(map);
        
        // Set filter options
        setLanguageFilterOptions(languages);
        setVoiceStyleFilterOptions(voiceStyles);
        setAudioCategoryFilterOptions(categories);
      } catch (error) {
        console.error('Error loading dynamic data:', error);
      }
    };
    
    loadDynamicData();

    // Listen for attribute updates
    const handleAttributesUpdate = () => {
      loadDynamicData();
    };

    window.addEventListener('attributesUpdated', handleAttributesUpdate);
    
    return () => {
      window.removeEventListener('attributesUpdated', handleAttributesUpdate);
    };
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
          const talent = convertToTalent(actor, categoryIconMap);
          
          // Add proper icons to samples using dynamic iconName
          const samplesWithIcons = talent.samples.map((sample: any) => ({
            ...sample,
            icon: sample.iconName ? getIconElement(sample.iconName, { className: "h-4 w-4" }) : <Mic2 className="h-4 w-4" />
          }));

          return {
            ...talent,
            samples: samplesWithIcons,
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
  }, [offset, limit, hasMore, isLoadingMore, categoryIconMap]);

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
            const talent = convertToTalent(actor, categoryIconMap);
            
            // Add proper icons to samples using dynamic iconName
            const samplesWithIcons = talent.samples.map((sample: any) => ({
              ...sample,
              icon: sample.iconName ? getIconElement(sample.iconName, { className: "h-4 w-4" }) : <Mic2 className="h-4 w-4" />
            }));

            return {
              ...talent,
              samples: samplesWithIcons,
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
  }, [limit, calculateResponsiveLimit, categoryIconMap]);

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

  // Filter talents based on applied filters
  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      // Filter by voice styles (multi-select)
      if (appliedFilters.voiceStyles.length > 0) {
        const hasMatchingStyle = appliedFilters.voiceStyles.some(style => 
          (talent as any).voice_style?.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      // Filter by languages (multi-select)
      if (appliedFilters.languages.length > 0) {
        const hasMatchingLanguage = appliedFilters.languages.some(lang => 
          talent.languages?.includes(lang)
        );
        if (!hasMatchingLanguage) return false;
      }

      // Filter by genders (multi-select)
      if (appliedFilters.genders.length > 0) {
        const hasMatchingGender = appliedFilters.genders.includes((talent as any).gender);
        if (!hasMatchingGender) return false;
      }

      // Filter by audio categories (multi-select)
      if (appliedFilters.audioCategories.length > 0) {
        const sampleCategories = talent.samples.map((s: any) => s.category).filter(Boolean);
        const hasMatchingCategory = appliedFilters.audioCategories.some(cat => 
          sampleCategories.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      return true;
    });
  }, [talents, appliedFilters]);

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  const handleCardClick = (talentId: string) => {
    router.push(`/talents/${talentId}`);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
  };

  const resetFilters = () => {
    setTempFilters({
      voiceStyles: [],
      languages: [],
      genders: [],
      audioCategories: [],
    });
    setAppliedFilters({
      voiceStyles: [],
      languages: [],
      genders: [],
      audioCategories: [],
    });
  };

  const activeFilterCount = 
    appliedFilters.voiceStyles.length +
    appliedFilters.languages.length +
    appliedFilters.genders.length +
    appliedFilters.audioCategories.length;

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
              {/* Voice Style Filter - Multi-select */}
              <div>
                <Label htmlFor="voice-style" className="mb-2 block">ხმის სტილი</Label>
                <MultiSelect
                  options={voiceStyleFilterOptions.length > 0 ? voiceStyleFilterOptions : VOICE_STYLE_OPTIONS}
                  selected={tempFilters.voiceStyles}
                  onChange={(values) => setTempFilters(prev => ({ ...prev, voiceStyles: values }))}
                  placeholder="აირჩიეთ სტილი"
                />
              </div>

              {/* Language Filter - Multi-select */}
              <div>
                <Label htmlFor="language" className="mb-2 block">ენა</Label>
                <MultiSelect
                  options={languageFilterOptions.length > 0 ? languageFilterOptions : LANGUAGE_OPTIONS}
                  selected={tempFilters.languages}
                  onChange={(values) => setTempFilters(prev => ({ ...prev, languages: values }))}
                  placeholder="აირჩიეთ ენა"
                />
              </div>

              {/* Gender Filter - Multi-select */}
              <div>
                <Label htmlFor="gender" className="mb-2 block">სქესი</Label>
                <MultiSelect
                  options={GENDER_OPTIONS}
                  selected={tempFilters.genders}
                  onChange={(values) => setTempFilters(prev => ({ ...prev, genders: values }))}
                  placeholder="აირჩიეთ სქესი"
                />
              </div>

              {/* Audio Category Filter - Multi-select */}
              <div>
                <Label htmlFor="audio-category" className="mb-2 block">აუდიო კატეგორია</Label>
                <MultiSelect
                  options={audioCategoryFilterOptions.length > 0 ? audioCategoryFilterOptions : AUDIO_CATEGORIES}
                  selected={tempFilters.audioCategories}
                  onChange={(values) => setTempFilters(prev => ({ ...prev, audioCategories: values }))}
                  placeholder="აირჩიეთ კატეგორია"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={applyFilters}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <Search className="h-4 w-4 mr-2" />
                ფილტრაცია
              </Button>
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
