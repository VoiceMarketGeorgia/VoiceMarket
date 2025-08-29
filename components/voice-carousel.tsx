"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceTalent {
  id: string
  name: string
  image: string
  samples: { id: string; name: string; url: string }[]
}

export function VoiceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeAudio, setActiveAudio] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const talents: VoiceTalent[] = [
    {
      id: "01",
      name: "Alex Morgan",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample1", name: "Commercial Demo", url: "#" },
        { id: "sample2", name: "Narration Demo", url: "#" },
      ],
    },
    {
      id: "02",
      name: "Sophia Chen",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample3", name: "Commercial Demo", url: "#" },
        { id: "sample4", name: "Narration Demo", url: "#" },
      ],
    },
    {
      id: "03",
      name: "Michael Davis",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample5", name: "Commercial Demo", url: "#" },
        { id: "sample6", name: "Narration Demo", url: "#" },
      ],
    },
    {
      id: "04",
      name: "Emma Wilson",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample7", name: "Commercial Demo", url: "#" },
        { id: "sample8", name: "Narration Demo", url: "#" },
      ],
    },
  ]

  const nextSlide = () => {
    setActiveAudio(null)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % talents.length)
  }

  const prevSlide = () => {
    setActiveAudio(null)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + talents.length) % talents.length)
  }

  const toggleAudio = (sampleId: string) => {
    if (activeAudio === sampleId) {
      setActiveAudio(null)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      setActiveAudio(sampleId)
      if (audioRef.current) {
        audioRef.current.src = talents[currentIndex].samples.find((s) => s.id === sampleId)?.url || ""
        audioRef.current.play()
      }
    }
  }

  // Stop audio when changing slides
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setActiveAudio(null)
    }
  }, [currentIndex])

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 p-8">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Voice Talents</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="relative h-[500px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <Image
                    src={talents[currentIndex].image || "/placeholder.svg"}
                    alt={talents[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 z-20 p-6">
                    <div className="text-6xl font-bold text-white">{talents[currentIndex].id}</div>
                    <h3 className="text-2xl font-semibold text-white mt-2">{talents[currentIndex].name}</h3>
                  </div>
                </div>

                <Card className="h-full flex flex-col">
                  <CardContent className="flex-1 p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-6">Voice Samples</h3>
                    <div className="space-y-6">
                      {talents[currentIndex].samples.map((sample) => (
                        <div key={sample.id} className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => toggleAudio(sample.id)}
                          >
                            {activeAudio === sample.id ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          <div>
                            <h4 className="font-medium">{sample.name}</h4>
                            <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
                              {activeAudio === sample.id && (
                                <motion.div
                                  className="h-full bg-orange-500"
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 30, ease: "linear" }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="mt-8 bg-orange-500 hover:bg-orange-600">View Full Profile</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <audio ref={audioRef} className="hidden" />

        <div className="mt-4 flex justify-center">
          {talents.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`mx-1 h-2 w-2 rounded-full ${index === currentIndex ? "bg-orange-500" : "bg-muted"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
