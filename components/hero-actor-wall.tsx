"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllVoiceActors } from "@/lib/supabase-queries";

/** Shipped images used until the actor photos arrive (and if the fetch fails). */
const FALLBACK_IMAGES = [
  "/davit-bantsadze.jpg",
  "/zura-400x450.jpg",
  "/service.jpg",
  "/placeholder-user.jpg",
];

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

function buildColumns(images: string[]) {
  const pool = images.length > 0 ? images : FALLBACK_IMAGES;

  return Array.from({ length: COLUMN_COUNT }, (_, columnIndex) =>
    Array.from(
      { length: TILES_PER_COLUMN },
      // Fill sequentially so neighbouring tiles are rarely the same face.
      (_, tileIndex) => pool[(columnIndex * TILES_PER_COLUMN + tileIndex) % pool.length]
    )
  );
}

/**
 * Cinematic backdrop: columns of blurred voice-actor portraits drifting in
 * opposite directions, like film reels running behind the hero copy.
 */
export function HeroActorWall() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadActorPhotos() {
      try {
        const actors = await getAllVoiceActors();
        const photos = actors
          .map((actor) => actor.image_url)
          .filter((url): url is string => Boolean(url));

        if (!cancelled && photos.length > 0) {
          setImages(photos);
        }
      } catch (loadError) {
        console.error("Error loading hero actor photos:", loadError);
      }
    }

    loadActorPhotos();
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo(() => buildColumns(images), [images]);

  return (
    <div className="hero-actor-wall" aria-hidden="true">
      {columns.map((column, columnIndex) => (
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
              <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default HeroActorWall;
