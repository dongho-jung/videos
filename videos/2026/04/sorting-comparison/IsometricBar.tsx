import React from "react";
import { ISO_DEPTH } from "./theme";

interface Props {
  x: number;
  baseY: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  labelColor?: string;
}

function shift(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export const IsometricBar: React.FC<Props> = ({
  x,
  baseY,
  width,
  height,
  color,
  label,
  labelColor,
}) => {
  const d = ISO_DEPTH;
  const top = baseY - height;

  return (
    <g>
      {/* front face */}
      <rect x={x} y={top} width={width} height={height} fill={color} />
      {/* top face */}
      <polygon
        points={`${x},${top} ${x + d},${top - d} ${x + width + d},${top - d} ${x + width},${top}`}
        fill={shift(color, 40)}
      />
      {/* right face */}
      <polygon
        points={`${x + width},${top} ${x + width + d},${top - d} ${x + width + d},${baseY - d} ${x + width},${baseY}`}
        fill={shift(color, -40)}
      />
      {label && (
        <text
          x={x + width / 2 + d / 2}
          y={baseY + 16}
          textAnchor="middle"
          fill={labelColor ?? "#8B949E"}
          fontSize={9}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
};
