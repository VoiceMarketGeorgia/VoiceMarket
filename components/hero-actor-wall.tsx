/**
 * Cinematic backdrop: columns of blurred voice-actor portraits drifting in
 * opposite directions, like film reels running behind the hero copy.
 *
 * The portraits are tiny pre-compressed copies in /public/hero (~2 KB each,
 * generated at 96x128 - invisible under the blur), served by Vercel instead
 * of the Supabase bucket so the wall costs no Supabase egress. No data
 * fetching, so this renders complete on the server: no client swap, no flash.
 */

const PHOTOS = Array.from(
  { length: 18 },
  (_, i) => `/hero/actor-${String(i + 1).padStart(2, "0")}.jpg`
);

const COLUMN_COUNT = 12;
const TILES_PER_COLUMN = 7;
/** Seconds for one full loop, per column - uneven values keep the drift organic. */
const COLUMN_DURATIONS = [58, 74, 46, 66, 52, 80, 62, 70, 48, 76, 56, 68];
/** Columns beyond the first four fade in as the viewport widens. */
const COLUMN_VISIBILITY = [
  "flex",
  "flex",
  "flex",
  "flex",
  "hidden sm:flex",
  "hidden sm:flex",
  "hidden md:flex",
  "hidden md:flex",
  "hidden lg:flex",
  "hidden lg:flex",
  "hidden xl:flex",
  "hidden xl:flex",
];

const COLUMNS = Array.from({ length: COLUMN_COUNT }, (_, columnIndex) =>
  Array.from(
    { length: TILES_PER_COLUMN },
    // Fill sequentially so neighbouring tiles are rarely the same face.
    (_, tileIndex) =>
      PHOTOS[(columnIndex * TILES_PER_COLUMN + tileIndex) % PHOTOS.length]
  )
);

export function HeroActorWall() {
  return (
    <div className="hero-actor-wall" aria-hidden="true">
      {COLUMNS.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`hero-actor-column ${COLUMN_VISIBILITY[columnIndex]}`}
          style={{
            animationDuration: `${COLUMN_DURATIONS[columnIndex]}s`,
            animationDirection: columnIndex % 2 === 1 ? "reverse" : "normal",
          }}
        >
          {/* Rendered twice so the vertical loop is seamless. */}
          {[...column, ...column].map((src, tileIndex) => (
            <div className="hero-actor-tile" key={`${columnIndex}-${tileIndex}`}>
              <img src={src} alt="" loading="eager" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default HeroActorWall;
