"use client";

import { useState, useEffect } from "react";
import { VoiceCard, AudioSample, Talent } from "./voice-card";
import { Mic2, Headphones, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllVoiceActors, convertToTalent } from "@/lib/supabase-queries";

export function FeaturedTalents() {
  const router = useRouter();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load talents from Supabase
  useEffect(() => {
    async function loadTalents() {
      try {
        setLoading(true);
        const voiceActors = await getAllVoiceActors();
        
        // Take only the first 4 actors for featured section
        const featuredActors = voiceActors.slice(0, 4);
        
        const talentsData: Talent[] = featuredActors.map(actor => {
          const talent = convertToTalent(actor);
          
          // Add proper icons to samples
          const samplesWithIcons = talent.samples.map((sample: any) => ({
            ...sample,
            icon: getSampleIcon(sample.name)
          }));

          return {
            ...talent,
            samples: samplesWithIcons,
          };
        });

        setTalents(talentsData);
        setError(null);
      } catch (err) {
        console.error('Error loading featured talents:', err);
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

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  const handleCardClick = (talentId: string) => {
    router.push(`/talents/${talentId}`);
  };

  return (
    <div className=" bg-white dark:bg-background p-4 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-foreground">
ჩვენი მსახიობები
        </h1>

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
          </div>
        )}

        {/* Talents Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {talents.map((talent) => (
                <VoiceCard
                  key={talent.id}
                  talent={talent as Talent}
                  currentlyPlayingId={currentlyPlayingId}
                  onTogglePlay={handleTogglePlay}
                  onClick={() => handleCardClick(talent.id)}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/talents">
                <button className="rounded-full px-8 py-3 border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
იხილეთ ყველა მსახიობი
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
