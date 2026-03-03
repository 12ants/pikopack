import { useGameStore } from '../store';
import { FenceRow, Bench, TrashCan, Bollard } from './Props';

export function EnvironmentDetails() {
  const shadows = useGameStore(s => s.settings.shadows);

  return (
    <group>
      {/* Fences around the town edges */}
      <FenceRow position={[-180, 0, -180]} rotation={[0, 0, 0]} count={10} />
      <FenceRow position={[-180, 0, 180]} rotation={[0, 0, 0]} count={10} />
      <FenceRow position={[-180, 0, -180]} rotation={[0, Math.PI / 2, 0]} count={10} />
      <FenceRow position={[180, 0, -180]} rotation={[0, Math.PI / 2, 0]} count={10} />

      {/* Street Lamps at intersections */}
      {[-120, -40, 40, 120].map(x => (
        [-120, -40, 40, 120].map(z => (
          <group key={`${x}-${z}`}>
            <StreetLamp position={[x + 5, 0, z + 5]} />
            <TrashCan position={[x - 5, 0, z - 5]} />
            <Bollard position={[x + 3, 0, z - 3]} />
            <Bollard position={[x - 3, 0, z + 3]} />
            <Bench position={[x - 5, 0, z + 5]} rotation={[0, Math.PI / 2, 0]} />
          </group>
        ))
      ))}

      {/* Some abandoned cars/junk in the outskirts */}
      <JunkPile position={[150, 0, 150]} />
      <JunkPile position={[-150, 0, 150]} />
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.5, 0.2, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Arm */}
      <mesh position={[0.5, 7.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={shadows}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[1, 7.6, 0]} castShadow={shadows}>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Light Source */}
      <mesh position={[1, 7.45, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={5} />
      </mesh>
      <pointLight position={[1, 7, 0]} intensity={120} distance={15} color="#ffffaa" />
    </group>
  );
}

function JunkPile({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} rotation={[0.2, 0.5, 0.1]} castShadow={shadows}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#332211" metalness={0.8} roughness={0.9} />
      </mesh>
      <mesh position={[1, 0.3, 2]} rotation={[0, -0.3, 0.5]} castShadow={shadows}>
        <cylinderGeometry args={[1, 1, 0.5, 8]} />
        <meshStandardMaterial color="#221100" metalness={0.9} roughness={0.8} />
      </mesh>
      <mesh position={[-1, 0.2, -1]} rotation={[0.5, 0, 0]} castShadow={shadows}>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color="#443322" />
      </mesh>
    </group>
  );
}
