"use client";

import { useState } from "react";
import { VoiceCard, AudioSample, ActorPricing, Talent } from "./voice-card";
import { Mic2, Headphones, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function FeaturedTalents() {
  const router = useRouter();
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const actorsCount = 4;

  // Number of samples per actor
  const samplesPerActor = [3, 2, 2, 3];

  const sampleNames = [
    { name: "სარეკლამო რგოლი", icon: <Mic2 className="h-4 w-4" /> },
    { name: "ავტომოპასუხე", icon: <Headphones className="h-4 w-4" /> },
    { name: "მხატვრული", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const talents = Array.from({ length: actorsCount }, (_, i) => {
    const id = `${i + 1}`;
    const audiosFolder = `/audios/${id}`;

    const samples: AudioSample[] = [];

    const count = samplesPerActor[i] || 0; // number of audios for this actor

    for (let idx = 0; idx < count; idx++) {
      samples.push({
        id: `${id}-${idx + 1}`,
        name: sampleNames[idx].name,
        url: `${audiosFolder}/${id}.${idx + 1}.wav`,
        icon: sampleNames[idx].icon,
      });
    }

    // Generate pricing for featured actors
    const pricing: ActorPricing = {
      basePrice: 40 + i * 10,
      pricePerWord: 0.08 + i * 0.02,
      expressDeliveryFee: 30 + i * 5,
      backgroundMusicFee: 20 + i * 5,
      soundEffectsFee: 25 + i * 5,
      revisionFee: 12 + i * 3,
      isFixedPrice: i === 2, // Only actor 3 has fixed price in featured
      fixedPriceAmount: i === 2 ? 200 : undefined,
      minOrder: 30 + i * 5,
    };

    return {
      id,
      name: `Actor ${id}`,
      image: `/photos/${id}.jpg`,
      samples,
      gradient: "from-orange-500 to-cyan-600",
      languages: ["English"],
      tags: ["Commercial", "Narration"],
      pricing,
    };
  });

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
      </div>
    </div>
  );
}
