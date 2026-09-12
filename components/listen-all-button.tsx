"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

interface ListenAllButtonProps {
  href?: string;
  className?: string;
}

/**
 * The headline call to action. Deliberately louder than the per-card
 * "მოისმინე" buttons: a faster gradient in a warmer-to-violet tone with
 * synthesiser waves drifting across it.
 */
export function ListenAllButton({ href = "/talents", className = "" }: ListenAllButtonProps) {
  const { tr } = useLanguage();

  return (
    <Link
      href={href}
      className={`listen-all-button group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-10 py-4 text-lg font-extrabold tracking-wide text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${className}`}
    >
      {/* Synthesiser waves: the path spans 1.5 viewBox widths and shifts by
          exactly one period, so the drift never shows a seam. */}
      <svg
        className="listen-all-waves"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="listen-all-wave listen-all-wave--back">
          <path d="M0 20 Q12.5 6 25 20 T50 20 T75 20 T100 20 T125 20 T150 20" />
        </g>
        <g className="listen-all-wave listen-all-wave--front">
          <path d="M0 22 Q9 34 18 22 T36 22 T54 22 T72 22 T90 22 T108 22 T126 22 T144 22" />
        </g>
      </svg>

      <span className="relative z-10 flex items-center gap-2 drop-shadow">
        {/* Equaliser bars */}
        <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
          <span className="listen-all-bar h-2 w-[3px]" />
          <span className="listen-all-bar h-4 w-[3px]" />
          <span className="listen-all-bar h-3 w-[3px]" />
          <span className="listen-all-bar h-5 w-[3px]" />
        </span>
        {tr("მოისმინე ყველა ხმა", "Listen to every voice")}
      </span>
    </Link>
  );
}

export default ListenAllButton;
