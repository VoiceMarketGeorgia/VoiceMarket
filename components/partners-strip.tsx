"use client";

import { useLanguage } from "@/components/language-provider";

/**
 * Partners / clients strip.
 *
 * TO ADD A REAL PARTNER: drop the logo into `public/partners/` and add an
 * entry below, e.g. `{ name: "Company", logo: "/partners/company.svg" }`.
 * Entries without a `logo` render as a plain wordmark, so a partner can be
 * listed before its image file exists. While the list is empty the whole
 * section renders nothing, so no placeholder boxes ever reach the site.
 */
interface Partner {
  name: string;
  logo?: string;
}

const PARTNERS: Partner[] = [
  // Example:
  // { name: "Silk Road Group", logo: "/partners/silk-road.svg" },
];

/** Four identical copies: one copy is exactly 25% of the strip, which is how
 *  far the animation travels before looping - so the loop has no seam. */
const COPIES = 4;

export function PartnersStrip() {
  const { tr } = useLanguage();

  if (PARTNERS.length === 0) return null;

  const repeated = Array.from(
    { length: COPIES * PARTNERS.length },
    (_, index) => PARTNERS[index % PARTNERS.length]
  );

  return (
    <section className="container">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {tr("ჩვენთან ნათანამშრომლები", "Who we have worked with")}
        </h2>
        <div className="mt-4 flex items-center justify-center">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange-500" />
          <div className="mx-2 h-1 w-1 rounded-full bg-orange-500" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-background dark:via-background/80 sm:w-16" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-background dark:via-background/80 sm:w-16" />

        <div
          className="flex w-max items-center"
          style={{ animation: "partners-scroll 32s linear infinite" }}
        >
          {repeated.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="mr-10 flex h-16 w-36 flex-shrink-0 items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 max-w-full object-contain"
                />
              ) : (
                <span className="select-none rounded-md border border-dashed border-muted-foreground/40 px-3 py-2 text-xs font-bold tracking-widest text-muted-foreground">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes partners-scroll {
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

export default PartnersStrip;
