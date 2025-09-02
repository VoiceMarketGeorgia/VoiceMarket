import { HeroSection } from "@/components/hero-section";
import { FeaturedTalents } from "@/components/featured-talents";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { OurServices } from "@/components/our-services";
import { CallToAction } from "@/components/call-to-action";
import { VoiceCarousel } from "@/components/voice-carousel";
import { RandomVoiceFinder } from "@/components/random-voice-finder";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <h2 className="text-2xl font-bold">Try Your Luck:</h2>
          <RandomVoiceFinder />
        </div>
      </div> */}

      {/* <div className="container">
        <VoiceCarousel />
      </div> */}

      <HeroSection />
      <OurServices />

      <FeaturedTalents />
      <HowItWorks />

      <CallToAction />
      <Testimonials />
    </div>
  );
}
