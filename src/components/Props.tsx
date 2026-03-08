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

export function BusStop({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position} rotation={rotation}>
      {/* Back glass */}
      <mesh position={[0, 1.5, -0.8]} castShadow={shadows}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Side glass */}
      <mesh position={[-2, 1.5, -0.4]} rotation={[0, Math.PI / 2, 0]} castShadow={shadows}>
        <boxGeometry args={[0.8, 3, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.1, -0.4]} rotation={[0.05, 0, 0]} castShadow={shadows}>
        <boxGeometry args={[4.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      {/* Poles */}
      <mesh position={[-2, 1.5, -0.8]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      <mesh position={[2, 1.5, -0.8]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      {/* Bench */}
      <mesh position={[0, 0.6, -0.5]} castShadow={shadows}>
        <boxGeometry args={[3, 0.1, 0.6]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
    </group>
  );
}

export function Billboard({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.3, 0.4, 8, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Board */}
      <mesh position={[0, 8, 0]} castShadow={shadows}>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Ad Face */}
      <mesh position={[0, 8, 0.26]}>
        <planeGeometry args={[7.8, 3.8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function Tree({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 2.5, 0]} castShadow={shadows}>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 3.5, 0.5]} castShadow={shadows}>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial color="#3a7033" roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 3, -0.5]} castShadow={shadows}>
        <dodecahedronGeometry args={[1.2]} />
        <meshStandardMaterial color="#24471f" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Planter({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow={shadows}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#888888" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow={shadows}>
        <dodecahedronGeometry args={[0.6]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Fountain({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow={shadows}>
        <cylinderGeometry args={[3, 3, 0.4, 16]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.41, 16]} />
        <meshStandardMaterial color="#44aaff" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Center Pillar */}
      <mesh position={[0, 1, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.5, 0.8, 2, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Top Bowl */}
      <mesh position={[0, 2, 0]} castShadow={shadows}>
        <cylinderGeometry args={[1.5, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Top Water */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.31, 16]} />
        <meshStandardMaterial color="#44aaff" transparent opacity={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function Mailbox({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.6, 0]} castShadow={shadows}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#1a4b8c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={shadows}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1a4b8c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0.31]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

