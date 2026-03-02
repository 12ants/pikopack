import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { globalCarPosition } from '../store';

export function Chunk({ position, children, renderDistance = 150 }: { position: [number, number], children: React.ReactNode, renderDistance?: number }) {
  const getDist = () => Math.sqrt(
    Math.pow(globalCarPosition.x - position[0], 2) + 
    Math.pow(globalCarPosition.z - position[1], 2)
  );
  
  const [mounted, setMounted] = useState(() => getDist() < renderDistance);
  
  useFrame(() => {
    const dist = getDist();
    if (dist < renderDistance && !mounted) {
      setMounted(true);
    } else if (dist > renderDistance + 30 && mounted) {
      setMounted(false);
    }
  });

  return mounted ? <group>{children}</group> : null;
}
