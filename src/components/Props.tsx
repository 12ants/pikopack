import { useGameStore } from '../store';

export function FenceRow({ position, rotation, count }: { position: [number, number, number], rotation: [number, number, number], count: number }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position} rotation={rotation}>
      {[...Array(count)].map((_, i) => (
        <group key={i} position={[i * 4, 0, 0]}>
          {/* Post */}
          <mesh position={[0, 1, 0]} castShadow={shadows}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
          {/* Rails */}
          <mesh position={[2, 1.5, 0]} castShadow={shadows}>
            <boxGeometry args={[4, 0.2, 0.1]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
          <mesh position={[2, 0.7, 0]} castShadow={shadows}>
            <boxGeometry args={[4, 0.2, 0.1]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Bench({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position} rotation={rotation}>
      {/* Legs */}
      <mesh position={[-1.2, 0.4, 0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, 0.4, 0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-1.2, 0.4, -0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, 0.4, -0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.8, 0]} castShadow={shadows}>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.4, -0.45]} rotation={[0.2, 0, 0]} castShadow={shadows}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
    </group>
  );
}

