import { useState, useRef, useEffect, ChangeEvent } from "react";

interface AudioPlayerProps {
  audioSrc: string;
  audioTitle?: string;
  audioArtist?: string;
  playerId: string;
  isPlaying: boolean;
  onTogglePlay: (playerId: string) => void;
  className?: string;
  showTimeDisplay?: boolean;
  showTextInfo?: boolean;
}

const CardAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  audioTitle,
  audioArtist,
  playerId,
  isPlaying,
  onTogglePlay,
  className = "",
  showTimeDisplay = true,
  showTextInfo = true,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.src = audioSrc;
    audio.loop = true;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", setAudioData);

    // Load the audio
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying]);

  const togglePlayPause = () => onTogglePlay(playerId);

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
      className={`bg-white rounded-xl shadow-lg p-4 border border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 flex-shrink-0"
        >
          {isPlaying ? PauseIcon : PlayIcon}
        </button>

        {/* Audio Info (Optional) */}
        {showTextInfo && (
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold text-lg truncate">
              {audioTitle}
            </h3>
            <p className="text-gray-600 text-sm truncate">{audioArtist}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div
          className={`relative h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 ${
            showTextInfo ? "w-24" : "flex-1"
          }`}
        >
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Time Display (Optional) */}
        {showTimeDisplay && (
          <div className="text-xs text-gray-500 font-mono whitespace-nowrap flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardAudioPlayer;

// // Demo usage
// const App = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-2xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Audio Player Cards
//         </h1>

//         {/* Full player with text and time */}
//         <CardAudioPlayer
//           audioSrc="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
//           audioTitle="Peaceful Meditation"
//           audioArtist="Zen Master"
//           showTextInfo={true}
//           showTimeDisplay={true}
//         />

//         {/* Player without time display */}
//         <CardAudioPlayer
//           audioSrc="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
//           audioTitle="Morning Coffee Jazz"
//           audioArtist="The Smooth Collective"
//           showTextInfo={true}
//           showTimeDisplay={false}
//         />

//         {/* Minimal player - ONLY PLAY and PROGRESS BAR */}
//         <CardAudioPlayer
//           audioSrc="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
//           audioTitle="Focus Beats"
//           audioArtist="Productivity Sounds"
//           showTextInfo={false}
//           showTimeDisplay={false}
//         />

//         {/* Player with time but no text info */}
//         <CardAudioPlayer
//           audioSrc="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
//           audioTitle="Ambient Sounds"
//           audioArtist="Nature Collection"
//           showTextInfo={false}
//           showTimeDisplay={true}
//         />
//       </div>
//     </div>
//   );
// };
