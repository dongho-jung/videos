import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS, SCENE_TITLE_FRAMES, FONT_STACK, VIDEO_WIDTH, VIDEO_HEIGHT } from "./theme";

interface Props {
  title: string;
  subtitle: string;
  frame: number;
}

export const SceneTitle: React.FC<Props> = ({ title, subtitle, frame }) => {
  const opacity = interpolate(
    frame,
    [0, 15, SCENE_TITLE_FRAMES - 15, SCENE_TITLE_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const ty = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        background: COLORS.bg,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity,
          transform: `translateY(${ty}px)`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.text,
            fontFamily: FONT_STACK,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: COLORS.textMuted,
            fontFamily: FONT_STACK,
            marginTop: 12,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};
