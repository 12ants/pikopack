import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Weather() {
  const count = 1000;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      const y = Math.random() * 50;
      const speed = 0.5 + Math.random() * 0.5;
      temp.push({ x, y, z, speed });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (particle.y < 0) {
        particle.y = 50;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(0.05, 0.8, 0.05);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#88ccff" transparent opacity={0.6} />
    </instancedMesh>
  );
}
