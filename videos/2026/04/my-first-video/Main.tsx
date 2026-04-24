import { AbsoluteFill, useCurrentFrame } from "remotion";
import React from "react";

const BOX = 680;
const RADIUS = 14;
const GRAVITY = 0.35;
const BOUNCE = 1.1;
const FRICTION = 0.999;
const ROTATION_SPEED = 0.03;
const TRAIL_LENGTH = 30;

const RAINBOW = [
  "#ff0000",
  "#ff8800",
  "#ffff00",
  "#00ff00",
  "#0088ff",
  "#8800ff",
];

interface Hit {
  x: number;
  y: number;
  frame: number;
  colorIndex: number;
}

function simulate(totalFrames: number) {
  let x = BOX / 2;
  let y = BOX / 3;
  let vx = 3;
  let vy = 0;
  const trail: Array<{ x: number; y: number }> = [{ x, y }];
  const hits: Hit[] = [];
  let hitCount = 0;

  for (let f = 0; f < totalFrames; f++) {
    const angle = Math.PI / 2 + ROTATION_SPEED * f;
    vx += GRAVITY * Math.cos(angle);
    vy += GRAVITY * Math.sin(angle);
    vx *= FRICTION;
    vy *= FRICTION;
    x += vx;
    y += vy;

    let bounced = false;
    if (x - RADIUS < 0) {
      x = RADIUS;
      vx = Math.abs(vx) * BOUNCE;
      bounced = true;
    }
    if (x + RADIUS > BOX) {
      x = BOX - RADIUS;
      vx = -Math.abs(vx) * BOUNCE;
      bounced = true;
    }
    if (y - RADIUS < 0) {
      y = RADIUS;
      vy = Math.abs(vy) * BOUNCE;
      bounced = true;
    }
    if (y + RADIUS > BOX) {
      y = BOX - RADIUS;
      vy = -Math.abs(vy) * BOUNCE;
      bounced = true;
    }

    if (bounced) {
      hits.push({ x, y, frame: f, colorIndex: hitCount % RAINBOW.length });
      hitCount++;
    }

    trail.push({ x, y });
  }

  const gravAngle = Math.PI / 2 + ROTATION_SPEED * totalFrames;
  return {
    x,
    y,
    trail: trail.slice(-TRAIL_LENGTH),
    gravAngle,
    hits,
    currentFrame: totalFrames,
  };
}

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { x, y, trail, gravAngle, hits, currentFrame } = simulate(frame);

  const ox = (1920 - BOX) / 2;
  const oy = (1080 - BOX) / 2;

  const arrowLen = 40;
  const ax = BOX / 2 + arrowLen * Math.cos(gravAngle);
  const ay = BOX / 2 + arrowLen * Math.sin(gravAngle);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <svg
        width={BOX}
        height={BOX}
        style={{ position: "absolute", left: ox, top: oy }}
      >
        <rect
          x={0}
          y={0}
          width={BOX}
          height={BOX}
          fill="none"
          stroke="#444"
          strokeWidth={2}
          rx={8}
        />

        {/* gravity arrow */}
        <line
          x1={BOX / 2}
          y1={BOX / 2}
          x2={ax}
          y2={ay}
          stroke="#555"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={ax} cy={ay} r={3} fill="#555" />

        {/* trail */}
        {trail.length > 1 && (
          <polyline
            points={trail.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={RADIUS * 2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* hit effects */}
        {hits.map((hit, i) => {
          const age = currentFrame - hit.frame;
          if (age > 20) return null;
          const progress = age / 20;
          const r = RADIUS + progress * 50;
          const opacity = 1 - progress;
          return (
            <circle
              key={i}
              cx={hit.x}
              cy={hit.y}
              r={r}
              fill="none"
              stroke={RAINBOW[hit.colorIndex]}
              strokeWidth={3 * (1 - progress)}
              opacity={opacity}
            />
          );
        })}

        {/* ball */}
        <circle cx={x} cy={y} r={RADIUS} fill="white" />
      </svg>
    </AbsoluteFill>
  );
};
