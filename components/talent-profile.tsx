"use client"
import { useState, useEffect } from "react"
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
import { getVoiceActorById, convertToTalent } from "@/lib/supabase-queries"
import CardAudioPlayer from "@/components/card-audio-player"

interface TalentProfileProps {
  id: string
}

export function TalentProfile({ id }: TalentProfileProps) {
  const [activeTab, setActiveTab] = useState("demos")
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load talent data from Supabase
  useEffect(() => {
    async function loadTalent() {
      try {
        setLoading(true);
        const voiceActor = await getVoiceActorById(id);
        
        if (voiceActor) {
          const talentData = convertToTalent(voiceActor);
          
          // Add proper icons to samples
          const samplesWithIcons = talentData.samples.map((sample: any) => ({
            ...sample,
            icon: getSampleIcon(sample.name),
            category: sample.name,
            description: `Professional ${sample.name.toLowerCase()} voice sample.`
          }));

          setTalent({
            ...talentData,
            title: "Professional Voice Actor",
            coverImage: talentData.image,
            bio: voiceActor.bio || `Professional voice actor with extensive experience in various voice-over projects. Specializes in ${talentData.tags.join(", ").toLowerCase()} work with a distinctive and engaging voice style.`,
            priceRange: talentData.pricing.isFixedPrice 
              ? `Fixed: $${talentData.pricing.fixedPriceAmount}` 
              : `$${talentData.pricing.basePrice}-${talentData.pricing.basePrice + 200}`,
            turnaround: voiceActor.turnaround_time || "24-48 hours",
            categories: talentData.tags,
            samples: samplesWithIcons,
            rating: voiceActor.rating || 4.5,
            reviewCount: voiceActor.review_count || 0
          });
        } else {
          setError('Voice actor not found');
        }
      } catch (err) {
        console.error('Error loading talent:', err);
        setError('Failed to load voice actor profile');
      } finally {
        setLoading(false);
      }
    }

    loadTalent();
  }, [id]);

  // Helper function to get icon for sample type
  const getSampleIcon = (sampleName: string) => {
    switch (sampleName) {
      case "სარეკლამო რგოლი":
        return <Mic2 className="h-5 w-5" />;
      case "ავტომოპასუხე":
        return <Headphones className="h-5 w-5" />;
      case "მხატვრული":
        return <BookOpen className="h-5 w-5" />;
      case "დოკუმენტური":
        return <FileText className="h-5 w-5" />;
      default:
        return <Mic2 className="h-5 w-5" />;
    }
  };

  const handleTogglePlay = (playerId: string) => {
    setCurrentlyPlayingId(currentlyPlayingId === playerId ? null : playerId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-muted-foreground text-lg">
          იტვირთება...
        </p>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error || 'Voice actor not found'}</p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mt-4"
        >
          უკან დაბრუნება
        </Button>
      </div>
    );
  }

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
                    <h3 className="font-medium">ენები</h3>
                    <p className="text-sm text-muted-foreground">{talent.languages.join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">შესრულების დრო</h3>
                    <p className="text-sm text-muted-foreground">{talent.turnaround}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">ფასთა ფარგლები</h3>
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
              მსახიობთან კონტაქტი
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">შესახებ</h2>
            <p className="text-muted-foreground">{talent.bio}</p>
          </div>

          <Tabs defaultValue="demos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demos">ხმოვანი დემო</TabsTrigger>
              <TabsTrigger value="pricing">ფასების კალკულატორი</TabsTrigger>
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
