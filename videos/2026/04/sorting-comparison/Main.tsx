import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SortPanel } from "./SortPanel";
import { SceneTitle } from "./SceneTitle";
import {
  COLORS,
  FONT_STACK,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  GRID_COLS,
  FRAMES_PER_STEP,
  SCENE_TITLE_FRAMES,
  INTRO_FRAMES,
  OUTRO_FRAMES,
} from "./theme";
import { SCENES, SCENE_RANGES, TOTAL_FRAMES } from "./scenes";

const SPACE_COMPLEXITIES: Record<string, string> = {
  "Bubble Sort": "O(1)",
  "Selection Sort": "O(1)",
  "Insertion Sort": "O(1)",
  "Shell Sort": "O(1)",
  "Merge Sort": "O(n)",
  "Quick Sort": "O(log n)",
  "Heap Sort": "O(1)",
  "Bogo Sort": "O(1)",
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Intro ───────────────────────────────
  if (frame < INTRO_FRAMES) {
    const op = interpolate(
      frame,
      [0, 20, INTRO_FRAMES - 15, INTRO_FRAMES],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const sc = interpolate(frame, [0, 20], [0.9, 1], {
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
            opacity: op,
            transform: `scale(${sc})`,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.text,
              fontFamily: FONT_STACK,
              letterSpacing: -3,
            }}
          >
            Sorting Algorithms
          </div>
          <div
            style={{
              fontSize: 32,
              color: COLORS.textMuted,
              fontFamily: FONT_STACK,
              marginTop: 16,
            }}
          >
            정렬 알고리즘 비교
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 40,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            {SCENES[0].algorithms.map((a) => (
              <div
                key={a.name}
                style={{
                  fontSize: 16,
                  color: COLORS.barDefault,
                  fontFamily: FONT_STACK,
                  padding: "6px 14px",
                  border: `1px solid ${COLORS.panelBorder}`,
                  borderRadius: 8,
                }}
              >
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Outro ───────────────────────────────
  const outroStart = TOTAL_FRAMES - OUTRO_FRAMES;
  if (frame >= outroStart) {
    const f = frame - outroStart;
    const op = interpolate(f, [0, 20, OUTRO_FRAMES - 20, OUTRO_FRAMES], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
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
            opacity: op,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: COLORS.text,
              fontFamily: FONT_STACK,
              marginBottom: 36,
            }}
          >
            Summary
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 120px 100px 80px",
              gap: "10px 32px",
              fontFamily: FONT_STACK,
              fontSize: 18,
            }}
          >
            {/* header */}
            <div style={{ color: COLORS.textMuted, fontWeight: 700 }}>
              Algorithm
            </div>
            <div style={{ color: COLORS.textMuted, fontWeight: 700 }}>
              Time
            </div>
            <div style={{ color: COLORS.textMuted, fontWeight: 700 }}>
              Space
            </div>
            <div style={{ color: COLORS.textMuted, fontWeight: 700 }}>
              Stable
            </div>

            {SCENES[0].algorithms.map((a) => (
              <React.Fragment key={a.name}>
                <div style={{ color: COLORS.text }}>{a.name}</div>
                <div style={{ color: COLORS.barDefault }}>
                  {a.timeComplexity}
                </div>
                <div style={{ color: COLORS.barDefault }}>
                  {SPACE_COMPLEXITIES[a.name]}
                </div>
                <div
                  style={{
                    color: a.stable
                      ? COLORS.stableBadge
                      : COLORS.unstableBadge,
                  }}
                >
                  {a.stable ? "\u25CF Yes" : "\u25CB No"}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Find active scene ───────────────────
  const range = SCENE_RANGES.find((r) => frame >= r.start && frame < r.end);
  if (!range) {
    return (
      <div
        style={{
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          background: COLORS.bg,
        }}
      />
    );
  }

  const sf = frame - range.start; // scene-local frame
  const scene = range.scene;

  // scene title phase
  if (sf < SCENE_TITLE_FRAMES) {
    return (
      <SceneTitle title={scene.caseTitle} subtitle={scene.caseSubtitle} frame={sf} />
    );
  }

  // animation phase
  const af = sf - SCENE_TITLE_FRAMES;
  const stepFloat = af / FRAMES_PER_STEP;
  const stepIdx = Math.floor(stepFloat);
  const stepProg = stepFloat - stepIdx;

  return (
    <div
      style={{
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        padding: "20px 32px",
        boxSizing: "border-box",
      }}
    >
      {/* scene label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 10,
          height: 32,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            color: COLORS.text,
            fontSize: 20,
            fontFamily: FONT_STACK,
            fontWeight: 700,
          }}
        >
          {scene.caseTitle}
        </span>
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 15,
            fontFamily: FONT_STACK,
          }}
        >
          {scene.caseSubtitle}
        </span>
      </div>

      {/* grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: "1fr 1fr",
          gap: 14,
          flex: 1,
        }}
      >
        {scene.algorithms.map((algo, i) => {
          // stagger entrance
          const delay = i * 3;
          const panelOp = interpolate(af, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const panelTy = interpolate(af, [delay, delay + 12], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={algo.name}
              style={{
                opacity: panelOp,
                transform: `translateY(${panelTy}px)`,
                height: "100%",
              }}
            >
              <SortPanel
                result={algo}
                stepIndex={stepIdx}
                stepProgress={stepProg}
                caseType={scene.caseType}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
