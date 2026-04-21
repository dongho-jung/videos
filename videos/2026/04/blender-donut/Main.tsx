import { AbsoluteFill, Sequence } from "remotion";
import { RotateScene } from "./RotateScene";
import { RainScene } from "./RainScene";

const FPS = 30;
const SCENE1_FRAMES = 6 * FPS;
const SCENE2_FRAMES = 8 * FPS;

export const Main: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE1_FRAMES}>
        <RotateScene />
      </Sequence>
      <Sequence from={SCENE1_FRAMES} durationInFrames={SCENE2_FRAMES}>
        <RainScene />
      </Sequence>
    </AbsoluteFill>
  );
};
