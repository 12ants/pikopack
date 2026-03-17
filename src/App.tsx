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
import { Sky, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore, globalCarPosition } from './store';
import { useState, useEffect, useRef } from 'react';

export default function App() {
  const settings = useGameStore(s => s.settings);
  const status = useGameStore(s => s.status);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden font-mono">
      {status === 'intro' ? (
        <IntroScreen />
      ) : (
        <>
          <HUD />
          <Settings />
          <Leva hidden={!settings.devInfo} collapsed={false} />
          
          <div className="absolute bottom-6 left-6 text-white text-xs z-10 pointer-events-none opacity-70 bg-black/80 p-4 border border-white/20 uppercase tracking-widest">
            <h1 className="text-white/50 mb-3 border-b border-white/20 pb-2">SYS.CONTROLS</h1>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <p><span className="text-white/50">W/↑</span> ACCEL</p>
              <p><span className="text-white/50">S/↓</span> BRAKE/REV</p>
              <p><span className="text-white/50">A/←</span> STEER L</p>
              <p><span className="text-white/50">D/→</span> STEER R</p>
              <p><span className="text-white/50">SPACE</span> E-BRAKE</p>
              <p><span className="text-white/50">F</span> ENTER/EXIT</p>
              <p><span className="text-white/50">R</span> RESET</p>
              <p><span className="text-white/50">L</span> LIGHTS</p>
              <p><span className="text-white/50">C</span> CAMERA</p>
            </div>
          </div>

          <Canvas 
            gl={{ antialias: false, alpha: false, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
            shadows={settings.shadows} 
            camera={{ position: [0, 5, 15], fov: 20 }} 
            dpr={1} 
            performance={{ min: 0.5 }}
          >
        <color attach="background" args={[settings.timeOfDay === 'twilight' ? '#ff9e79' : '#1a1a2e']} />
        
        <Sky 
          sunPosition={settings.timeOfDay === 'twilight' ? [160, 5, 200] : [100, -5, 100]} 
          turbidity={settings.timeOfDay === 'twilight' ? 110 : 5} 
          rayleigh={settings.timeOfDay === 'twilight' ? 4 : 1} 
        />
        <Environment preset={settings.timeOfDay === 'twilight' ? "sunset" : "night"} />
        
        <ambientLight intensity={settings.timeOfDay === 'twilight' ? 0.02 : 0.01} />
        
        {settings.timeOfDay === 'twilight' && settings.shadows && (
          <directionalLight
            castShadow
            position={[40, 60, 150]}
            intensity={1}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-150}
            shadow-camera-right={150}
            shadow-camera-top={150}
            shadow-camera-bottom={-150}
          />
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

          {/* Stats removed to prevent InvalidStateError: CanvasRenderingContext2D.drawImage: Passed-in canvas is empty */}
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
      <Car position={[142, 2, 42]} />
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
