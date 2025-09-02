"use client";

import { useState } from "react";
import { VoiceCard, AudioSample } from "./voice-card";
import { Mic2, Headphones, BookOpen } from "lucide-react";

export function FeaturedTalents() {
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

    return {
      id,
      name: `Actor ${id}`,
      image: `/photos/${id}.jpg`,
      samples,
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.8,
      reviews: 100 + i * 10,
      languages: ["English"],
      tags: ["Commercial", "Narration"],
    };
  });

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
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
              talent={talent}
              currentlyPlayingId={currentlyPlayingId}
              onTogglePlay={handleTogglePlay}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="rounded-full px-8 py-3 border border-gray-300 dark:border-border bg-white dark:bg-card text-gray-700 dark:text-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
            იხილეთ ყველა მსახიობი
          </button>
        </div>
      </div>
    </div>
  );
}
