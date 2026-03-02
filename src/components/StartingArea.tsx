import { useBox } from '@react-three/cannon';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { FenceRow } from './Props';

export function StartingArea() {
  const shadows = useGameStore(s => s.settings.shadows);

  // Main barren plateau
  const [plateauRef] = useBox(() => ({
    type: 'Static',
    position: [200, 25, 200],
    args: [100, 50, 100],
  }), useRef<THREE.Mesh>(null));

  // Ramp down to the city
  const [rampRef] = useBox(() => ({
    type: 'Static',
    position: [130, 12.5, 130],
    rotation: [0, Math.PI / 4, -Math.PI / 8],
    args: [120, 2, 40],
  }), useRef<THREE.Mesh>(null));

  // Shack Body
  const [shackRef] = useBox(() => ({
    type: 'Static',
    position: [215, 53, 215],
    args: [8, 6, 12],
  }), useRef<THREE.Mesh>(null));

  return (
    <group>
      {/* Plateau */}
      <mesh ref={plateauRef} receiveShadow={shadows} castShadow={shadows}>
        <boxGeometry args={[100, 50, 100]} />
        <meshStandardMaterial color="#5c5346" roughness={0.9} />
      </mesh>

      {/* Ramp */}
      <mesh ref={rampRef} receiveShadow={shadows} castShadow={shadows}>
        <boxGeometry args={[120, 2, 40]} />
        <meshStandardMaterial color="#4a4338" roughness={0.9} />
      </mesh>

      {/* The Shack */}
      <group position={[215, 50, 215]}>
        {/* Main structure */}
        <mesh ref={shackRef} castShadow={shadows} receiveShadow={shadows}>
          <boxGeometry args={[8, 6, 12]} />
          <meshStandardMaterial color="#4d3a2b" roughness={1} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 6.5, 0]} rotation={[0, 0, 0]} castShadow={shadows}>
          <coneGeometry args={[7, 3, 4]} />
          <meshStandardMaterial color="#2d241c" roughness={1} />
        </mesh>
        {/* Door */}
        <mesh position={[4.01, 2, 0]}>
          <boxGeometry args={[0.1, 4, 2]} />
          <meshStandardMaterial color="#1a140f" />
        </mesh>
        {/* Window */}
        <mesh position={[4.01, 3.5, 3]}>
          <boxGeometry args={[0.1, 1.5, 1.5]} />
          <meshStandardMaterial color="#88ccff" emissive="#446688" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Scenery around the shack */}
      <group position={[200, 50, 200]}>
        {/* Some old crates */}
        <mesh position={[5, 1, 10]} castShadow={shadows}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#5c4a3c" />
        </mesh>
        <mesh position={[7, 0.75, 11]} rotation={[0, 0.5, 0]} castShadow={shadows}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#6d5a4c" />
        </mesh>
        
        {/* A rusted pole */}
        <mesh position={[12, 4, 8]} castShadow={shadows}>
          <cylinderGeometry args={[0.1, 0.1, 8]} />
          <meshStandardMaterial color="#332211" metalness={0.8} roughness={0.8} />
        </mesh>

        {/* Old Tire */}
        <mesh position={[3, 0.35, 15]} rotation={[Math.PI / 2, 0.2, 0]} castShadow={shadows}>
          <torusGeometry args={[0.7, 0.3, 8, 16]} />
          <meshStandardMaterial color="#111111" roughness={1} />
        </mesh>

        {/* Scattered debris */}
        <mesh position={[-5, 0.1, 5]} rotation={[0, 0.8, 0]} castShadow={shadows}>
          <boxGeometry args={[3, 0.2, 1]} />
          <meshStandardMaterial color="#443322" />
        </mesh>
      </group>

      {/* Some scattered rocks on the plateau */}
      {[...Array(10)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            200 + (Math.random() - 0.5) * 80, 
            50.5, 
            200 + (Math.random() - 0.5) * 80
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
          castShadow={shadows}
        >
          <dodecahedronGeometry args={[Math.random() * 2 + 1, 0]} />
          <meshStandardMaterial color="#4a4338" roughness={0.9} />
        </mesh>
      ))}

      {/* Fences around the plateau edge */}
      <FenceRow position={[150, 50, 150]} rotation={[0, Math.PI / 4, 0]} count={5} />
      <FenceRow position={[250, 50, 150]} rotation={[0, -Math.PI / 4, 0]} count={5} />
    </group>
  );
}
