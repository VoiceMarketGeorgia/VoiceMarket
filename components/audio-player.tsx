"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AudioPlayerProps {
  audioUrl: string
  showWaveform?: boolean
}

export function AudioPlayer({ audioUrl, showWaveform = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isVolumeOpen, setIsVolumeOpen] = useState(false)
  const [waveform, setWaveform] = useState<number[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnded)

    // Set volume
    audio.volume = volume[0] / 100

    // Generate waveform
    generateWaveform()

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [volume])

  const generateWaveform = () => {
    const bars = 40
    const waveformData = []

    for (let i = 0; i < bars; i++) {
      // Generate a more natural looking waveform with higher values in the middle
      const position = i / bars
      const amplitude = Math.sin(position * Math.PI)
      const height = 20 + amplitude * 60 + Math.random() * 20
      waveformData.push(height)
    }

    setWaveform(waveformData)
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      cancelAnimationFrame(animationRef.current!)
    } else {
      audioRef.current.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    setIsPlaying(!isPlaying)
  }

  const whilePlaying = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    cancelAnimationFrame(animationRef.current!)
  }

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])

    if (!isPlaying) {
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return

    audioRef.current.volume = value[0] / 100
    setVolume(value)
  }

  const skipBackward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    setCurrentTime(audioRef.current.currentTime)
  }

  const skipForward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    setCurrentTime(audioRef.current.currentTime)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getVolumeIcon = () => {
    if (volume[0] === 0) return <VolumeX className="h-4 w-4" />
    if (volume[0] < 50) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  return (
    <div className="rounded-lg border p-4 bg-muted/30 shadow-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {showWaveform && (
        <div className="relative h-16 mb-2 overflow-hidden rounded-md">
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {waveform.map((height, index) => {
              const progress = (currentTime / duration) * 100
              const position = (index / waveform.length) * 100
              const isActive = position <= progress

              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.01 }}
                  className={`w-1.5 rounded-full ${isActive ? "bg-orange-500" : "bg-muted-foreground/30"}`}
                  style={{
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              )
            })}
          </div>

          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.01}
            onValueChange={(value) => handleTimeChange(value)}
            className="absolute inset-0 z-10 opacity-0"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={skipBackward}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full ${isPlaying ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={skipForward}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsVolumeOpen(!isVolumeOpen)}
          >
            {getVolumeIcon()}
          </Button>

          <AnimatePresence>
            {isVolumeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 w-32 rounded-lg border bg-background p-3 shadow-md"
              >
                <Slider value={volume} max={100} step={1} onValueChange={handleVolumeChange} className="my-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
