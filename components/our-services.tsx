"use client";

import { Button } from "@/components/ui/button";
import { Mic2, Radio, Film, BookOpen, Headphones, Tv2 } from "lucide-react";

export function OurServices() {
  const categories = [
    {
      icon: <Headphones className="h-6 w-6" />,
      name: "ავტომოპასუხე",
      description: "ხმოვანი პასუხი",
    },
    {
      icon: <Film className="h-6 w-6" />,
      name: "გახმოვანება",
      description: "ფილმები და სერიალები",
    },
    {
      icon: <Radio className="h-6 w-6" />,
      name: "პოდკასტები",
      description: "ინტერვიუები და სხვა",
    },
    {
      icon: <Mic2 className="h-6 w-6" />,
      name: "კომერციული",
      description: "სარეკლამო რგოლი",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      name: "აუდიოწიგნები",
      description: "ხმოვანი წიგნები",
    },
    {
      icon: <Tv2 className="h-6 w-6" />,
      name: "განათლება",
      description: "ტრენინგები და სხვა",
    },
  ];

  // Duplicate categories for seamless infinite scroll - using more repetitions
  const duplicatedCategories = [
    ...categories,
    ...categories,
    ...categories,
    ...categories,
  ];

  return (
    <section className="container relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
ჩვენი სერვისები
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
          className="flex gap-4"
          style={{
            animation: "scroll 40s linear infinite",
            width: `calc(${duplicatedCategories.length} * (200px + 1rem))`,
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <Button
              key={`${category.name}-${index}`}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6 min-w-[200px] flex-shrink-0 bg-background/50 backdrop-blur-sm border-border pointer-events-none"
            >
              <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">
                {category.icon}
              </div>
              <h3 className="font-medium text-sm whitespace-nowrap">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {category.description}
              </p>
            </Button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
