"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Play, Pause, Heart, X, User, Volume2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceTalent {
  id: string
  name: string
  image: string
  sample: string
  description: string
}

export function RandomVoiceFinder() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [currentTalent, setCurrentTalent] = useState<VoiceTalent | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sample voice talents data
  const voiceTalents: VoiceTalent[] = [
    {
      id: "01",
      name: "Alex Morgan",
      image: "/placeholder.svg?height=400&width=300",
      sample: "#", // In a real app, this would be a URL to an audio file
      description: "Warm, authoritative male voice perfect for commercials and corporate videos.",
    },
    {
      id: "02",
      name: "Sophia Chen",
      image: "/placeholder.svg?height=400&width=300",
      sample: "#",
      description: "Friendly, conversational female voice ideal for explainer videos and narration.",
    },
    {
      id: "03",
      name: "Michael Davis",
      image: "/placeholder.svg?height=400&width=300",
      sample: "#",
      description: "Deep, resonant male voice great for movie trailers and dramatic readings.",
    },
    {
      id: "04",
      name: "Emma Wilson",
      image: "/placeholder.svg?height=400&width=300",
      sample: "#",
      description: "Youthful, energetic female voice perfect for animation and character work.",
    },
    {
      id: "05",
      name: "James Lee",
      image: "/placeholder.svg?height=400&width=300",
      sample: "#",
      description: "Smooth, professional male voice suited for audiobooks and e-learning.",
    },
  ]

  const findRandomVoice = () => {
    setIsRevealed(false)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const randomIndex = Math.floor(Math.random() * voiceTalents.length)
    setCurrentTalent(voiceTalents[randomIndex])
    setIsOpen(true)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const revealTalent = () => {
    setIsRevealed(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setIsPlaying(false)
    setIsRevealed(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  return (
    <>
      <Button
        onClick={findRandomVoice}
        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 shadow-lg transition-all hover:shadow-orange-500/25"
      >
        <div className="relative z-10 flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          <span>Discover Random Voice</span>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
      </Button>

      <AnimatePresence>
        {isOpen && currentTalent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <Card className="overflow-hidden border-2 border-orange-500 shadow-xl">
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-white hover:bg-white/20"
                    onClick={closeModal}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-bold">Magic Voice Finder</h2>
                  <p className="text-sm opacity-90">Discover amazing voice talent randomly</p>
                </div>

                <CardContent className="p-6">
                  {!isRevealed ? (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative h-32 w-32 rounded-full bg-orange-500/10">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Volume2 className="h-16 w-16 text-orange-500" />
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-lg font-semibold">Mystery Voice #{currentTalent.id}</h3>
                        <p className="mt-2 text-muted-foreground">
                          Listen to this voice and see if it matches what you're looking for!
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                      </div>

                      <audio
                        ref={audioRef}
                        src={currentTalent.sample}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />

                      <div className="flex justify-center">
                        <Button onClick={revealTalent} className="bg-orange-500 hover:bg-orange-600">
                          <User className="mr-2 h-4 w-4" />
                          Reveal Voice Talent
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-orange-500">
                          <Image
                            src={currentTalent.image || "/placeholder.svg"}
                            alt={currentTalent.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-xl font-bold">{currentTalent.name}</h3>
                        <p className="mt-2 text-muted-foreground">{currentTalent.description}</p>
                      </div>

                      <div className="flex justify-center gap-3">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                      </div>

                      <div className="flex justify-center gap-3">
                        <Button variant="outline">
                          <Heart className="mr-2 h-4 w-4" />
                          Save to Favorites
                        </Button>
                        <Button className="bg-orange-500 hover:bg-orange-600">View Full Profile</Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
