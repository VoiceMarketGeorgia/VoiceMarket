"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { ChevronDown } from "lucide-react";

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
  const [selectedSample, setSelectedSample] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const audioPlayerRef = useRef<AudioPlayer>(null);

  const currentSample = audioSamples[selectedSample];

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
  };

  // Audio event handlers
  const handleCanPlay = () => {
    setIsAudioLoaded(true);
    setIsLoadingAudio(false);
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

  return (
    <>
      <style jsx global>{`
        /* Hide the H5 player completely - we'll use custom controls */
        .custom-audio-player {
          display: none !important;
        }
      `}</style>

      <div
        className={`bg-white dark:bg-card rounded-xl shadow-lg pl-0 pr-4 pt-4 pb-4 ${className}`}
      >
       
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
          <div
            className="relative h-2 bg-gray-200 dark:bg-muted rounded-full overflow-hidden flex-1 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200 pointer-events-none"
              style={{ width: `${progress}%` }}
            />
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
