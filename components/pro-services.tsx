"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

/**
 * "VoiceMarket PRO" - the full-production services offered beyond the voice
 * itself. Presented as a capability list rather than a price list: these are
 * scoped per project, so no tariffs are shown here on purpose.
 */
export function ProServices() {
  const { tr } = useLanguage();

  const services = [
    { emoji: "💡", label: tr("იდეის შექმნა & კონცეფცია", "Ideation & concept") },
    { emoji: "✍️", label: tr("სცენარის წერა", "Scriptwriting") },
    { emoji: "📝", label: tr("ქოფირაითინგი", "Copywriting") },
    { emoji: "🔄", label: tr("ტექსტის ადაპტაცია", "Text adaptation") },
    { emoji: "🌍", label: tr("თარგმნა", "Translation") },
    { emoji: "🎨", label: tr("კრეატიული მიმართულება", "Creative direction") },
    { emoji: "👥", label: tr("კასტინგი", "Casting") },
    { emoji: "📍", label: tr("ლოკაციის შერჩევა", "Location scouting") },
    { emoji: "🎬", label: tr("გადაღების ორგანიზება", "Shoot production") },
    { emoji: "📹", label: tr("ვიდეოგადაღება", "Videography") },
    { emoji: "📸", label: tr("ფოტოგადაღება", "Photography") },
    { emoji: "💡", label: tr("განათება & ტექნიკური უზრუნველყოფა", "Lighting & technical support") },
    { emoji: "🎭", label: tr("რეჟისურა", "Directing") },
    { emoji: "✂️", label: tr("ვიდეო მონტაჟი", "Video editing") },
    { emoji: "🎨", label: tr("Color Grading", "Color grading") },
    { emoji: "✨", label: tr("Motion Graphics", "Motion graphics") },
    { emoji: "💥", label: tr("VFX / ვიზუალური ეფექტები", "VFX / visual effects") },
    { emoji: "🎧", label: tr("Sound Design & Mixing", "Sound design & mixing") },
    { emoji: "📱", label: tr("Reels / TikTok / Shorts", "Reels / TikTok / Shorts") },
    { emoji: "💬", label: tr("სუბტიტრები & Captioning", "Subtitles & captioning") },
  ];

  return (
    <section className="container">
      <div className="overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/40 p-8 md:p-10 lg:p-12">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400">
            VoiceMarket PRO
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {tr("მეტი, ვიდრე ხმა", "More than a voice")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            {tr(
              "სრული პროდაქშენი ერთ სივრცეში — იდეიდან საბოლოო მასალამდე. ყველა მიმართულებაზე გვყავს პროფესიონალი გუნდი.",
              "Full production in one place - from the idea to the finished material. We have a professional team for every one of these."
            )}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/90 transition-colors duration-200 hover:bg-white/5"
            >
              <span className="text-lg" aria-hidden="true">
                {service.emoji}
              </span>
              <span className="text-sm font-medium">{service.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <p className="mb-5 text-sm text-white/60">
            {tr(
              "ამ სერვისების ღირებულება პროექტის მიხედვით ინდივიდუალურად განისაზღვრება.",
              "Pricing for these services is agreed individually, per project."
            )}
          </p>
          <Link href="/contact" className="inline-flex max-w-full">
            {/* Wraps on phones: the tall Georgian label is wider than the card,
                and the default button is single-line at a fixed height. */}
            <Button
              size="lg"
              className="h-auto min-h-11 max-w-full whitespace-normal bg-orange-500 px-6 py-3 text-center leading-snug hover:bg-orange-600"
            >
              {tr("დაგვიკავშირდი პროექტისთვის", "Talk to us about your project")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProServices;
