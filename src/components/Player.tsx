import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useGameStore, globalCarPosition } from '../store';

// Reusable objects — allocated once, mutated each frame, never recreated
const _playerPos = new THREE.Vector3();
const _carPos = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _cameraOffset = new THREE.Vector3();
const _camTargetPos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _lookAtMatrix = new THREE.Matrix4();
const _targetQuat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

// CharacterModel reads from refs passed by Player so it always sees live values.
function CharacterModel({
  rotationRef,
  velocityRef,
  turnDirRef,
}: {
  rotationRef: React.RefObject<number>;
  velocityRef: React.RefObject<number[]>;
  turnDirRef: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (
      !group.current || !bodyRef.current ||
      !leftLegRef.current || !rightLegRef.current ||
      !leftArmRef.current || !rightArmRef.current
    ) return;

    const rotation = rotationRef.current ?? 0;
    const vel = velocityRef.current ?? [0, 0, 0];
    const turnDir = turnDirRef.current ?? 0;

    // Smooth rotation — shortest-path interpolation
    let diff = rotation - group.current.rotation.y;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    group.current.rotation.y += diff * 0.15;

    // Lean into turns
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, turnDir * 0.2, 0.1);

    const t = state.clock.elapsedTime;
    const speed = Math.sqrt(vel[0] ** 2 + vel[2] ** 2);
    const isJumping = Math.abs(vel[1]) > 0.5;

    if (isJumping) {
      leftLegRef.current.rotation.x = -0.5;
      rightLegRef.current.rotation.x = 0.2;
      leftArmRef.current.rotation.x = Math.PI;
      rightArmRef.current.rotation.x = Math.PI;
      bodyRef.current.position.y = 0.75;
    } else if (speed > 0.1) {
      const animSpeed = speed > 10 ? 15 : 10;
      const walkCycle = Math.sin(t * animSpeed);
      leftLegRef.current.rotation.x = walkCycle * 0.5;
      rightLegRef.current.rotation.x = -walkCycle * 0.5;
      leftArmRef.current.rotation.x = -walkCycle * 0.5;
      rightArmRef.current.rotation.x = walkCycle * 0.5;
      bodyRef.current.position.y = 0.75 + Math.abs(Math.sin(t * animSpeed)) * 0.1;
    } else {
      leftLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.x = 0;
      leftArmRef.current.rotation.x = 0;
      rightArmRef.current.rotation.x = 0;
      bodyRef.current.position.y = 0.75 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="royalblue" />

        {/* Head */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="peachpuff" />
          <mesh position={[0.1, 0.1, 0.21]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.1, 0.1, 0.21]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </mesh>

        {/* Arms */}
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

const CAMERA_TRANSITION_DURATION = 0.6;

export function Player() {
  const playerState = useGameStore(s => s.playerState);
  const setPlayerState = useGameStore(s => s.setPlayerState);
  const playerPosition = useGameStore(s => s.playerPosition);
  const setInteractPrompt = useGameStore(s => s.setInteractPrompt);

  const meshRef = useRef<THREE.Mesh>(null);
  const [, api] = useSphere(() => ({
    mass: 70,
    type: 'Dynamic',
    position: playerPosition,
    args: [0.5],
    fixedRotation: true,
    linearDamping: 0.95,
    angularDamping: 1,
    allowSleep: false,
  }), meshRef);

  const controls = useKeyboard();
  const velocityRef = useRef<number[]>([0, 0, 0]);
  const playerRotationRef = useRef(0);
  const turnDirRef = useRef(0);
  const lastInteract = useRef(false);
  const lastPrompt = useRef<string | null>(null);
  const wasWalking = useRef(false);
  const cameraTransitionStart = useRef<number | null>(null);
  const playerStateRef = useRef(playerState);

  // Keep a ref copy of playerState so useFrame never reads a stale closure
  useEffect(() => {
    playerStateRef.current = playerState;
  }, [playerState]);

  // Teleport the physics body when playerState or spawn position changes
  useEffect(() => {
    if (playerState === 'walking') {
      api.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    } else {
      // Park the sphere well out of the way while driving
      api.position.set(0, -200, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  }, [playerState, playerPosition]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return api.velocity.subscribe(v => { velocityRef.current = v; });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    const isWalking = playerStateRef.current === 'walking';

    if (!isWalking) {
      wasWalking.current = false;
      // Freeze physics while the player is in the car
      api.velocity.set(0, 0, 0);
      velocityRef.current = [0, 0, 0];
      return;
    }

    if (!wasWalking.current) {
      cameraTransitionStart.current = state.clock.elapsedTime;
      wasWalking.current = true;
    }

    const { forward, backward, left, right, interact, brake: jump, sprint } = controls;

    if (!meshRef.current) return;
    meshRef.current.getWorldPosition(_playerPos);

    // Skip update until the sphere has actually teleported to the spawn position
    if (_playerPos.y < -50) return;

    // --- Interaction: enter car ---
    _carPos.set(globalCarPosition.x, globalCarPosition.y, globalCarPosition.z);
    const distToCar = _playerPos.distanceTo(_carPos);

    const newPrompt = distToCar < 5 ? 'Press F to enter vehicle' : null;
    if (newPrompt !== lastPrompt.current) {
      setInteractPrompt(newPrompt);
      lastPrompt.current = newPrompt;
    }

    if (interact && !lastInteract.current && distToCar < 5) {
      setPlayerState('driving');
      setInteractPrompt(null);
      lastPrompt.current = null;
    }
    lastInteract.current = interact;

    // --- Rotation ---
    if (left) playerRotationRef.current += 0.05;
    if (right) playerRotationRef.current -= 0.05;
    turnDirRef.current = Number(left) - Number(right);

    // --- Movement ---
    _euler.set(0, playerRotationRef.current, 0);

    const moveDir = Number(forward) - Number(backward);
    const targetSpeed = sprint ? 14 : 8;
    _direction.set(0, 0, moveDir * targetSpeed);
    _direction.applyEuler(_euler);

    const vx = velocityRef.current[0];
    const vy = velocityRef.current[1];
    const vz = velocityRef.current[2];
    const isMoving = moveDir !== 0;
    const moveLerp = isMoving ? 0.25 : 0.12;

    const nextVx = THREE.MathUtils.lerp(vx, _direction.x, moveLerp);
    const nextVz = THREE.MathUtils.lerp(vz, _direction.z, moveLerp);

    // Jump — only when grounded (vy very close to 0)
    if (jump && Math.abs(vy) < 0.15) {
      api.velocity.set(nextVx, 6, nextVz);
    } else {
      api.velocity.set(nextVx, vy, nextVz);
    }

    // --- Third-person camera ---
    if (!useGameStore.getState().settings.satelliteView) {
      _cameraOffset.set(0, 3, -8).applyEuler(_euler);
      _camTargetPos.copy(_playerPos).add(_cameraOffset);
      if (_camTargetPos.y < 0.5) _camTargetPos.y = 0.5;

      _lookAt.copy(_playerPos);
      _lookAt.y += 1.5;
      _lookAtMatrix.lookAt(_camTargetPos, _lookAt, _up);
      _targetQuat.setFromRotationMatrix(_lookAtMatrix);

      const elapsed = cameraTransitionStart.current === null
        ? CAMERA_TRANSITION_DURATION
        : state.clock.elapsedTime - cameraTransitionStart.current;
      const alpha = THREE.MathUtils.clamp(elapsed / CAMERA_TRANSITION_DURATION, 0, 1);
      const camLerp = THREE.MathUtils.lerp(0.03, 0.15, alpha);

      state.camera.position.lerp(_camTargetPos, camLerp);
      state.camera.quaternion.slerp(_targetQuat, camLerp);
    }
  });

  return (
    <mesh ref={meshRef} visible={playerState === 'walking'}>
      <CharacterModel
        rotationRef={playerRotationRef as React.RefObject<number>}
        velocityRef={velocityRef as React.RefObject<number[]>}
        turnDirRef={turnDirRef as React.RefObject<number>}
      />
    </mesh>
  );
}

