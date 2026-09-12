import { useId } from "react";
import type { SVGProps } from "react";

/**
 * VoiceMarket brand mark: a studio microphone wearing headphones, with sound
 * waves either side.
 *
 * The headphones, stand and grille follow `currentColor` so the mark works on
 * both the light and the dark theme (white on dark, near-black on light). Only
 * the capsule keeps its fixed orange-to-black gradient, exactly as in the
 * brand artwork.
 */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  const uid = useId().replace(/:/g, "");
  const capsuleGradient = `brand-capsule-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Voicemarket.ge"
      {...props}
    >
      <defs>
        <linearGradient id={capsuleGradient} x1="32" y1="12" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="30%" stopColor="#f9701a" />
          <stop offset="52%" stopColor="#e23c10" />
          {/* Hard-ish break into the dark lower half of the capsule */}
          <stop offset="58%" stopColor="#141414" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      {/* Sound waves */}
      <g
        stroke="#f97316"
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      >
        <path d="M12 27q-2.5 5 0 10" opacity={0.95} />
        <path d="M8.5 24q-4 8 0 16" opacity={0.7} />
        <path d="M5 21q-5.5 11 0 22" opacity={0.45} />
        <path d="M52 27q2.5 5 0 10" opacity={0.95} />
        <path d="M55.5 24q4 8 0 16" opacity={0.7} />
        <path d="M59 21q5.5 11 0 22" opacity={0.45} />
      </g>

      {/* Capsule */}
      <rect x="25" y="12" width="14" height="30" rx="7" fill={`url(#${capsuleGradient})`} />

      {/* Grille slots */}
      <g fill="currentColor">
        <rect x="27.6" y="20.6" width="3.8" height="2" rx="1" />
        <rect x="33.4" y="20.6" width="5" height="2" rx="1" />
        <rect x="26.4" y="25.4" width="5" height="2" rx="1" />
        <rect x="33.4" y="25.4" width="3.8" height="2" rx="1" />
      </g>

      {/* Headband + stand */}
      <g
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      >
        <path d="M17 33v-5a15 15 0 0 1 30 0v5" />
        <path d="M32 43v10" />
        <path d="M24 55h16" />
      </g>

      {/* Ear cups */}
      <g fill="currentColor">
        <rect x="13" y="27" width="7.5" height="15" rx="3.75" />
        <rect x="43.5" y="27" width="7.5" height="15" rx="3.75" />
      </g>
    </svg>
  );
}

export default BrandMark;
