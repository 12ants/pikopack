import { usePlane } from '@react-three/cannon';
import { useRef } from 'react';
import * as THREE from 'three';

export function Ground() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    material: 'ground',
  }), useRef<THREE.Mesh>(null));

  return (
    <group>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <gridHelper args={[1000, 100, '#333', '#222']} position={[0, 0.01, 0]} />
    </group>
  );
}
