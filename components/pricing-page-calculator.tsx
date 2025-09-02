"use client"

import { useState, useEffect, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Clock, DollarSign, AlertCircle, ChevronDown, User } from "lucide-react"
import { ActorPricing } from "./voice-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

interface ActorData {
  id: string;
  pricing: ActorPricing;
  rating: number;
  tags: string[];
}

export function PricingPageCalculator() {
  const [selectedActorId, setSelectedActorId] = useState<string>("")
  const [script, setScript] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [revisions, setRevisions] = useState([2])
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [soundEffects, setSoundEffects] = useState(false)
  const [price, setPrice] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState("48 hours")

  // Generate all actor data
  const allActors: ActorData[] = useMemo(() => {
    return Array.from({ length: 47 }, (_, i) => {
      const id = `${i + 1}`;
      const numId = i + 1;
      
      // Generate tags
      const actorTags = [];
      if (numId % 4 === 0) actorTags.push("Commercial");
      if (numId % 3 === 0) actorTags.push("Narration");
      if (numId % 5 === 0) actorTags.push("Documentary");
      if (numId % 7 === 0) actorTags.push("Character");
      if (numId % 6 === 0) actorTags.push("E-Learning");
      if (numId % 8 === 0) actorTags.push("Animation");
      if (actorTags.length < 2) {
        actorTags.push("Commercial", "Narration");
      }

      // Generate individual pricing
      const isFixedPrice = (numId * 7) % 10 > 6; // Deterministic but varied
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
        id,
        pricing,
        rating: 0, // Not using rating system
        tags: actorTags,
      };
    });
  }, []);

  const selectedActor = allActors.find(actor => actor.id === selectedActorId);

  // Calculate word count
  useEffect(() => {
    if (script.trim() === "") {
      setWordCount(0)
    } else {
      const words = script.trim().split(/\s+/)
      setWordCount(words.length)
    }
  }, [script])

  // Calculate price based on selected actor's pricing
  useEffect(() => {
    if (!selectedActor) {
      setPrice(0);
      return;
    }

    let calculatedPrice = 0;
    const pricing = selectedActor.pricing;

    if (pricing.isFixedPrice && pricing.fixedPriceAmount) {
      // Fixed price model
      calculatedPrice = pricing.fixedPriceAmount;
    } else {
      // Variable pricing model
      calculatedPrice = pricing.basePrice;
      
      // Add per-word pricing
      if (wordCount > 0) {
        calculatedPrice += wordCount * pricing.pricePerWord;
      }
    }

    // Add revision cost
    calculatedPrice += revisions[0] * pricing.revisionFee;

    // Add express delivery fee
    if (expressDelivery) {
      calculatedPrice += pricing.expressDeliveryFee;
      setDeliveryTime("24 hours");
    } else {
      setDeliveryTime("48 hours");
    }

    // Add background music fee
    if (backgroundMusic) {
      calculatedPrice += pricing.backgroundMusicFee;
    }

    // Add sound effects fee
    if (soundEffects) {
      calculatedPrice += pricing.soundEffectsFee;
    }

    // Apply minimum order
    calculatedPrice = Math.max(calculatedPrice, pricing.minOrder);

    setPrice(Math.round(calculatedPrice));
  }, [selectedActor, script, wordCount, revisions, expressDelivery, backgroundMusic, soundEffects]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Select Actor & Calculate Price</h3>
      </div>

      {/* Actor Selection */}
      <div className="space-y-4">
        <Label htmlFor="actor-select">Choose Voice Actor</Label>
        <Select value={selectedActorId} onValueChange={setSelectedActorId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an actor to see their pricing..." />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {allActors.map((actor) => (
              <SelectItem key={actor.id} value={actor.id} className="p-0 h-auto">
                <div className="flex items-center gap-3 p-2 w-full min-w-0 sm:min-w-[400px]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={`/photos/${actor.id}.jpg`}
                      alt={`Actor ${actor.id}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't load
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-user.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Actor #{actor.id}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {actor.pricing.isFixedPrice 
                          ? `Fixed: $${actor.pricing.fixedPriceAmount}`
                          : `$${actor.pricing.basePrice}+`
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {actor.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-orange-100 text-orange-800 text-xs px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedActorId && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Please select an actor to see pricing</p>
            <p className="text-sm text-gray-500">Choose from our 47 professional voice actors above</p>
          </CardContent>
        </Card>
      )}

      {selectedActor && (
        <>
          {selectedActor.pricing.isFixedPrice && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Actor #{selectedActorId} uses fixed pricing: ${selectedActor.pricing.fixedPriceAmount} (base rate)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="script">Your Script</Label>
                <Textarea
                  id="script"
                  placeholder="Paste your script here to calculate the exact price..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Word count: {wordCount} words
                </p>
              </div>

              <div>
                <Label htmlFor="revisions">Number of Revisions: {revisions[0]}</Label>
                <Slider
                  id="revisions"
                  min={0}
                  max={5}
                  step={1}
                  value={revisions}
                  onValueChange={setRevisions}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="express">Express Delivery (24h)</Label>
                  <Switch
                    id="express"
                    checked={expressDelivery}
                    onCheckedChange={setExpressDelivery}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="music">Background Music</Label>
                  <Switch
                    id="music"
                    checked={backgroundMusic}
                    onCheckedChange={setBackgroundMusic}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="effects">Sound Effects</Label>
                  <Switch
                    id="effects"
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-500 mb-2">
                      ${price}
                    </div>
                    <p className="text-muted-foreground">Total Project Cost</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actor #{selectedActorId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    {selectedActor.pricing.isFixedPrice ? (
                      <div className="flex justify-between">
                        <span>Fixed Rate:</span>
                        <span>${selectedActor.pricing.fixedPriceAmount}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>${selectedActor.pricing.basePrice}</span>
                        </div>
                        {wordCount > 0 && (
                          <div className="flex justify-between">
                            <span>Words ({wordCount} × ${selectedActor.pricing.pricePerWord.toFixed(2)}):</span>
                            <span>${(wordCount * selectedActor.pricing.pricePerWord).toFixed(0)}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {revisions[0] > 0 && (
                      <div className="flex justify-between">
                        <span>Revisions ({revisions[0]} × ${selectedActor.pricing.revisionFee}):</span>
                        <span>${revisions[0] * selectedActor.pricing.revisionFee}</span>
                      </div>
                    )}
                    
                    {expressDelivery && (
                      <div className="flex justify-between">
                        <span>Express Delivery:</span>
                        <span>${selectedActor.pricing.expressDeliveryFee}</span>
                      </div>
                    )}
                    
                    {backgroundMusic && (
                      <div className="flex justify-between">
                        <span>Background Music:</span>
                        <span>${selectedActor.pricing.backgroundMusicFee}</span>
                      </div>
                    )}
                    
                    {soundEffects && (
                      <div className="flex justify-between">
                        <span>Sound Effects:</span>
                        <span>${selectedActor.pricing.soundEffectsFee}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${price}</span>
                      </div>
                    </div>
                    
                    {price === selectedActor.pricing.minOrder && (
                      <p className="text-xs text-muted-foreground mt-2">
                        * Minimum order: ${selectedActor.pricing.minOrder}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Delivery Time</span>
                  </div>
                  <p className="text-muted-foreground">{deliveryTime}</p>
                </CardContent>
              </Card>

              {selectedActorId && (
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => window.open(`/talents/${selectedActorId}`, '_blank')}
                >
                  View Actor #{selectedActorId} Profile
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
