"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, RefreshCw, X } from "lucide-react";
import { VoiceCard, type ActorPricing, type AudioSample } from "./voice-card";
import { Button } from "@/components/ui/button";
import {
  getAllAudioCategories,
  getAllVoiceActors,
  convertToTalent,
} from "@/lib/supabase-queries";
import {
  buildAudioCategoryMap,
  getCategoryIconName,
  getIconElement,
} from "@/lib/category-icons";
import { useLanguage } from "@/components/language-provider";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  TALENT_GENDER_OPTIONS,
  TALENT_LANGUAGE_OPTIONS,
  localizeTalentOptions,
} from "@/lib/talent-options";

interface TalentWithDuration {
  id: string;
  name: string;
  image: string;
  samples: AudioSample[];
  gradient: string;
  pricing: ActorPricing;
  languages: string[];
  gender: string;
}

export function AllTalents() {
  const router = useRouter();
  const { language, tr } = useLanguage();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [talents, setTalents] = useState<TalentWithDuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    languages: [] as string[],
    genders: [] as string[],
  });
  const [appliedFilters, setAppliedFilters] = useState({
    languages: [] as string[],
    genders: [] as string[],
  });

  const languageOptions = useMemo(
    () => localizeTalentOptions(TALENT_LANGUAGE_OPTIONS, language),
    [language]
  );
  const genderOptions = useMemo(
    () => localizeTalentOptions(TALENT_GENDER_OPTIONS, language),
    [language]
  );

  const loadTalents = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const [actors, audioCategories] = await Promise.all([
        getAllVoiceActors(),
        getAllAudioCategories(),
      ]);
      const categoryIconMap = buildAudioCategoryMap(audioCategories);
      const convertedTalents = actors.map((actor) => {
        const talent = convertToTalent(actor, categoryIconMap);

        return {
          id: talent.id,
          name: talent.name,
          image: talent.image,
          gradient: talent.gradient,
          pricing: talent.pricing,
          languages: talent.languages || [],
          gender: talent.gender || "Male",
          samples: talent.samples.map((sample: AudioSample) => ({
            ...sample,
            icon: getIconElement(
              getCategoryIconName(sample.category, sample.iconName),
              { className: "h-4 w-4" }
            ),
          })),
        };
      });

      setTalents(convertedTalents);
    } catch (loadError) {
      console.error("Error loading voice actors:", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTalents();
  }, [loadTalents]);

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId((currentId) =>
      currentId === playerId ? null : playerId
    );
  };

  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      const matchesLanguage =
        appliedFilters.languages.length === 0 ||
        appliedFilters.languages.some((selectedLanguage) =>
          talent.languages.some(
            (actorLanguage) =>
              actorLanguage.toLowerCase() === selectedLanguage.toLowerCase()
          )
        );
      const matchesGender =
        appliedFilters.genders.length === 0 ||
        appliedFilters.genders.some(
          (selectedGender) =>
            talent.gender.toLowerCase() === selectedGender.toLowerCase()
        );

      return matchesLanguage && matchesGender;
    });
  }, [talents, appliedFilters]);

  const resetFilters = () => {
    const emptyFilters = { languages: [] as string[], genders: [] as string[] };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const activeFilterCount =
    appliedFilters.languages.length + appliedFilters.genders.length;

  if (loading) {
    return (
      <section className="container py-12" aria-busy="true">
        <div className="mb-8 space-y-2">
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-background">
      <div className="container py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-foreground">
              {tr("ჩვენი მსახიობები", "Our voice actors")}
            </h1>
            {!error && (
              <p className="text-gray-600 dark:text-muted-foreground">
                {tr(
                  `${filteredTalents.length} მსახიობი მოიძებნა`,
                  `${filteredTalents.length} voice ${filteredTalents.length === 1 ? "actor" : "actors"} found`
                )}
              </p>
            )}
          </div>
          {!error && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters((isOpen) => !isOpen)}
              className="self-start border-orange-500/70 md:self-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {tr("ფილტრები", "Filters")}
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {showFilters && !error && (
          <div className="mb-8 rounded-xl border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{tr("ფილტრები", "Filters")}</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                aria-label={tr("ფილტრების დახურვა", "Close filters")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label className="mb-2 block">{tr("ენა", "Language")}</Label>
                <MultiSelect
                  options={languageOptions}
                  selected={tempFilters.languages}
                  onChange={(languages) =>
                    setTempFilters((filters) => ({ ...filters, languages }))
                  }
                  placeholder={tr("აირჩიეთ ენა", "Choose language")}
                  searchPlaceholder={tr("ენის ძებნა...", "Search languages...")}
                  emptyMessage={tr("ენა ვერ მოიძებნა.", "No language found.")}
                  moreLabel={tr("მეტი", "more")}
                />
              </div>
              <div>
                <Label className="mb-2 block">{tr("სქესი", "Gender")}</Label>
                <MultiSelect
                  options={genderOptions}
                  selected={tempFilters.genders}
                  onChange={(genders) =>
                    setTempFilters((filters) => ({ ...filters, genders }))
                  }
                  placeholder={tr("აირჩიეთ სქესი", "Choose gender")}
                  searchPlaceholder={tr("სქესის ძებნა...", "Search genders...")}
                  emptyMessage={tr("შედეგი ვერ მოიძებნა.", "No result found.")}
                  moreLabel={tr("მეტი", "more")}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => setAppliedFilters({
                  languages: [...tempFilters.languages],
                  genders: [...tempFilters.genders],
                })}
                className="bg-orange-500 hover:bg-orange-600 sm:flex-1"
              >
                {tr("ფილტრაცია", "Apply filters")}
              </Button>
              <Button type="button" variant="outline" onClick={resetFilters} className="sm:flex-1">
                {tr("გასუფთავება", "Clear")}
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="mb-4 text-muted-foreground">
              {tr(
                "მსახიობების ჩატვირთვა ვერ მოხერხდა.",
                "We could not load the voice actors."
              )}
            </p>
            <Button onClick={loadTalents} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {tr("ხელახლა ცდა", "Try again")}
            </Button>
          </div>
        ) : talents.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
            {tr("მსახიობები ჯერ არ დამატებულა.", "No voice actors have been added yet.")}
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="text-muted-foreground">
              {tr("არჩეული ფილტრებით მსახიობი ვერ მოიძებნა.", "No voice actors match the selected filters.")}
            </p>
            <Button type="button" variant="outline" onClick={resetFilters} className="mt-4">
              {tr("ფილტრების გასუფთავება", "Clear filters")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTalents.map((talent) => (
              <VoiceCard
                key={talent.id}
                talent={talent}
                currentlyPlayingId={currentlyPlayingId}
                onTogglePlay={handleTogglePlay}
                onClick={() => router.push(`/talents/${talent.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
