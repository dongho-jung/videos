import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { THEME } from "./theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const titleScale = interpolate(frame, [15, 60], [0.8, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [15, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [50, 80], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [40, 75], [0, 320], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* exit fade at the end of the intro (last 20 frames) */
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: THEME.fontFamily,
        opacity: exitOpacity,
      }}
    >
      {/* Decorative orbits */}
      {[280, 380, 460].map((r, i) => {
        const orbitOpacity = interpolate(
          frame,
          [10 + i * 8, 40 + i * 8],
          [0, 0.08 + i * 0.02],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `1px solid rgba(150,180,255,${orbitOpacity})`,
            }}
          />
        );
      })}

      {/* Central Sun glow */}
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,220,100,0.25), rgba(255,180,50,0.08) 50%, transparent 70%)",
          opacity: interpolate(frame, [5, 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <div style={{ textAlign: "center", position: "relative" }}>
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: THEME.text,
            letterSpacing: 8,
            textTransform: "uppercase",
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            lineHeight: 1.1,
          }}
        >
          The Solar
          <br />
          System
        </div>

        {/* Divider line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            backgroundColor: "rgba(150,180,255,0.4)",
            margin: "24px auto",
          }}
        />

        <div
          style={{
            fontSize: 28,
            color: "#8899cc",
            fontStyle: "italic",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            letterSpacing: 3,
          }}
        >
          A Tour of Our Cosmic Neighborhood
        </div>
      </div>
    </AbsoluteFill>
  );
};
