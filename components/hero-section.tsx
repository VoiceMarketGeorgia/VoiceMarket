"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { HeroActorWall } from "@/components/hero-actor-wall";

export function HeroSection() {
  const { tr } = useLanguage();
  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden md:min-h-[660px] lg:min-h-[720px]">
      {/* Base layer - shown while the actor photos are still loading */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/service.jpg)" }}
      />

      {/* Animated wall of blurred voice actors */}
      <HeroActorWall />

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Warm cinematic light + vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/25 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_30%,rgba(0,0,0,0.75)_100%)]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Voice <span className="text-orange-500">Market</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md font-medium">
            🎙️ {tr("ყველა ხმა, ერთ სივრცეში!", "Every voice, all in one place!")}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/talents">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>
                  <Search className="mr-2 h-5 w-5" />
                  {tr("ხმების ძიება", "Browse voices")}
                </span>
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/80 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 text-lg backdrop-blur-sm bg-white/10 transition-all duration-300"
              >
                {tr("დაკავშირება", "Contact us")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-white from-[8%] to-transparent dark:from-background" />

      {/* Animated Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-32 right-16 w-3 h-3 bg-orange-300 rounded-full opacity-40 animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-orange-500 rounded-full opacity-80 animate-pulse delay-500" />
    </section>
  );
}

export default HeroSection;
