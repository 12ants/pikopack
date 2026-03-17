import { useBox } from '@react-three/cannon';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { useFrame } from '@react-three/fiber';

export function DeliveryZone() {
  const { hasPackage, targetLocation } = useGameStore();

  const [ref, api] = useBox(() => ({
    isTrigger: true,
    args: [10, 10, 10],
    position: [targetLocation[0], 5, targetLocation[2]],
    onCollide: (e) => {
      if (e.body.userData?.id === 'car') {
        const state = useGameStore.getState();
        if (state.hasPackage) {
          state.dropoff();
        } else {
          state.pickup();
        }
      }
    }
  }), useRef<THREE.Mesh>(null));

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    api.position.set(targetLocation[0], 5, targetLocation[2]);
  }, [targetLocation, api.position]);

  const color = hasPackage ? "#00ff00" : "#0088ff";
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime();
      ringRef.current.position.y = 2 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }
  });

  return (
    <>
      <mesh ref={ref} visible={false}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <group position={[targetLocation[0], 0, targetLocation[2]]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[3.5, 4.5, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[2, 0.3, 16, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 3, 0]} color={color} intensity={10} distance={20} />
      </group>
    </>
  );
}
