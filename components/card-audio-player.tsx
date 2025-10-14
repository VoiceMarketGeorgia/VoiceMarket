import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  ChevronDown,
  Mic2,
  Headphones,
  BookOpen,
  GraduationCap,
  Star,
} from "lucide-react";

// Custom styles for the audio player
const customAudioPlayerStyles = `
  .custom-audio-player .rhap_container {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  
  .custom-audio-player .rhap_main-controls-button {
    background: white !important;
    border-radius: 50% !important;
    width: 48px !important;
    height: 48px !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border: none !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Make play/pause icon orange and large */
  .custom-audio-player .rhap_main-controls-button svg {
    fill: #f97316 !important;
    color: #f97316 !important;
    width: 100px !important;
    height: 100px !important;
  }
  
  .custom-audio-player .rhap_main-controls-button svg path {
    fill: #f97316 !important;
    color: #f97316 !important;
  }
  
  /* Ensure button stays white on hover */
  .custom-audio-player .rhap_main-controls-button:hover {
    background: white !important;
    transform: scale(1.05) !important;
    transition: transform 0.2s ease !important;
  }
  
  /* Make sure the triangle is orange */
  .custom-audio-player .rhap_main-controls-button svg polygon,
  .custom-audio-player .rhap_main-controls-button svg circle,
  .custom-audio-player .rhap_main-controls-button svg rect {
    fill: #f97316 !important;
    color: #f97316 !important;
  }
  
  .custom-audio-player .rhap_progress-filled {
    background: linear-gradient(to right, #fb923c, #f97316) !important;
  }
  
  .custom-audio-player .rhap_progress-indicator {
    background: linear-gradient(to right, #fb923c, #f97316) !important;
  }
  
  /* Hide time displays */
  .custom-audio-player .rhap_time {
    display: none !important;
  }
  
  /* Hide volume controls */
  .custom-audio-player .rhap_volume-container {
    display: none !important;
  }
  
  /* Hide repeat/loop button */
  .custom-audio-player .rhap_repeat-button {
    display: none !important;
  }
  
  /* Hide jump controls */
  .custom-audio-player .rhap_jump-button {
    display: none !important;
  }
  
  /* Hide download progress */
  .custom-audio-player .rhap_download-progress {
    display: none !important;
  }

  /* Remove margin and padding from all audio player elements */
  .custom-audio-player,
  .custom-audio-player *,
  .rhap_container,
  .rhap_container * {
    margin: 0, 0, 20px, 0 !important;
    padding: 0 !important;
  }

  /* Remove padding from controls section and its children */
  .custom-audio-player .rhap_controls-section,
  .custom-audio-player .rhap_controls-section * {
    margin: 0 !important;
  }
`;

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
  
  const currentSample = audioSamples[selectedSample];

  const handleSampleChange = (index: number) => {
    if (isPlaying) {
      onTogglePlay(playerId);
    }
    setSelectedSample(index);
    setIsDropdownOpen(false);
  };




  return (
    <>
      <style>{customAudioPlayerStyles}</style>
      <div className={`bg-white dark:bg-card rounded-xl shadow-lg p-4 ${className}`}>
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

      {/* Audio Player */}
      <AudioPlayer
        src={currentSample.url}
        autoPlay={false}
        loop={true}
        showJumpControls={false}
        showDownloadProgress={false}
        showFilledProgress={true}
        showFilledVolume={false}
        volume={0.8}
        layout="horizontal-reverse"
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
        className="custom-audio-player"
      />
    </div>
    </>
  );
};

export default CardAudioPlayer;
