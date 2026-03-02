import { useBox } from '@react-three/cannon';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Chunk } from './Chunk';

function Rock({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + scale, position[2]],
    args: [scale * 2, scale * 2, scale * 2],
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <dodecahedronGeometry args={[scale * 1.5, 1]} />
      <meshStandardMaterial color="#555555" roughness={0.9} metalness={0.1} flatShading />
    </mesh>
  );
}

export function Rocks() {
  const chunks = useMemo(() => {
    const rockPositions: { pos: [number, number, number], scale: number }[] = [];
    
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 220 + Math.random() * 150;
      rockPositions.push({ pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius], scale: Math.random() * 2 + 1 });
    }

    const CHUNK_SIZE = 80;
    const map: Record<string, { pos: [number, number, number], scale: number }[]> = {};
    
    rockPositions.forEach(rock => {
      const key = `${Math.floor(rock.pos[0] / CHUNK_SIZE)},${Math.floor(rock.pos[2] / CHUNK_SIZE)}`;
      if (!map[key]) map[key] = [];
      map[key].push(rock);
    });
    
    return map;
  }, []);

  return (
    <group>
      {Object.entries(chunks).map(([key, rocks]) => {
        const [cx, cz] = key.split(',').map(Number);
        return (
          <Chunk key={key} position={[cx * 80 + 40, cz * 80 + 40]} renderDistance={150}>
            {rocks.map((rock, i) => <Rock key={i} position={rock.pos} scale={rock.scale} />)}
          </Chunk>
        );
      })}
    </group>
  );
}
