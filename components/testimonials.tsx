import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "We found the perfect voice for our commercial in just a few hours. The quality was outstanding and the turnaround time was impressive.",
      author: "Sarah Johnson",
      role: "Marketing Director, TechCorp",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "As a podcast producer, finding the right voice for our intro was crucial. VoiceMarket made it easy to find exactly what we needed.",
      author: "David Chen",
      role: "Podcast Producer, AudioWaves",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "The platform is intuitive and the talent pool is exceptional. We've used VoiceMarket for multiple projects and have always been satisfied.",
      author: "Maria Rodriguez",
      role: "Creative Director, AdVision",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <section className="container">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Clients Say</h2>
        <p className="mt-4 text-muted-foreground">Hear from businesses that have found their perfect voice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">"{testimonial.quote}"</p>
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
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
