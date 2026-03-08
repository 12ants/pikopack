import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useGameStore, globalCarPosition } from '../store';

export function Player() {
  const playerState = useGameStore(s => s.playerState);
  const setPlayerState = useGameStore(s => s.setPlayerState);
  const playerPosition = useGameStore(s => s.playerPosition);
  
  const [ref, api] = useSphere(() => ({
    mass: 70,
    type: 'Dynamic',
    position: playerPosition,
    args: [0.5],
    fixedRotation: true,
  }), useRef<THREE.Mesh>(null));

  const controls = useKeyboard();
  const velocity = useRef([0, 0, 0]);
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const speed = new THREE.Vector3();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lastInteract = useRef(false);

  useEffect(() => {
    if (playerState === 'walking') {
      api.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      api.velocity?.set(0, 0, 0);
    } else {
      api.position.set(0, -100, 0);
      api.velocity?.set(0, 0, 0);
    }
  }, [playerState, playerPosition, api.position, api.velocity]);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, [api.velocity]);

  useFrame((state) => {
    if (playerState !== 'walking') return;

    const { forward, backward, left, right, interact } = controls;
    
    if (ref.current) {
      const playerPos = new THREE.Vector3();
      ref.current.getWorldPosition(playerPos);
      
      // Interact to enter car
      if (interact && !lastInteract.current) {
        const carPos = new THREE.Vector3(globalCarPosition.x, globalCarPosition.y, globalCarPosition.z);
        if (playerPos.distanceTo(carPos) < 5) {
          setPlayerState('driving');
        }
      }
      lastInteract.current = interact;

      // Movement
      frontVector.set(0, 0, Number(backward) - Number(forward));
      sideVector.set(Number(left) - Number(right), 0, 0);
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5);
      
      // Apply only Y rotation
      const euler = new THREE.Euler(0, state.camera.rotation.y, 0, 'YXZ');
      direction.applyEuler(euler);
      
      api.velocity?.set(direction.x, velocity.current[1], direction.z);

      // Sync camera
      state.camera.position.copy(playerPos);
      state.camera.position.y += 1.6; // Eye level
    }
  });

  return (
    <>
      {playerState === 'walking' && <PointerLockControls />}
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}
