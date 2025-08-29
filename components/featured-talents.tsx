"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayButton } from "@/components/audio-play-button"
import { Star, Headphones, Mic2, BookOpen } from "lucide-react"

export function FeaturedTalents() {
  const [activeAudio, setActiveAudio] = useState<string | null>(null)

  const talents = [
    {
      id: "01",
      name: "Alex Morgan",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample1", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample2", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample3", name: "Character", icon: <BookOpen className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.9,
      reviews: 124,
      languages: ["English", "Spanish"],
      tags: ["Commercial", "Narration"],
    },
    {
      id: "02",
      name: "Sophia Chen",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample4", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample5", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.8,
      reviews: 98,
      languages: ["English", "Mandarin"],
      tags: ["Commercial", "E-Learning"],
    },
    {
      id: "03",
      name: "Michael Davis",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample6", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample7", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.7,
      reviews: 87,
      languages: ["English"],
      tags: ["Audiobook", "Narration"],
    },
    {
      id: "04",
      name: "Emma Wilson",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample8", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample9", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 5.0,
      reviews: 156,
      languages: ["English", "French"],
      tags: ["Animation", "Character"],
    },
  ]

  const toggleAudio = (sampleId: string) => {
    if (activeAudio === sampleId) {
      setActiveAudio(null)
    } else {
      setActiveAudio(sampleId)
    }
  }

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Voice Talents</h2>
        <p className="mt-4 text-muted-foreground">Listen to samples from our top professional voice actors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {talents.map((talent) => (
          <Card
            key={talent.id}
            className="group overflow-hidden border-0 bg-transparent transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-0">
              <div className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-b ${talent.gradient}`}>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 z-20 p-6">
                  <div className="text-4xl font-bold text-white">{talent.id}</div>
                  <h3 className="text-xl font-semibold text-white mt-1">{talent.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                    <span className="text-sm text-white">{talent.rating}</span>
                    <span className="text-sm text-white/70">({talent.reviews})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {talent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex justify-center gap-3">
                  {talent.samples.map((sample) => (
                    <AudioPlayButton
                      key={sample.id}
                      isPlaying={activeAudio === sample.id}
                      onClick={() => toggleAudio(sample.id)}
                      icon={sample.icon}
                      tooltip={sample.name}
                    />
                  ))}
                </div>

                <Link href={`/talents/${talent.id}`} className="block w-full">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/talents">
          <Button
            variant="outline"
            className="rounded-full px-8 transition-all duration-300 hover:bg-orange-500 hover:text-white"
          >
            View All Voice Talents
          </Button>
        </Link>
      </div>
    </section>
  )
}
