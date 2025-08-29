"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayButton } from "@/components/audio-play-button"
import { Star, Mic2, Headphones, BookOpen, Filter, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TalentDirectory() {
  const [activeAudio, setActiveAudio] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("relevance")
  const [filteredTalents, setFilteredTalents] = useState<any[]>([])
  const [activeFilters, setActiveFilters] = useState<{
    languages: string[]
    categories: string[]
    gender: string | null
    priceRange: [number, number]
  }>({
    languages: [],
    categories: [],
    gender: null,
    priceRange: [0, 1000],
  })

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
      categories: ["Commercial", "Narration"],
      gender: "Male",
      price: 250,
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
      categories: ["Commercial", "E-Learning"],
      gender: "Female",
      price: 180,
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
      categories: ["Audiobook", "Narration"],
      gender: "Male",
      price: 150,
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
      categories: ["Animation", "Character"],
      gender: "Female",
      price: 300,
      tags: ["Animation", "Character"],
    },
    {
      id: "05",
      name: "James Lee",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample10", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample11", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.6,
      reviews: 72,
      languages: ["English", "Korean"],
      categories: ["Commercial", "E-Learning"],
      gender: "Male",
      price: 200,
      tags: ["Commercial", "E-Learning"],
    },
    {
      id: "06",
      name: "Olivia Brown",
      image: "/placeholder.svg?height=400&width=300",
      samples: [
        { id: "sample12", name: "Commercial", icon: <Mic2 className="h-4 w-4" />, url: "/demo-audio.mp3" },
        { id: "sample13", name: "Narration", icon: <Headphones className="h-4 w-4" />, url: "/demo-audio.mp3" },
      ],
      gradient: "from-orange-500 to-cyan-600",
      rating: 4.9,
      reviews: 108,
      languages: ["English"],
      categories: ["Animation", "Character"],
      gender: "Female",
      price: 280,
      tags: ["Animation", "Character"],
    },
  ]

  // Initialize filtered talents
  useEffect(() => {
    setFilteredTalents(talents)
  }, [])

  // Apply filters and sorting whenever they change
  useEffect(() => {
    let result = [...talents]

    // Filter by language
    if (activeFilters.languages.length > 0) {
      result = result.filter((talent) => activeFilters.languages.some((lang) => talent.languages.includes(lang)))
    }

    // Filter by category
    if (activeFilters.categories.length > 0) {
      result = result.filter((talent) => activeFilters.categories.some((cat) => talent.categories.includes(cat)))
    }

    // Filter by gender
    if (activeFilters.gender) {
      result = result.filter((talent) => talent.gender === activeFilters.gender)
    }

    // Filter by price range
    result = result.filter(
      (talent) => talent.price >= activeFilters.priceRange[0] && talent.price <= activeFilters.priceRange[1],
    )

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews)
        break
      // relevance is default, no sorting needed
    }

    setFilteredTalents(result)
  }, [activeFilters, sortBy])

  const toggleAudio = (sampleId: string) => {
    if (activeAudio === sampleId) {
      setActiveAudio(null)
    } else {
      setActiveAudio(sampleId)
    }
  }

  const toggleLanguageFilter = (language: string) => {
    setActiveFilters((prev) => {
      const newLanguages = prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language]

      return {
        ...prev,
        languages: newLanguages,
      }
    })
  }

  const toggleCategoryFilter = (category: string) => {
    setActiveFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return {
        ...prev,
        categories: newCategories,
      }
    })
  }

  const setGenderFilter = (gender: string | null) => {
    setActiveFilters((prev) => ({
      ...prev,
      gender,
    }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      languages: [],
      categories: [],
      gender: null,
      priceRange: [0, 1000],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">{filteredTalents.length} Voice Talents Found</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.languages.length > 0 && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
                Languages: {activeFilters.languages.join(", ")}
              </Badge>
            )}
            {activeFilters.categories.length > 0 && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
                Categories: {activeFilters.categories.join(", ")}
              </Badge>
            )}
            {activeFilters.gender && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
                Gender: {activeFilters.gender}
              </Badge>
            )}
            {(activeFilters.languages.length > 0 || activeFilters.categories.length > 0 || activeFilters.gender) && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Languages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => toggleLanguageFilter("English")}>
                  <span className={activeFilters.languages.includes("English") ? "text-orange-500 font-medium" : ""}>
                    English
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguageFilter("Spanish")}>
                  <span className={activeFilters.languages.includes("Spanish") ? "text-orange-500 font-medium" : ""}>
                    Spanish
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguageFilter("French")}>
                  <span className={activeFilters.languages.includes("French") ? "text-orange-500 font-medium" : ""}>
                    French
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguageFilter("Mandarin")}>
                  <span className={activeFilters.languages.includes("Mandarin") ? "text-orange-500 font-medium" : ""}>
                    Mandarin
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguageFilter("Korean")}>
                  <span className={activeFilters.languages.includes("Korean") ? "text-orange-500 font-medium" : ""}>
                    Korean
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuLabel className="mt-2">Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("Commercial")}>
                  <span
                    className={activeFilters.categories.includes("Commercial") ? "text-orange-500 font-medium" : ""}
                  >
                    Commercial
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("Narration")}>
                  <span className={activeFilters.categories.includes("Narration") ? "text-orange-500 font-medium" : ""}>
                    Narration
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("Animation")}>
                  <span className={activeFilters.categories.includes("Animation") ? "text-orange-500 font-medium" : ""}>
                    Animation
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("Audiobook")}>
                  <span className={activeFilters.categories.includes("Audiobook") ? "text-orange-500 font-medium" : ""}>
                    Audiobook
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("E-Learning")}>
                  <span
                    className={activeFilters.categories.includes("E-Learning") ? "text-orange-500 font-medium" : ""}
                  >
                    E-Learning
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleCategoryFilter("Character")}>
                  <span className={activeFilters.categories.includes("Character") ? "text-orange-500 font-medium" : ""}>
                    Character
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuLabel className="mt-2">Gender</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setGenderFilter("Male")}>
                  <span className={activeFilters.gender === "Male" ? "text-orange-500 font-medium" : ""}>Male</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGenderFilter("Female")}>
                  <span className={activeFilters.gender === "Female" ? "text-orange-500 font-medium" : ""}>Female</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGenderFilter(null)}>
                  <span className={!activeFilters.gender ? "text-orange-500 font-medium" : ""}>All Genders</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating (High to Low)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent) => (
          <Card key={talent.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-0">
              <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-b ${talent.gradient}`}>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 z-20 p-6">
                  <div className="text-4xl font-bold text-white">{talent.id}</div>
                  <h3 className="text-xl font-semibold text-white mt-2">{talent.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                    <span className="text-sm text-white">{talent.rating}</span>
                    <span className="text-sm text-white/70">({talent.reviews})</span>
                  </div>
                  <div className="mt-2 text-sm text-white/90">{talent.languages.join(", ")}</div>
                  <div className="mt-1 text-sm font-medium text-white">${talent.price}/project</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {talent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
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

      {filteredTalents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No voice talents match your filters</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters to see more results</p>
          <Button onClick={clearAllFilters} className="mt-4 bg-orange-500 hover:bg-orange-600">
            Clear All Filters
          </Button>
        </div>
      )}

      {filteredTalents.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-orange-500 text-white hover:bg-orange-600">
              2
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              3
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              4
            </Button>
            <span className="mx-1">...</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              10
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
