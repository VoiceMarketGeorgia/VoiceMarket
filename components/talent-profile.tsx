"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  Share2,
  MessageCircle,
  Languages,
  Clock,
  DollarSign,
  ShoppingBag,
  ThumbsUp,
  Users,
  BarChart3,
  Calendar,
  Mic2,
  Headphones,
  BookOpen,
  FileText,
} from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"
import { ActorPricingCalculator } from "@/components/actor-pricing-calculator"
import { ActorPricing } from "@/components/voice-card"
import CardAudioPlayer from "@/components/card-audio-player"

interface TalentProfileProps {
  id: string
}

export function TalentProfile({ id }: TalentProfileProps) {
  const [activeTab, setActiveTab] = useState("demos")
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  // Generate real talent data based on the ID
  const generateTalentData = (actorId: string) => {
    const numId = parseInt(actorId);
    
    // Generate samples based on the same logic as AllTalents
    const samplesPerActor = [
      3, 2, 2, 2, 3, 3, 3, 3, 3, 3, // 1-10
      3, 3, 3, 3, 4, 3, 3, 3, 2, 3, // 11-20
      3, 4, 3, 3, 3, 3, 3, 2, 3, 2, // 21-30
      3, 2, 2, 3, 2, 2, 3, 3, 3, 4, // 31-40
      2, 2, 2, 2, 2, 3, 2, // 41-47
    ];

    const sampleNames = [
      { name: "სარეკლამო რგოლი", icon: <Mic2 className="h-5 w-5" /> },
      { name: "ავტომოპასუხე", icon: <Headphones className="h-5 w-5" /> },
      { name: "მხატვრული", icon: <BookOpen className="h-5 w-5" /> },
      { name: "დოკუმენტური", icon: <FileText className="h-5 w-5" /> },
    ];

    const samples = [];
    const count = samplesPerActor[numId - 1] || 2;
    
    for (let idx = 0; idx < count; idx++) {
      const sampleIndex = idx % sampleNames.length;
      samples.push({
        id: `${actorId}-${idx + 1}`,
        name: sampleNames[sampleIndex].name,
        category: sampleNames[sampleIndex].name,
        url: `/audios/${actorId}/${actorId}.${idx + 1}.wav`,
        icon: sampleNames[sampleIndex].icon,
        description: `Professional ${sampleNames[sampleIndex].name.toLowerCase()} voice sample.`,
      });
    }

    // Generate tags
    const actorTags = [];
    if (numId % 4 === 0) actorTags.push("Commercial");
    if (numId % 3 === 0) actorTags.push("Narration");
    if (numId % 5 === 0) actorTags.push("Documentary");
    if (numId % 7 === 0) actorTags.push("Character");
    if (numId % 6 === 0) actorTags.push("E-Learning");
    if (actorTags.length < 2) {
      actorTags.push("Commercial", "Narration");
    }

    // Generate individual pricing
    const isFixedPrice = Math.random() > 0.7;
    const pricing: ActorPricing = {
      basePrice: 30 + (numId * 3) % 50,
      pricePerWord: 0.05 + ((numId * 2) % 15) / 100,
      expressDeliveryFee: 25 + (numId * 5) % 35,
      backgroundMusicFee: 15 + (numId * 3) % 25,
      soundEffectsFee: 20 + (numId * 4) % 30,
      revisionFee: 10 + (numId * 2) % 15,
      isFixedPrice,
      fixedPriceAmount: isFixedPrice ? 100 + (numId * 10) % 300 : undefined,
      minOrder: 25 + (numId * 2) % 25,
    };

    return {
      id: actorId,
      name: `Actor ${actorId}`, // Remove name display as requested
      title: "Professional Voice Actor",
      image: `/photos/${actorId}.jpg`,
      coverImage: `/photos/${actorId}.jpg`, // Use same image for cover
      bio: `Professional voice actor with extensive experience in various voice-over projects. Specializes in ${actorTags.join(", ").toLowerCase()} work with a distinctive and engaging voice style.`,
      languages: ["Georgian", ...(numId % 3 === 0 ? ["English"] : [])],
      pricing,
      priceRange: pricing.isFixedPrice 
        ? `Fixed: $${pricing.fixedPriceAmount}` 
        : `$${pricing.basePrice}-${pricing.basePrice + 200}`,
      turnaround: "24-48 hours",
      categories: actorTags,
      samples,
    };
  };

  const talent = generateTalentData(id);

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  return (
    <div className="space-y-8">
      <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden rounded-xl">
        <Image src={talent.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10">
          <div className="flex items-end gap-6">
            <div className="relative h-[120px] w-[120px] md:h-[150px] md:w-[150px] overflow-hidden rounded-xl border-4 border-background">
              <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold">Actor #{talent.id}</h1>
              <p className="text-white/80">{talent.title}</p>
              {/* Removed rating system as requested */}
              <div className="flex flex-wrap gap-2 mt-3">
                {talent.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Languages</h3>
                    <p className="text-sm text-muted-foreground">{talent.languages.join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Turnaround Time</h3>
                    <p className="text-sm text-muted-foreground">{talent.turnaround}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Price Range</h3>
                    <p className="text-sm text-muted-foreground">{talent.priceRange}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Removed Performance Stats section as requested */}

          <div className="flex flex-col gap-3">
            {/* Removed Save, Hire, Performance Stats buttons as requested */}
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Actor
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{talent.bio}</p>
          </div>

          <Tabs defaultValue="demos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demos">Voice Demos</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="demos" className="space-y-6 pt-6">
              {talent.samples.map((sample, index) => (
                <Card key={sample.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">{sample.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{sample.name}</h3>
                        <p className="text-muted-foreground">{sample.description}</p>
                      </div>
                    </div>
                    {/* Use CardAudioPlayer for proper audio functionality */}
                    <CardAudioPlayer
                      audioSamples={[{
                        id: sample.id,
                        name: sample.name,
                        url: sample.url,
                        icon: sample.icon,
                      }]}
                      playerId={`profile-${sample.id}`}
                      isPlaying={currentlyPlayingId === `profile-${sample.id}`}
                      onTogglePlay={handleTogglePlay}
                      showTimeDisplay={true}
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pricing" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <ActorPricingCalculator pricing={talent.pricing} actorId={talent.id} />
                </CardContent>
              </Card>
            </TabsContent>


          </Tabs>
        </div>
      </div>
    </div>
  )
}
