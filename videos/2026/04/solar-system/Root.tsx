import { Composition } from "remotion";
import { Main } from "./Main";
import { TIMING } from "./theme";

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TIMING.TOTAL_FRAMES}
      fps={TIMING.FPS}
      width={1920}
      height={1080}
    />
  );
};
