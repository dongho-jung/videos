import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas } from "@react-three/fiber";
import { Donut } from "./Donut";

export const RotateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rotationY = (frame / (fps * 6)) * Math.PI * 2;

  return (
    <AbsoluteFill>
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [3, 2, 3], fov: 40, near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#16162a"]} />

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.8}
          color="#fff5e6"
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />
        <directionalLight
          position={[-4, 3, -2]}
          intensity={0.5}
          color="#c8d8ff"
        />
        <pointLight position={[-2, -2, 4]} intensity={0.4} color="#ffe0cc" />

        {/* Shadow catcher */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.65, 0]}
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.35} />
        </mesh>

        <group rotation={[0.3, rotationY, 0.1]}>
          <Donut />
        </group>
      </Canvas>
    </AbsoluteFill>
  );
};
