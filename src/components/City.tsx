import { useBox } from '@react-three/cannon';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

import { useGameStore } from '../store';

import { Chunk } from './Chunk';
import { Bench, TrashCan, Bollard, FireHydrant } from './Props';

function House({ position, size, color }: { position: [number, number, number], size: [number, number, number], color: string }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + size[1] / 2, position[2]],
    args: size,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh castShadow={shadows} receiveShadow={shadows} position={[0, size[1] / 2 + size[0] / 4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[size[0] * 0.8, size[0] / 2, 4]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLight({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 50 : 0,
    position: [position[0], 4, position[2]],
    rotation,
    args: [0.5, 8, 0.5],
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.2, 8, 5]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.1, 0.1, 3, 5]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.3, 2.5]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 3.1, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.5]} />
        <meshStandardMaterial color="#ffcc77" emissive="#ffcc77" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3, 2.5]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 4, 4]} />
        <meshBasicMaterial color="#ffcc77" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function StreetSign({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 20 : 0,
    position: [position[0], 1.5, position[2]],
    rotation,
    args: [0.4, 4, 0.4],
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 1.0, 0.1]} castShadow={shadows}>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#2d6a4f" />
      </mesh>
    </group>
  );
}

function ParkedCar({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 1000 : 0,
    position: [position[0], 0.75, position[2]],
    rotation,
    args: [2, 1.5, 4],
    allowSleep: true,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow={shadows} receiveShadow={shadows}>
      <boxGeometry args={[2, 1.5, 4]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.4} />
    </mesh>
  );
}

function Ramp({ position, rotation, args = [6, 0.5, 8] }: { position: [number, number, number], rotation: [number, number, number], args?: [number, number, number] }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args,
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow={shadows} receiveShadow={shadows}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#ffb703" roughness={0.8} />
    </mesh>
  );
}

function Crate({ position }: { position: [number, number, number] }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 20 : 0,
    position,
    args: [1.5, 1.5, 1.5],
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow={shadows} receiveShadow={shadows}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#d4a373" roughness={0.9} />
    </mesh>
  );
}

function CityBlock({ position, size }: { position: [number, number, number], size: number }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const elevation = position[1];
  const [blockRef] = useBox(() => ({
    type: 'Static',
    position: [position[0], elevation / 2 + 0.25, position[2]],
    args: [size, elevation + 0.5, size]
  }), useRef<THREE.Mesh>(null));

  const { houses, streetLights, signs, parkedCars, props } = useMemo(() => {
    const h = [];
    const sl = [];
    const sg = [];
    const pc = [];
    const pr = [];
    const colors = ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#ffffff', '#a8dadc', '#457b9d', '#1d3557'];
    const carColors = ['#e63946', '#1d3557', '#457b9d', '#f1faee', '#2a9d8f', '#e9c46a'];
    
    const offset = size / 4;
    const positions = [
      [position[0] - offset, position[2] - offset],
      [position[0] + offset, position[2] - offset],
      [position[0] - offset, position[2] + offset],
      [position[0] + offset, position[2] + offset],
    ];

    positions.forEach(pos => {
      if (Math.random() > 0.1) {
        const w = Math.random() * 10 + 15;
        const d = Math.random() * 10 + 15;
        const height = Math.random() * 30 + 15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        h.push({ pos: [pos[0], elevation + 0.5, pos[1]] as [number, number, number], size: [w, height, d] as [number, number, number], color });
      }
    });

    const edgeOffset = size / 2 - 1;
    
    // Street Lights
    sl.push({ pos: [position[0], elevation + 0.5, position[2] + edgeOffset] as [number, number, number], rot: [0, 0, 0] as [number, number, number] });
    sl.push({ pos: [position[0], elevation + 0.5, position[2] - edgeOffset] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] });
    sl.push({ pos: [position[0] + edgeOffset, elevation + 0.5, position[2]] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] });
    sl.push({ pos: [position[0] - edgeOffset, elevation + 0.5, position[2]] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] });

    // Street Signs (Corners)
    const cornerOffset = size / 2 - 1.5;
    sg.push({ pos: [position[0] - cornerOffset, elevation + 0.5, position[2] - cornerOffset] as [number, number, number], rot: [0, Math.PI/4, 0] as [number, number, number] });
    sg.push({ pos: [position[0] + cornerOffset, elevation + 0.5, position[2] + cornerOffset] as [number, number, number], rot: [0, -Math.PI*0.75, 0] as [number, number, number] });
    sg.push({ pos: [position[0] - cornerOffset, elevation + 0.5, position[2] + cornerOffset] as [number, number, number], rot: [0, Math.PI*0.75, 0] as [number, number, number] });
    sg.push({ pos: [position[0] + cornerOffset, elevation + 0.5, position[2] - cornerOffset] as [number, number, number], rot: [0, -Math.PI/4, 0] as [number, number, number] });

    // Props (Benches, Trash Cans, Bollards)
    const sideLength = size - 10;
    const step = 8;
    
    const addPropsLine = (startX: number, startZ: number, dx: number, dz: number, rot: [number, number, number]) => {
      for (let i = -sideLength/2; i <= sideLength/2; i += step) {
        if (Math.random() > 0.6) {
           const type = Math.random();
           const px = startX + (dx * i);
           const pz = startZ + (dz * i);
           // Add some jitter
           const jx = (Math.random() - 0.5) * 0.5;
           const jz = (Math.random() - 0.5) * 0.5;
           
           if (type < 0.3) {
             pr.push({ type: 'bench', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.5) {
             pr.push({ type: 'trash', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.6) {
             pr.push({ type: 'bollard', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.65) {
             pr.push({ type: 'hydrant', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           }
        }
      }
    };

    // North side (Z negative) - Face Road (North/ -Z) -> Rot PI
    addPropsLine(position[0], position[2] - edgeOffset, 1, 0, [0, Math.PI, 0]);
    // South side (Z positive) - Face Road (South/ +Z) -> Rot 0
    addPropsLine(position[0], position[2] + edgeOffset, 1, 0, [0, 0, 0]);
    // East side (X positive) - Face Road (East/ +X) -> Rot -PI/2
    addPropsLine(position[0] + edgeOffset, position[2], 0, 1, [0, -Math.PI/2, 0]);
    // West side (X negative) - Face Road (West/ -X) -> Rot PI/2
    addPropsLine(position[0] - edgeOffset, position[2], 0, 1, [0, Math.PI/2, 0]);


    // Parked Cars (On the road, outside the block)
    const roadOffset = size / 2 + 2;
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + (Math.random() * 20 - 10), 0, position[2] + roadOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + (Math.random() * 20 - 10), 0, position[2] - roadOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + roadOffset, 0, position[2] + (Math.random() * 20 - 10)] as [number, number, number], rot: [0, 0, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] - roadOffset, 0, position[2] + (Math.random() * 20 - 10)] as [number, number, number], rot: [0, 0, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });

    return { houses: h, streetLights: sl, signs: sg, parkedCars: pc, props: pr };
  }, [position, size, elevation]);

  return (
    <group>
      {/* Sidewalk Base */}
      <mesh ref={blockRef} receiveShadow={shadows}>
        <boxGeometry args={[size, elevation + 0.5, size]} />
        <meshStandardMaterial color="#999" roughness={0.9} />
      </mesh>
      {/* Inner Grass */}
      <mesh position={[position[0], elevation + 0.26, position[2]]} receiveShadow={shadows} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size - 4, size - 4]} />
        <meshStandardMaterial color="#4a5d23" roughness={1} />
      </mesh>
      
      {elevation > 0 && (
        <>
          <Ramp position={[position[0], elevation / 2, position[2] + size / 2 + 2]} rotation={[-Math.atan2(elevation, 4), 0, 0]} args={[10, 0.5, 8]} />
          <Ramp position={[position[0], elevation / 2, position[2] - size / 2 - 2]} rotation={[Math.atan2(elevation, 4), 0, 0]} args={[10, 0.5, 8]} />
          <Ramp position={[position[0] + size / 2 + 2, elevation / 2, position[2]]} rotation={[0, 0, Math.atan2(elevation, 4)]} args={[8, 0.5, 10]} />
          <Ramp position={[position[0] - size / 2 - 2, elevation / 2, position[2]]} rotation={[0, 0, -Math.atan2(elevation, 4)]} args={[8, 0.5, 10]} />
        </>
      )}

      {houses.map((h, i) => <House key={`house-${i}`} position={h.pos} size={h.size} color={h.color} />)}
      {streetLights.map((l, i) => <StreetLight key={`light-${i}`} position={l.pos} rotation={l.rot} />)}
      {signs.map((s, i) => <StreetSign key={`sign-${i}`} position={s.pos} rotation={s.rot} />)}
      {parkedCars.map((c, i) => <ParkedCar key={`car-${i}`} position={c.pos} rotation={c.rot} color={c.color} />)}
      {props.map((p, i) => {
        if (p.type === 'bench') return <Bench key={`prop-${i}`} position={p.pos} rotation={p.rot} />;
        if (p.type === 'trash') return <TrashCan key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'bollard') return <Bollard key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'hydrant') return <FireHydrant key={`prop-${i}`} position={p.pos} />;
        return null;
      })}
    </group>
  );
}

function CentralPark({ position, size }: { position: [number, number, number], size: number }) {
  const shadows = useGameStore(s => s.settings.shadows);
  const elevation = position[1];
  const [blockRef] = useBox(() => ({
    type: 'Static',
    position: [position[0], elevation / 2 + 0.25, position[2]],
    args: [size, elevation + 0.5, size]
  }), useRef<THREE.Mesh>(null));

  const { crates, benches } = useMemo(() => {
    const c = [];
    const b = [];
    for(let i=0; i<15; i++) {
      c.push([position[0] + (Math.random() * 20 - 10), elevation + 2, position[2] + (Math.random() * 20 - 10)] as [number, number, number]);
    }
    
    // Add benches along the paths
    const pathLength = size - 10;
    const step = 10;
    for (let i = -pathLength/2; i <= pathLength/2; i += step) {
      // Z-aligned path (X constant)
      if (Math.random() > 0.5) {
        b.push({ pos: [position[0] - 3, elevation + 0.5, position[2] + i] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number] });
      }
      if (Math.random() > 0.5) {
        b.push({ pos: [position[0] + 3, elevation + 0.5, position[2] + i] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number] });
      }
      
      // X-aligned path (Z constant)
      if (Math.random() > 0.5) {
        b.push({ pos: [position[0] + i, elevation + 0.5, position[2] - 3] as [number, number, number], rot: [0, 0, 0] as [number, number, number] });
      }
      if (Math.random() > 0.5) {
        b.push({ pos: [position[0] + i, elevation + 0.5, position[2] + 3] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] });
      }
    }
    
    return { crates: c, benches: b };
  }, [position, elevation]);

  return (
    <group>
      <mesh ref={blockRef} receiveShadow={shadows}>
        <boxGeometry args={[size, elevation + 0.5, size]} />
        <meshStandardMaterial color="#999" roughness={0.9} />
      </mesh>
      <mesh position={[position[0], elevation + 0.26, position[2]]} receiveShadow={shadows} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size - 2, size - 2]} />
        <meshStandardMaterial color="#3a5f4b" roughness={1} />
      </mesh>
      {/* Park Paths */}
      <mesh position={[position[0], elevation + 0.27, position[2]]} receiveShadow={shadows} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, 4]} />
        <meshStandardMaterial color="#d4a373" roughness={1} />
      </mesh>
      <mesh position={[position[0], elevation + 0.27, position[2]]} receiveShadow={shadows} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[size, 4]} />
        <meshStandardMaterial color="#d4a373" roughness={1} />
      </mesh>

      {/* Ramps */}
      <Ramp position={[position[0], elevation + 0.5, position[2] + 15]} rotation={[-0.2, 0, 0]} />
      <Ramp position={[position[0], elevation + 0.5, position[2] - 15]} rotation={[0.2, 0, 0]} />
      <Ramp position={[position[0] + 15, elevation + 0.5, position[2]]} rotation={[0, 0, 0.2]} />
      <Ramp position={[position[0] - 15, elevation + 0.5, position[2]]} rotation={[0, 0, -0.2]} />

      {elevation > 0 && (
        <>
          <Ramp position={[position[0], elevation / 2, position[2] + size / 2 + 2]} rotation={[-Math.atan2(elevation, 4), 0, 0]} args={[10, 0.5, 8]} />
          <Ramp position={[position[0], elevation / 2, position[2] - size / 2 - 2]} rotation={[Math.atan2(elevation, 4), 0, 0]} args={[10, 0.5, 8]} />
          <Ramp position={[position[0] + size / 2 + 2, elevation / 2, position[2]]} rotation={[0, 0, Math.atan2(elevation, 4)]} args={[8, 0.5, 10]} />
          <Ramp position={[position[0] - size / 2 - 2, elevation / 2, position[2]]} rotation={[0, 0, -Math.atan2(elevation, 4)]} args={[8, 0.5, 10]} />
        </>
      )}

      {/* Crates */}
      {crates.map((pos, i) => <Crate key={i} position={pos} />)}
      {benches.map((b, i) => <Bench key={`bench-${i}`} position={b.pos} rotation={b.rot} />)}
    </group>
  );
}

export function City() {
  const blockSize = 60;
  const roadWidth = 20;
  const gridSize = 5;
  
  const blocks = useMemo(() => {
    const b = [];
    const offset = (gridSize * blockSize + (gridSize - 1) * roadWidth) / 2 - blockSize / 2;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const posX = x * (blockSize + roadWidth) - offset;
        const posZ = z * (blockSize + roadWidth) - offset;
        const isPark = (x === 2 && z === 2) || Math.random() > 0.8;
        const elevation = (x === 2 && z === 2) ? 0 : (Math.random() > 0.8 ? 2 : 0);
        b.push({ pos: [posX, elevation, posZ] as [number, number, number], isPark });
      }
    }
    return b;
  }, []);

  return (
    <group>
      {/* Asphalt covering the city area */}
      <mesh position={[0, 0.05, 0]} receiveShadow={useGameStore(s => s.settings.shadows)} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Road markings */}
      <gridHelper args={[400, 5, 0xffffff, 0x333333]} position={[0, 0.06, 0]} />

      {blocks.map((b, i) => (
        <Chunk key={i} position={[b.pos[0], b.pos[2]]} renderDistance={120}>
          {b.isPark ? 
            <CentralPark position={b.pos} size={blockSize} /> :
            <CityBlock position={b.pos} size={blockSize} />
          }
        </Chunk>
      ))}
    </group>
  );
}
