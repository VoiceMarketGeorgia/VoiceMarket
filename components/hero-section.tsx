import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent h-[500px] -z-10" />

      <div className="container pt-16 pb-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Find the Perfect <span className="text-orange-500">Voice</span> for Your Project
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Connect with professional voice actors for commercials, explainer videos, podcasts, and more. Get high-quality
          voice overs that bring your projects to life.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="What type of voice are you looking for?"
              className="w-full rounded-full border border-input bg-background px-10 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600">
            Find Voice Talent
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <span>Popular:</span>
          <Button variant="link" className="h-auto p-0 text-orange-500">
            Commercial
          </Button>
          <span>•</span>
          <Button variant="link" className="h-auto p-0 text-orange-500">
            Narration
          </Button>
          <span>•</span>
          <Button variant="link" className="h-auto p-0 text-orange-500">
            Animation
          </Button>
          <span>•</span>
          <Button variant="link" className="h-auto p-0 text-orange-500">
            E-Learning
          </Button>
          <span>•</span>
          <Button variant="link" className="h-auto p-0 text-orange-500">
            Podcast
          </Button>
        </div>
      </div>
    </section>
  )
}
