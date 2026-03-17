import { useRef } from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';
import { useGameStore } from '../store';

// ---------------------------------------------------------------------------
// Physics mass / damping presets
// High mass + high damping = solid urban furniture that can be nudged by a
// vehicle but never goes flying. Lower values for lighter props.
// ---------------------------------------------------------------------------
const HEAVY  = { mass: 600, ld: 0.6, ad: 0.95 };  // bus-stop, billboard, tree, fountain
const MEDIUM = { mass: 250, ld: 0.5, ad: 0.92 };  // bench
const LIGHT  = { mass: 80,  ld: 0.4, ad: 0.90 };  // trash can, hydrant, mailbox, planter, bollard

// ---------------------------------------------------------------------------
// FenceRow — static; individual posts would need too many bodies
// ---------------------------------------------------------------------------
export function FenceRow({ position, rotation, count }: { position: [number, number, number], rotation: [number, number, number], count: number }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const totalWidth = count * 4;
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: count * 40,
    args: [totalWidth, 2, 0.3],
    position: [position[0], position[1] + 1, position[2]],
    rotation,
    linearDamping: 0.5,
    angularDamping: 0.95,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {[...Array(count)].map((_, i) => (
        <group key={i} position={[i * 4 - totalWidth / 2 + 2, 0, 0]}>
          <mesh position={[0, 0, 0]} castShadow={shadows}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
          <mesh position={[2, 0.5, 0]} castShadow={shadows}>
            <boxGeometry args={[4, 0.2, 0.1]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
          <mesh position={[2, -0.3, 0]} castShadow={shadows}>
            <boxGeometry args={[4, 0.2, 0.1]} />
            <meshStandardMaterial color="#4d3a2b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Bench
// ---------------------------------------------------------------------------
export function Bench({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  // Single box collider enclosing the whole bench (3 × 1 × 1 m)
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: MEDIUM.mass,
    args: [3, 0.9, 1],
    position: [position[0], position[1] + 0.45, position[2]],
    rotation,
    linearDamping: MEDIUM.ld,
    angularDamping: MEDIUM.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Legs */}
      <mesh position={[-1.2, -0.05, 0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, -0.05, 0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-1.2, -0.05, -0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, -0.05, -0.4]} castShadow={shadows}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow={shadows}>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.95, -0.45]} rotation={[0.2, 0, 0]} castShadow={shadows}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// TrashCan
// ---------------------------------------------------------------------------
export function TrashCan({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: LIGHT.mass,
    args: [0.9, 1.35, 0.9],
    position: [position[0], position[1] + 0.675, position[2]],
    linearDamping: LIGHT.ld,
    angularDamping: LIGHT.ad,
    allowSleep: true,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow={shadows}>
      <boxGeometry args={[0.9, 1.35, 0.9]} />
      <meshStandardMaterial color="#224422" roughness={0.8} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Bollard
// ---------------------------------------------------------------------------
export function Bollard({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: LIGHT.mass,
    args: [0.35, 1.15, 0.35],
    position: [position[0], position[1] + 0.575, position[2]],
    linearDamping: LIGHT.ld,
    angularDamping: LIGHT.ad,
    allowSleep: true,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow={shadows}>
      <boxGeometry args={[0.35, 1.15, 0.35]} />
      <meshStandardMaterial color="#444444" />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// FireHydrant
// ---------------------------------------------------------------------------
export function FireHydrant({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: LIGHT.mass * 1.5,
    args: [0.5, 0.85, 0.5],
    position: [position[0], position[1] + 0.425, position[2]],
    linearDamping: LIGHT.ld,
    angularDamping: LIGHT.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow={shadows}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
      </mesh>
      <mesh position={[-0.15, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// BusStop — one box for the whole shelter
// ---------------------------------------------------------------------------
export function BusStop({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: HEAVY.mass,
    args: [4.2, 3.2, 1.2],
    position: [position[0], position[1] + 1.6, position[2]],
    rotation,
    linearDamping: HEAVY.ld,
    angularDamping: HEAVY.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Back glass */}
      <mesh position={[0, -0.1, -0.55]} castShadow={shadows}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Side glass */}
      <mesh position={[-2, -0.1, -0.15]} rotation={[0, Math.PI / 2, 0]} castShadow={shadows}>
        <boxGeometry args={[0.8, 3, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.5, -0.15]} castShadow={shadows}>
        <boxGeometry args={[4.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      {/* Poles */}
      <mesh position={[-2, -0.1, -0.55]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      <mesh position={[2, -0.1, -0.55]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#555555" metalness={0.8} />
      </mesh>
      {/* Bench */}
      <mesh position={[0, -0.9, -0.25]} castShadow={shadows}>
        <boxGeometry args={[3, 0.1, 0.6]} />
        <meshStandardMaterial color="#4d3a2b" />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Billboard
// ---------------------------------------------------------------------------
export function Billboard({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  // Physics body covers both pole and board
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: HEAVY.mass,
    args: [0.8, 12, 0.8],
    position: [position[0], position[1] + 6, position[2]],
    rotation,
    linearDamping: HEAVY.ld,
    angularDamping: HEAVY.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Pole */}
      <mesh position={[0, -2, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.3, 0.4, 8, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Board */}
      <mesh position={[0, 2, 0]} castShadow={shadows}>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Ad Face */}
      <mesh position={[0, 2, 0.26]}>
        <planeGeometry args={[7.8, 3.8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------
export function Tree({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  // Upright box collider for the whole tree (trunk + crown)
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: HEAVY.mass,
    args: [1.5, 5, 1.5],
    position: [position[0], position[1] + 2.5, position[2]],
    linearDamping: HEAVY.ld,
    angularDamping: HEAVY.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Trunk */}
      <mesh position={[0, -1.5, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0, 0]} castShadow={shadows}>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 1, 0.5]} castShadow={shadows}>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial color="#3a7033" roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.5, -0.5]} castShadow={shadows}>
        <dodecahedronGeometry args={[1.2]} />
        <meshStandardMaterial color="#24471f" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Planter
// ---------------------------------------------------------------------------
export function Planter({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: LIGHT.mass * 2,
    args: [1, 1.4, 1],
    position: [position[0], position[1] + 0.7, position[2]],
    linearDamping: LIGHT.ld,
    angularDamping: LIGHT.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, -0.3, 0]} castShadow={shadows}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#888888" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow={shadows}>
        <dodecahedronGeometry args={[0.6]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Fountain — large concrete structure, very heavy, barely movable
// ---------------------------------------------------------------------------
export function Fountain({ position }: { position: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: 3000,
    args: [6, 2.4, 6],
    position: [position[0], position[1] + 1.2, position[2]],
    linearDamping: 0.8,
    angularDamping: 0.99,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Base */}
      <mesh position={[0, -1, 0]} castShadow={shadows}>
        <cylinderGeometry args={[3, 3, 0.4, 16]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Water */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.41, 16]} />
        <meshStandardMaterial color="#44aaff" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Center Pillar */}
      <mesh position={[0, -0.2, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.5, 0.8, 2, 8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Top Bowl */}
      <mesh position={[0, 0.8, 0]} castShadow={shadows}>
        <cylinderGeometry args={[1.5, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#cccccc" roughness={0.8} />
      </mesh>
      {/* Top Water */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.31, 16]} />
        <meshStandardMaterial color="#44aaff" transparent opacity={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Mailbox
// ---------------------------------------------------------------------------
export function Mailbox({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Dynamic',
    mass: LIGHT.mass,
    args: [0.6, 1.5, 0.6],
    position: [position[0], position[1] + 0.75, position[2]],
    rotation,
    linearDamping: LIGHT.ld,
    angularDamping: LIGHT.ad,
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, -0.15, 0]} castShadow={shadows}>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#1a4b8c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={shadows}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1a4b8c" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.05, 0.31]}>
        <planeGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

