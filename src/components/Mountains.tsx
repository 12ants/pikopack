import { useRef } from 'react';
import * as THREE from 'three';

function Mountain({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      {/* A simple cone to represent a mountain */}
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} flatShading />
    </mesh>
  );
}

export function Mountains() {
  const mountainData: { pos: [number, number, number], scale: [number, number, number], color: string }[] = [
    { pos: [150, 40, -200], scale: [100, 80, 100], color: "#2d4c3b" },
    { pos: [-180, 50, -150], scale: [120, 100, 120], color: "#3a5f4b" },
    { pos: [200, 60, 100], scale: [150, 120, 150], color: "#253d2e" },
    { pos: [-220, 45, 180], scale: [110, 90, 110], color: "#2d4c3b" },
    { pos: [0, 30, -250], scale: [140, 60, 140], color: "#426b54" },
    { pos: [80, 55, 220], scale: [130, 110, 130], color: "#3a5f4b" },
    { pos: [-80, 35, 250], scale: [90, 70, 90], color: "#253d2e" },
  ];

  return (
    <group>
      {mountainData.map((m, i) => (
        <Mountain key={i} position={m.pos} scale={m.scale} color={m.color} />
      ))}
    </group>
  );
}
