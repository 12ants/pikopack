import { LOCATIONS } from '../store';
import * as THREE from 'three';

export function DeliveryZones() {
  return (
    <group>
      {LOCATIONS.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Subtle ground circle to show service area */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[2.8, 3, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
          
          {/* Small center dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>

          {/* Vertical light beam (very faint) */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 2, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
