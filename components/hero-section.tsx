import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[460px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://voicemarket.ge/wp-content/uploads/2023/10/service.jpg)",
        }}
      />

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Gradient Overlay for Additional Visual Appeal */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 via-transparent to-black/40" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Voice Market
            {/* <span className="text-orange-400 drop-shadow-lg bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              
            </span> */}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md font-medium">
            🎙️ ყველა ხმა, ერთ სივრცეში!
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="mr-2 h-5 w-5" />
              ხმების ძიება
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/80 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 text-lg backdrop-blur-sm bg-white/10 transition-all duration-300"
            >
              მეტის ნახვა
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />

      {/* Animated Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-32 right-16 w-3 h-3 bg-orange-300 rounded-full opacity-40 animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-orange-500 rounded-full opacity-80 animate-pulse delay-500" />
    </section>
  );
}

export default HeroSection;
