import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import type { PlanetData } from "./data";

interface Props {
  planet: PlanetData;
  size?: number;
}

/* ── deterministic RNG ──────────────────────────────────────────── */
function srand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ══════════════════════════════════════════════════════════════════
   PER-PLANET SURFACE RENDERERS
   Each returns SVG elements laid out in a strip [-2r, 2r] wide.
   They will be translated for rotation and clipped to the sphere.
   ══════════════════════════════════════════════════════════════════ */

function mercurySurface(r: number) {
  const rng = srand(111);
  const craters = Array.from({ length: 22 }, () => ({
    cx: (rng() - 0.5) * r * 3.5,
    cy: (rng() - 0.5) * r * 1.8,
    cr: 3 + rng() * r * 0.13,
  }));
  return (
    <>
      {craters.map((c, i) => (
        <React.Fragment key={i}>
          <circle cx={c.cx} cy={c.cy} r={c.cr} fill="rgba(0,0,0,0.18)" />
          <circle
            cx={c.cx - c.cr * 0.15}
            cy={c.cy - c.cr * 0.15}
            r={c.cr * 0.7}
            fill="rgba(0,0,0,0.08)"
          />
        </React.Fragment>
      ))}
      {/* Hot side glow (left = sun-facing) */}
      <rect x={-r * 2} y={-r} width={r * 1.5} height={r * 2} fill="rgba(255,160,50,0.08)" />
      {/* Cold side (right = shadow) */}
      <rect x={r * 0.5} y={-r} width={r * 1.5} height={r * 2} fill="rgba(30,40,80,0.1)" />
    </>
  );
}

function venusSurface(r: number) {
  // Dense retrograde cloud bands — thick swirling ellipses
  const bands = Array.from({ length: 8 }, (_, i) => ({
    y: ((i / 7) - 0.5) * r * 1.8,
    rx: r * 1.5 + (i % 3) * r * 0.3,
    ry: r * 0.07 + (i % 2) * r * 0.04,
    dx: (i % 2 === 0 ? 1 : -1) * r * 0.3,
    rot: (i % 2 === 0 ? 3 : -3),
  }));
  return (
    <>
      {bands.map((b, i) => (
        <ellipse
          key={i}
          cx={b.dx}
          cy={b.y}
          rx={b.rx}
          ry={b.ry}
          fill="rgba(255,210,100,0.15)"
          transform={`rotate(${b.rot})`}
        />
      ))}
      {/* Dense haze overlay */}
      <rect
        x={-r * 2}
        y={-r}
        width={r * 4}
        height={r * 2}
        fill="rgba(200,150,60,0.08)"
      />
    </>
  );
}

function earthSurface(r: number) {
  return (
    <>
      {/* Continent blobs (spread across the tile-strip) */}
      <ellipse cx={-r * 0.2} cy={-r * 0.15} rx={r * 0.28} ry={r * 0.38} fill="#2d8c4e" opacity={0.7} />
      <ellipse cx={r * 0.5} cy={r * 0.05} rx={r * 0.22} ry={r * 0.32} fill="#2d8c4e" opacity={0.65} />
      <ellipse cx={r * 0.45} cy={-r * 0.4} rx={r * 0.3} ry={r * 0.18} fill="#2d8c4e" opacity={0.6} />
      <ellipse cx={-r * 0.55} cy={r * 0.35} rx={r * 0.18} ry={r * 0.14} fill="#2d8c4e" opacity={0.55} />
      {/* Additional continents for tiling */}
      <ellipse cx={r * 1.8} cy={-r * 0.1} rx={r * 0.25} ry={r * 0.35} fill="#2d8c4e" opacity={0.65} />
      <ellipse cx={-r * 1.6} cy={r * 0.1} rx={r * 0.22} ry={r * 0.28} fill="#2d8c4e" opacity={0.6} />
      {/* Polar ice */}
      <ellipse cx={0} cy={-r * 0.9} rx={r * 2} ry={r * 0.12} fill="rgba(230,240,255,0.5)" />
      <ellipse cx={0} cy={r * 0.92} rx={r * 2} ry={r * 0.1} fill="rgba(230,240,255,0.4)" />
      {/* Cloud wisps */}
      <ellipse cx={r * 0.3} cy={-r * 0.05} rx={r * 0.6} ry={r * 0.05} fill="rgba(255,255,255,0.22)" />
      <ellipse cx={-r * 0.4} cy={r * 0.25} rx={r * 0.5} ry={r * 0.04} fill="rgba(255,255,255,0.18)" />
    </>
  );
}

function marsSurface(r: number) {
  return (
    <>
      {/* Terrain patches */}
      <ellipse cx={-r * 0.3} cy={r * 0.1} rx={r * 0.4} ry={r * 0.22} fill="rgba(40,15,5,0.25)" />
      <ellipse cx={r * 0.4} cy={-r * 0.3} rx={r * 0.25} ry={r * 0.18} fill="rgba(40,15,5,0.2)" />
      <ellipse cx={r * 1.5} cy={r * 0.15} rx={r * 0.3} ry={r * 0.2} fill="rgba(40,15,5,0.22)" />
      {/* Olympus Mons */}
      <circle cx={-r * 0.5} cy={-r * 0.2} r={r * 0.1} fill="rgba(70,25,8,0.35)" />
      <circle cx={-r * 0.5} cy={-r * 0.2} r={r * 0.04} fill="rgba(40,15,5,0.4)" />
      {/* Valles Marineris (canyon line) */}
      <rect cx={r * 0.1} x={-r * 0.1} y={r * 0.02} width={r * 0.8} height={r * 0.02} fill="rgba(30,10,0,0.3)" rx={2} />
      {/* Polar cap */}
      <ellipse cx={0} cy={-r * 0.9} rx={r * 2} ry={r * 0.09} fill="rgba(220,220,235,0.45)" />
    </>
  );
}

function jupiterSurface(r: number) {
  // Bands at different y positions, different speeds will be simulated by main rotation
  const bands = [
    { y: -0.75, h: 0.12, color: "#d9a44f", opacity: 0.5 },
    { y: -0.51, h: 0.14, color: "#b07828", opacity: 0.45 },
    { y: -0.23, h: 0.12, color: "#e8c476", opacity: 0.4 },
    { y: 0.03, h: 0.14, color: "#a06820", opacity: 0.45 },
    { y: 0.31, h: 0.12, color: "#d9a44f", opacity: 0.4 },
    { y: 0.57, h: 0.14, color: "#b07828", opacity: 0.45 },
    { y: 0.8, h: 0.1, color: "#c89838", opacity: 0.35 },
  ];
  return (
    <>
      {bands.map((b, i) => (
        <React.Fragment key={i}>
          <rect
            x={-r * 2}
            y={b.y * r}
            width={r * 4}
            height={b.h * r}
            fill={b.color}
            opacity={b.opacity}
          />
          {/* Band edge turbulence */}
          <rect
            x={-r * 2}
            y={b.y * r + b.h * r}
            width={r * 4}
            height={r * 0.02}
            fill="rgba(0,0,0,0.1)"
          />
        </React.Fragment>
      ))}
      {/* Great Red Spot */}
      <ellipse cx={r * 0.3} cy={r * 0.22} rx={r * 0.2} ry={r * 0.13} fill="#b84020" opacity={0.8} />
      <ellipse cx={r * 0.3} cy={r * 0.22} rx={r * 0.14} ry={r * 0.08} fill="#d06040" opacity={0.55} />
      <ellipse cx={r * 0.28} cy={r * 0.2} rx={r * 0.06} ry={r * 0.035} fill="#e08060" opacity={0.35} />
    </>
  );
}

function saturnSurface(r: number) {
  const bands = [
    { y: -0.65, h: 0.13, color: "#e8d080" },
    { y: -0.35, h: 0.15, color: "#c8a050" },
    { y: -0.05, h: 0.13, color: "#d8c070" },
    { y: 0.25, h: 0.15, color: "#c0a040" },
    { y: 0.55, h: 0.13, color: "#d8c060" },
  ];
  return (
    <>
      {bands.map((b, i) => (
        <rect key={i} x={-r * 2} y={b.y * r} width={r * 4} height={b.h * r} fill={b.color} opacity={0.25} />
      ))}
      {/* Hexagonal storm hint at north pole area */}
      <polygon
        points={Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return `${Math.cos(a) * r * 0.15},${-r * 0.78 + Math.sin(a) * r * 0.08}`;
        }).join(" ")}
        fill="none"
        stroke="rgba(200,180,100,0.3)"
        strokeWidth={1.5}
      />
    </>
  );
}

function uranusSurface(r: number) {
  return (
    <>
      <rect x={-r * 2} y={-r * 0.12} width={r * 4} height={r * 0.24} fill="rgba(130,210,220,0.12)" />
      <rect x={-r * 2} y={r * 0.3} width={r * 4} height={r * 0.12} fill="rgba(130,210,220,0.08)" />
    </>
  );
}

function neptuneSurface(r: number, frame: number) {
  // Fast wind streaks
  const rng = srand(777);
  const streaks = Array.from({ length: 12 }, () => ({
    baseX: (rng() - 0.5) * r * 3,
    y: (rng() - 0.5) * r * 1.6,
    w: r * 0.15 + rng() * r * 0.35,
    speed: 1.5 + rng() * 2.5,
    opacity: 0.08 + rng() * 0.12,
  }));
  return (
    <>
      {/* Base banding */}
      <rect x={-r * 2} y={-r * 0.3} width={r * 4} height={r * 0.2} fill="rgba(80,100,200,0.15)" />
      <rect x={-r * 2} y={r * 0.25} width={r * 4} height={r * 0.15} fill="rgba(60,80,180,0.12)" />
      {/* Wind streaks that move independently */}
      {streaks.map((s, i) => {
        const period = r * 4;
        const x = ((s.baseX + frame * s.speed) % period + period) % period - r * 2;
        return (
          <rect key={i} x={x} y={s.y} width={s.w} height={2.5} rx={1.25} fill={`rgba(150,170,255,${s.opacity})`} />
        );
      })}
      {/* Dark spot */}
      <ellipse cx={-r * 0.2} cy={r * 0.15} rx={r * 0.12} ry={r * 0.08} fill="rgba(10,15,50,0.25)" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RINGS
   ══════════════════════════════════════════════════════════════════ */

function SaturnRings({
  r,
  behind,
  tilt,
}: {
  r: number;
  behind?: boolean;
  tilt: number;
}) {
  const ringRx = r * 1.7;
  const ringRy = r * 0.35;
  const id = behind ? "sRB" : "sRF";
  return (
    <g transform={`rotate(${tilt})`}>
      <defs>
        <clipPath id={id}>
          {behind ? (
            <rect x={-ringRx - 20} y={0} width={(ringRx + 20) * 2} height={ringRy + r + 20} />
          ) : (
            <rect x={-ringRx - 20} y={-ringRy - r - 20} width={(ringRx + 20) * 2} height={ringRy + r + 20} />
          )}
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {/* Multiple ring bands */}
        <ellipse cx={0} cy={0} rx={ringRx * 1.12} ry={ringRy * 1.12} fill="none" stroke="#b8a060" strokeWidth={r * 0.04} opacity={0.25} />
        <ellipse cx={0} cy={0} rx={ringRx} ry={ringRy} fill="none" stroke="#d8c890" strokeWidth={r * 0.14} opacity={0.45} />
        {/* Cassini division */}
        <ellipse cx={0} cy={0} rx={ringRx * 0.9} ry={ringRy * 0.9} fill="none" stroke="rgba(5,5,16,0.5)" strokeWidth={r * 0.02} />
        <ellipse cx={0} cy={0} rx={ringRx * 0.82} ry={ringRy * 0.82} fill="none" stroke="#c8b070" strokeWidth={r * 0.1} opacity={0.4} />
        <ellipse cx={0} cy={0} rx={ringRx * 0.7} ry={ringRy * 0.7} fill="none" stroke="#a89050" strokeWidth={r * 0.05} opacity={0.3} />
      </g>
    </g>
  );
}

function UranusRings({
  r,
  behind,
}: {
  r: number;
  behind?: boolean;
}) {
  const ringRx = r * 1.4;
  const ringRy = r * 0.2;
  const id = behind ? "uRB" : "uRF";
  return (
    <g>
      <defs>
        <clipPath id={id}>
          {behind ? (
            <rect x={-ringRx - 20} y={0} width={(ringRx + 20) * 2} height={ringRy + r + 20} />
          ) : (
            <rect x={-ringRx - 20} y={-ringRy - r - 20} width={(ringRx + 20) * 2} height={ringRy + r + 20} />
          )}
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <ellipse cx={0} cy={0} rx={ringRx} ry={ringRy} fill="none" stroke="#70c0d0" strokeWidth={r * 0.025} opacity={0.35} />
        <ellipse cx={0} cy={0} rx={ringRx * 0.9} ry={ringRy * 0.9} fill="none" stroke="#60b0c0" strokeWidth={r * 0.015} opacity={0.25} />
      </g>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXTERNAL OVERLAYS (drawn outside the sphere clip)
   ══════════════════════════════════════════════════════════════════ */

function EarthMagneticField({ r, frame }: { r: number; frame: number }) {
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.05);
  // Field lines curving from pole to pole
  const lines = [0.8, 1.1, 1.4];
  return (
    <g opacity={0.25 * pulse}>
      {lines.map((spread, i) => (
        <React.Fragment key={i}>
          <path
            d={`M 0,${-r * 1.2} C ${r * spread},${-r * 0.4} ${r * spread},${r * 0.4} 0,${r * 1.2}`}
            fill="none"
            stroke="#6699ff"
            strokeWidth={1.2}
            strokeDasharray="4,3"
          />
          <path
            d={`M 0,${-r * 1.2} C ${-r * spread},${-r * 0.4} ${-r * spread},${r * 0.4} 0,${r * 1.2}`}
            fill="none"
            stroke="#6699ff"
            strokeWidth={1.2}
            strokeDasharray="4,3"
          />
        </React.Fragment>
      ))}
      {/* Aurora glow at poles */}
      <ellipse cx={0} cy={-r * 1.05} rx={r * 0.25} ry={r * 0.06} fill="#4488ff" opacity={0.4 * pulse} />
      <ellipse cx={0} cy={r * 1.05} rx={r * 0.2} ry={r * 0.05} fill="#4488ff" opacity={0.3 * pulse} />
    </g>
  );
}

function MarsDust({ r, frame }: { r: number; frame: number }) {
  const particles = useMemo(() => {
    const rng = srand(333);
    return Array.from({ length: 15 }, () => ({
      baseX: (rng() - 0.5) * r * 3,
      baseY: (rng() - 0.5) * r * 2.5,
      size: 2 + rng() * 5,
      speed: 0.2 + rng() * 0.6,
      opacity: 0.1 + rng() * 0.2,
    }));
  }, [r]);

  return (
    <g>
      {particles.map((p, i) => {
        const x = p.baseX + frame * p.speed;
        const drift = Math.sin(frame * 0.03 + i) * 8;
        return (
          <circle
            key={i}
            cx={x % (r * 3) - r * 1.5}
            cy={p.baseY + drift}
            r={p.size}
            fill={`rgba(200,100,40,${p.opacity})`}
          />
        );
      })}
    </g>
  );
}

function VenusRetroArrow({ r }: { r: number }) {
  // Small curved arrow showing retrograde rotation
  const arrowR = r * 1.25;
  return (
    <g opacity={0.35}>
      <path
        d={`M ${arrowR * 0.7},${-arrowR * 0.15}
            A ${arrowR * 0.72},${arrowR * 0.72} 0 0 0 ${arrowR * 0.7},${arrowR * 0.15}`}
        fill="none"
        stroke="#f0d080"
        strokeWidth={2}
        markerEnd="url(#retroArrow)"
      />
      <defs>
        <marker id="retroArrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill="#f0d080" />
        </marker>
      </defs>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export const PlanetVisual: React.FC<Props> = ({ planet, size }) => {
  const frame = useCurrentFrame();
  const r = size ?? planet.visualRadius;
  const hasRings = planet.name === "Saturn" || planet.name === "Uranus";
  const pad = hasRings ? r * 2 : r * 1.5;
  const svgSize = pad * 2;

  const n = planet.name;
  const glowPulse = 0.85 + 0.15 * Math.sin(frame * 0.04);

  // ── 3D rotation: surface scrolls ──
  const period = r * 4;
  const rawOffset = ((frame * planet.rotationSpeed) % period + period) % period;

  // Tilt: rotate the surface scroll direction
  const tiltDeg = planet.tilt;

  // For Uranus the whole visual (including rings) is dramatically tilted
  const globalTilt = n === "Uranus" ? 82 : 0; // visual tilt of entire planet

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`${-pad} ${-pad} ${svgSize} ${svgSize}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Base sphere gradient */}
        <radialGradient id={`bg-${n}`} cx="30%" cy="25%" r="65%">
          <stop offset="0%" stopColor={planet.colors.highlight} />
          <stop offset="50%" stopColor={planet.colors.primary} />
          <stop offset="100%" stopColor={planet.colors.secondary} />
        </radialGradient>

        {/* 3D shadow overlay */}
        <radialGradient id={`sh-${n}`} cx="28%" cy="22%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="40%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>

        {/* Specular highlight */}
        <radialGradient id={`sp-${n}`} cx="30%" cy="22%" r="22%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Rim light */}
        <linearGradient id={`rim-${n}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`gl-${n}`}>
          <feGaussianBlur stdDeviation={r * 0.22} />
        </filter>

        {/* Sphere clip */}
        <clipPath id={`cl-${n}`}>
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>

      {/* ── Apply global tilt (for Uranus) ── */}
      <g transform={`rotate(${globalTilt})`}>
        {/* Atmospheric glow */}
        <circle
          cx={0} cy={0} r={r * 1.08}
          fill={planet.colors.atmosphere}
          filter={`url(#gl-${n})`}
          opacity={0.3 * glowPulse}
        />

        {/* Rings behind planet */}
        {n === "Saturn" && <SaturnRings r={r} behind tilt={tiltDeg} />}
        {n === "Uranus" && <UranusRings r={r} behind />}

        {/* Planet body (base color) */}
        <circle cx={0} cy={0} r={r} fill={`url(#bg-${n})`} />

        {/* ── Rotating surface features ── */}
        <g clipPath={`url(#cl-${n})`}>
          <g transform={`rotate(${n === "Uranus" ? 0 : tiltDeg})`}>
            {/* Two copies for seamless tiling */}
            <g transform={`translate(${rawOffset}, 0)`}>
              {renderSurface(n, r, frame)}
            </g>
            <g transform={`translate(${rawOffset - period}, 0)`}>
              {renderSurface(n, r, frame)}
            </g>
          </g>
        </g>

        {/* ── 3D lighting layers ── */}
        <circle cx={0} cy={0} r={r} fill={`url(#sh-${n})`} />
        <circle cx={0} cy={0} r={r} fill={`url(#sp-${n})`} />
        <circle cx={0} cy={0} r={r} fill="none" stroke={`url(#rim-${n})`} strokeWidth={2.5} />

        {/* Rings in front */}
        {n === "Saturn" && <SaturnRings r={r} tilt={tiltDeg} />}
        {n === "Uranus" && <UranusRings r={r} />}

        {/* ── Axis line ── */}
        {renderAxis(n, r, n === "Uranus" ? 0 : tiltDeg)}
      </g>

      {/* ── External overlays (not affected by global tilt) ── */}
      <g transform={`rotate(${globalTilt})`}>
        {n === "Earth" && <EarthMagneticField r={r} frame={frame} />}
        {n === "Mars" && <MarsDust r={r} frame={frame} />}
        {n === "Venus" && <VenusRetroArrow r={r} />}
      </g>
    </svg>
  );
};

/* ── dispatch surface renderer ──────────────────────────────────── */
function renderSurface(name: string, r: number, frame: number) {
  switch (name) {
    case "Mercury": return mercurySurface(r);
    case "Venus": return venusSurface(r);
    case "Earth": return earthSurface(r);
    case "Mars": return marsSurface(r);
    case "Jupiter": return jupiterSurface(r);
    case "Saturn": return saturnSurface(r);
    case "Uranus": return uranusSurface(r);
    case "Neptune": return neptuneSurface(r, frame);
    default: return null;
  }
}

/* ── axis line renderer ─────────────────────────────────────────── */
function renderAxis(name: string, r: number, tiltDeg: number) {
  const isUranus = name === "Uranus";
  const len = r * 1.35;
  const opacity = isUranus ? 0.5 : 0.15;
  const strokeW = isUranus ? 2 : 1;

  return (
    <g transform={`rotate(${tiltDeg})`}>
      <line
        x1={0} y1={-len} x2={0} y2={len}
        stroke="rgba(255,255,255,1)"
        strokeWidth={strokeW}
        strokeDasharray={isUranus ? "none" : "5,4"}
        opacity={opacity}
      />
      {/* Pole markers */}
      <circle cx={0} cy={-len} r={isUranus ? 4 : 2} fill="rgba(255,255,255,1)" opacity={opacity} />
      <circle cx={0} cy={len} r={isUranus ? 3 : 1.5} fill="rgba(255,255,255,1)" opacity={opacity * 0.6} />
      {/* Uranus: tilt label */}
      {isUranus && (
        <text
          x={8}
          y={-len + 4}
          fill="rgba(160,224,232,0.7)"
          fontSize={14}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
        >
          98°
        </text>
      )}
    </g>
  );
}
