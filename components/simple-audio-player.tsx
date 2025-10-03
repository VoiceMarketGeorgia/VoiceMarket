"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleAudioPlayerProps {
  audioUrl: string
  playerId: string
  isPlaying: boolean
  onTogglePlay: (playerId: string) => void
  sampleName: string
  sampleIcon: React.ReactNode
  category?: string
}

export function SimpleAudioPlayer({
  audioUrl,
  playerId,
  isPlaying,
  onTogglePlay,
  sampleName,
  sampleIcon,
  category
}: SimpleAudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Function to load audio lazily when play button is clicked
  const loadAudio = async () => {
    if (isAudioLoaded || isLoadingAudio) return
    
    setIsLoadingAudio(true)
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current
      audio.src = audioUrl
      audio.loop = false
      audio.preload = 'metadata'

      const updateCurrentTime = () => setCurrentTime(audio.currentTime)
      const setAudioData = () => {
        setDuration(audio.duration)
        setCurrentTime(audio.currentTime)
        setIsAudioLoaded(true)
        setIsLoadingAudio(false)
      }

      const handleError = () => {
        console.error('Error loading audio:', audioUrl)
        setIsLoadingAudio(false)
      }

      audio.addEventListener("timeupdate", updateCurrentTime)
      audio.addEventListener("loadedmetadata", setAudioData)
      audio.addEventListener("error", handleError)

      // Load the audio
      await audio.load()
      
    } catch (error) {
      console.error('Error loading audio:', error)
      setIsLoadingAudio(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioLoaded) return

    if (isPlaying) audio.play().catch(console.error)
    else audio.pause()
  }, [isPlaying, isAudioLoaded])

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  const togglePlayPause = async () => {
    // Load audio first if not loaded
    if (!isAudioLoaded && !isLoadingAudio) {
      await loadAudio()
      // Wait a bit for audio to be ready
      setTimeout(() => {
        onTogglePlay(playerId)
      }, 100)
    } else {
      onTogglePlay(playerId)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {/* Sample Info */}
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-orange-500/10 p-3 text-orange-500 flex-shrink-0">
          {sampleIcon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-xl leading-tight">{sampleName}</h3>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          disabled={isLoadingAudio}
          className={`w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
            isLoadingAudio ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoadingAudio ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-muted rounded-full overflow-hidden flex-1">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${isAudioLoaded ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="text-xs text-gray-500 dark:text-muted-foreground font-mono whitespace-nowrap flex-shrink-0">
          {isAudioLoaded ? (
            `${formatTime(currentTime)} / ${formatTime(duration)}`
          ) : (
            '0:00 / 0:00'
          )}
        </div>
      </div>
    </div>
  )
}
