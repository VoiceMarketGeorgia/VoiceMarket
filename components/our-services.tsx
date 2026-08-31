"use client";

import { useLanguage } from "@/components/language-provider";
import {
  AnimationIcon,
  AudiobookIcon,
  CommercialIcon,
  FilmIcon,
  IvrIcon,
  SeriesIcon,
} from "@/components/service-icons";

export function OurServices() {
  const { tr } = useLanguage();
  const categories = [
    { Icon: IvrIcon, name: tr("ავტომოპასუხე", "IVR") },
    { Icon: CommercialIcon, name: tr("სარეკლამო რგოლი", "Commercials") },
    { Icon: FilmIcon, name: tr("ფილმი", "Film") },
    { Icon: SeriesIcon, name: tr("სერიალი", "TV series") },
    { Icon: AnimationIcon, name: tr("ანიმაცია", "Animation") },
    { Icon: AudiobookIcon, name: tr("აუდიოწიგნი", "Audiobook") },
  ];

  // Four identical copies, so one copy is exactly 25% of the strip - that is
  // the distance the scroll animation travels before it loops.
  const COPIES = 4;
  const duplicatedCategories = Array.from(
    { length: COPIES * categories.length },
    (_, index) => categories[index % categories.length]
  );

  return (
    <section className="container relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {tr("ჩვენი სერვისები", "Our services")}
        </h2>
        {/* Beautiful decorative line */}
        <div className="flex items-center justify-center mt-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
          <div className="h-1 w-1 rounded-full bg-orange-500 mx-2"></div>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
        </div>
      </div>

      {/* Scrolling Container */}
      <div className="relative overflow-hidden">
        {/* Fade gradients - smaller on mobile, better color matching */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <div
          className="flex w-max"
          style={{ animation: "scroll 40s linear infinite" }}
        >
          {duplicatedCategories.map(({ Icon, name }, index) => (
            <div
              key={`${name}-${index}`}
              className="mr-4 flex min-w-[200px] flex-shrink-0 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background/50 p-6 backdrop-blur-sm"
            >
              <Icon className="h-12 w-12" />
              <h3 className="whitespace-nowrap text-center text-sm font-medium">
                {name}
              </h3>
              <div className="flex w-full items-center justify-center">
                <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-orange-500" />
                <div className="mx-1.5 h-1 w-1 rounded-full bg-orange-500" />
                <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-orange-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            /* One of the four copies - lands on identical content. */
            transform: translateX(-25%);
          }
        }
      `}</style>
    </section>
  );
}
