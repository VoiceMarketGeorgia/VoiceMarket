"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import { submitContactForm } from "@/lib/supabase-queries"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitContactForm({
        name,
        email,
        subject,
        message
      })

      if (result.success) {
        setIsSubmitted(true)
        // Reset form after submission
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        setError(result.error || 'შეტყობინების გაგზავნა ვერ მოხერხდა')
      }
    } catch (err) {
      setError('შეტყობინების გაგზავნა ვერ მოხერხდა')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">შეტყობინება წარმატებით გაიგზავნა</h3>
            <p className="mt-2 text-muted-foreground">
              მადლობა, რომ მიმართეთ! ჩვენ მალე უპასუხებთ.
            </p>
            <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
              სხვა შეტყობინების გაგზავნა
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">თქვენი სახელი</Label>
              <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ელ-ფოსტის მისამართი</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">თემა</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="აირჩიეთ თემა" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">ზოგადი კითხვა</SelectItem>
                  <SelectItem value="support">მომხმარებელთა მხარდაჭერა</SelectItem>
                  <SelectItem value="billing">ფასდაკლების კითხვა</SelectItem>
                  <SelectItem value="partnership">პარტნიორობის შესაძლებლობა</SelectItem>
                  <SelectItem value="talent">ხმოვანი მსახიობის გახდომა</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">თქვენი შეტყობინება</Label>
              <Textarea
                id="message"
                placeholder="როგორ შეგვიძლია დაგეხმაროთ?"
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იგზავნება...
                </>
              ) : (
                "შეტყობინების გაგზავნა"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
