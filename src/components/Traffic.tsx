import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Traffic() {
  const count = 50;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cars = useMemo(() => {
    const temp = [];
    // Based on store.ts intersections and blockCenters
    const roadsX = [-160, -80, 0, 80, 160];
    const roadsZ = [-120, -40, 40, 120];

    for (let i = 0; i < count; i++) {
      const isX = Math.random() > 0.5;
      const road = isX ? roadsX[Math.floor(Math.random() * roadsX.length)] : roadsZ[Math.floor(Math.random() * roadsZ.length)];
      // Offset slightly to be in a lane
      const laneOffset = (Math.random() > 0.5 ? 2 : -2); 
      
      const pos = (Math.random() - 0.5) * 400;
      const speed = (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
      
      temp.push({ 
        isX, 
        road: road + laneOffset, 
        pos, 
        speed,
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5)
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;

    cars.forEach((car, i) => {
      car.pos += car.speed;
      if (car.pos > 250) car.pos = -250;
      if (car.pos < -250) car.pos = 250;

      if (car.isX) {
        dummy.position.set(car.road, 1, car.pos);
        dummy.rotation.set(0, 0, 0); // Align with Z axis movement? No, if moving along Z, rotation 0 is fine if box is long on Z
      } else {
        dummy.position.set(car.pos, 1, car.road);
        dummy.rotation.set(0, Math.PI / 2, 0); // Align with X axis movement
      }

      dummy.scale.set(2, 1.5, 4); // Car shape
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, car.color);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
