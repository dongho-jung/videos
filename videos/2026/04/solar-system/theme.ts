export const THEME = {
  bg: "#050510",
  text: "#ffffff",
  textDim: "#8888aa",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
} as const;

export const TIMING = {
  FPS: 30,
  INTRO_FRAMES: 120, // 4 s
  PLANET_FRAMES: 390, // 13 s each
  OUTRO_FRAMES: 360, // 12 s
  FADE_FRAMES: 30,
  TOTAL_FRAMES: 3600, // 120 s
} as const;
