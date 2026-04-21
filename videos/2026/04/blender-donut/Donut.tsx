import * as THREE from "three";
import React, { useMemo } from "react";

/* ── seeded PRNG ── */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPRINKLE_COLORS = [
  "#E8272C",
  "#F28B30",
  "#F7D94C",
  "#3CB44B",
  "#4363D8",
  "#911EB4",
  "#F032E6",
  "#42D4F4",
  "#FFFAC8",
];

/* ── icing drip profile ── */
function dripExtra(u: number, seed: number): number {
  const base = 0.3;
  const noise =
    0.15 * Math.sin(u * 3 + seed * 0.1) +
    0.1 * Math.sin(u * 7 + seed * 0.3 + 1.2) +
    0.07 * Math.sin(u * 13 + seed * 0.7);
  const drip1 =
    0.5 * Math.pow(Math.max(0, Math.cos((u - 1.2 - seed * 0.05) * 3.5)), 5);
  const drip2 =
    0.45 *
    Math.pow(Math.max(0, Math.cos((u - 3.8 - seed * 0.08) * 3.5)), 5);
  const drip3 =
    0.35 *
    Math.pow(Math.max(0, Math.cos((u - 5.5 - seed * 0.03) * 3.5)), 5);
  return base + noise + drip1 + drip2 + drip3;
}

/* ── icing geometry ── */
function createIcingGeometry(
  R: number,
  r: number,
  thickness: number,
  ringSteps: number,
  tubeSteps: number,
  seed: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= ringSteps; i++) {
    const u = (i / ringSteps) * Math.PI * 2;
    const cosU = Math.cos(u);
    const sinU = Math.sin(u);
    const extra = dripExtra(u, seed);
    const vMin = -extra;
    const vMax = Math.PI + extra;

    for (let j = 0; j <= tubeSteps; j++) {
      const t = j / tubeSteps;
      const v = vMin + t * (vMax - vMin);
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);

      const edgeFade = Math.sin(t * Math.PI);
      const localR = r + thickness * Math.pow(edgeFade, 0.25);

      positions.push(
        (R + localR * cosV) * cosU,
        (R + localR * cosV) * sinU,
        localR * sinV,
      );
    }
  }

  for (let i = 0; i < ringSteps; i++) {
    for (let j = 0; j < tubeSteps; j++) {
      const a = i * (tubeSteps + 1) + j;
      const b = (i + 1) * (tubeSteps + 1) + j;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/* ── sprinkles ── */
interface SprinkleData {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
  color: string;
}

function createSprinkles(
  R: number,
  r: number,
  thickness: number,
  count: number,
  seed: number,
): SprinkleData[] {
  const rand = mulberry32(seed + 999);
  const out: SprinkleData[] = [];

  for (let i = 0; i < count; i++) {
    const u = rand() * Math.PI * 2;
    const extra = dripExtra(u, seed);
    const t = 0.12 + rand() * 0.76;
    const vMin = -extra;
    const vMax = Math.PI + extra;
    const v = vMin + t * (vMax - vMin);

    const cosV = Math.cos(v);
    const sinV = Math.sin(v);
    const cosU = Math.cos(u);
    const sinU = Math.sin(u);
    const sR = r + thickness + 0.012;

    const x = (R + sR * cosV) * cosU;
    const y = (R + sR * cosV) * sinU;
    const z = sR * sinV;

    const normal = new THREE.Vector3(
      cosV * cosU,
      cosV * sinU,
      sinV,
    ).normalize();
    const arb =
      Math.abs(normal.z) < 0.9
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(1, 0, 0);
    const tangent = new THREE.Vector3()
      .crossVectors(normal, arb)
      .normalize()
      .applyAxisAngle(normal, rand() * Math.PI * 2)
      .normalize();

    out.push({
      position: [x, y, z],
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        tangent,
      ),
      color: SPRINKLE_COLORS[Math.floor(rand() * SPRINKLE_COLORS.length)],
    });
  }
  return out;
}

/* ── component ── */
interface DonutProps {
  icingColor?: string;
  bodyColor?: string;
  sprinkleCount?: number;
  seed?: number;
  detail?: "high" | "low";
}

export const Donut: React.FC<DonutProps> = ({
  icingColor = "#FF85B3",
  bodyColor = "#C5813A",
  sprinkleCount = 80,
  seed = 42,
  detail = "high",
}) => {
  const R = 1;
  const r = 0.42;
  const icingThickness = 0.06;
  const isHigh = detail === "high";

  const { bodyGeo, icingGeo, sprinkles } = useMemo(() => {
    const body = new THREE.TorusGeometry(
      R,
      r,
      isHigh ? 32 : 14,
      isHigh ? 64 : 28,
    );
    const pos = body.attributes.position as THREE.BufferAttribute;
    for (let idx = 0; idx < pos.count; idx++) {
      const px = pos.getX(idx);
      const py = pos.getY(idx);
      const pz = pos.getZ(idx);
      const angle = Math.atan2(py, px);
      const bump =
        0.018 * Math.sin(angle * 5 + pz * 8 + seed) +
        0.012 * Math.sin(angle * 11 + pz * 14 + seed * 2) +
        0.007 * Math.sin(angle * 23 + pz * 19 + seed * 3);
      const dist = Math.sqrt(px * px + py * py);
      if (dist > 0.01) {
        pos.setXYZ(
          idx,
          px + (px / dist) * bump,
          py + (py / dist) * bump,
          pz + bump * 0.5,
        );
      }
    }
    body.computeVertexNormals();

    const icing = createIcingGeometry(
      R,
      r,
      icingThickness,
      isHigh ? 96 : 28,
      isHigh ? 32 : 14,
      seed,
    );

    const spr =
      sprinkleCount > 0
        ? createSprinkles(R, r, icingThickness, sprinkleCount, seed)
        : [];

    return { bodyGeo: body, icingGeo: icing, sprinkles: spr };
  }, [seed, sprinkleCount, isHigh]);

  const sprinkleGeo = useMemo(
    () => new THREE.CapsuleGeometry(0.013, 0.04, 3, 5),
    [],
  );

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>
      <mesh geometry={icingGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={icingColor}
          roughness={0.15}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>
      {sprinkles.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          quaternion={s.quaternion}
          geometry={sprinkleGeo}
          castShadow
        >
          <meshStandardMaterial color={s.color} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};
