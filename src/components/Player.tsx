import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useGameStore, globalCarPosition } from '../store';

function CharacterModel({ rotation, velocity, turnDir }: { rotation: number, velocity: THREE.Vector3, turnDir: number }) {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current || !bodyRef.current || !leftLegRef.current || !rightLegRef.current || !leftArmRef.current || !rightArmRef.current) return;
    
    // Smooth rotation
    const currentRotation = group.current.rotation.y;
    // Shortest path interpolation
    let diff = rotation - currentRotation;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    group.current.rotation.y += diff * 0.15;

    // Lean into turns
    const targetLean = turnDir * 0.2;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetLean, 0.1);

    const t = state.clock.elapsedTime;
    const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
    const isJumping = Math.abs(velocity.y) > 0.5;

    if (isJumping) {
      // Jump pose
      leftLegRef.current.rotation.x = -0.5;
      rightLegRef.current.rotation.x = 0.2;
      leftArmRef.current.rotation.x = Math.PI; // arms up
      rightArmRef.current.rotation.x = Math.PI;
      bodyRef.current.position.y = 0.75;
    } else if (speed > 0.1) {
      // Walk/Sprint cycle
      const animSpeed = speed > 10 ? 15 : 10;
      const walkCycle = Math.sin(t * animSpeed);
      leftLegRef.current.rotation.x = walkCycle * 0.5;
      rightLegRef.current.rotation.x = -walkCycle * 0.5;
      leftArmRef.current.rotation.x = -walkCycle * 0.5;
      rightArmRef.current.rotation.x = walkCycle * 0.5;
      bodyRef.current.position.y = 0.75 + Math.abs(Math.sin(t * animSpeed)) * 0.1;
    } else {
      // Idle
      const idleCycle = Math.sin(t * 2);
      leftLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.x = 0;
      leftArmRef.current.rotation.x = 0;
      rightArmRef.current.rotation.x = 0;
      bodyRef.current.position.y = 0.75 + idleCycle * 0.02;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="royalblue" />
        
        {/* Head attached to body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="peachpuff" />
          {/* Eyes */}
          <mesh position={[0.1, 0.1, 0.21]}><boxGeometry args={[0.08,0.08,0.08]}/><meshStandardMaterial color="black"/></mesh>
          <mesh position={[-0.1, 0.1, 0.21]}><boxGeometry args={[0.08,0.08,0.08]}/><meshStandardMaterial color="black"/></mesh>
        </mesh>
        
        {/* Arms attached to body */}
        <group ref={leftArmRef} position={[0.4, 0.3, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[-0.4, 0.3, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
        </group>
      </mesh>
      
      {/* Legs */}
      <group ref={leftLegRef} position={[0.15, 0.35, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color="darkblue" />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[-0.15, 0.35, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.2, 0.7, 0.2]} />
          <meshStandardMaterial color="darkblue" />
        </mesh>
      </group>
    </group>
  );
}

export function Player() {
  const playerState = useGameStore(s => s.playerState);
  const setPlayerState = useGameStore(s => s.setPlayerState);
  const playerPosition = useGameStore(s => s.playerPosition);
  const setInteractPrompt = useGameStore(s => s.setInteractPrompt);
  
  const [ref, api] = useSphere(() => ({
    mass: 70,
    type: 'Dynamic',
    position: playerPosition,
    args: [0.5],
    fixedRotation: true,
    linearDamping: 0.1,
    angularDamping: 0.9,
    allowSleep: false,
  }), useRef<THREE.Mesh>(null));

  const controls = useKeyboard();
  const velocity = useRef([0, 0, 0]);
  const direction = new THREE.Vector3();
  const lastInteract = useRef(false);
  const playerRotation = useRef(0);
  const lastPrompt = useRef<string | null>(null);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (playerState === 'walking') {
      api.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      api.velocity?.set(0, 0, 0);
      api.angularVelocity?.set(0, 0, 0);
    } else {
      api.position.set(0, -100, 0);
      api.velocity?.set(0, 0, 0);
      api.angularVelocity?.set(0, 0, 0);
    }
  }, [playerState, playerPosition, api.position, api.velocity, api.angularVelocity]);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, [api.velocity]);

  useFrame((state) => {
    if (playerState !== 'walking') {
      // Keep player frozen while driving so they don't fall infinitely
      api.velocity?.set(0, 0, 0);
      api.angularVelocity?.set(0, 0, 0);
      velocity.current = [0, 0, 0];
      return;
    }

    const { forward, backward, left, right, interact, brake: jump, sprint } = controls as any;
    
    if (ref.current) {
      const playerPos = new THREE.Vector3();
      ref.current.getWorldPosition(playerPos);
      
      // If player is still at the hidden position, don't update camera yet
      if (playerPos.y < -50) return;
      
      const carPos = new THREE.Vector3(globalCarPosition.x, globalCarPosition.y, globalCarPosition.z);
      const distToCar = playerPos.distanceTo(carPos);
      
      // Update interaction prompt
      const newPrompt = distToCar < 5 ? 'Press F to enter vehicle' : null;
      if (newPrompt !== lastPrompt.current) {
        setInteractPrompt(newPrompt);
        lastPrompt.current = newPrompt;
      }

      // Interact to enter car
      if (interact && !lastInteract.current) {
        if (distToCar < 5) {
          setPlayerState('driving');
          setInteractPrompt(null);
          lastPrompt.current = null;
        }
      }
      lastInteract.current = interact;

      // Rotation
      const rotationSpeed = 0.05;
      if (left) playerRotation.current += rotationSpeed;
      if (right) playerRotation.current -= rotationSpeed;
      
      const turnDir = Number(left) - Number(right);

      // Movement
      const targetSpeed = sprint ? 14 : 8;
      const moveDir = Number(forward) - Number(backward);
      
      direction.set(0, 0, moveDir * targetSpeed);
      
      // Apply player rotation
      const euler = new THREE.Euler(0, playerRotation.current, 0, 'YXZ');
      direction.applyEuler(euler);
      
      // Smooth acceleration/deceleration
      const currentVelocityX = velocity.current[0];
      const currentVelocityZ = velocity.current[2];
      
      // Faster acceleration, slower deceleration (friction)
      const isMoving = Math.abs(moveDir) > 0;
      const lerpFactor = isMoving ? 0.2 : 0.1;
      
      const desiredVelocityX = THREE.MathUtils.lerp(currentVelocityX, direction.x, lerpFactor);
      const desiredVelocityZ = THREE.MathUtils.lerp(currentVelocityZ, direction.z, lerpFactor);
      
      // Use forces to move so we don't overwrite the Y velocity (which breaks gravity)
      const mass = 70;
      const forceMultiplier = 10; // Adjust for responsiveness
      const forceX = (desiredVelocityX - currentVelocityX) * mass * forceMultiplier;
      const forceZ = (desiredVelocityZ - currentVelocityZ) * mass * forceMultiplier;
      
      api.applyLocalForce([forceX, 0, forceZ], [0, 0, 0]);
      
      // Jump
      const currentVelocityY = velocity.current[1];
      const isGrounded = Math.abs(currentVelocityY) < 0.05;
      if (jump && isGrounded) {
        api.velocity?.set(currentVelocityX, 6, currentVelocityZ);
      }

      // Sync camera (Third Person)
      const settings = useGameStore.getState().settings;
      if (!settings.satelliteView) {
        const cameraOffset = new THREE.Vector3(0, 3, -8); // 8 units behind, 3 units up
        cameraOffset.applyEuler(euler);
        const targetPos = playerPos.clone().add(cameraOffset);
        
        // Prevent camera from clipping through the ground
        if (targetPos.y < 0.5) targetPos.y = 0.5;
        
        // Smoothly interpolate camera position and look at player
        const lookAtTarget = playerPos.clone().add(new THREE.Vector3(0, 1.5, 0));
        const targetRotation = new THREE.Quaternion().setFromRotationMatrix(
          new THREE.Matrix4().lookAt(targetPos, lookAtTarget, new THREE.Vector3(0, 1, 0))
        );
        
        state.camera.position.lerp(targetPos, 0.15);
        state.camera.quaternion.slerp(targetRotation, 0.15);
      }
      
      // Store turnDir for rendering
      ref.current.userData.turnDir = turnDir;
    }
  });

  return (
    <mesh ref={ref}>
      <CharacterModel 
        rotation={playerRotation.current} 
        velocity={new THREE.Vector3(velocity.current[0], velocity.current[1], velocity.current[2])} 
        turnDir={ref.current?.userData?.turnDir || 0}
      />
    </mesh>
  );
}
