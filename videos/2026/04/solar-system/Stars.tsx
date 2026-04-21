import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export const Stars: React.FC<{ count?: number; seed?: number }> = ({
  count = 250,
  seed = 42,
}) => {
  const frame = useCurrentFrame();

  const stars = useMemo(() => {
    const rng = seededRandom(seed);
    return Array.from({ length: count }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      size: 0.6 + rng() * 2.4,
      baseOpacity: 0.15 + rng() * 0.85,
      speed: 0.015 + rng() * 0.05,
      offset: rng() * Math.PI * 2,
      bright: rng() > 0.92,
    }));
  }, [count, seed]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {stars.map((star, i) => {
        const opacity =
          star.baseOpacity *
          (0.5 + 0.5 * Math.sin(frame * star.speed + star.offset));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity,
              boxShadow: star.bright
                ? `0 0 ${star.size * 3}px ${star.size}px rgba(180,200,255,0.4)`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
