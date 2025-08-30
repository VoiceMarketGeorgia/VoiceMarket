import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="container pt-16 pb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent h-[500px] -z-10" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          აირჩიე <span className="text-orange-500">ხმა</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600">
          მოძებნე შენი საყვარელი ხმა და მიეცი მას ხმა.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full bg-orange-500 hover:bg-orange-600"
          >
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
  );
}
