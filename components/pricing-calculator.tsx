"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Clock, DollarSign } from "lucide-react"

export function PricingCalculator() {
  const [script, setScript] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [revisions, setRevisions] = useState([2])
  const [expressDelivery, setExpressDelivery] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [soundEffects, setSoundEffects] = useState(false)
  const [price, setPrice] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState("48 hours")

  // Base pricing rules
  const BASE_PRICE = 50
  const PRICE_PER_WORD = 0.1
  const FREE_WORD_LIMIT = 100
  const EXPRESS_DELIVERY_FEE = 50
  const BACKGROUND_MUSIC_FEE = 30
  const SOUND_EFFECTS_FEE = 40
  const REVISION_PRICE = 15

  // Calculate word count
  useEffect(() => {
    if (script.trim() === "") {
      setWordCount(0)
    } else {
      const words = script.trim().split(/\s+/)
      setWordCount(words.length)
    }
  }, [script])

  // Calculate price
  useEffect(() => {
    let calculatedPrice = BASE_PRICE

    // Add per-word pricing for words over the free limit
    if (wordCount > FREE_WORD_LIMIT) {
      calculatedPrice += (wordCount - FREE_WORD_LIMIT) * PRICE_PER_WORD
    }

    // Add revision cost
    calculatedPrice += revisions[0] * REVISION_PRICE

    // Add express delivery fee
    if (expressDelivery) {
      calculatedPrice += EXPRESS_DELIVERY_FEE
      setDeliveryTime("24 hours")
    } else {
      setDeliveryTime("48 hours")
    }

    // Add background music fee
    if (backgroundMusic) {
      calculatedPrice += BACKGROUND_MUSIC_FEE
    }

    // Add sound effects fee
    if (soundEffects) {
      calculatedPrice += SOUND_EFFECTS_FEE
    }

    setPrice(Math.round(calculatedPrice))
  }, [wordCount, revisions, expressDelivery, backgroundMusic, soundEffects])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="script">Paste your script</Label>
        <Textarea
          id="script"
          placeholder="Enter your script here to calculate the price..."
          className="min-h-[150px]"
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Word count: <span className="font-medium">{wordCount}</span>
          {wordCount > FREE_WORD_LIMIT && (
            <span>
              {" "}
              ({FREE_WORD_LIMIT} words free, {wordCount - FREE_WORD_LIMIT} words charged)
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="revisions">Number of revisions: {revisions[0]}</Label>
          </div>
          <Slider id="revisions" min={1} max={5} step={1} value={revisions} onValueChange={setRevisions} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="express-delivery">Express Delivery (24h)</Label>
            <p className="text-sm text-muted-foreground">Get your recording in 24 hours</p>
          </div>
          <Switch id="express-delivery" checked={expressDelivery} onCheckedChange={setExpressDelivery} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="background-music">Background Music</Label>
            <p className="text-sm text-muted-foreground">Add professional background music</p>
          </div>
          <Switch id="background-music" checked={backgroundMusic} onCheckedChange={setBackgroundMusic} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-effects">Sound Effects</Label>
            <p className="text-sm text-muted-foreground">Add custom sound effects</p>
          </div>
          <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/10 p-2 text-orange-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Price</p>
                <p className="text-2xl font-bold">${price}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/10 p-2 text-orange-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Delivery Time</p>
                <p className="text-2xl font-bold">{deliveryTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-orange-500 hover:bg-orange-600">
        <Calculator className="mr-2 h-4 w-4" /> Get a Custom Quote
      </Button>
    </div>
  )
}
