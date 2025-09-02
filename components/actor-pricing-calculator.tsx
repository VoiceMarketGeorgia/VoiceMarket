"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Clock, DollarSign, AlertCircle } from "lucide-react"
import { ActorPricing } from "./voice-card"

interface ActorPricingCalculatorProps {
  pricing: ActorPricing;
  actorId: string;
}

export function ActorPricingCalculator({ pricing, actorId }: ActorPricingCalculatorProps) {
  const [script, setScript] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [revisions, setRevisions] = useState([2])
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [soundEffects, setSoundEffects] = useState(false)
  const [price, setPrice] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState("48 hours")

  // Calculate word count
  useEffect(() => {
    if (script.trim() === "") {
      setWordCount(0)
    } else {
      const words = script.trim().split(/\s+/)
      setWordCount(words.length)
    }
  }, [script])

  // Calculate price based on actor's specific pricing
  useEffect(() => {
    let calculatedPrice = 0;

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
  }, [script, wordCount, revisions, expressDelivery, backgroundMusic, soundEffects, pricing]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Actor #{actorId} Pricing Calculator</h3>
      </div>

      {pricing.isFixedPrice && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                This actor uses fixed pricing: ${pricing.fixedPriceAmount} (base rate)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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

          <div className="space-y-3">
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

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  ${price}
                </div>
                <p className="text-muted-foreground">პროექტის სრული ღირებულება</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">ფასების დეტალები</h4>
              <div className="space-y-2 text-sm">
                {pricing.isFixedPrice ? (
                  <div className="flex justify-between">
                    <span>ფიქსირებული ტარიფი:</span>
                    <span>${pricing.fixedPriceAmount}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>საბაზისო ფასი:</span>
                      <span>${pricing.basePrice}</span>
                    </div>
                    {wordCount > 0 && (
                      <div className="flex justify-between">
                        <span>სიტყვები ({wordCount} × ${pricing.pricePerWord.toFixed(2)}):</span>
                        <span>${(wordCount * pricing.pricePerWord).toFixed(0)}</span>
                      </div>
                    )}
                  </>
                )}
                
                {revisions[0] > 0 && (
                  <div className="flex justify-between">
                    <span>შესწორებები ({revisions[0]} × ${pricing.revisionFee}):</span>
                    <span>${revisions[0] * pricing.revisionFee}</span>
                  </div>
                )}
                
                {expressDelivery && (
                  <div className="flex justify-between">
                    <span>სწრაფი მიწოდება:</span>
                    <span>${pricing.expressDeliveryFee}</span>
                  </div>
                )}
                
                {backgroundMusic && (
                  <div className="flex justify-between">
                    <span>ფონური მუსიკა:</span>
                    <span>${pricing.backgroundMusicFee}</span>
                  </div>
                )}
                
                {soundEffects && (
                  <div className="flex justify-between">
                    <span>ხმოვანი ეფექტები:</span>
                    <span>${pricing.soundEffectsFee}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>სულ:</span>
                    <span>${price}</span>
                  </div>
                </div>
                
                {price === pricing.minOrder && (
                  <p className="text-xs text-muted-foreground mt-2">
                    * Minimum order: ${pricing.minOrder}
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
    </div>
  )
}
