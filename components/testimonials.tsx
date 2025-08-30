import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.",
      author: "დავით ბანცაძე",
      role: "ფოტოგრაფი, პირველი არხი",
      avatar: "/davit-bantsadze.jpg",
    },
    {
      quote:
        "ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.",
      author: "დავით ბანცაძე",
      role: "ფოტოგრაფი, პირველი არხი",
      avatar: "/davit-bantsadze.jpg",
    },
    {
      quote:
        "ჩვენი რეკლამისთვის იდეალური ხმა სულ რამდენიმე საათში ვიპოვეთ. ხარისხი გამორჩეული იყო და შესრულების დროც შთამბეჭდავი.",
      author: "დავით ბანცაძე",
      role: "ფოტოგრაფი, პირველი არხი",
      avatar: "/davit-bantsadze.jpg",
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ჩვენი კლიენტები
        </h2>
        <p className="mt-4 text-muted-foreground px-4">
          გაიგე ბიზნესებისგან, რომლებმაც იპოვეს მათი იდეალური ხმა
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
