import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { TOTAL_FRAMES, VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from "./scenes";

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
