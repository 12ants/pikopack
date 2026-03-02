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
      {/* Invisible collision plane */}
      <mesh ref={ref} visible={false}>
        <planeGeometry args={[2000, 2000]} />
      </mesh>
      
      {/* Outer Grass Plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#2d4c3b" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}
