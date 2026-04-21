import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import type { PlanetData } from "./data";
import { PlanetVisual } from "./PlanetVisual";
import { FeatureAnimation } from "./FeatureAnimations";
import { THEME } from "./theme";

interface Props {
  planet: PlanetData;
}

/*
  Revised timing — more reading time:
   0- 60  planet entrance
  28- 90  name + tagline (3 seconds to read before features)
  90-220  feature 1 (130 frames = 4.3 s)
 230-360  feature 2 (130 frames = 4.3 s, 10-frame gap)
 355-390  exit
*/
const F1_START = 90;
const F1_DUR = 130;
const F2_START = 230;
const F2_DUR = 130;

/* ── seeded RNG for ambient particles ───────────────────────────── */
function srand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ── Ambient floating particles (planet-colored) ────────────────── */
const AmbientParticles: React.FC<{
  color: string;
  frame: number;
  seed: number;
}> = ({ color, frame, seed }) => {
  const particles = useMemo(() => {
    const rng = srand(seed);
    return Array.from({ length: 30 }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      size: 1.5 + rng() * 4,
      speedX: (rng() - 0.5) * 0.015,
      speedY: (rng() - 0.5) * 0.012,
      opacity: 0.05 + rng() * 0.15,
      phase: rng() * Math.PI * 2,
      pulseRate: 0.02 + rng() * 0.04,
    }));
  }, [seed]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((p, i) => {
        const x = (p.x + frame * p.speedX) % 100;
        const y = (p.y + frame * p.speedY) % 100;
        const op = p.opacity * (0.5 + 0.5 * Math.sin(frame * p.pulseRate + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(x + 100) % 100}%`,
              top: `${(y + 100) % 100}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: op,
              boxShadow: p.size > 3 ? `0 0 ${p.size * 3}px ${p.size}px ${color}30` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

export const PlanetScene: React.FC<Props> = ({ planet }) => {
  const frame = useCurrentFrame();

  /* ── scene fade ───────────────────────────────────────────────── */
  const opacity = interpolate(frame, [0, 30, 360, 390], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── planet entrance ──────────────────────────────────────────── */
  const planetScale = interpolate(frame, [0, 55], [0.4, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const planetX = interpolate(frame, [0, 55], [-100, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  /* ── badge ────────────────────────────────────────────────────── */
  const badgeOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── name ─────────────────────────────────────────────────────── */
  const nameOpacity = interpolate(frame, [28, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [28, 52], [30, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── tagline ──────────────────────────────────────────────────── */
  const tagOpacity = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── feature animations ───────────────────────────────────────── */
  const f1Frame = frame - F1_START;
  const f2Frame = frame - F2_START;
  const f1Opacity = interpolate(
    frame,
    [F1_START, F1_START + 20, F1_START + F1_DUR - 15, F1_START + F1_DUR],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const f2Opacity = interpolate(
    frame,
    [F2_START, F2_START + 20, F2_START + F2_DUR - 15, F2_START + F2_DUR],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const c1Op = interpolate(
    frame,
    [F1_START + 12, F1_START + 30, F1_START + F1_DUR - 18, F1_START + F1_DUR],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const c2Op = interpolate(
    frame,
    [F2_START + 12, F2_START + 30, F2_START + F2_DUR - 18, F2_START + F2_DUR],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── background glow (stronger) ───────────────────────────────── */
  const bgGlow = interpolate(frame, [0, 60], [0, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── pulsing ring around planet ───────────────────────────────── */
  const ringPulse = 0.15 + 0.1 * Math.sin(frame * 0.06);
  const ringScale = interpolate(frame, [20, 60], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        perspective: 1200,
      }}
    >
      {/* ── Background layers ─────────────────────────────────────── */}

      {/* Primary colored glow (planet side) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 22% 50%, ${planet.colors.atmosphere}${Math.round(bgGlow * 255)
            .toString(16)
            .padStart(2, "0")}, transparent 65%)`,
        }}
      />

      {/* Secondary glow (feature side, subtler) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 75% 60%, ${planet.colors.primary}${Math.round(bgGlow * 0.3 * 255)
            .toString(16)
            .padStart(2, "0")}, transparent 50%)`,
        }}
      />

      {/* Ambient floating particles */}
      <AmbientParticles
        color={planet.colors.highlight}
        frame={frame}
        seed={planet.order * 1000}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Planet visual (left side) ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: "2%",
          top: 0,
          bottom: 0,
          width: "34%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Pulsing ring behind planet */}
        <div
          style={{
            position: "absolute",
            width: planet.visualRadius * 2.6,
            height: planet.visualRadius * 2.6,
            borderRadius: "50%",
            border: `1.5px solid ${planet.colors.highlight}`,
            opacity: ringPulse * ringScale,
            transform: `scale(${planetScale})`,
          }}
        />

        <div
          style={{
            transform: `scale(${planetScale}) translateX(${planetX}px) translateZ(40px)`,
          }}
        >
          <PlanetVisual planet={planet} />
        </div>
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: "37%",
          right: "3%",
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          fontFamily: THEME.fontFamily,
          paddingTop: 50,
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            fontSize: 17,
            fontWeight: 600,
            color: planet.colors.highlight,
            letterSpacing: 5,
            marginBottom: 10,
          }}
        >
          {planet.order} / 8
        </div>

        {/* Name — big and bold */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            fontSize: 88,
            fontWeight: 800,
            color: THEME.text,
            lineHeight: 1,
            letterSpacing: -2,
            marginBottom: 8,
            textShadow: `0 0 40px ${planet.colors.atmosphere}40`,
          }}
        >
          {planet.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            fontSize: 26,
            fontStyle: "italic",
            color: planet.colors.highlight,
            marginBottom: 24,
            textShadow: `0 0 20px ${planet.colors.atmosphere}30`,
          }}
        >
          {planet.tagline}
        </div>

        {/* ── Feature animation area ──────────────────────────────── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            maxHeight: 520,
          }}
        >
          {/* Feature 1 */}
          {f1Frame >= 0 && f1Frame <= F1_DUR && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: f1Opacity,
              }}
            >
              <div style={{ width: "100%", height: "82%", padding: 8 }}>
                <FeatureAnimation
                  planetName={planet.name}
                  featureIndex={0}
                  frame={f1Frame}
                  duration={F1_DUR}
                  accentColor={planet.colors.highlight}
                />
              </div>
              <div
                style={{
                  opacity: c1Op,
                  fontSize: 22,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  marginTop: 8,
                  paddingLeft: 6,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {planet.features[0]}
              </div>
            </div>
          )}

          {/* Feature 2 */}
          {f2Frame >= 0 && f2Frame <= F2_DUR && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: f2Opacity,
              }}
            >
              <div style={{ width: "100%", height: "82%", padding: 8 }}>
                <FeatureAnimation
                  planetName={planet.name}
                  featureIndex={1}
                  frame={f2Frame}
                  duration={F2_DUR}
                  accentColor={planet.colors.highlight}
                />
              </div>
              <div
                style={{
                  opacity: c2Op,
                  fontSize: 22,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  marginTop: 8,
                  paddingLeft: 6,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {planet.features[1]}
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
