import React, { useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Canvas, useThree } from "@react-three/fiber";
import * as CANNON from "cannon-es";
import { Donut } from "./Donut";

const SCENE2_FRAMES = 8 * 30; // 240

const ICING_COLORS = [
  "#FF85B3",
  "#8B4513",
  "#FFFFFF",
  "#87CEEB",
  "#FFD700",
  "#A8E6A3",
  "#FF6347",
  "#DDA0DD",
];

/* ── seeded PRNG ── */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface DonutConfig {
  id: number;
  x: number;
  z: number;
  startY: number;
  scale: number;
  icingColor: string;
  seed: number;
}

interface FrameSnapshot {
  positions: [number, number, number][];
  rotations: [number, number, number, number][];
}

/* ── cannon-es pre-computation ── */
function simulate(
  configs: DonutConfig[],
  totalFrames: number,
): FrameSnapshot[] {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -15, 0) });
  (world.solver as CANNON.GSSolver).iterations = 8;

  const donutMat = new CANNON.Material("donut");
  const groundMat = new CANNON.Material("ground");

  world.addContactMaterial(
    new CANNON.ContactMaterial(donutMat, groundMat, {
      restitution: 0.45,
      friction: 0.4,
    }),
  );
  world.addContactMaterial(
    new CANNON.ContactMaterial(donutMat, donutMat, {
      restitution: 0.3,
      friction: 0.3,
    }),
  );

  // Ground at y = 0
  const ground = new CANNON.Body({ mass: 0, material: groundMat });
  ground.addShape(new CANNON.Plane());
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(ground);

  // Donut rigid bodies
  const rand = mulberry32(77777);
  const R = 1.0;
  const r = 0.42;
  const bodies: CANNON.Body[] = configs.map((cfg) => {
    const body = new CANNON.Body({
      mass: cfg.scale * 2,
      material: donutMat,
      linearDamping: 0.05,
      angularDamping: 0.15,
    });
    body.position.set(cfg.x, cfg.startY, cfg.z);
    body.velocity.set(
      (rand() - 0.5) * 2,
      -rand() * 3,
      (rand() - 0.5) * 2,
    );
    body.angularVelocity.set(
      (rand() - 0.5) * 6,
      (rand() - 0.5) * 4,
      (rand() - 0.5) * 6,
    );

    // 8 spheres in a ring ≈ torus collider
    const s = cfg.scale;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      body.addShape(
        new CANNON.Sphere(r * s * 0.85),
        new CANNON.Vec3(Math.cos(a) * R * s, 0, Math.sin(a) * R * s),
      );
    }

    world.addBody(body);
    return body;
  });

  // Step simulation
  const frames: FrameSnapshot[] = [];
  for (let f = 0; f < totalFrames; f++) {
    world.step(1 / 60);
    world.step(1 / 60); // 2 substeps → 60 Hz physics at 30 fps
    frames.push({
      positions: bodies.map((b) => [b.position.x, b.position.y, b.position.z]),
      rotations: bodies.map((b) => [
        b.quaternion.x,
        b.quaternion.y,
        b.quaternion.z,
        b.quaternion.w,
      ]),
    });
  }

  return frames;
}

/* ── camera ── */
function CameraLookUp() {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 100, 0);
  }, [camera]);
  return null;
}

/* ── scene ── */
export const RainScene: React.FC = () => {
  const frame = useCurrentFrame();

  const { configs, sim } = useMemo(() => {
    const rand = mulberry32(12345);
    const cfgs: DonutConfig[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (rand() - 0.5) * 28,
      z: (rand() - 0.5) * 28,
      startY: 12 + rand() * 45,
      scale: 0.35 + rand() * 0.4,
      icingColor: ICING_COLORS[Math.floor(rand() * ICING_COLORS.length)],
      seed: Math.floor(rand() * 10000),
    }));
    const simData = simulate(cfgs, SCENE2_FRAMES);
    return { configs: cfgs, sim: simData };
  }, []);

  const snap = sim[Math.min(frame, sim.length - 1)];
  const quat = useMemo(() => new THREE.Quaternion(), []);

  return (
    <AbsoluteFill>
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, -2, 0], fov: 100, near: 0.1, far: 250 }}
      >
        <color attach="background" args={["#87CEEB"]} />
        <CameraLookUp />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 30, 5]}
          intensity={1.0}
          color="#fff8ee"
        />
        <directionalLight
          position={[-5, 20, -5]}
          intensity={0.3}
          color="#d4e5ff"
        />

        {configs.map((d, i) => {
          const [x, y, z] = snap.positions[i];
          if (y < -10) return null;
          quat.set(...snap.rotations[i]);

          return (
            <group
              key={d.id}
              position={[x, y, z]}
              quaternion={quat.clone()}
              scale={d.scale}
            >
              <Donut
                icingColor={d.icingColor}
                seed={d.seed}
                sprinkleCount={0}
                detail="low"
              />
            </group>
          );
        })}
      </Canvas>
    </AbsoluteFill>
  );
};
