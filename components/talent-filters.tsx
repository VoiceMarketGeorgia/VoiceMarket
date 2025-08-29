"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function TalentFilters() {
  const [priceRange, setPriceRange] = useState([50, 500])
  const [languages, setLanguages] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [gender, setGender] = useState<string>("all")

  // This would be connected to the TalentDirectory component in a real implementation
  // For now, we'll just log the filter changes
  useEffect(() => {
    console.log("Filters updated:", { languages, categories, gender, priceRange })
  }, [languages, categories, gender, priceRange])

  const toggleLanguage = (language: string) => {
    setLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const toggleCategory = (category: string) => {
    setCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const handleReset = () => {
    setLanguages([])
    setCategories([])
    setGender("all")
    setPriceRange([50, 500])
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 bg-card shadow-sm">
        <h3 className="font-medium mb-4">Filters</h3>

        <Accordion type="multiple" defaultValue={["gender", "language", "accent", "price", "category"]}>
          <AccordionItem value="gender">
            <AccordionTrigger>Gender</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-gender" />
                  <Label htmlFor="all-gender">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="language">
            <AccordionTrigger>Language</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="english"
                    checked={languages.includes("English")}
                    onCheckedChange={() => toggleLanguage("English")}
                  />
                  <Label htmlFor="english">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spanish"
                    checked={languages.includes("Spanish")}
                    onCheckedChange={() => toggleLanguage("Spanish")}
                  />
                  <Label htmlFor="spanish">Spanish</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="french"
                    checked={languages.includes("French")}
                    onCheckedChange={() => toggleLanguage("French")}
                  />
                  <Label htmlFor="french">French</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandarin"
                    checked={languages.includes("Mandarin")}
                    onCheckedChange={() => toggleLanguage("Mandarin")}
                  />
                  <Label htmlFor="mandarin">Mandarin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="korean"
                    checked={languages.includes("Korean")}
                    onCheckedChange={() => toggleLanguage("Korean")}
                  />
                  <Label htmlFor="korean">Korean</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="accent">
            <AccordionTrigger>Accent</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="american" />
                  <Label htmlFor="american">American</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="british" />
                  <Label htmlFor="british">British</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="australian" />
                  <Label htmlFor="australian">Australian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="canadian" />
                  <Label htmlFor="canadian">Canadian</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider value={priceRange} max={1000} step={10} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="commercial"
                    checked={categories.includes("Commercial")}
                    onCheckedChange={() => toggleCategory("Commercial")}
                  />
                  <Label htmlFor="commercial">Commercial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="narration"
                    checked={categories.includes("Narration")}
                    onCheckedChange={() => toggleCategory("Narration")}
                  />
                  <Label htmlFor="narration">Narration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="animation"
                    checked={categories.includes("Animation")}
                    onCheckedChange={() => toggleCategory("Animation")}
                  />
                  <Label htmlFor="animation">Animation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="audiobook"
                    checked={categories.includes("Audiobook")}
                    onCheckedChange={() => toggleCategory("Audiobook")}
                  />
                  <Label htmlFor="audiobook">Audiobook</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="podcast"
                    checked={categories.includes("Podcast")}
                    onCheckedChange={() => toggleCategory("Podcast")}
                  />
                  <Label htmlFor="podcast">Podcast</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="elearning"
                    checked={categories.includes("E-Learning")}
                    onCheckedChange={() => toggleCategory("E-Learning")}
                  />
                  <Label htmlFor="elearning">E-Learning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="character"
                    checked={categories.includes("Character")}
                    onCheckedChange={() => toggleCategory("Character")}
                  />
                  <Label htmlFor="character">Character</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex flex-col gap-2">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">Apply Filters</Button>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
