import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useCylinder, useRaycastVehicle } from '@react-three/cannon';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useControls as useLeva } from 'leva';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';

export function Car({ position = [0, 2, 0] }: { position?: [number, number, number] }) {
  const {
    mass,
    engineForce,
    maxBrake,
    steeringValue,
    suspensionStiffness,
    suspensionRestLength,
    frictionSlip,
    dampingRelaxation,
    dampingCompression,
    rollInfluence,
  } = useLeva('Car Physics', {
    mass: { value: 1500, min: 500, max: 3000 },
    engineForce: { value: 2000, min: 500, max: 5000 },
    maxBrake: { value: 50, min: 10, max: 100 },
    steeringValue: { value: 0.5, min: 0.1, max: 1 },
    suspensionStiffness: { value: 30, min: 10, max: 100 },
    suspensionRestLength: { value: 0.3, min: 0.1, max: 1 },
    frictionSlip: { value: 1.5, min: 0.1, max: 5 },
    dampingRelaxation: { value: 2.3, min: 0.1, max: 5 },
    dampingCompression: { value: 4.4, min: 0.1, max: 10 },
    rollInfluence: { value: 0.01, min: 0, max: 1 },
  });

  const chassisWidth = 1.8;
  const chassisHeight = 0.6;
  const chassisLength = 4;
  const wheelRadius = 0.4;
  const wheelWidth = 0.3;

  const chassisRef = useRef<THREE.Group>(null);
  const [chassisBody, chassisApi] = useBox(() => ({
    mass,
    position,
    args: [chassisWidth, chassisHeight, chassisLength],
    allowSleep: false,
  }), chassisRef);

  const wheelRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  const wheelPositions: [number, number, number][] = [
    [-chassisWidth / 2 - 0.2, -0.1, chassisLength / 2 - 0.5], // Front Left
    [chassisWidth / 2 + 0.2, -0.1, chassisLength / 2 - 0.5],  // Front Right
    [-chassisWidth / 2 - 0.2, -0.1, -chassisLength / 2 + 0.5], // Rear Left
    [chassisWidth / 2 + 0.2, -0.1, -chassisLength / 2 + 0.5],  // Rear Right
  ];

  const wheelInfos = wheelPositions.map((pos, index) => ({
    radius: wheelRadius,
    directionLocal: [0, -1, 0] as [number, number, number],
    suspensionStiffness,
    suspensionRestLength,
    frictionSlip,
    dampingRelaxation,
    dampingCompression,
    maxSuspensionForce: 100000,
    rollInfluence,
    axleLocal: [-1, 0, 0] as [number, number, number],
    chassisConnectionPointLocal: pos,
    isFrontWheel: index < 2,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
  }));

  const [vehicle, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody,
    wheelInfos,
    wheels: wheelRefs,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }), useRef<THREE.Group>(null));

  const controls = useKeyboard();
  const { cameraMode } = controls;

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = controls;

    if (reset) {
      chassisApi.position.set(0, 2, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }

    const force = forward ? -engineForce : backward ? engineForce : 0;
    vehicleApi.applyEngineForce(force, 2);
    vehicleApi.applyEngineForce(force, 3);

    const steering = left ? steeringValue : right ? -steeringValue : 0;
    vehicleApi.setSteeringValue(steering, 0);
    vehicleApi.setSteeringValue(steering, 1);

    if (brake) {
      vehicleApi.setBrake(maxBrake, 0);
      vehicleApi.setBrake(maxBrake, 1);
      vehicleApi.setBrake(maxBrake, 2);
      vehicleApi.setBrake(maxBrake, 3);
    } else {
      vehicleApi.setBrake(0, 0);
      vehicleApi.setBrake(0, 1);
      vehicleApi.setBrake(0, 2);
      vehicleApi.setBrake(0, 3);
    }
  });

  return (
    <group ref={vehicle}>
      <group ref={chassisRef}>
        {/* Mount the camera directly to the car chassis */}
        {cameraMode === 0 && <PerspectiveCamera makeDefault position={[0, 6, -15]} rotation={[0.42, Math.PI, 0]} />}
        {cameraMode === 1 && <PerspectiveCamera makeDefault position={[0, 8, -18]} rotation={[0.4, Math.PI, 0]} />}
        {cameraMode === 2 && <PerspectiveCamera makeDefault position={[0, 25, 0]} rotation={[Math.PI / 2, Math.PI, 0]} />}
        {cameraMode === 3 && <PerspectiveCamera makeDefault position={[0, 5, -5]} rotation={[0, Math.PI, 0]} />}

        <mesh>
          <boxGeometry args={[chassisWidth, chassisHeight, chassisLength]} />
          <meshStandardMaterial color="#fff" wireframe />
        </mesh>
        {/* Cockpit indicator */}
        <mesh position={[0, chassisHeight / 2 + 0.2, -0.5]}>
          <boxGeometry args={[chassisWidth - 0.2, 0.4, chassisLength / 2]} />
          <meshStandardMaterial color="#fff" wireframe />
        </mesh>
      </group>
      {wheelRefs.map((ref, index) => (
        <Wheel key={index} ref={ref} radius={wheelRadius} width={wheelWidth} leftSide={index % 2 === 0} />
      ))}
    </group>
  );
}

const Wheel = React.forwardRef(({ radius, width, leftSide, ...props }: any, ref: any) => {
  useCylinder(() => ({
    mass: 20,
    type: 'Kinematic',
    material: 'wheel',
    collisionFilterGroup: 0,
    args: [radius, radius, width, 16],
    rotation: [0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2],
    ...props,
  }), ref);

  return (
    <group ref={ref}>
      <mesh rotation={[0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, width, 16]} />
        <meshStandardMaterial color="#555" wireframe />
      </mesh>
      <mesh rotation={[0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]}>
        <boxGeometry args={[radius * 2, radius * 2, width * 1.1]} />
        <meshStandardMaterial color="#fff" wireframe />
      </mesh>
    </group>
  );
});
