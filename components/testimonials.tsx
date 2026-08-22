"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Testimonials() {
  const { tr } = useLanguage();
  const testimonials = [
    {
      quote:
        tr("ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.", "We found the perfect voice for our advertisement within hours. The quality and turnaround were outstanding."),
      author: tr("დავით ბანცაძე", "Davit Bantsadze"),
      role: tr("ფოტოგრაფი, პირველი არხი", "Photographer, First Channel"),
      avatar: "/davit-bantsadze.jpg",
    },
    {
      quote:
        tr("ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.", "We found the perfect voice for our advertisement within hours. The quality and turnaround were outstanding."),
      author: tr("დავით ბანცაძე", "Davit Bantsadze"),
      role: tr("ფოტოგრაფი, პირველი არხი", "Photographer, First Channel"),
      avatar: "/davit-bantsadze.jpg",
    },
    {
      quote:
        tr("ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.", "We found the perfect voice for our advertisement within hours. The quality and turnaround were outstanding."),
      author: tr("დავით ბანცაძე", "Davit Bantsadze"),
      role: tr("ფოტოგრაფი, პირველი არხი", "Photographer, First Channel"),
      avatar: "/davit-bantsadze.jpg",
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tr("ჩვენი კლიენტები", "Our clients")}
        </h2>
        <p className="mt-4 text-muted-foreground px-4">
          {tr("გაიგე ბიზნესებისგან, რომლებმაც იპოვეს მათი იდეალური ხმა", "Hear from businesses that found their perfect voice")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="mx-3 sm:mx-0">
            <CardContent className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
