import { useBox } from '@react-three/cannon';
import { useRef } from 'react';
import * as THREE from 'three';

export function Ramp({ position, rotation, args }: any) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#fff" wireframe />
    </mesh>
  );
}

export function Box({ position, args, mass = 1 }: any) {
  const [ref] = useBox(() => ({
    mass,
    position,
    args,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#fff" wireframe />
    </mesh>
  );
}

export function Obstacles() {
  return (
    <group>
      {/* Track Walls */}
      <Box position={[0, 2, -100]} args={[200, 4, 2]} mass={0} />
      <Box position={[0, 2, 100]} args={[200, 4, 2]} mass={0} />
      <Box position={[-100, 2, 0]} args={[2, 4, 200]} mass={0} />
      <Box position={[100, 2, 0]} args={[2, 4, 200]} mass={0} />

      {/* Center Obstacles */}
      <Ramp position={[0, 1, -20]} rotation={[0.2, 0, 0]} args={[10, 2, 10]} />
      <Ramp position={[15, 2, -40]} rotation={[0, 0, 0.3]} args={[10, 4, 10]} />
      <Ramp position={[-15, 2, -60]} rotation={[0, 0, -0.3]} args={[10, 4, 10]} />
      
      {/* A stack of boxes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={`box1-${i}`} position={[-10, i * 2 + 1, -20]} args={[2, 2, 2]} mass={50} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={`box2-${i}`} position={[10, i * 2 + 1, -60]} args={[2, 2, 2]} mass={50} />
      ))}
    </group>
  );
}
