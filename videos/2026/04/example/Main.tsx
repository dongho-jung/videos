import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(1, frame / fps);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: 80,
          fontFamily: "sans-serif",
          opacity,
        }}
      >
        Hello, Remotion!
      </h1>
    </AbsoluteFill>
  );
};
