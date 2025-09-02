import { Star, Headphones, Mic2, BookOpen, GraduationCap } from "lucide-react";
import CardAudioPlayer from "./card-audio-player";

export interface AudioSample {
  id: string;
  name: string;
  icon: JSX.Element;
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
  languages: string[];
  tags: string[];
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
  return (
    <div
      key={talent.id}
      className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div
        onClick={onClick}
        className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${talent.gradient} ${
          onClick ? 'cursor-pointer hover:opacity-90 transition-opacity duration-200' : ''
        }`}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <img
          src={talent.image}
          alt={talent.id}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 z-20 p-4">
          <div className="text-3xl font-bold text-white mb-1">
            {talent.id.padStart(2, "0")}
          </div>
          {/* <h3 className="text-white font-semibold text-lg mb-2">
            {talent.name}
          </h3> */}

          <div className="flex flex-wrap gap-1">
            {talent.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
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
