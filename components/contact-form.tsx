"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/supabase-queries";
import { useLanguage } from "@/components/language-provider";

export function ContactForm() {
  const { tr } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitContactForm({
        name,
        email,
        subject,
        message,
      });

      if (result.success) {
        setIsSubmitted(true);
        // Reset form after submission
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(result.error || tr("შეტყობინების გაგზავნა ვერ მოხერხდა", "The message could not be sent"));
      }
    } catch (err) {
      setError(tr("შეტყობინების გაგზავნა ვერ მოხერხდა", "The message could not be sent"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              {tr("შეტყობინება წარმატებით გაიგზავნა", "Message sent successfully")}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {tr("მადლობა, რომ მოგვწერეთ! მალე გიპასუხებთ.", "Thanks for reaching out! We will reply soon.")}
            </p>
            <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
              {tr("სხვა შეტყობინების გაგზავნა", "Send another message")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{tr("თქვენი სახელი", "Your name")}</Label>
              <Input
                id="name"
                placeholder={tr("გიორგი გიორგაძე", "Your name")}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{tr("ელ-ფოსტის მისამართი", "Email address")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="giorgi@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{tr("თემა", "Subject")}</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder={tr("აირჩიეთ თემა", "Choose a subject")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{tr("ზოგადი კითხვა", "General question")}</SelectItem>
                  <SelectItem value="support">
                    {tr("მომხმარებელთა მხარდაჭერა", "Customer support")}
                  </SelectItem>
                  <SelectItem value="billing">{tr("ფასებთან დაკავშირებული კითხვა", "Pricing question")}</SelectItem>
                  <SelectItem value="partnership">
                    {tr("პარტნიორობის შესაძლებლობა", "Partnership opportunity")}
                  </SelectItem>
                  <SelectItem value="talent">{tr("მსახიობობა მსურს", "I want to become a voice actor")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{tr("თქვენი შეტყობინება", "Your message")}</Label>
              <Textarea
                id="message"
                placeholder={tr("როგორ შეგვიძლია დაგეხმაროთ?", "How can we help?")}
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tr("იგზავნება...", "Sending...")}
                </>
              ) : (
                tr("შეტყობინების გაგზავნა", "Send message")
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
