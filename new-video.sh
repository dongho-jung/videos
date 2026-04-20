#!/usr/bin/env bash
set -euo pipefail

name="${1:?Usage: ./new-video.sh <name>}"
dir="videos/$(date +%Y/%m)/${name}"

if [ -d "$dir" ]; then
  echo "Already exists: $dir" >&2
  exit 1
fi

mkdir -p "$dir"

cat > "$dir/index.ts" << 'EOF'
import { registerRoot } from "remotion";
import { Root } from "./Root";

registerRoot(Root);
EOF

cat > "$dir/Root.tsx" << 'EOF'
import { Composition } from "remotion";
import { Main } from "./Main";

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
EOF

cat > "$dir/Main.tsx" << 'EOF'
import { AbsoluteFill } from "remotion";

export const Main: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
      }}
    >
      <h1 style={{ color: "white", fontSize: 80, fontFamily: "sans-serif" }}>
        TODO
      </h1>
    </AbsoluteFill>
  );
};
EOF

echo "Created: $dir"
echo "Studio:  npx remotion studio $dir/index.ts"
