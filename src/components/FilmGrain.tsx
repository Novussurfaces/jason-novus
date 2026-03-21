"use client";

export function FilmGrain() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        pointerEvents: "none",
        opacity: 0.03,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="film-grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-noise)" />
      </svg>
    </div>
  );
}
