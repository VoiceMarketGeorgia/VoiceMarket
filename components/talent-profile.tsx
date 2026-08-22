"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ActorPricingCalculator } from "@/components/actor-pricing-calculator";
import {
  getAllAudioCategories,
  getVoiceActorById,
  convertToTalent,
} from "@/lib/supabase-queries";
import CardAudioPlayer from "@/components/card-audio-player";
import { useLanguage } from "@/components/language-provider";
import { localizeAudioName } from "@/lib/audio-labels";
import {
  buildAudioCategoryMap,
  getCategoryIconName,
  getIconElement,
} from "@/lib/category-icons";

interface TalentProfileProps {
  id: string;
}

export function TalentProfile({ id }: TalentProfileProps) {
  const { language, tr } = useLanguage();
  const [activeTab, setActiveTab] = useState("demos");
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTalent() {
      try {
        setLoading(true);
        setError(false);
        const [actor, audioCategories] = await Promise.all([
          getVoiceActorById(id),
          getAllAudioCategories(),
        ]);

        if (!actor) {
          setError(true);
          return;
        }

        const categoryIconMap = buildAudioCategoryMap(audioCategories);
        const converted = convertToTalent(actor, categoryIconMap);
        setTalent({
          ...converted,
          bio: actor.bio,
          turnaround: actor.turnaround_time,
          samples: converted.samples.map((sample: any) => ({
            ...sample,
            icon: getIconElement(
              getCategoryIconName(sample.category, sample.iconName),
              { className: "h-4 w-4" }
            ),
          })),
        });
      } catch (loadError) {
        console.error("Error loading talent:", loadError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTalent();
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 text-center text-lg text-muted-foreground" aria-busy="true">
        {tr("იტვირთება...", "Loading...")}
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">
          {tr("მსახიობი ვერ მოიძებნა", "Voice actor not found")}
        </p>
        <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
          {tr("უკან დაბრუნება", "Go back")}
        </Button>
      </div>
    );
  }

  const priceRange = talent.pricing.isFixedPrice
    ? tr(
        `ფიქსირებული: ₾${talent.pricing.fixedPriceAmount}`,
        `Fixed: ₾${talent.pricing.fixedPriceAmount}`
      )
    : `₾${talent.pricing.basePrice}–₾${talent.pricing.basePrice + 200}`;

  return (
    <div className="space-y-8">
      <div className="relative h-[250px] w-full overflow-hidden rounded-xl md:h-[350px]">
        <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8">
          <div className="flex items-end gap-6">
            <div className="relative h-[110px] w-[110px] overflow-hidden rounded-xl border-4 border-background md:h-[150px] md:w-[150px]">
              <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold md:text-4xl">
                {tr("მსახიობი", "Voice actor")} #{talent.id}
              </h1>
              <p className="text-white/80">
                {tr("პროფესიონალი ხმის მსახიობი", "Professional voice actor")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <Card className="h-fit overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <h3 className="font-medium">{tr("შესრულების დრო", "Turnaround time")}</h3>
                <p className="text-sm text-muted-foreground">
                  {talent.turnaround || tr("24–48 საათი", "24–48 hours")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 h-5 w-5 text-orange-500" />
              <div>
                <h3 className="font-medium">{tr("ფასის დიაპაზონი", "Price range")}</h3>
                <p className="text-sm text-muted-foreground">{priceRange}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              {tr("მსახიობის შესახებ", "About this voice actor")}
            </h2>
            <p className="text-muted-foreground">
              {talent.bio ||
                tr(
                  "პროფესიონალი ხმის მსახიობი სხვადასხვა ტიპის პროექტების გამოცდილებით.",
                  "A professional voice actor experienced in a range of projects."
                )}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demos">{tr("ხმოვანი დემო", "Voice demos")}</TabsTrigger>
              <TabsTrigger value="pricing">{tr("ფასის კალკულატორი", "Price calculator")}</TabsTrigger>
            </TabsList>

            <TabsContent value="demos" className="space-y-6 pt-6">
              {talent.samples.length === 0 ? (
                <p className="rounded-lg border p-6 text-center text-muted-foreground">
                  {tr("აუდიო ნიმუშები ჯერ არ არის", "No audio samples yet")}
                </p>
              ) : (
                talent.samples.map((sample: any) => (
                  <Card key={sample.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">{sample.icon}</div>
                        <h3 className="text-lg font-semibold">{localizeAudioName(sample.name, language)}</h3>
                      </div>
                      <CardAudioPlayer
                        audioSamples={[sample]}
                        playerId={`profile-${sample.id}`}
                        isPlaying={currentlyPlayingId === `profile-${sample.id}`}
                        onTogglePlay={(playerId) =>
                          setCurrentlyPlayingId((currentId) =>
                            currentId === playerId ? null : playerId
                          )
                        }
                        showTimeDisplay
                        showDropdown={false}
                        className="border-2 border-gray-100 dark:border-gray-700"
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="pricing" className="pt-6">
              <Card>
                <CardContent className="p-6">
                  <ActorPricingCalculator pricing={talent.pricing} actorId={talent.id} dbId={talent.dbId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
