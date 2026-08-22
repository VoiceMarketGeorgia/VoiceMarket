"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VoiceCard, type AudioSample, type Talent } from "./voice-card";
import {
  getAllAudioCategories,
  getAllVoiceActors,
  convertToTalent,
} from "@/lib/supabase-queries";
import { useLanguage } from "@/components/language-provider";
import {
  buildAudioCategoryMap,
  getCategoryIconName,
  getIconElement,
} from "@/lib/category-icons";

export function FeaturedTalents() {
  const router = useRouter();
  const { tr } = useLanguage();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTalents() {
      try {
        setLoading(true);
        setError(false);
        const [actors, audioCategories] = await Promise.all([
          getAllVoiceActors(),
          getAllAudioCategories(),
        ]);
        const categoryIconMap = buildAudioCategoryMap(audioCategories);
        const converted = actors.slice(0, 4).map((actor) => {
          const talent = convertToTalent(actor, categoryIconMap);
          return {
            id: talent.id,
            name: talent.name,
            image: talent.image,
            gradient: talent.gradient,
            pricing: talent.pricing,
            samples: talent.samples.map((sample: AudioSample) => ({
              ...sample,
              icon: getIconElement(
                getCategoryIconName(sample.category, sample.iconName),
                { className: "h-4 w-4" }
              ),
            })),
          };
        });
        setTalents(converted);
      } catch (loadError) {
        console.error("Error loading featured talents:", loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTalents();
  }, []);

  return (
    <section className="bg-white px-4 py-12 dark:bg-background">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-foreground">
          {tr("ჩვენი მსახიობები", "Our voice actors")}
        </h2>

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        )}

        {error && (
          <p className="py-12 text-center text-red-500">
            {tr("მსახიობების ჩატვირთვა ვერ მოხერხდა.", "We could not load the voice actors.")}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {talents.map((talent) => (
                <VoiceCard
                  key={talent.id}
                  talent={talent}
                  currentlyPlayingId={currentlyPlayingId}
                  onTogglePlay={(playerId) =>
                    setCurrentlyPlayingId((currentId) =>
                      currentId === playerId ? null : playerId
                    )
                  }
                  onClick={() => router.push(`/talents/${talent.id}`)}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/talents"
                className="inline-flex rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 shadow-md transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-lg dark:border-border dark:bg-card dark:text-foreground"
              >
                {tr("იხილეთ ყველა მსახიობი", "View all voice actors")}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
