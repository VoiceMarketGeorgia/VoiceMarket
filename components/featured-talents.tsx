"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayButton } from "@/components/audio-play-button";
import { Star, Headphones, Mic2, BookOpen, GraduationCap } from "lucide-react";
import CardAudioPlayer from "./card-audio-player";
import { VoiceCard } from "./voice-card";

export function FeaturedTalents() {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const talents = [
    {
      id: "01",
      name: "Alex Morgan",
      image:
        "https://voicemarket.ge/wp-content/uploads/2024/03/zura-400x450.jpg",
      samples: [
        {
          id: "commercial-1",
          name: "სარეკლამო",
          icon: <Mic2 className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
          id: "narration-1",
          name: "გახმოვანება",
          icon: <Headphones className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        {
          id: "character-1",
          name: "მხატვრული",
          icon: <BookOpen className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.9,
      reviews: 124,
      languages: ["English", "Spanish"],
      tags: ["კომერციული", "მხატვრული"],
    },
    {
      id: "02",
      name: "Sophia Chen",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b691?w=300&h=400&fit=crop&crop=face",
      samples: [
        {
          id: "commercial-2",
          name: "Commercial",
          icon: <Mic2 className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        },
        {
          id: "tutorial-2",
          name: "Tutorial",
          icon: <GraduationCap className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        },
        {
          id: "narration-2",
          name: "Narration",
          icon: <Headphones className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        },
      ],
      gradient: "from-purple-500 to-pink-600",
      rating: 4.8,
      reviews: 98,
      languages: ["English", "Mandarin"],
      tags: ["Commercial", "E-Learning"],
    },
    {
      id: "03",
      name: "Michael Davis",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
      samples: [
        {
          id: "commercial-3",
          name: "Commercial",
          icon: <Mic2 className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        },
        {
          id: "audiobook-3",
          name: "Audiobook",
          icon: <BookOpen className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        },
        {
          id: "narration-3",
          name: "Narration",
          icon: <Headphones className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        },
      ],
      gradient: "from-blue-500 to-teal-600",
      rating: 4.7,
      reviews: 87,
      languages: ["English"],
      tags: ["Audiobook", "Narration"],
    },
    {
      id: "04",
      name: "Emma Wilson",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
      samples: [
        {
          id: "commercial-4",
          name: "Commercial",
          icon: <Mic2 className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        },
        {
          id: "character-4",
          name: "Character",
          icon: <BookOpen className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        },
        {
          id: "tutorial-4",
          name: "Tutorial",
          icon: <GraduationCap className="h-4 w-4" />,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        },
      ],
      gradient: "from-green-500 to-emerald-600",
      rating: 5.0,
      reviews: 156,
      languages: ["English", "French"],
      tags: ["Animation", "Character"],
    },
  ];

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Featured Voice Talents
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
          <button className="rounded-full px-8 py-3 border border-gray-300 bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
            View All Voice Talents
          </button>
        </div>
      </div>
    </div>
  );
}
