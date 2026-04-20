import type { SceneData } from "./types";
import { DATASETS } from "./datasets";
import { runAlgorithms } from "./algorithms";
import {
  FRAMES_PER_STEP,
  SCENE_TITLE_FRAMES,
  SCENE_PAUSE_FRAMES,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "./theme";

function buildScene(
  ds: (typeof DATASETS)[keyof typeof DATASETS],
): SceneData {
  const algorithms = runAlgorithms(ds.data);
  // Max steps across non-Bogo algorithms (Bogo is always last)
  const real = algorithms.slice(0, -1);
  const maxSteps = Math.max(...real.map((a) => a.steps.length));
  return {
    caseTitle: ds.title,
    caseSubtitle: ds.subtitle,
    caseType: ds.caseType,
    algorithms,
    maxSteps,
  };
}

export const SCENES: SceneData[] = [
  buildScene(DATASETS.random),
  buildScene(DATASETS.reversed),
  buildScene(DATASETS.nearlySorted),
  buildScene(DATASETS.stability),
];

export function sceneFrames(s: SceneData): number {
  return SCENE_TITLE_FRAMES + s.maxSteps * FRAMES_PER_STEP + SCENE_PAUSE_FRAMES;
}

export const SCENE_RANGES: { start: number; end: number; scene: SceneData }[] =
  [];
let cursor = INTRO_FRAMES;
for (const s of SCENES) {
  const f = sceneFrames(s);
  SCENE_RANGES.push({ start: cursor, end: cursor + f, scene: s });
  cursor += f;
}

export const TOTAL_FRAMES = cursor + OUTRO_FRAMES;
export { VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT };
