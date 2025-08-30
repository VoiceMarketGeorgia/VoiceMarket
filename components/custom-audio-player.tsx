import { useState, useRef, useEffect, ChangeEvent } from "react";

interface AudioPlayerProps {
  audioSrc: string;
  audioTitle: string;
  audioArtist: string;
}

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  audioTitle,
  audioArtist,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", setAudioData);

    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = audioSrc;
    audio.load();
    setCurrentTime(0);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioSrc]);

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newTime = (Number(event.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const PlayIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 fill-current text-white"
      viewBox="0 0 24 24"
      style={{ transform: "translateX(1px)" }}
    >
      <path d="M3 22v-20l18 10-18 10z" />
    </svg>
  );

  const PauseIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 fill-current text-white"
      viewBox="0 0 24 24"
    >
      <path d="M6 22h4v-20h-4v20zm8-20v20h4v-20h-4z" />
    </svg>
  );

  return (
    <div className="fixed left-4 bottom-4 z-10">
      <div
        className="w-64 h-20 bg-[#000]/[.3] rounded relative flex items-center p-4"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        }}
      >
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="text-white text-base font-semibold">
                {audioTitle}
              </div>
              <div className="text-gray-500 text-sm">{audioArtist}</div>
            </div>
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 items-center justify-center flex rounded-full bg-gray-500"
              style={{ border: "1px #ffffff solid" }}
            >
              {isPlaying ? PauseIcon : PlayIcon}
            </button>
          </div>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gray-500"
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
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
