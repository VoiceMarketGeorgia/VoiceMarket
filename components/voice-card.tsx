"use client";

import { Heart } from "lucide-react";
import CardAudioPlayer from "./card-audio-player";
import { useShortlist } from "@/hooks/use-shortlist";
import { useLanguage } from "@/components/language-provider";

export interface AudioSample {
  id: string;
  name: string;
  icon: JSX.Element;
  iconName?: string;
  category?: string | null;
  url: string;
}

export interface ActorPricing {
  basePrice: number; // Base price per word/syllable
  pricePerWord: number;
  expressDeliveryFee: number;
  backgroundMusicFee: number;
  soundEffectsFee: number;
  revisionFee: number;
  isFixedPrice: boolean; // Whether the actor charges a fixed price
  fixedPriceAmount?: number; // Fixed price if applicable
  minOrder: number; // Minimum order amount
}

export interface Talent {
  id: string;
  name: string;
  image: string;
  samples: AudioSample[];
  gradient: string;
  pricing: ActorPricing;
}

interface VoiceCardProps {
  talent: Talent;
  currentlyPlayingId: string | null;
  onTogglePlay: (playerId: string) => void;
  onClick?: () => void;
}

// Use the interface to type the props
export function VoiceCard({
  talent,
  currentlyPlayingId,
  onTogglePlay,
  onClick,
}: VoiceCardProps) {
  const { tr } = useLanguage();
  const { has, toggle } = useShortlist();
  const isMarked = has(talent.id);

  return (
    <div
      key={talent.id}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image Section */}
      <div
        onClick={onClick}
        className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${talent.gradient} ${
          onClick ? 'cursor-pointer hover:opacity-95 transition-opacity duration-200' : ''
        }`}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent dark:from-gray-900 dark:via-gray-900/30" />
        <img
          src={talent.image}
          alt={talent.id}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 z-20 p-5">
          <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {talent.id.padStart(2, "0")}
          </div>
        </div>

        {/* Mark this voice - stops propagation so it never opens the profile */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggle(talent.id);
          }}
          aria-pressed={isMarked}
          title={
            isMarked
              ? tr("კალათიდან ამოშლა", "Remove from selection")
              : tr("მოინიშნე ხმა", "Mark this voice")
          }
          aria-label={
            isMarked
              ? tr("კალათიდან ამოშლა", "Remove from selection")
              : tr("მოინიშნე ხმა", "Mark this voice")
          }
          className={`absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            isMarked
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Heart className={`h-5 w-5 ${isMarked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Audio Player Section */}
      <CardAudioPlayer
        audioSamples={talent.samples}
        playerId={talent.id}
        isPlaying={currentlyPlayingId === talent.id}
        onTogglePlay={onTogglePlay}
        showTimeDisplay={false}
        key={talent.id}
      />
    </div>
  );
}
