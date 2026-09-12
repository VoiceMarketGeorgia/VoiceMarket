"use client";

import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface ListenAllButtonProps {
  href?: string;
  className?: string;
}

/**
 * Equaliser bar heights (percent of the bar area). A soft envelope - lower at
 * the ends, peaking just right of centre - so the bars frame the label
 * instead of competing with it.
 */
const BAR_HEIGHTS = Array.from({ length: 34 }, (_, index) => {
  const position = index / 33;
  const envelope = Math.sin(position * Math.PI) ** 1.4;
  const texture = 0.55 + 0.45 * Math.abs(Math.sin(index * 1.7));
  return Math.round(18 + 78 * envelope * texture);
});

/**
 * The headline call to action: a dark glass pill with a glowing edge, a round
 * play button and equaliser bars drifting behind the label.
 */
export function ListenAllButton({ href = "/talents", className = "" }: ListenAllButtonProps) {
  const { tr } = useLanguage();
  const label = tr("მოუსმინე ყველა ხმას", "Listen to every voice");

  return (
    <Link
      href={href}
      className={`listen-all group relative inline-flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-5 sm:py-3 sm:pl-3 sm:pr-7 ${className}`}
    >
      {/* Equaliser bars behind the label */}
      <span className="listen-all__bars" aria-hidden="true">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="listen-all__bar"
            style={{
              height: `${height}%`,
              animationDelay: `${(index % 7) * -0.17}s`,
              animationDuration: `${1.1 + (index % 5) * 0.14}s`,
            }}
          />
        ))}
      </span>

      <span className="listen-all__play" aria-hidden="true">
        <Play className="h-5 w-5 translate-x-[1px] fill-current sm:h-7 sm:w-7" />
      </span>

      <span className="listen-all__label">{label}</span>

      <span className="listen-all__divider" aria-hidden="true" />

      <ChevronRight
        className="listen-all__chevron h-5 w-5 sm:h-7 sm:w-7"
        aria-hidden="true"
      />
    </Link>
  );
}

export default ListenAllButton;
