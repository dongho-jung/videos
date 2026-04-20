import React, { useMemo } from "react";
import { interpolate, Easing } from "remotion";
import type { AlgorithmResult } from "./types";
import { IsometricBar } from "./IsometricBar";
import {
  COLORS,
  STABILITY_COLORS,
  BAR_WIDTH,
  BAR_GAP,
  MAX_BAR_HEIGHT,
  ISO_DEPTH,
  SVG_WIDTH,
  SVG_HEIGHT,
  SVG_OFFSET_X,
  SVG_BASE_Y,
  FONT_STACK,
} from "./theme";

interface Props {
  result: AlgorithmResult;
  stepIndex: number;
  stepProgress: number;
  caseType: "default" | "stability";
}

export const SortPanel: React.FC<Props> = ({
  result,
  stepIndex,
  stepProgress,
  caseType,
}) => {
  const idx = Math.min(stepIndex, result.steps.length - 1);
  const step = result.steps[idx];
  const prev = idx > 0 ? result.steps[idx - 1] : step;
  const isDone = step.sorted.length === step.array.length;
  const total = result.steps.length;
  const maxVal = Math.max(...step.array.map((e) => e.value));

  const progress = interpolate(stepProgress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  // Stability result check
  const isResultStable = useMemo(() => {
    if (!isDone || caseType !== "stability") return null;
    const arr = step.array;
    for (let i = 1; i < arr.length; i++) {
      if (
        arr[i].value === arr[i - 1].value &&
        arr[i].originalIndex < arr[i - 1].originalIndex
      )
        return false;
    }
    return true;
  }, [isDone, caseType, step.array]);

  const borderColor =
    caseType === "stability" && isDone
      ? isResultStable
        ? COLORS.stableBadge
        : COLORS.unstableBadge
      : COLORS.panelBorder;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.panelBg,
        borderRadius: 12,
        border: `1.5px solid ${borderColor}`,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px",
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              color: COLORS.text,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT_STACK,
            }}
          >
            {result.name}
          </div>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 11,
              fontFamily: FONT_STACK,
            }}
          >
            {result.timeComplexity}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              fontFamily: FONT_STACK,
              padding: "2px 8px",
              borderRadius: 8,
              background:
                (result.stable ? COLORS.stableBadge : COLORS.unstableBadge) +
                "22",
              color: result.stable ? COLORS.stableBadge : COLORS.unstableBadge,
            }}
          >
            {result.stable ? "STABLE" : "UNSTABLE"}
          </div>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 10,
              fontFamily: FONT_STACK,
              marginTop: 2,
            }}
          >
            {isDone
              ? "\u2713 Done"
              : `${Math.min(idx + 1, total)}/${total}`}
          </div>
        </div>
      </div>

      {/* ── Bars (SVG) ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {step.array.map((el, tgt) => {
            const prevIdx = prev.array.findIndex((e) => e.id === el.id);
            const fromX =
              SVG_OFFSET_X + (prevIdx >= 0 ? prevIdx : tgt) * (BAR_WIDTH + BAR_GAP);
            const toX = SVG_OFFSET_X + tgt * (BAR_WIDTH + BAR_GAP);
            const x = fromX + (toX - fromX) * progress;

            const h = Math.max((el.value / maxVal) * MAX_BAR_HEIGHT, 12);
            const isActive = step.active.includes(tgt);
            const isSorted = step.sorted.includes(tgt);

            let color: string;
            if (isActive) {
              color = COLORS.barActive;
            } else if (caseType === "stability") {
              color = isDone && isSorted
                ? (STABILITY_COLORS[el.label] ?? COLORS.barSorted)
                : (STABILITY_COLORS[el.label] ?? COLORS.barDefault);
            } else if (isDone || isSorted) {
              color = COLORS.barSorted;
            } else {
              color = COLORS.barDefault;
            }

            return (
              <IsometricBar
                key={el.id}
                x={x}
                baseY={SVG_BASE_Y}
                width={BAR_WIDTH}
                height={h}
                color={color}
                label={el.label}
                labelColor={
                  caseType === "stability"
                    ? (STABILITY_COLORS[el.label] ?? COLORS.textMuted)
                    : undefined
                }
              />
            );
          })}
        </svg>
      </div>

      {/* ── Bogo indicator ── */}
      {result.name === "Bogo Sort" && !isDone && idx >= result.steps.length - 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.unstableBadge,
            fontSize: 11,
            fontFamily: FONT_STACK,
            fontWeight: 700,
          }}
        >
          {"\u221E"} still shuffling...
        </div>
      )}

      {/* ── Stability result ── */}
      {isDone && caseType === "stability" && isResultStable !== null && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 11,
            fontFamily: FONT_STACK,
            fontWeight: 700,
            color: isResultStable ? COLORS.stableBadge : COLORS.unstableBadge,
          }}
        >
          {isResultStable ? "\uC21C\uC11C \uC720\uC9C0 \u2713" : "\uC21C\uC11C \uBCC0\uACBD \u2717"}
        </div>
      )}

      {/* ── Progress bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${(Math.min(idx + 1, total) / total) * 100}%`,
          background: isDone ? COLORS.barSorted : COLORS.barDefault,
          borderRadius: "0 0 0 12px",
        }}
      />
    </div>
  );
};
