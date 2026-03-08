import { useBox } from '@react-three/cannon';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { useGameStore } from '../store';

import { Chunk } from './Chunk';
import { Bench, TrashCan, Bollard, FireHydrant, BusStop, Billboard, Tree, Mailbox, Planter, Fountain } from './Props';

function House({ position, size, color, style }: { position: [number, number, number], size: [number, number, number], color: string, style: number }) {
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
      {style === 0 && (
        <mesh castShadow={shadows} receiveShadow={shadows} position={[0, size[1] / 2 + size[0] / 4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[size[0] * 0.8, size[0] / 2, 4]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      )}
      {style === 1 && (
        <mesh castShadow={shadows} receiveShadow={shadows} position={[0, size[1] / 2 + size[0] / 4, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[size[0] * 0.5, size[0] * 0.5, size[0] / 2, 4]} />
          <meshStandardMaterial color="#444" roughness={0.8} />
        </mesh>
      )}
      {style === 2 && (
        <group position={[0, size[1] / 2 + 0.5, 0]}>
            <mesh castShadow={shadows} receiveShadow={shadows}>
                <boxGeometry args={[size[0] * 0.9, 1, size[2] * 0.9]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>
            <mesh castShadow={shadows} receiveShadow={shadows} position={[0, 1, 0]}>
                <boxGeometry args={[size[0] * 0.5, 1, size[2] * 0.5]} />
                <meshStandardMaterial color="#555" roughness={0.8} />
            </mesh>
        </group>
      )}
      {style === 3 && (
        <mesh castShadow={shadows} receiveShadow={shadows} position={[0, size[1] / 2 + 0.25, 0]}>
          <boxGeometry args={[size[0], 0.5, size[2]]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      )}
      {style === 4 && (
        <group position={[0, size[1] / 2, 0]}>
          <mesh castShadow={shadows} receiveShadow={shadows} position={[0, 1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#888" metalness={0.8} />
          </mesh>
          <mesh castShadow={shadows} receiveShadow={shadows} position={[0, 2, 0]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="#f00" emissive="#f00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
      {style === 5 && (
        <mesh castShadow={shadows} receiveShadow={shadows} position={[0, 0, 0]}>
          <boxGeometry args={[size[0] * 1.02, size[1] * 0.98, size[2] * 1.02]} />
          <meshStandardMaterial color="#88ccff" roughness={0.2} metalness={0.8} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function StreetLight({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 50 : 0,
    position: [position[0], position[1] + 4, position[2]],
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
    position: [position[0], position[1] + 2, position[2]],
    rotation,
    args: [0.4, 4, 0.4],
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.05, 0.05, 4, 4]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0, 1.0, 0.1]} castShadow={shadows}>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#2d6a4f" />
      </mesh>
    </group>
  );
}

function TrafficLight({ position, rotation, offset = 0 }: { position: [number, number, number], rotation: [number, number, number], offset?: number }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 50 : 0,
    position: [position[0], position[1] + 3, position[2]],
    rotation,
    args: [0.5, 6, 0.5],
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  const redRef = useRef<THREE.MeshStandardMaterial>(null);
  const yellowRef = useRef<THREE.MeshStandardMaterial>(null);
  const greenRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycle = (t + offset) % 10;
    
    let state = 0;
    if (cycle < 4) state = 0; // Green
    else if (cycle < 5) state = 1; // Yellow
    else state = 2; // Red

    if (redRef.current) {
      redRef.current.emissiveIntensity = state === 2 ? 2 : 0;
      redRef.current.color.setHex(state === 2 ? 0xff0000 : 0x330000);
    }
    if (yellowRef.current) {
      yellowRef.current.emissiveIntensity = state === 1 ? 2 : 0;
      yellowRef.current.color.setHex(state === 1 ? 0xffff00 : 0x333300);
    }
    if (greenRef.current) {
      greenRef.current.emissiveIntensity = state === 0 ? 2 : 0;
      greenRef.current.color.setHex(state === 0 ? 0x00ff00 : 0x003300);
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -0.5, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
        <meshStandardMaterial color="#333" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow={shadows}>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.6, 0.31]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial ref={redRef} color="#ff0000" emissive="#ff0000" toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.0, 0.31]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial ref={yellowRef} color="#ffff00" emissive="#ffff00" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.4, 0.31]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial ref={greenRef} color="#00ff00" emissive="#00ff00" toneMapped={false} />
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

  const { houses, streetLights, signs, parkedCars, props, trafficLights, footpaths } = useMemo(() => {
    const h = [];
    const sl = [];
    const sg = [];
    const tl = [];
    const pc = [];
    const pr = [];
    const fp = [];
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
        const style = Math.floor(Math.random() * 6); // 0, 1, 2, 3, 4, 5
        h.push({ pos: [pos[0], elevation + 0.5, pos[1]] as [number, number, number], size: [w, height, d] as [number, number, number], color, style });
        
        // Add a footpath connecting the house to the street
        const dx = pos[0] - position[0];
        const dz = pos[1] - position[2];
        
        // Randomly choose X or Z direction for the path
        if (Math.random() > 0.5) {
          // Path to X street
          const pathLength = (size / 2 - 1) - Math.abs(dx);
          const pathX = position[0] + Math.sign(dx) * (Math.abs(dx) + pathLength / 2);
          fp.push({ pos: [pathX, elevation + 0.27, pos[1]] as [number, number, number], size: [pathLength, 3] as [number, number] });
        } else {
          // Path to Z street
          const pathLength = (size / 2 - 1) - Math.abs(dz);
          const pathZ = position[2] + Math.sign(dz) * (Math.abs(dz) + pathLength / 2);
          fp.push({ pos: [pos[0], elevation + 0.27, pathZ] as [number, number, number], size: [3, pathLength] as [number, number] });
        }
      }
    });

    const edgeOffset = size / 2 - 1.5;
    
    // Street Lights
    const slPositions = [-20, 0, 20];
    slPositions.forEach(p => {
      sl.push({ pos: [position[0] + p, elevation + 0.5, position[2] + edgeOffset] as [number, number, number], rot: [0, 0, 0] as [number, number, number] });
      sl.push({ pos: [position[0] + p, elevation + 0.5, position[2] - edgeOffset] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] });
      sl.push({ pos: [position[0] + edgeOffset, elevation + 0.5, position[2] + p] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] });
      sl.push({ pos: [position[0] - edgeOffset, elevation + 0.5, position[2] + p] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] });
    });

    // Street Signs (Corners)
    const cornerOffset = size / 2 - 2;
    sg.push({ pos: [position[0] - cornerOffset, elevation + 0.5, position[2] - cornerOffset] as [number, number, number], rot: [0, Math.PI/4, 0] as [number, number, number] });
    sg.push({ pos: [position[0] + cornerOffset, elevation + 0.5, position[2] + cornerOffset] as [number, number, number], rot: [0, -Math.PI*0.75, 0] as [number, number, number] });
    sg.push({ pos: [position[0] - cornerOffset, elevation + 0.5, position[2] + cornerOffset] as [number, number, number], rot: [0, Math.PI*0.75, 0] as [number, number, number] });
    sg.push({ pos: [position[0] + cornerOffset, elevation + 0.5, position[2] - cornerOffset] as [number, number, number], rot: [0, -Math.PI/4, 0] as [number, number, number] });

    // Traffic Lights (Corners)
    const tlOffset = size / 2 - 1.5;
    tl.push({ pos: [position[0] - tlOffset, elevation + 0.5, position[2] - tlOffset] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], offset: 0 });
    tl.push({ pos: [position[0] + tlOffset, elevation + 0.5, position[2] - tlOffset] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number], offset: 5 });
    tl.push({ pos: [position[0] + tlOffset, elevation + 0.5, position[2] + tlOffset] as [number, number, number], rot: [0, 0, 0] as [number, number, number], offset: 0 });
    tl.push({ pos: [position[0] - tlOffset, elevation + 0.5, position[2] + tlOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], offset: 5 });

    // Props (Benches, Trash Cans, Bollards)
    const sideLength = size - 10;
    const step = 4;
    const propsOffset = size / 2 - 2.5;
    
    const addPropsLine = (startX: number, startZ: number, dx: number, dz: number, rot: [number, number, number]) => {
      for (let i = -sideLength/2; i <= sideLength/2; i += step) {
        // Avoid placing props near footpaths (which are at +/- 15)
        if (Math.abs(i - 15) < 3 || Math.abs(i + 15) < 3) continue;
        // Avoid placing props near street lights (which are at 0, +/- 20)
        if (Math.abs(i) < 2 || Math.abs(i - 20) < 2 || Math.abs(i + 20) < 2) continue;

        if (Math.random() > 0.3) {
           const type = Math.random();
           const px = startX + (dx * i);
           const pz = startZ + (dz * i);
           // Add some jitter
           const jx = (Math.random() - 0.5) * 0.5;
           const jz = (Math.random() - 0.5) * 0.5;
           
           if (type < 0.15) {
             pr.push({ type: 'bench', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.3) {
             pr.push({ type: 'trash', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.45) {
             pr.push({ type: 'bollard', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.55) {
             pr.push({ type: 'hydrant', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.65) {
             pr.push({ type: 'mailbox', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.75) {
             pr.push({ type: 'busstop', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.8) {
             pr.push({ type: 'billboard', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot });
           } else if (type < 0.9) {
             pr.push({ type: 'planter', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot: [0,0,0] as [number, number, number] });
           } else {
             pr.push({ type: 'tree', pos: [px + jx, elevation + 0.5, pz + jz] as [number, number, number], rot: [0,0,0] as [number, number, number] });
           }
        }
      }
    };

    // North side (Z negative) - Face Road (North/ -Z) -> Rot PI
    addPropsLine(position[0], position[2] - propsOffset, 1, 0, [0, Math.PI, 0]);
    // South side (Z positive) - Face Road (South/ +Z) -> Rot 0
    addPropsLine(position[0], position[2] + propsOffset, 1, 0, [0, 0, 0]);
    // East side (X positive) - Face Road (East/ +X) -> Rot -PI/2
    addPropsLine(position[0] + propsOffset, position[2], 0, 1, [0, -Math.PI/2, 0]);
    // West side (X negative) - Face Road (West/ -X) -> Rot PI/2
    addPropsLine(position[0] - propsOffset, position[2], 0, 1, [0, Math.PI/2, 0]);

    // Add trees inside the block
    for(let i=0; i<5; i++) {
        if (Math.random() > 0.5) {
            pr.push({ type: 'tree', pos: [position[0] + (Math.random() * (size - 10) - (size - 10)/2), elevation + 0.5, position[2] + (Math.random() * (size - 10) - (size - 10)/2)] as [number, number, number], rot: [0,0,0] as [number, number, number] });
        }
    }

    // Parked Cars (On the road, outside the block)
    const roadOffset = size / 2 + 2;
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + (Math.random() * 20 - 10), 0, position[2] + roadOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + (Math.random() * 20 - 10), 0, position[2] - roadOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] + roadOffset, 0, position[2] + (Math.random() * 20 - 10)] as [number, number, number], rot: [0, 0, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });
    if (Math.random() > 0.2) pc.push({ pos: [position[0] - roadOffset, 0, position[2] + (Math.random() * 20 - 10)] as [number, number, number], rot: [0, 0, 0] as [number, number, number], color: carColors[Math.floor(Math.random() * carColors.length)] });

    return { houses: h, streetLights: sl, signs: sg, parkedCars: pc, props: pr, trafficLights: tl, footpaths: fp };
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
      
      {/* Footpaths */}
      {footpaths.map((fp, i) => (
        <mesh key={`fp-${i}`} position={fp.pos} receiveShadow={shadows} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={fp.size} />
          <meshStandardMaterial color="#d4a373" roughness={1} />
        </mesh>
      ))}

      {houses.map((h, i) => <House key={`house-${i}`} position={h.pos} size={h.size} color={h.color} style={h.style} />)}
      {streetLights.map((l, i) => <StreetLight key={`light-${i}`} position={l.pos} rotation={l.rot} />)}
      {signs.map((s, i) => <StreetSign key={`sign-${i}`} position={s.pos} rotation={s.rot} />)}
      {trafficLights.map((t, i) => <TrafficLight key={`tl-${i}`} position={t.pos} rotation={t.rot} offset={t.offset} />)}
      {parkedCars.map((c, i) => <ParkedCar key={`car-${i}`} position={c.pos} rotation={c.rot} color={c.color} />)}
      {props.map((p, i) => {
        if (p.type === 'bench') return <Bench key={`prop-${i}`} position={p.pos} rotation={p.rot} />;
        if (p.type === 'trash') return <TrashCan key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'bollard') return <Bollard key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'hydrant') return <FireHydrant key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'mailbox') return <Mailbox key={`prop-${i}`} position={p.pos} rotation={p.rot} />;
        if (p.type === 'busstop') return <BusStop key={`prop-${i}`} position={p.pos} rotation={p.rot} />;
        if (p.type === 'billboard') return <Billboard key={`prop-${i}`} position={p.pos} rotation={p.rot} />;
        if (p.type === 'planter') return <Planter key={`prop-${i}`} position={p.pos} />;
        if (p.type === 'tree') return <Tree key={`prop-${i}`} position={p.pos} />;
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

  const { crates, benches, trashCans, trafficLights, trees, planters, streetLights } = useMemo(() => {
    const c = [];
    const b = [];
    const tc = [];
    const tl = [];
    const tr = [];
    const pl = [];
    const sl = [];
    for(let i=0; i<15; i++) {
      c.push([position[0] + (Math.random() * 20 - 10), elevation + 2, position[2] + (Math.random() * 20 - 10)] as [number, number, number]);
    }
    
    // Add trees to the park
    for(let i=0; i<12; i++) {
      tr.push([position[0] + (Math.random() * 40 - 20), elevation + 0.5, position[2] + (Math.random() * 40 - 20)] as [number, number, number]);
    }
    
    // Add planters to the park
    for(let i=0; i<8; i++) {
      pl.push([position[0] + (Math.random() * 30 - 15), elevation + 0.5, position[2] + (Math.random() * 30 - 15)] as [number, number, number]);
    }
    
    // Add benches and trash cans along the paths
    const pathLength = size - 10;
    const step = 8;
    for (let i = -pathLength/2; i <= pathLength/2; i += step) {
      // Z-aligned path (X constant)
      if (Math.random() > 0.4) {
        b.push({ pos: [position[0] - 3, elevation + 0.5, position[2] + i] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number] });
      } else if (Math.random() > 0.5) {
        tc.push({ pos: [position[0] - 3, elevation + 0.5, position[2] + i] as [number, number, number] });
      }
      if (Math.random() > 0.4) {
        b.push({ pos: [position[0] + 3, elevation + 0.5, position[2] + i] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number] });
      } else if (Math.random() > 0.5) {
        tc.push({ pos: [position[0] + 3, elevation + 0.5, position[2] + i] as [number, number, number] });
      }
      
      // X-aligned path (Z constant)
      if (Math.random() > 0.4) {
        b.push({ pos: [position[0] + i, elevation + 0.5, position[2] - 3] as [number, number, number], rot: [0, 0, 0] as [number, number, number] });
      } else if (Math.random() > 0.5) {
        tc.push({ pos: [position[0] + i, elevation + 0.5, position[2] - 3] as [number, number, number] });
      }
      if (Math.random() > 0.4) {
        b.push({ pos: [position[0] + i, elevation + 0.5, position[2] + 3] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] });
      } else if (Math.random() > 0.5) {
        tc.push({ pos: [position[0] + i, elevation + 0.5, position[2] + 3] as [number, number, number] });
      }
    }
    
    // Traffic Lights (Corners)
    const tlOffset = size / 2 - 1.5;
    tl.push({ pos: [position[0] - tlOffset, elevation + 0.5, position[2] - tlOffset] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number], offset: 0 });
    tl.push({ pos: [position[0] + tlOffset, elevation + 0.5, position[2] - tlOffset] as [number, number, number], rot: [0, -Math.PI/2, 0] as [number, number, number], offset: 5 });
    tl.push({ pos: [position[0] + tlOffset, elevation + 0.5, position[2] + tlOffset] as [number, number, number], rot: [0, 0, 0] as [number, number, number], offset: 0 });
    tl.push({ pos: [position[0] - tlOffset, elevation + 0.5, position[2] + tlOffset] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], offset: 5 });

    // Street Lights
    const edgeOffset = size / 2 - 1.5;
    const slPositions = [-20, 0, 20];
    slPositions.forEach(p => {
      sl.push({ pos: [position[0] + p, elevation + 0.5, position[2] + edgeOffset] as [number, number, number], rot: [0, 0, 0] as [number, number, number] });
      sl.push({ pos: [position[0] + p, elevation + 0.5, position[2] - edgeOffset] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] });
      sl.push({ pos: [position[0] + edgeOffset, elevation + 0.5, position[2] + p] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] });
      sl.push({ pos: [position[0] - edgeOffset, elevation + 0.5, position[2] + p] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] });
    });

    return { crates: c, benches: b, trashCans: tc, trafficLights: tl, trees: tr, planters: pl, streetLights: sl };
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

      {/* Crates */}
      {crates.map((pos, i) => <Crate key={i} position={pos} />)}
      {benches.map((b, i) => <Bench key={`bench-${i}`} position={b.pos} rotation={b.rot} />)}
      {trashCans.map((tc, i) => <TrashCan key={`tc-${i}`} position={tc.pos} />)}
      {trafficLights.map((t, i) => <TrafficLight key={`tl-${i}`} position={t.pos} rotation={t.rot} offset={t.offset} />)}
      {streetLights.map((l, i) => <StreetLight key={`light-${i}`} position={l.pos} rotation={l.rot} />)}
      {trees.map((pos, i) => <Tree key={`tree-${i}`} position={pos} />)}
      {planters.map((pos, i) => <Planter key={`planter-${i}`} position={pos} />)}
      
      {/* Center Fountain */}
      <Fountain position={[position[0], elevation + 0.5, position[2]]} />
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
