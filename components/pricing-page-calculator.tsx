"use client"

import { useState, useEffect, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Clock, DollarSign, AlertCircle, ChevronDown, User, Send, CheckCircle2, Loader2 } from "lucide-react"
import { ActorPricing } from "./voice-card"
import { submitQuoteRequest } from "@/lib/supabase-queries"
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
  
  // Quote request form states
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Generate all actor data
  const allActors: ActorData[] = useMemo(() => {
    return Array.from({ length: 47 }, (_, i) => {
      const id = `${i + 1}`;
      const numId = i + 1;
      
      // Generate tags
      const actorTags = [];
      if (numId % 4 === 0) actorTags.push("კომერციული");
      if (numId % 3 === 0) actorTags.push("გახმოვანება");
      if (numId % 5 === 0) actorTags.push("დოკუმენტური");
      if (numId % 7 === 0) actorTags.push("პერსონაჟი");
      if (numId % 6 === 0) actorTags.push("ელექტრონული სწავლება");
      if (numId % 8 === 0) actorTags.push("ანიმაცია");
      if (actorTags.length < 2) {
        actorTags.push("კომერციული", "გახმოვანება");
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

  const handleSubmitQuote = async () => {
    if (!clientName || !clientEmail || !script || !selectedActorId) {
      setSubmitError("გთხოვთ შეავსოთ სავალდებულო ველები");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitQuoteRequest({
        voice_actor_id: parseInt(selectedActorId),
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        script_text: script,
        word_count: wordCount,
        revisions_requested: revisions[0],
        express_delivery: expressDelivery,
        background_music: backgroundMusic,
        sound_effects: soundEffects,
        estimated_price: price,
        special_requirements: specialRequirements
      });

      if (result.success) {
        setIsSubmitted(true);
        // Reset form
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setSpecialRequirements("");
        setShowQuoteForm(false);
      } else {
        setSubmitError(result.error || "მოთხოვნის გაგზავნა ვერ მოხერხდა");
      }
    } catch (err) {
      setSubmitError("მოთხოვნის გაგზავნა ვერ მოხერხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">აირჩიეთ მსახიობი და გამოთვალეთ ფასი</h3>
      </div>

      {/* Actor Selection */}
      <div className="space-y-4">
        <Label htmlFor="actor-select">აირჩიეთ ხმოვანი მსახიობი</Label>
        <Select value={selectedActorId} onValueChange={setSelectedActorId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="აირჩიეთ მსახიობი მათი ფასების სანახავად..." />
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
            <p className="text-gray-600 font-medium">გთხოვთ აირჩიოთ მსახიობი ფასების სანახავად</p>
            <p className="text-sm text-gray-500">აირჩიეთ ჩვენი 47 პროფესიონალი ხმოვანი მსახიობიდან</p>
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
                <Label htmlFor="script">თქვენი სკრიპტი</Label>
                <Textarea
                  id="script"
                  placeholder="ჩასვით თქვენი სკრიპტი აქ ზუსტი ფასის გამოსათვლელად..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  სიტყვების რაოდენობა: {wordCount} სიტყვა
                </p>
              </div>

              <div>
                <Label htmlFor="revisions">შესწორებების რაოდენობა: {revisions[0]}</Label>
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
                  <Label htmlFor="express">სწრაფი მიწოდება (24 საათი)</Label>
                  <Switch
                    id="express"
                    checked={expressDelivery}
                    onCheckedChange={setExpressDelivery}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="music">ფონური მუსიკა</Label>
                  <Switch
                    id="music"
                    checked={backgroundMusic}
                    onCheckedChange={setBackgroundMusic}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="effects">ხმოვანი ეფექტები</Label>
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
                    <p className="text-muted-foreground">პროექტის სრული ღირებულება</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actor #{selectedActorId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">ფასების დეტალები</h4>
                  <div className="space-y-2 text-sm">
                    {selectedActor.pricing.isFixedPrice ? (
                      <div className="flex justify-between">
                        <span>ფიქსირებული ტარიფი:</span>
                        <span>${selectedActor.pricing.fixedPriceAmount}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>საბაზისო ფასი:</span>
                          <span>${selectedActor.pricing.basePrice}</span>
                        </div>
                        {wordCount > 0 && (
                          <div className="flex justify-between">
                            <span>სიტყვები ({wordCount} × ${selectedActor.pricing.pricePerWord.toFixed(2)}):</span>
                            <span>${(wordCount * selectedActor.pricing.pricePerWord).toFixed(0)}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {revisions[0] > 0 && (
                      <div className="flex justify-between">
                        <span>შესწორებები ({revisions[0]} × ${selectedActor.pricing.revisionFee}):</span>
                        <span>${revisions[0] * selectedActor.pricing.revisionFee}</span>
                      </div>
                    )}
                    
                    {expressDelivery && (
                      <div className="flex justify-between">
                        <span>სწრაფი მიწოდება:</span>
                        <span>${selectedActor.pricing.expressDeliveryFee}</span>
                      </div>
                    )}
                    
                    {backgroundMusic && (
                      <div className="flex justify-between">
                        <span>ფონური მუსიკა:</span>
                        <span>${selectedActor.pricing.backgroundMusicFee}</span>
                      </div>
                    )}
                    
                    {soundEffects && (
                      <div className="flex justify-between">
                        <span>ხმოვანი ეფექტები:</span>
                        <span>${selectedActor.pricing.soundEffectsFee}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>სულ:</span>
                        <span>${price}</span>
                      </div>
                    </div>
                    
                    {price === selectedActor.pricing.minOrder && (
                      <p className="text-xs text-muted-foreground mt-2">
                        * მინიმალური შეკვეთა: ${selectedActor.pricing.minOrder}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">მიწოდების დრო</span>
                  </div>
                  <p className="text-muted-foreground">{deliveryTime}</p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      მოთხოვნა წარმატებით გაიგზავნა!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      ჩვენ განვიხილავთ თქვენს პროექტს და 24 საათში გამოგიგზავნით ზუსტ ფასს.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quote Request Button/Form */}
          {!isSubmitted && selectedActorId && (
            <Card>
              <CardContent className="p-6">
                {!showQuoteForm ? (
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">მომწონს ეს ფასი?</h3>
                    <p className="text-muted-foreground">
                      გაგზავნეთ მოთხოვნა Actor #{selectedActorId}-ისთვის და მიიღეთ ზუსტი ფასი
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={() => setShowQuoteForm(true)}
                        className="bg-orange-500 hover:bg-orange-600"
                        disabled={!script || wordCount === 0}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        მოთხოვნის გაგზავნა
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`/talents/${selectedActorId}`, '_blank')}
                      >
                        პროფილის ნახვა
                      </Button>
                    </div>
                    {(!script || wordCount === 0) && (
                      <p className="text-sm text-muted-foreground">
                        * გთხოვთ ჯერ შეიყვანოთ სკრიპტი
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">კონტაქტის ინფორმაცია</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowQuoteForm(false)}
                      >
                        უკან
                      </Button>
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-red-600 dark:text-red-400 text-sm">{submitError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">სრული სახელი *</Label>
                        <Input
                          id="clientName"
                          placeholder="გელა გელაშვილი"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">ელ-ფოსტა *</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          placeholder="gela@example.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">ტელეფონი</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        placeholder="+995 555 123 456"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">დამატებითი მოთხოვნები</Label>
                      <Textarea
                        id="specialRequirements"
                        placeholder="სპეციალური ინსტრუქციები, ტონალობა, მიწოდების მოთხოვნები..."
                        rows={3}
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                      />
                    </div>

                    {/* Summary */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">მოთხოვნის შეჯამება</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>მსახიობი:</strong> Actor #{selectedActorId}</p>
                            <p><strong>სიტყვები:</strong> {wordCount}</p>
                            <p><strong>მიწოდება:</strong> {deliveryTime}</p>
                          </div>
                          <div>
                            <p><strong>შესწორებები:</strong> {revisions[0]}</p>
                            <p><strong>ფასი:</strong> ${price}</p>
                            {expressDelivery && <p><strong>სწრაფი მიწოდება:</strong> ✓</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button 
                      onClick={handleSubmitQuote}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={isSubmitting || !clientName || !clientEmail}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          იგზავნება...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          მოთხოვნის გაგზავნა
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
