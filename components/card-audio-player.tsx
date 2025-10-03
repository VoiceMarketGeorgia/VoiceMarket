import { useState, useRef, useEffect, ChangeEvent } from "react";

import {
  ChevronDown,
  Mic2,
  Headphones,
  BookOpen,
  GraduationCap,
  Star,
} from "lucide-react";

interface AudioSample {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
}

interface AudioPlayerProps {
  audioSamples: AudioSample[];
  playerId: string;
  isPlaying: boolean;
  onTogglePlay: (playerId: string) => void;
  className?: string;
  showTimeDisplay?: boolean;
}

const CardAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSamples,
  playerId,
  isPlaying,
  onTogglePlay,
  className = "",
  showTimeDisplay = true,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSample = audioSamples[selectedSample];

  // Function to load audio lazily when play button is clicked
  const loadAudio = async () => {
    if (isAudioLoaded || isLoadingAudio) return;
    
    setIsLoadingAudio(true);
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = currentSample.url;
      audio.loop = true;
      audio.preload = 'metadata';

      const updateCurrentTime = () => setCurrentTime(audio.currentTime);
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setIsAudioLoaded(true);
        setIsLoadingAudio(false);
      };

      const handleError = () => {
        console.error('Error loading audio:', currentSample.url);
        setIsLoadingAudio(false);
      };

      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("loadedmetadata", setAudioData);
      audio.addEventListener("error", handleError);

      // Load the audio
      await audio.load();
      
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioLoaded) return;

    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying, isAudioLoaded]);

  const togglePlayPause = async () => {
    // Load audio first if not loaded
    if (!isAudioLoaded && !isLoadingAudio) {
      await loadAudio();
      // Wait a bit for audio to be ready
      setTimeout(() => {
        onTogglePlay(playerId);
      }, 100);
    } else {
      onTogglePlay(playerId);
    }
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (Number(event.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSampleChange = (index: number) => {
    if (isPlaying) {
      onTogglePlay(playerId);
    }
    setSelectedSample(index);
    setIsDropdownOpen(false);
    // Reset audio loaded state when changing samples
    setIsAudioLoaded(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const PlayIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 fill-current"
      viewBox="0 0 24 24"
      style={{ transform: "translateX(1px)" }}
    >
      <path d="M3 22v-20l18 10-18 10z" />
    </svg>
  );

  const PauseIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M6 22h4v-20h-4v20zm8-20v20h4v-20h-4z" />
    </svg>
  );

  return (
    <div
      className={`bg-white dark:bg-card rounded-xl shadow-lg p-4 ${className}`}
    >
      {/* Category Dropdown */}
      <div className="relative mb-3">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-muted rounded-lg border border-gray-200 dark:border-border hover:bg-gray-100 dark:hover:bg-muted/80 transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="text-orange-500">{currentSample.icon}</span>
            <span className="font-medium text-gray-700 dark:text-foreground">
              {currentSample.name}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 dark:text-muted-foreground transition-transform duration-200 ${
              isDropdownOpen ? "rotate-0" : "-rotate-180"
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-lg z-[9999] overflow-hidden">
            {audioSamples.map((sample, index) => (
              <button
                key={sample.id}
                onClick={() => handleSampleChange(index)}
                className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors duration-150 ${
                  index === selectedSample
                    ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-foreground"
                }`}
              >
                <span
                  className={
                    index === selectedSample
                      ? "text-orange-500 dark:text-orange-400"
                      : "text-gray-400 dark:text-muted-foreground"
                  }
                >
                  {sample.icon}
                </span>
                <span className="font-medium">{sample.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Audio Player Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoadingAudio}
          className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 flex-shrink-0 ${
            isLoadingAudio ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoadingAudio ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            PauseIcon
          ) : (
            PlayIcon
          )}
        </button>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-muted rounded-full overflow-hidden flex-1">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${isAudioLoaded ? (currentTime / duration) * 100 : 0}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={isAudioLoaded ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
            disabled={!isAudioLoaded}
            className={`absolute top-0 left-0 w-full h-full opacity-0 ${
              isAudioLoaded ? 'cursor-pointer' : 'cursor-not-allowed'
            }`}
          />
        </div>

        {/* Time Display */}
        {showTimeDisplay && (
          <div className="text-xs text-gray-500 dark:text-muted-foreground font-mono whitespace-nowrap flex-shrink-0">
            {isAudioLoaded ? (
              `${formatTime(currentTime)} / ${formatTime(duration)}`
            ) : (
              '0:00 / 0:00'
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CardAudioPlayer;
