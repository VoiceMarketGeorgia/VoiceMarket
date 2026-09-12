import { HeroSection } from "@/components/hero-section";
import { FeaturedTalents } from "@/components/featured-talents";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { OurServices } from "@/components/our-services";
import { CallToAction } from "@/components/call-to-action";
import { ProServices } from "@/components/pro-services";
import { PartnersStrip } from "@/components/partners-strip";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <HeroSection />
      <OurServices />

      <FeaturedTalents />
      <PartnersStrip />
      <HowItWorks />

      <ProServices />
      <CallToAction />
      <Testimonials />
    </div>
  );
}
