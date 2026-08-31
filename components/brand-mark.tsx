import type { SVGProps } from "react";

/**
 * VoiceMarket brand mark: an upright studio microphone with a grille, yoke
 * and stand, drawn in the brand orange. Inherits `currentColor`, so callers
 * set the colour with a text-* utility.
 */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="VoiceMarket"
      {...props}
    >
      {/* capsule */}
      <rect x="10.75" y="2" width="10.5" height="17" rx="5.25" fill="currentColor" />
      {/* grille slots, knocked out of the capsule */}
      <path
        d="M13 7h6M13 10.5h6M13 14h6"
        stroke="#000"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* yoke */}
      <path
        d="M7 13.5v1.5a9 9 0 0 0 18 0v-1.5"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      {/* stem + base */}
      <path
        d="M16 24v4M11 28h10"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default BrandMark;
