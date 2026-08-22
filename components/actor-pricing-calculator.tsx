"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Clock,
  DollarSign,
  AlertCircle,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { ActorPricing } from "./voice-card";
import { submitQuoteRequest } from "@/lib/supabase-queries";
import { useLanguage } from "@/components/language-provider";

interface ActorPricingCalculatorProps {
  pricing: ActorPricing;
  actorId: string;
  dbId?: number; // Database primary key for foreign key references
}

export function ActorPricingCalculator({
  pricing,
  actorId,
  dbId,
}: ActorPricingCalculatorProps) {
  const { tr } = useLanguage();
  const [script, setScript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [revisions, setRevisions] = useState([2]);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [soundEffects, setSoundEffects] = useState(false);
  const [price, setPrice] = useState(0);
  const deliveryTime = expressDelivery
    ? tr("24 საათი", "24 hours")
    : tr("48 საათი", "48 hours");

  // Quote request form states
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate word count
  useEffect(() => {
    if (script.trim() === "") {
      setWordCount(0);
    } else {
      const words = script.trim().split(/\s+/);
      setWordCount(words.length);
    }
  }, [script]);

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
  }, [
    script,
    wordCount,
    revisions,
    expressDelivery,
    backgroundMusic,
    soundEffects,
    pricing,
  ]);

  const handleSubmitQuote = async () => {
    if (!clientName || !clientEmail || !script) {
      setSubmitError(tr("გთხოვთ შეავსოთ სავალდებულო ველები", "Please complete all required fields"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitQuoteRequest({
        voice_actor_id: dbId, // Use database ID for foreign key
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
        special_requirements: specialRequirements,
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
        setSubmitError(result.error || tr("მოთხოვნის გაგზავნა ვერ მოხერხდა", "The request could not be sent"));
      }
    } catch (err) {
      setSubmitError(tr("მოთხოვნის გაგზავნა ვერ მოხერხდა", "The request could not be sent"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">{tr("ფასის კალკულატორი", "Price calculator")}</h3>
      </div>

      {pricing.isFixedPrice && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                {tr("ეს მსახიობი იყენებს ფიქსირებულ ფასს", "This voice actor uses a fixed price")}: ₾{pricing.fixedPriceAmount}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="script">{tr("თქვენი ტექსტი", "Your script")}</Label>
            <Textarea
              id="script"
              placeholder={tr("ჩასვით თქვენი ტექსტი აქ ზუსტი ფასის გამოსათვლელად...", "Paste your script here to calculate an accurate price...")}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={6}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {tr("სიტყვების რაოდენობა", "Word count")}: {wordCount}
            </p>
          </div>

          <div>
            <Label htmlFor="revisions">
              {tr("შესწორებების რაოდენობა", "Number of revisions")}: {revisions[0]}
            </Label>
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
              <Label htmlFor="express">{tr("სწრაფი მიწოდება (24 საათი)", "Express delivery (24 hours)")}</Label>
              <Switch
                id="express"
                checked={expressDelivery}
                onCheckedChange={setExpressDelivery}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="music">{tr("ფონური მუსიკა", "Background music")}</Label>
              <Switch
                id="music"
                checked={backgroundMusic}
                onCheckedChange={setBackgroundMusic}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="effects">{tr("ხმოვანი ეფექტები", "Sound effects")}</Label>
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
                  ₾{price}
                </div>
                <p className="text-muted-foreground">
                  {tr("პროექტის სრული ღირებულება", "Total project cost")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">{tr("ფასების დეტალები", "Price breakdown")}</h4>
              <div className="space-y-2 text-sm">
                {pricing.isFixedPrice ? (
                  <div className="flex justify-between">
                    <span>{tr("ფიქსირებული ტარიფი", "Fixed rate")}:</span>
                    <span>₾{pricing.fixedPriceAmount}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>{tr("საბაზისო ფასი", "Base price")}:</span>
                      <span>₾{pricing.basePrice}</span>
                    </div>
                    {wordCount > 0 && (
                      <div className="flex justify-between">
                        <span>
                          {tr("სიტყვები", "Words")} ({wordCount} × ₾
                          {pricing.pricePerWord.toFixed(2)}):
                        </span>
                        <span>
                          ₾{(wordCount * pricing.pricePerWord).toFixed(0)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {revisions[0] > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {tr("შესწორებები", "Revisions")} ({revisions[0]} × ₾{pricing.revisionFee}):
                    </span>
                    <span>₾{revisions[0] * pricing.revisionFee}</span>
                  </div>
                )}

                {expressDelivery && (
                  <div className="flex justify-between">
                    <span>{tr("სწრაფი მიწოდება", "Express delivery")}:</span>
                    <span>₾{pricing.expressDeliveryFee}</span>
                  </div>
                )}

                {backgroundMusic && (
                  <div className="flex justify-between">
                    <span>{tr("ფონური მუსიკა", "Background music")}:</span>
                    <span>₾{pricing.backgroundMusicFee}</span>
                  </div>
                )}

                {soundEffects && (
                  <div className="flex justify-between">
                    <span>{tr("ხმოვანი ეფექტები", "Sound effects")}:</span>
                    <span>₾{pricing.soundEffectsFee}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>{tr("სულ", "Total")}:</span>
                    <span>₾{price}</span>
                  </div>
                </div>

                {price === pricing.minOrder && (
                  <p className="text-xs text-muted-foreground mt-2">
                    * Minimum order: ₾{pricing.minOrder}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{tr("მიწოდების დრო", "Delivery time")}</span>
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
                  {tr("შეკვეთა წარმატებით გაიგზავნა!", "Request sent successfully!")}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {tr("თქვენს პროექტს განვიხილავთ და 24 საათში გამოგიგზავნით ზუსტ ფასს.", "We will review your project and send an exact quote within 24 hours.")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Request Button/Form */}
      {!isSubmitted && (
        <Card>
          <CardContent className="p-6">
            {!showQuoteForm ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{tr("გსურთ გაგრძელება?", "Ready to continue?")}</h3>
                <p className="text-muted-foreground mb-4">
                  {tr("გაგზავნეთ მოთხოვნა ამ მსახიობისთვის და მიიღეთ ზუსტი ფასი", "Send a request for this voice actor and receive an exact quote")} #{actorId}
                </p>
                <Button
                  onClick={() => setShowQuoteForm(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  disabled={!script || wordCount === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {tr("მოთხოვნის გაგზავნა", "Send request")}
                </Button>
                {(!script || wordCount === 0) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    * {tr("გთხოვთ ჯერ შეიყვანოთ ტექსტი", "Please enter your script first")}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {tr("საკონტაქტო ინფორმაცია", "Contact information")}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuoteForm(false)}
                  >
                    {tr("უკან", "Back")}
                  </Button>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {submitError}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">{tr("სრული სახელი", "Full name")} *</Label>
                    <Input
                      id="clientName"
                      placeholder={tr("გელა გელაშვილი", "Your full name")}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">{tr("ელ-ფოსტა", "Email")} *</Label>
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
                  <Label htmlFor="clientPhone">{tr("ტელეფონი", "Phone")}</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    placeholder="+995 555 123 456"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">
                    {tr("დამატებითი მოთხოვნები", "Additional requirements")}
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder={tr("სპეციალური ინსტრუქციები, ტონალობა, მიწოდების მოთხოვნები...", "Special instructions, tone, delivery requirements...")}
                    rows={3}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                  />
                </div>

                {/* Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{tr("მოთხოვნის შეჯამება", "Request summary")}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>{tr("მსახიობი", "Voice actor")}:</strong> #{actorId}
                        </p>
                        <p>
                          <strong>{tr("სიტყვები", "Words")}:</strong> {wordCount}
                        </p>
                        <p>
                          <strong>{tr("მიწოდება", "Delivery")}:</strong> {deliveryTime}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>{tr("შესწორებები", "Revisions")}:</strong> {revisions[0]}
                        </p>
                        <p>
                          <strong>{tr("ფასი", "Price")}:</strong> ₾{price}
                        </p>
                        {expressDelivery && (
                          <p>
                            <strong>{tr("სწრაფი მიწოდება", "Express delivery")}:</strong> ✓
                          </p>
                        )}
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
                      {tr("იგზავნება...", "Sending...")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {tr("მოთხოვნის გაგზავნა", "Send request")}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
