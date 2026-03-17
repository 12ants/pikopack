import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useControls as useKeyboard } from '../hooks/useControls';
import { useGameStore, globalCarPosition } from '../store';

// ---------------------------------------------------------------------------
// Module-level reusable objects — allocated once, mutated each frame
// ---------------------------------------------------------------------------
const _playerPos   = new THREE.Vector3();
const _carPos      = new THREE.Vector3();
const _moveInput   = new THREE.Vector3();
const _camOffset   = new THREE.Vector3();
const _camTarget   = new THREE.Vector3();
const _lookAt      = new THREE.Vector3();
const _lookMat     = new THREE.Matrix4();
const _targetQuat  = new THREE.Quaternion();
const _up          = new THREE.Vector3(0, 1, 0);
const _camYawEuler = new THREE.Euler(0, 0, 0, 'YXZ');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const WALK_SPEED       = 7;
const SPRINT_SPEED     = 13;
const CAMERA_DIST      = 6;    // metres behind player
const CAMERA_HEIGHT    = 2.5;  // metres above player centre
const MOUSE_SENSITIVITY = 0.0025;
const CAM_LERP         = 0.18; // position lerp per frame
const CAM_ROT_LERP     = 0.22; // rotation lerp per frame
const INTERACT_RANGE   = 5;

// ---------------------------------------------------------------------------
// CharacterModel
// Reads live values from refs so useFrame always gets up-to-date state
// without triggering React re-renders.
// ---------------------------------------------------------------------------
function CharacterModel({
  facingRef,   // world-space Y angle the character body should face
  speedRef,    // horizontal speed magnitude
  vyRef,       // vertical velocity (for jump detection)
}: {
  facingRef: React.RefObject<number>;
  speedRef:  React.RefObject<number>;
  vyRef:     React.RefObject<number>;
}) {
  const rootRef     = useRef<THREE.Group>(null);
  const torsoRef    = useRef<THREE.Group>(null);
  const headRef     = useRef<THREE.Mesh>(null);
  const leftLegRef  = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef  = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!rootRef.current || !torsoRef.current || !leftLegRef.current ||
        !rightLegRef.current || !leftArmRef.current || !rightArmRef.current) return;

    const facing = facingRef.current ?? 0;
    const speed  = speedRef.current  ?? 0;
    const vy     = vyRef.current     ?? 0;

    // ── Smooth body yaw (shortest-arc interpolation) ──────────────────────
    let dyaw = facing - rootRef.current.rotation.y;
    while (dyaw >  Math.PI) dyaw -= Math.PI * 2;
    while (dyaw < -Math.PI) dyaw += Math.PI * 2;
    rootRef.current.rotation.y += dyaw * 0.2;

    // ── Animation ─────────────────────────────────────────────────────────
    const t = clock.elapsedTime;
    const isAirborne = vy > 1.5 || vy < -1.5;

    if (isAirborne) {
      // jump / fall pose
      leftLegRef.current.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current.rotation.x,  -0.6, 0.2);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x,  0.3, 0.2);
      leftArmRef.current.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current.rotation.x,  -1.2, 0.2);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.2, 0.2);
      torsoRef.current.rotation.x    = THREE.MathUtils.lerp(torsoRef.current.rotation.x, 0.15, 0.15);
    } else if (speed > 0.5) {
      // walk / run cycle
      const cycleRate = speed > WALK_SPEED * 0.8 ? 14 : 9; // faster arms/legs when sprinting
      const swing     = Math.sin(t * cycleRate) * Math.min(speed / WALK_SPEED, 1.3) * 0.55;
      leftLegRef.current.rotation.x  = swing;
      rightLegRef.current.rotation.x = -swing;
      leftArmRef.current.rotation.x  = -swing * 0.7;
      rightArmRef.current.rotation.x =  swing * 0.7;
      // subtle body bob
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(
        torsoRef.current.rotation.x,
        Math.abs(Math.sin(t * cycleRate)) * 0.04,
        0.15,
      );
    } else {
      // idle breath
      const breathe = Math.sin(t * 1.8) * 0.02;
      leftLegRef.current.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current.rotation.x,  0, 0.1);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
      leftArmRef.current.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current.rotation.x,  0.1, 0.1);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.1, 0.1);
      torsoRef.current.rotation.x    = THREE.MathUtils.lerp(torsoRef.current.rotation.x, breathe, 0.1);
    }
  });

  // ── Geometry ──────────────────────────────────────────────────────────────
  // Root sits at physics sphere centre (y=0 relative to mesh).
  // We shift the visual down so feet land at y = -0.5 (bottom of sphere).
  //
  //   feet  pivot @ root y=0,  leg mesh centre y = -0.35  → feet bottom @ -0.7
  //   → offset root by +0.2 so feet sit at ≈ -0.5
  return (
    <group ref={rootRef} position={[0, -0.3, 0]}>
      {/* ── Legs (pivot at hip) ────────────────────────────── */}
      <group ref={leftLegRef} position={[0.17, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#1a237e" roughness={0.8} />
        </mesh>
        {/* shoe */}
        <mesh position={[0, -0.73, 0.06]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.32]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[-0.17, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#1a237e" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.73, 0.06]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.32]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Torso ──────────────────────────────────────────── */}
      <group ref={torsoRef} position={[0, 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.75, 0.38]} />
          <meshStandardMaterial color="#1565c0" roughness={0.7} metalness={0.05} />
        </mesh>

        {/* collar / neck */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.28, 0.14, 0.28]} />
          <meshStandardMaterial color="#f5c5a3" roughness={0.8} />
        </mesh>

        {/* ── Head ─────────────────────────────────────────── */}
        <mesh ref={headRef} position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial color="#f5c5a3" roughness={0.7} />
          {/* eyes */}
          <mesh position={[ 0.11,  0.06, 0.22]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[-0.11,  0.06, 0.22]}>
            <boxGeometry args={[0.09, 0.09, 0.04]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* hair */}
          <mesh position={[0, 0.22, -0.02]}>
            <boxGeometry args={[0.44, 0.12, 0.46]} />
            <meshStandardMaterial color="#4a2c0a" roughness={1} />
          </mesh>
        </mesh>

        {/* ── Arms (pivot at shoulder) ───────────────────── */}
        <group ref={leftArmRef} position={[0.43, 0.28, 0]}>
          {/* upper arm */}
          <mesh position={[0.11, -0.18, 0]} castShadow>
            <boxGeometry args={[0.22, 0.38, 0.22]} />
            <meshStandardMaterial color="#1565c0" roughness={0.7} metalness={0.05} />
          </mesh>
          {/* forearm */}
          <mesh position={[0.11, -0.5, 0]} castShadow>
            <boxGeometry args={[0.19, 0.34, 0.19]} />
            <meshStandardMaterial color="#f5c5a3" roughness={0.8} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[-0.43, 0.28, 0]}>
          <mesh position={[-0.11, -0.18, 0]} castShadow>
            <boxGeometry args={[0.22, 0.38, 0.22]} />
            <meshStandardMaterial color="#1565c0" roughness={0.7} metalness={0.05} />
          </mesh>
          <mesh position={[-0.11, -0.5, 0]} castShadow>
            <boxGeometry args={[0.19, 0.34, 0.19]} />
            <meshStandardMaterial color="#f5c5a3" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------
export function Player() {
  const playerState    = useGameStore(s => s.playerState);
  const setPlayerState = useGameStore(s => s.setPlayerState);
  const playerPosition = useGameStore(s => s.playerPosition);
  const setInteractPrompt = useGameStore(s => s.setInteractPrompt);

  // ── Physics ───────────────────────────────────────────────────────────────
  const meshRef = useRef<THREE.Mesh>(null);
  const [, api] = useSphere(() => ({
    mass: 70,
    type: 'Dynamic',
    position: playerPosition,
    args: [0.5],
    fixedRotation: true,
    linearDamping: 0.9,  // enough to stop smoothly without feeling sluggish
    angularDamping: 1,
    allowSleep: false,
  }), meshRef);

  // ── Live state refs (never cause re-renders, safe to read in useFrame) ────
  const controls        = useKeyboard();
  const velocityRef     = useRef<number[]>([0, 0, 0]);
  const playerStateRef  = useRef(playerState);
  const lastInteract    = useRef(false);
  const lastPrompt      = useRef<string | null>(null);
  const wasWalking      = useRef(false);

  // Camera-specific refs
  const camYaw          = useRef(0);   // horizontal orbit angle around player
  const camPitch        = useRef(0.3); // vertical orbit angle (radians, clamped)
  const isPointerLocked = useRef(false);

  // CharacterModel animation refs
  const facingRef = useRef(0);   // world Y angle the body should face
  const speedRef  = useRef(0);
  const vyRef     = useRef(0);

  // Sync playerState to ref so useFrame never reads stale React state
  useEffect(() => {
    playerStateRef.current = playerState;
  }, [playerState]);

  // ── Subscribe to physics velocity ─────────────────────────────────────────
  useEffect(() => {
    return api.velocity.subscribe(v => { velocityRef.current = v; });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Teleport body when state/spawn changes ────────────────────────────────
  useEffect(() => {
    if (playerState === 'walking') {
      api.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    } else {
      api.position.set(0, -500, 0); // park far below world
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  }, [playerState, playerPosition]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pointer-lock mouse look ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return;
      camYaw.current   -= e.movementX * MOUSE_SENSITIVITY;
      camPitch.current -= e.movementY * MOUSE_SENSITIVITY;
      camPitch.current  = THREE.MathUtils.clamp(camPitch.current, 0.05, 1.1);
    };

    const onLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas;
    };

    const onClick = () => {
      if (playerStateRef.current === 'walking' && !isPointerLocked.current) {
        canvas.requestPointerLock();
      }
    };

    canvas.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onLockChange);
    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onLockChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Per-frame update ──────────────────────────────────────────────────────
  useFrame((state) => {
    const isWalking = playerStateRef.current === 'walking';

    if (!isWalking) {
      wasWalking.current = false;
      // Keep physics body frozen while in the car
      api.velocity.set(0, 0, 0);
      velocityRef.current = [0, 0, 0];
      speedRef.current    = 0;
      vyRef.current       = 0;
      return;
    }

    // Initialise camera yaw from car camera when first switching to walking
    if (!wasWalking.current) {
      // Align camYaw with the current camera so there's no jarring snap
      const { x, z } = state.camera.position;
      if (!meshRef.current) { wasWalking.current = true; }
      else {
        meshRef.current.getWorldPosition(_playerPos);
        const dx = _playerPos.x - x;
        const dz = _playerPos.z - z;
        if (Math.abs(dx) + Math.abs(dz) > 0.1) {
          camYaw.current = Math.atan2(dx, dz); // face camera toward player initially
        }
        wasWalking.current = true;
      }
    }

    const { forward, backward, left, right, interact, brake: jump, sprint } = controls;

    if (!meshRef.current) return;
    meshRef.current.getWorldPosition(_playerPos);
    if (_playerPos.y < -50) return; // still teleporting

    // ── Interaction ─────────────────────────────────────────────────────────
    _carPos.set(globalCarPosition.x, globalCarPosition.y, globalCarPosition.z);
    const distToCar = _playerPos.distanceTo(_carPos);
    const newPrompt = distToCar < INTERACT_RANGE ? 'Press F to enter vehicle' : null;
    if (newPrompt !== lastPrompt.current) {
      setInteractPrompt(newPrompt);
      lastPrompt.current = newPrompt;
    }
    if (interact && !lastInteract.current && distToCar < INTERACT_RANGE) {
      setPlayerState('driving');
      setInteractPrompt(null);
      lastPrompt.current = null;
      if (document.pointerLockElement) document.exitPointerLock();
    }
    lastInteract.current = interact;

    // ── Camera-relative movement ─────────────────────────────────────────────
    // Build a flat movement vector in world space from WASD relative to camera yaw.
    // A/D strafes left/right, W/S moves forward/back.
    _camYawEuler.set(0, camYaw.current, 0);

    let mx = Number(right) - Number(left);
    let mz = Number(forward) - Number(backward);
    const inputLen = Math.sqrt(mx * mx + mz * mz);
    if (inputLen > 1) { mx /= inputLen; mz /= inputLen; } // normalise diagonal

    _moveInput.set(mx, 0, mz).applyEuler(_camYawEuler);

    const targetSpeed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const vx = velocityRef.current[0];
    const vy = velocityRef.current[1];
    const vz = velocityRef.current[2];

    const hasInput = inputLen > 0;
    const accel = hasInput ? 0.22 : 0.14; // decelerate slower than accelerate

    const nextVx = THREE.MathUtils.lerp(vx, _moveInput.x * targetSpeed, accel);
    const nextVz = THREE.MathUtils.lerp(vz, _moveInput.z * targetSpeed, accel);

    // Jump — only allow when near ground (small vy and moving slowly vertically)
    const isGrounded = Math.abs(vy) < 0.8;
    if (jump && isGrounded) {
      api.velocity.set(nextVx, 7, nextVz);
    } else {
      api.velocity.set(nextVx, vy, nextVz);
    }

    // Update animation refs
    const horizSpeed = Math.sqrt(nextVx * nextVx + nextVz * nextVz);
    speedRef.current = horizSpeed;
    vyRef.current    = vy;

    // ── Character facing ─────────────────────────────────────────────────────
    // Face the direction of movement only when actually moving.
    if (horizSpeed > 0.3) {
      facingRef.current = Math.atan2(_moveInput.x, _moveInput.z);
    }

    // ── Third-person orbit camera ────────────────────────────────────────────
    if (!useGameStore.getState().settings.satelliteView) {
      // Spherical coords: yaw around Y, pitch down
      const sinYaw   = Math.sin(camYaw.current);
      const cosYaw   = Math.cos(camYaw.current);
      const sinPitch = Math.sin(camPitch.current);
      const cosPitch = Math.cos(camPitch.current);

      _camOffset.set(
        sinYaw * cosPitch * CAMERA_DIST,
        sinPitch * CAMERA_DIST + CAMERA_HEIGHT,
        cosYaw * cosPitch * CAMERA_DIST,
      );

      _camTarget.copy(_playerPos).add(_camOffset);
      if (_camTarget.y < 0.4) _camTarget.y = 0.4;

      _lookAt.copy(_playerPos);
      _lookAt.y += 1.0; // look at chest height
      _lookMat.lookAt(_camTarget, _lookAt, _up);
      _targetQuat.setFromRotationMatrix(_lookMat);

      state.camera.position.lerp(_camTarget,    CAM_LERP);
      state.camera.quaternion.slerp(_targetQuat, CAM_ROT_LERP);
    }
  });

  return (
    <mesh ref={meshRef} visible={playerState === 'walking'}>
      <CharacterModel
        facingRef={facingRef as React.RefObject<number>}
        speedRef={speedRef   as React.RefObject<number>}
        vyRef={vyRef         as React.RefObject<number>}
      />
    </mesh>
  );
}

