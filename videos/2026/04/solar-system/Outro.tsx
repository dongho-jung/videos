import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { PLANETS } from "./data";
import { THEME } from "./theme";

const OUTRO_PLANET_SIZES = [18, 35, 38, 24, 110, 95, 55, 52];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  /* Title */
  const titleOpacity = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Fade out at end */
  const exitOpacity = interpolate(frame, [300, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Entry opacity for the whole scene */
  const entryOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: THEME.fontFamily,
        opacity: entryOpacity * exitOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: THEME.text,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          The Solar System
        </div>
        <div
          style={{
            fontSize: 22,
            color: THEME.textDim,
            marginTop: 12,
            letterSpacing: 2,
          }}
        >
          Eight Worlds, One Star
        </div>
      </div>

      {/* Planet parade */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginTop: 40,
        }}
      >
        {/* Sun (partial) */}
        <div
          style={{
            width: 70,
            height: 140,
            borderRadius: "0 140px 140px 0",
            background:
              "radial-gradient(circle at -30% 50%, #ffdd60, #ff9922 60%, #cc6600)",
            boxShadow: "0 0 50px 15px rgba(255,180,50,0.3)",
            opacity: interpolate(frame, [10, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            marginRight: 12,
          }}
        />

        {PLANETS.map((planet, i) => {
          const size = OUTRO_PLANET_SIZES[i];
          const delay = 30 + i * 18;
          const pOpacity = interpolate(frame, [delay, delay + 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pScale = interpolate(frame, [delay, delay + 25], [0.5, 1], {
            easing: Easing.out(Easing.back(1.5)),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // gentle float
          const floatY =
            Math.sin(frame * 0.03 + i * 1.2) * 4;

          return (
            <div
              key={planet.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                opacity: pOpacity,
                transform: `scale(${pScale}) translateY(${floatY}px)`,
              }}
            >
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, ${planet.colors.highlight}, ${planet.colors.primary} 50%, ${planet.colors.secondary})`,
                  boxShadow: `0 0 ${size * 0.4}px ${size * 0.1}px ${planet.colors.atmosphere}40`,
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  color: THEME.textDim,
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {planet.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          textAlign: "center",
          opacity: interpolate(frame, [180, 220], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontSize: 18,
          color: THEME.textDim,
          letterSpacing: 2,
        }}
      >
        Not to scale
      </div>
    </AbsoluteFill>
  );
};
