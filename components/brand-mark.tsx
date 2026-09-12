import { useId } from "react";
import type { SVGProps } from "react";

/**
 * VoiceMarket brand mark: a studio microphone wearing headphones, sitting in
 * a U-shaped cradle on a stand.
 *
 * The headphones, grille bars, cradle and stand follow `currentColor`, so the
 * mark reads on both themes (white on dark, near-black on light). The capsule
 * keeps its fixed orange-to-black gradient and glow from the brand artwork.
 */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  const uid = useId().replace(/:/g, "");
  const capsuleFill = `brand-capsule-${uid}`;
  const capsuleGloss = `brand-gloss-${uid}`;
  const glow = `brand-glow-${uid}`;

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
        <linearGradient id={capsuleFill} x1="32" y1="8.8" x2="32" y2="53.4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb13b" />
          <stop offset="30%" stopColor="#ff7a1a" />
          <stop offset="52%" stopColor="#e8401c" />
          {/* Hard break into the black lower half, as in the artwork */}
          <stop offset="56%" stopColor="#161616" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id={capsuleGloss} x1="0" y1="8.8" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <filter id={glow} x="-60%" y="-40%" width="220%" height="180%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      {/* Warm glow behind the capsule */}
      <rect
        x="20.8"
        y="8.8"
        width="23.3"
        height="28"
        rx="11.65"
        fill="#ff6a1a"
        opacity={0.55}
        filter={`url(#${glow})`}
      />

      {/* Headband */}
      <path
        d="M11.3 22.5v-4.5a20.7 16 0 0 1 41.4 0v4.5"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      {/* Ear cups */}
      <g fill="currentColor">
        <rect x="7.2" y="19.6" width="8.2" height="16.6" rx="4.1" />
        <rect x="48.6" y="19.6" width="8.2" height="16.6" rx="4.1" />
      </g>

      {/* Capsule, with a faint rim so the black half still reads on dark */}
      <rect
        x="20.8"
        y="8.8"
        width="23.3"
        height="44.6"
        rx="11.65"
        fill={`url(#${capsuleFill})`}
        stroke="#ffffff"
        strokeOpacity={0.12}
        strokeWidth={0.6}
      />
      <rect x="23.5" y="10.5" width="7" height="22" rx="3.5" fill={`url(#${capsuleGloss})`} />

      {/* Grille bars - they run past the capsule edges, as in the artwork */}
      <g fill="currentColor">
        <rect x="17.7" y="23.8" width="10.2" height="2.6" rx="1.3" />
        <rect x="35.9" y="23.8" width="10.2" height="2.6" rx="1.3" />
        <rect x="17.7" y="29.6" width="10.2" height="2.6" rx="1.3" />
        <rect x="35.9" y="29.6" width="10.2" height="2.6" rx="1.3" />
      </g>

      {/* Cradle, stem and base */}
      <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
        <path d="M17.9 35v7.4a14.4 14.4 0 0 0 28.8 0V35" />
        <path d="M32.3 56.8v4.4" />
        <path d="M22.2 61.4h20.2" />
      </g>
    </svg>
  );
}

export default BrandMark;
