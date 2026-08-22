"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { localizeAudioName } from "@/lib/audio-labels";
import { getIconElement } from "@/lib/category-icons";

interface AudioSample {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconName?: string; // Dynamic icon name from database
  url: string;
}

interface AudioPlayerProps {
  audioSamples: AudioSample[];
  playerId: string;
  isPlaying: boolean;
  onTogglePlay: (playerId: string) => void;
  className?: string;
  showTimeDisplay?: boolean;
  showDropdown?: boolean;
}

const CardAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSamples,
  playerId,
  isPlaying,
  onTogglePlay,
  className = "",
  showTimeDisplay = true,
  showDropdown = true,
}) => {
  const { language, tr } = useLanguage();
  const [selectedSample, setSelectedSample] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayerRef = useRef<AudioPlayer>(null);

  const currentSample = audioSamples[selectedSample];

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Lazy load audio function
  const loadAudio = async () => {
    if (isAudioLoaded || isLoadingAudio || audioSrc) return;

    setIsLoadingAudio(true);

    // Simulate loading and then set the source
    setTimeout(() => {
      setAudioSrc(currentSample.url);
      setIsLoadingAudio(false);
    }, 100);
  };

  // Toggle play/pause with lazy loading
  const togglePlayPause = async () => {
    if (!audioSrc && !isLoadingAudio) {
      // Load audio first if not loaded
      await loadAudio();
      setTimeout(() => {
        if (audioPlayerRef.current?.audio.current) {
          audioPlayerRef.current.audio.current.play();
        }
      }, 200);
    } else if (audioPlayerRef.current?.audio.current) {
      // Toggle play/pause
      if (audioPlayerRef.current.audio.current.paused) {
        audioPlayerRef.current.audio.current.play();
      } else {
        audioPlayerRef.current.audio.current.pause();
      }
    }
  };

  // Handle sample change
  const handleSampleChange = (index: number) => {
    // Stop current audio
    if (audioPlayerRef.current?.audio.current) {
      audioPlayerRef.current.audio.current.pause();
      audioPlayerRef.current.audio.current.currentTime = 0;
    }

    if (isPlaying) {
      onTogglePlay(playerId);
    }

    setSelectedSample(index);
    setIsDropdownOpen(false);

    // Reset audio loaded state when changing samples
    setIsAudioLoaded(false);
    setIsLoadingAudio(false);
    setAudioSrc("");
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  // Audio event handlers
  const handleCanPlay = () => {
    setIsAudioLoaded(true);
    setIsLoadingAudio(false);
    if (audioPlayerRef.current?.audio.current) {
      setDuration(audioPlayerRef.current.audio.current.duration);
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      onTogglePlay(playerId);
    }
  };

  const handlePlay = () => {
    if (!isPlaying) {
      onTogglePlay(playerId);
    }
  };

  const handleListen = () => {
    if (audioPlayerRef.current?.audio.current) {
      const audio = audioPlayerRef.current.audio.current;
      const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
      setProgress(progressPercent);
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    }
  };

  // Handle progress bar click to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioPlayerRef.current?.audio.current;
    if (!audio || !audioSrc) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));

    // Wait for audio to be ready
    if (audio.duration && !isNaN(audio.duration)) {
      const newTime = percentage * audio.duration;
      audio.currentTime = newTime;
      setProgress(percentage * 100);
    }
  };

  // Sync isPlaying state with audio
  useEffect(() => {
    const audio = audioPlayerRef.current?.audio.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  // Stop audio when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        onTogglePlay(playerId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, playerId, onTogglePlay]);

  if (!currentSample) {
    return (
      <div className={`rounded-xl bg-white p-4 text-center text-sm text-muted-foreground shadow-lg dark:bg-card ${className}`}>
        {tr("აუდიო ნიმუში ჯერ არ არის", "No audio sample yet")}
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Hide the H5 player completely - we'll use custom controls */
        .custom-audio-player {
          display: none !important;
        }
      `}</style>

      <div
        className={`bg-white dark:bg-card rounded-xl shadow-lg pl-2.5 pr-4 pt-4 pb-4 ${className}`}
      >
        {/* Category Dropdown */}
        {showDropdown && (
          <div className="relative mb-3">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-label={tr("აუდიო ნიმუშის არჩევა", "Choose an audio sample")}
              className="listen-gradient-button w-full rounded-xl px-4 py-3 shadow-md transition-[filter,box-shadow] duration-200 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3 text-left">
                  <span className="shrink-0 text-sm font-extrabold uppercase tracking-wide text-white drop-shadow-sm">
                    {tr("მოისმინე", "Listen")}
                  </span>
                  <span className="truncate border-l border-white/40 pl-3 text-sm font-medium text-white/95">
                    {localizeAudioName(currentSample.name, language)}
                  </span>
                </div>
                <span className="ml-2 rounded-full bg-black/20 p-1.5 text-white shadow-sm backdrop-blur-sm">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg shadow-lg z-[9999] overflow-hidden">
                {audioSamples.map((sample, index) => (
                  <button
                    type="button"
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
                      {sample.iconName
                        ? getIconElement(sample.iconName, { className: "h-5 w-5" })
                        : sample.icon}
                    </span>
                    <span className="font-medium">{localizeAudioName(sample.name, language)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audio Player Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            disabled={isLoadingAudio}
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 flex-shrink-0 ${
              isLoadingAudio ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoadingAudio ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M6 22h4v-20h-4v20zm8-20v20h4v-20h-4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                style={{ transform: "translateX(1px)" }}
              >
                <path d="M3 22v-20l18 10-18 10z" />
              </svg>
            )}
          </button>

          {/* Progress Bar */}
          <div className="flex-1">
            <div
              className="relative h-2 bg-gray-200 dark:bg-muted rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200 pointer-events-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Time Display */}
            {showTimeDisplay && (
              <div className="flex justify-between items-center mt-1.5 px-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {formatTime(currentTime)}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hidden H5 Audio Player for functionality */}
        <AudioPlayer
          ref={audioPlayerRef}
          src={audioSrc}
          autoPlay={false}
          loop={true}
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onListen={handleListen}
          className="custom-audio-player"
        />
      </div>
    </>
  );
};

export default CardAudioPlayer;
