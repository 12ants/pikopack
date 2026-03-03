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

export function TrashCan({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.4, 0.35, 1.2, 12]} />
        <meshStandardMaterial color="#224422" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.45, 0.4, 0.1, 12]} />
        <meshStandardMaterial color="#112211" />
      </mesh>
    </group>
  );
}

export function Bollard({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow={shadows}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

export function FireHydrant({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow={shadows}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, -Math.PI/2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
      </mesh>
       <mesh position={[-0.15, 0.6, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
      </mesh>
    </group>
  );
}

