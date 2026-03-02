import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useSphere, useRaycastVehicle } from '@react-three/cannon';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useControls as useLeva } from 'leva';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useGameStore, globalCarPosition } from '../store';

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

  const chassisWidth = 1.7;
  const chassisHeight = 0.7;
  const chassisLength = 4.4;
  const wheelRadius = 0.35;
  const wheelWidth = 0.25;

  const chassisRef = useRef<THREE.Group>(null);
  const [chassisBody, chassisApi] = useBox(() => ({
    mass,
    position,
    args: [chassisWidth, chassisHeight, chassisLength],
    allowSleep: false,
    userData: { id: 'car' }
  }), chassisRef);

  const wheelRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  const wheelPositions: [number, number, number][] = [
    [-chassisWidth / 2 - 0.1, -0.15, -chassisLength / 2 + 0.7], // Front Left
    [chassisWidth / 2 + 0.1, -0.15, -chassisLength / 2 + 0.7],  // Front Right
    [-chassisWidth / 2 - 0.1, -0.15, chassisLength / 2 - 0.6], // Rear Left
    [chassisWidth / 2 + 0.1, -0.15, chassisLength / 2 - 0.6],  // Rear Right
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
  const { cameraMode, lights } = controls;

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = controls;

    if (reset) {
      chassisApi.position.set(200, 52, 200);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }

    const force = forward ? engineForce : backward ? -engineForce : 0;
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

    const pos = chassisRef.current?.position;
    if (pos) {
      globalCarPosition.x = pos.x;
      globalCarPosition.y = pos.y;
      globalCarPosition.z = pos.z;
    }
  });

  // Saab 900 Geometries
  const { bodyGeom, frontRearWindowGeom, sideWindowGeom } = useMemo(() => {
    const extrudeSettings = { depth: chassisWidth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    
    // Main Body Profile (Positive X is Front)
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-2.2, -0.2); // Rear bottom
    bodyShape.lineTo(-2.2, 0.0); // Rear bumper top
    bodyShape.lineTo(-2.1, 0.1); // Rear lip
    bodyShape.lineTo(-1.8, 0.15); // Base of fastback
    bodyShape.lineTo(-0.6, 0.5); // Rear of roof
    bodyShape.lineTo(0.2, 0.5); // Top of windshield
    bodyShape.lineTo(0.8, 0.15); // Base of windshield
    bodyShape.lineTo(2.1, 0.1); // Hood nose
    bodyShape.lineTo(2.2, 0.0); // Front bumper top
    bodyShape.lineTo(2.2, -0.2); // Front bottom
    bodyShape.lineTo(-2.2, -0.2); // Back to rear bottom

    const bGeom = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bGeom.center();

    // Front/Rear Windows (Pokes through the front and rear slopes)
    const frWindowShape = new THREE.Shape();
    frWindowShape.moveTo(-1.85, 0.15); 
    frWindowShape.lineTo(-0.55, 0.52); 
    frWindowShape.lineTo(0.15, 0.52); 
    frWindowShape.lineTo(0.9, 0.15); 
    frWindowShape.lineTo(-1.85, 0.15);
    
    const frGeom = new THREE.ExtrudeGeometry(frWindowShape, { ...extrudeSettings, depth: chassisWidth - 0.1, bevelEnabled: false });
    frGeom.center();

    // Side Windows (Pokes through the sides)
    const sideWindowShape = new THREE.Shape();
    sideWindowShape.moveTo(-1.6, 0.18);
    sideWindowShape.lineTo(-0.5, 0.45);
    sideWindowShape.lineTo(0.1, 0.45);
    sideWindowShape.lineTo(0.7, 0.18);
    sideWindowShape.lineTo(-1.6, 0.18);

    const sideGeom = new THREE.ExtrudeGeometry(sideWindowShape, { ...extrudeSettings, depth: chassisWidth + 0.05, bevelEnabled: false });
    sideGeom.center();

    return { bodyGeom: bGeom, frontRearWindowGeom: frGeom, sideWindowGeom: sideGeom };
  }, [chassisWidth]);

  const headlightTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(10, 0.05, 0);
    return o;
  }, []);

  return (
    <group ref={vehicle}>
      <group ref={chassisRef}>
        {/* Mount the camera directly to the car chassis */}
        {cameraMode === 0 && <PerspectiveCamera makeDefault position={[0, 6, 15]} rotation={[-0.2, 0, 0]} />}
        {cameraMode === 1 && <PerspectiveCamera makeDefault position={[0, 8, 18]} rotation={[-0.3, 0, 0]} />}
        {cameraMode === 2 && <PerspectiveCamera makeDefault position={[0, 25, 0]} rotation={[-Math.PI / 2, 0, 0]} />}
        {cameraMode === 3 && <PerspectiveCamera makeDefault position={[0, 0.8, -0.5]} rotation={[0, 0, 0]} />}

        {/* Saab 900 Body Group - Rotated so Positive X (Front) points to Negative Z */}
        <group rotation={[0, Math.PI / 2, 0]} position={[0, 0.1, 0]}>
          {/* Main Silver Body */}
          <mesh geometry={bodyGeom} castShadow receiveShadow>
            <meshStandardMaterial color="#88929b" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Front and Rear Windows */}
          <mesh geometry={frontRearWindowGeom}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Side Windows */}
          <mesh geometry={sideWindowGeom}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Front Bumper (Black Plastic) */}
          <mesh position={[2.15, -0.1, 0]}>
            <boxGeometry args={[0.2, 0.2, chassisWidth]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>

          {/* Rear Bumper (Black Plastic) */}
          <mesh position={[-2.15, -0.1, 0]}>
            <boxGeometry args={[0.2, 0.2, chassisWidth]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>

          {/* Grille */}
          <mesh position={[2.22, 0.05, 0]}>
            <boxGeometry args={[0.05, 0.15, 0.6]} />
            <meshStandardMaterial color="#111111" roughness={0.5} />
          </mesh>

          {/* Headlights */}
          <mesh position={[2.21, 0.05, 0.5]}>
            <boxGeometry args={[0.05, 0.15, 0.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={lights ? 5 : 0} />
          </mesh>
          <mesh position={[2.21, 0.05, -0.5]}>
            <boxGeometry args={[0.05, 0.15, 0.3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={lights ? 5 : 0} />
          </mesh>

          {lights && (
            <>
              <primitive object={headlightTarget} />
              <spotLight
                position={[2.3, 0.05, 0.5]}
                angle={0.5}
                penumbra={0.5}
                intensity={100}
                distance={50}
                castShadow
                target={headlightTarget}
              />
              <spotLight
                position={[2.3, 0.05, -0.5]}
                angle={0.5}
                penumbra={0.5}
                intensity={100}
                distance={50}
                castShadow
                target={headlightTarget}
              />
            </>
          )}

          {/* Taillights */}
          <mesh position={[-2.21, 0.05, 0.6]}>
            <boxGeometry args={[0.05, 0.15, 0.3]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={lights ? 3 : 0} />
          </mesh>
          <mesh position={[-2.21, 0.05, -0.6]}>
            <boxGeometry args={[0.05, 0.15, 0.3]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={lights ? 3 : 0} />
          </mesh>

          {lights && (
            <>
              <pointLight position={[-2.3, 0.05, 0.6]} intensity={5} distance={3} color="#ff0000" />
              <pointLight position={[-2.3, 0.05, -0.6]} intensity={5} distance={3} color="#ff0000" />
            </>
          )}
        </group>
        <DeliveryArrow />
      </group>
      {wheelRefs.map((ref, index) => (
        <Wheel key={index} ref={ref} radius={wheelRadius} width={wheelWidth} leftSide={index % 2 === 0} />
      ))}
    </group>
  );
}

const Wheel = React.forwardRef(({ radius, width, leftSide, ...props }: any, ref: any) => {
  useSphere(() => ({
    mass: 20,
    type: 'Kinematic',
    material: 'wheel',
    collisionFilterGroup: 0,
    args: [radius],
    ...props,
  }), ref);

  return (
    <group ref={ref}>
      <group rotation={[0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2]}>
        {/* Tire */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, width, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Saab Aero-style 3-spoke Rim approximation */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius * 0.65, radius * 0.65, width * 1.05, 8]} />
          <meshStandardMaterial color="#dddddd" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Hubcap center */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius * 0.2, radius * 0.2, width * 1.1, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
});

function DeliveryArrow() {
  const targetLocation = useGameStore(state => state.targetLocation);
  const hasPackage = useGameStore(state => state.hasPackage);
  const arrowRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (arrowRef.current) {
      const worldPos = new THREE.Vector3();
      arrowRef.current.getWorldPosition(worldPos);
      arrowRef.current.lookAt(targetLocation[0], worldPos.y, targetLocation[2]);
    }
  });

  return (
    <group position={[0, 2.5, 0]}>
      <group ref={arrowRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.4, 1.2, 8]} />
          <meshStandardMaterial color={hasPackage ? "#00ff00" : "#0088ff"} emissive={hasPackage ? "#00ff00" : "#0088ff"} emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}
