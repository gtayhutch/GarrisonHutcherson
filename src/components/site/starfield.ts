/** Width of the repeating star tile, in SVG user units. */
export const STAR_TILE_WIDTH = 1200;

interface Star {
  x: number;
  y: number;
  r: number;
  twinkle: number;
}

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** Generates a repeatable layer of stars across a 1200 by 600 SVG tile. */
export function starLayer(
  count: number,
  radius: [number, number],
  twinkleShare: number,
  seed: number,
): Star[] {
  const random = seeded(seed);
  return Array.from({length: count}, () => {
    const twinkle = random() < twinkleShare ? 1 + Math.floor(random() * 4) : 0;
    return {
      x: Math.round(random() * STAR_TILE_WIDTH),
      y: Math.round(random() * 600),
      r: Number((radius[0] + random() * (radius[1] - radius[0])).toFixed(2)),
      twinkle,
    };
  });
}
