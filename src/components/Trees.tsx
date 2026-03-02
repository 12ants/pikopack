import { useBox } from '@react-three/cannon';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { Chunk } from './Chunk';
import { useMemo } from 'react';

function Tree({ position }: { position: [number, number, number] }) {
  const destructibles = useGameStore(s => s.settings.destructibles);
  const shadows = useGameStore(s => s.settings.shadows);
  
  const [ref] = useBox(() => ({
    type: destructibles ? 'Dynamic' : 'Static',
    mass: destructibles ? 150 : 0,
    position: [position[0], position[1] + 2.5, position[2]],
    args: [0.8, 5, 0.8],
    allowSleep: true,
  }), useRef<THREE.Group>(null));

  return (
    <group ref={ref}>
      {/* Trunk */}
      <mesh position={[0, -1.5, 0]} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.2, 0.3, 2, 5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.5, 0]} castShadow={shadows} receiveShadow={shadows}>
        <coneGeometry args={[1.5, 3, 5]} />
        <meshStandardMaterial color="#2e8b57" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow={shadows} receiveShadow={shadows}>
        <coneGeometry args={[1.2, 2.5, 5]} />
        <meshStandardMaterial color="#3cb371" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Trees() {
  const chunks = useMemo(() => {
    const treePositions: [number, number, number][] = [];
    
    // Central park trees
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      treePositions.push([x, 0.5, z]);
    }
    
    // Outer forest trees
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 220 + Math.random() * 150;
      treePositions.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }

    const CHUNK_SIZE = 80;
    const map: Record<string, [number, number, number][]> = {};
    
    treePositions.forEach(pos => {
      const key = `${Math.floor(pos[0] / CHUNK_SIZE)},${Math.floor(pos[2] / CHUNK_SIZE)}`;
      if (!map[key]) map[key] = [];
      map[key].push(pos);
    });
    
    return map;
  }, []);

  return (
    <group>
      {Object.entries(chunks).map(([key, positions]) => {
        const [cx, cz] = key.split(',').map(Number);
        return (
          <Chunk key={key} position={[cx * 80 + 40, cz * 80 + 40]} renderDistance={150}>
            {positions.map((pos, i) => <Tree key={i} position={pos} />)}
          </Chunk>
        );
      })}
    </group>
  );
}
