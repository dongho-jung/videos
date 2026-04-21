import { Composition } from "remotion";
import { Main } from "./Main";

const FPS = 30;
const SCENE1_SEC = 6;
const SCENE2_SEC = 8;

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={(SCENE1_SEC + SCENE2_SEC) * FPS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
