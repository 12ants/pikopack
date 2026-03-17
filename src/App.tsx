/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, Debug } from '@react-three/cannon';
import * as THREE from 'three';
import { Car } from './components/Car';
import { Ground } from './components/Ground';
import { City } from './components/City';
import { Trees } from './components/Trees';
import { Rocks } from './components/Rocks';
import { Mountains } from './components/Mountains';
import { IntroScreen } from './components/IntroScreen';
import { DeliveryZone } from './components/DeliveryZone';
import { DeliveryZones } from './components/DeliveryZones';
import { EnvironmentDetails } from './components/EnvironmentDetails';
import { HUD } from './components/HUD';
import { Settings } from './components/Settings';
import { StartingArea } from './components/StartingArea';
import { Traffic } from './components/Traffic';
import { Weather } from './components/Weather';
import { Player } from './components/Player';
import { Leva } from 'leva';
import { Sky, Environment, PerspectiveCamera, SoftShadows, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Perf } from 'r3f-perf';
import { useGameStore, globalCarPosition, CAR_SPAWN_POSITION } from './store';
import { useState, useEffect, useRef } from 'react';

// Loading bar shown before the game starts
function LoadingBar() {
  const status = useGameStore(s => s.status);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (status === 'playing') {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
      }
      setProgress(p);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-white pointer-events-none">
      <div className="w-64 mb-4">
        <div className="text-xs text-white/50 uppercase tracking-widest mb-2">Initializing System</div>
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-[10px] text-white/30 uppercase tracking-widest">
        {progress < 30 && 'Loading Assets...'}
        {progress >= 30 && progress < 60 && 'Preparing Physics...'}
        {progress >= 60 && progress < 90 && 'Building City...'}
        {progress >= 90 && 'Ready'}
      </div>
    </div>
  );
}

export default function App() {
  const settings = useGameStore(s => s.settings);
  const status = useGameStore(s => s.status);
  const interactPrompt = useGameStore(s => s.interactPrompt);
  const [dpr, setDpr] = useState(1);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden font-mono">
      {status === 'intro' ? (
        <IntroScreen />
      ) : (
        <>
          <HUD />
          <Settings />
          <Leva hidden={!settings.devInfo} collapsed={false} />

          {interactPrompt && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white text-lg z-10 pointer-events-none bg-black/80 px-6 py-3 border border-white/30 uppercase tracking-widest animate-pulse">
              {interactPrompt}
            </div>
          )}

          <LoadingBar />

          <Canvas
            gl={{ antialias: false, alpha: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
            shadows={settings.shadows}
            camera={{ position: [0, 5, 15], fov: 50 }}
            dpr={dpr}
            performance={{ min: 0.5 }}
          >
            <PerformanceMonitor
              flipflops={3}
              onIncline={() => setDpr(d => Math.min(d + 0.5, 2))}
              onDecline={() => setDpr(d => Math.max(d - 0.5, 0.5))}
            >
              <color attach="background" args={[settings.timeOfDay === 'twilight' ? '#ff9e79' : '#1a1a2e']} />

              <Sky
                sunPosition={settings.timeOfDay === 'twilight' ? [160, 5, 200] : [100, -5, 100]}
                turbidity={settings.timeOfDay === 'twilight' ? 110 : 5}
                rayleigh={settings.timeOfDay === 'twilight' ? 4 : 1}
              />
              <Environment preset={settings.timeOfDay === 'twilight' ? 'sunset' : 'night'} />

              <ambientLight intensity={settings.timeOfDay === 'twilight' ? 0.02 : 0.01} />

              {settings.timeOfDay === 'twilight' && settings.shadows && (
                <>
                  <SoftShadows size={15} focus={0.5} samples={10} />
                  <DynamicShadows />
                </>
              )}

              <Physics broadphase="SAP" gravity={[0, -9, 0]}>
                {settings.debugPhysics ? (
                  <Debug color="black" scale={1}>
                    <Scene />
                  </Debug>
                ) : (
                  <Scene />
                )}
              </Physics>

              {settings.postProcessing && (
                <EffectComposer>
                  <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                  <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
              )}

              {settings.devInfo && <Perf position="bottom-right" />}
            </PerformanceMonitor>
          </Canvas>
        </>
      )}
    </div>
  );
}

function Scene() {
  const settings = useGameStore(s => s.settings);

  return (
    <>
      <Car position={CAR_SPAWN_POSITION} />
      <Player />
      <Ground />
      <City key={`city-${settings.destructibles}`} />
      <Trees key={`trees-${settings.destructibles}`} />
      <Rocks />
      <EnvironmentDetails />
      <DeliveryZones />
      <DeliveryZone />
      {settings.traffic && <Traffic />}
      {settings.weather && <Weather />}
      {settings.satelliteView && <SatelliteCamera />}
    </>
  );
}

function SatelliteCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(globalCarPosition.x, 150, globalCarPosition.z);
      cameraRef.current.lookAt(globalCarPosition.x, 0, globalCarPosition.z);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[0, 150, 0]} />;
}

function DynamicShadows() {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);
  const offset = new THREE.Vector3(40, 60, 150).normalize().multiplyScalar(100);

  useFrame(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.position.set(
        globalCarPosition.x + offset.x,
        globalCarPosition.y + offset.y,
        globalCarPosition.z + offset.z,
      );
      targetRef.current.position.set(globalCarPosition.x, globalCarPosition.y, globalCarPosition.z);
      lightRef.current.target = targetRef.current;
    }
  });

  return (
    <group>
      <directionalLight
        ref={lightRef}
        castShadow
        intensity={0.8}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={10}
        shadow-camera-far={150}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />
      <object3D ref={targetRef} />
    </group>
  );
}
