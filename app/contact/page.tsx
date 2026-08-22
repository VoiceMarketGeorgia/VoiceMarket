"use client";

import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";
import { useLanguage } from "@/components/language-provider";

export default function ContactPage() {
  const { tr } = useLanguage();
  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {tr("დაგვიკავშირდით", "Contact us")}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          {tr(
            "გაქვთ კითხვები ან გჭირდებათ დახმარება? მზად ვართ გიპასუხოთ VoiceMarket-ის შესახებ ნებისმიერ კითხვაზე.",
            "Have questions or need help? We are here to answer anything about VoiceMarket."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}
