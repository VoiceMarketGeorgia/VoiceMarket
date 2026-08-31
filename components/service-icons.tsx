"use client";

import { useId } from "react";
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Shared wrapper: every service logo is drawn on a 64x64 grid with an orange
 * gradient stroke plus a soft glow, matching the reference icon sheet.
 */
function IconShell({
  children,
  className = "",
  ...props
}: Omit<IconProps, "children"> & {
  children: (ids: { grad: string; soft: string; glow: string }) => ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    grad: `svc-grad-${uid}`,
    soft: `svc-soft-${uid}`,
    glow: `svc-glow-${uid}`,
  };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id={ids.grad} x1="8" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb347" />
          <stop offset="45%" stopColor="#ff7a18" />
          <stop offset="100%" stopColor="#e64a0b" />
        </linearGradient>
        <linearGradient id={ids.soft} x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd9a8" />
          <stop offset="100%" stopColor="#ff8c2b" />
        </linearGradient>
        <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="#ff7a18" floodOpacity="0.55" />
        </filter>
      </defs>
      <g
        filter={`url(#${ids.glow})`}
        stroke={`url(#${ids.grad})`}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children(ids)}
      </g>
    </svg>
  );
}

/** ავტომოპასუხე (IVR) — studio mic inside a headset arc with an IVR bubble. */
export function IvrIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          {/* headset arc + ear cups */}
          <path d="M13 36v-6a16 16 0 0 1 32 0v6" />
          <rect x="8" y="31" width="7" height="14" rx="3.5" fill={`url(#${ids.grad})`} />
          <rect x="43" y="31" width="7" height="14" rx="3.5" fill={`url(#${ids.grad})`} />
          {/* mic capsule */}
          <rect x="22" y="14" width="14" height="23" rx="7" fill={`url(#${ids.soft})`} fillOpacity={0.22} />
          <path d="M25.5 20h7M25.5 25h7M25.5 30h7" strokeWidth={1.6} />
          {/* mic stand */}
          <path d="M19 33a10 10 0 0 0 20 0" />
          <path d="M29 43v6M23.5 49h11" />
          {/* IVR speech bubble */}
          <path
            d="M45 8h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-5 4v-4h-.5a3 3 0 0 1-2.5-3v-7a3 3 0 0 1 3-3Z"
            fill={`url(#${ids.grad})`}
            fillOpacity={0.18}
          />
          <text
            x="51"
            y="18"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={`url(#${ids.grad})`}
            stroke="none"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            IVR
          </text>
        </>
      )}
    </IconShell>
  );
}

/** სარეკლამო რგოლი — megaphone with a play mark and broadcast waves. */
export function CommercialIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          <path d="M8 26h8l22-11v34L16 38H8a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3Z" fill={`url(#${ids.soft})`} fillOpacity={0.18} />
          <path d="M17 38v9a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3v-5" />
          <path d="M25 26.5 33 32l-8 5.5V26.5Z" fill={`url(#${ids.grad})`} strokeWidth={1.8} />
          <path d="M45 22a14 14 0 0 1 0 20" />
          <path d="M52 16a24 24 0 0 1 0 32" strokeOpacity={0.75} />
        </>
      )}
    </IconShell>
  );
}

/** ფილმი — clapperboard with a play mark. */
export function FilmIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          <rect x="7" y="26" width="50" height="27" rx="4" fill={`url(#${ids.soft})`} fillOpacity={0.16} />
          <path d="M8.6 20.6 51 11.2a3 3 0 0 1 3.6 2.3l1.4 6.4a3 3 0 0 1-2.3 3.6L11.3 32.9a3 3 0 0 1-3.6-2.3l-1.4-6.4a3 3 0 0 1 2.3-3.6Z" fill={`url(#${ids.grad})`} fillOpacity={0.18} />
          <path d="m19.5 18.5 4.2 12M31 16l4.2 12M42.5 13.5l4.2 12" strokeWidth={2} />
          <path d="M28 33.5 39.5 40 28 46.5v-13Z" fill={`url(#${ids.grad})`} strokeWidth={1.8} />
        </>
      )}
    </IconShell>
  );
}

/** სერიალი — retro TV set with antennas and a play mark. */
export function SeriesIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          <path d="m22 21-8-9M42 21l8-9" />
          <circle cx="12.5" cy="10.5" r="2.6" fill={`url(#${ids.grad})`} strokeWidth={1.6} />
          <circle cx="51.5" cy="10.5" r="2.6" fill={`url(#${ids.grad})`} strokeWidth={1.6} />
          <rect x="8" y="21" width="40" height="29" rx="5" fill={`url(#${ids.soft})`} fillOpacity={0.16} />
          <rect x="13" y="26" width="30" height="19" rx="3" strokeWidth={1.8} strokeOpacity={0.7} />
          <path d="M25 30.5 34.5 35.5 25 40.5v-10Z" fill={`url(#${ids.grad})`} strokeWidth={1.8} />
          <circle cx="53.5" cy="29" r="2.4" fill={`url(#${ids.grad})`} strokeWidth={1.6} />
          <circle cx="53.5" cy="38" r="2.4" fill={`url(#${ids.grad})`} strokeWidth={1.6} />
          <path d="M15 50v3M41 50v3" />
        </>
      )}
    </IconShell>
  );
}

/** ანიმაცია — cartoon character wearing headphones. */
export function AnimationIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          <circle cx="32" cy="34" r="17" fill={`url(#${ids.soft})`} fillOpacity={0.14} />
          {/* hair tuft */}
          <path
            d="M23 19c2.5-4 7-6.5 12-6 3 .4 5 1.8 6 3.6 1.6-2.8 4.6-4 7.6-3.2-3.4 1-5 3.4-5.2 6.4-1.4-2.6-4-4.2-7.2-4.4-4.6-.3-8.6 1.4-13.2 3.6Z"
            fill={`url(#${ids.grad})`}
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <path d="M14 35v-3a18 18 0 0 1 36 0v3" />
          <rect x="8.5" y="30" width="8" height="14" rx="4" fill={`url(#${ids.grad})`} />
          <rect x="47.5" y="30" width="8" height="14" rx="4" fill={`url(#${ids.grad})`} />
          <circle cx="26" cy="32" r="1.9" fill={`url(#${ids.grad})`} stroke="none" />
          <circle cx="38" cy="32" r="1.9" fill={`url(#${ids.grad})`} stroke="none" />
          <path d="M26 40a7.5 7.5 0 0 0 12 0" />
        </>
      )}
    </IconShell>
  );
}

/** აუდიოწიგნი — open book under a headset arc with a waveform. */
export function AudiobookIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      {(ids) => (
        <>
          <path d="M14 33v-2a18 18 0 0 1 36 0v2" />
          <rect x="8.5" y="29" width="8" height="15" rx="4" fill={`url(#${ids.grad})`} />
          <rect x="47.5" y="29" width="8" height="15" rx="4" fill={`url(#${ids.grad})`} />
          <path d="M25 21v9M29.5 17v17M34.5 17v17M39 21v9" strokeWidth={2.6} />
          <path d="M32 41c-3.8-3.2-8.6-4.8-14-4.8h-6v15.6h6c5.4 0 10.2 1.6 14 4.8 3.8-3.2 8.6-4.8 14-4.8h6V36.2h-6c-5.4 0-10.2 1.6-14 4.8Z" fill={`url(#${ids.soft})`} fillOpacity={0.18} />
          <path d="M32 41v15.6" />
        </>
      )}
    </IconShell>
  );
}
