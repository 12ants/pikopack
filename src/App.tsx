/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { Physics, Debug } from '@react-three/cannon';
import { Car } from './components/Car';
import { Ground } from './components/Ground';
import { Obstacles } from './components/Obstacles';
import { Leva, useControls } from 'leva';

export default function App() {
  const { debug } = useControls('General', { debug: false });

  return (
    <div className="w-screen h-screen bg-black overflow-hidden font-mono">
      <Leva collapsed={false} />
      
      <div className="absolute top-4 left-4 text-white text-xs z-10 pointer-events-none opacity-50 bg-black/50 p-4 rounded-lg border border-white/10">
        <h1 className="text-sm font-bold mb-2 text-white/80">CONTROLS</h1>
        <p>W / Up : Accelerate</p>
        <p>S / Down : Reverse</p>
        <p>A / Left : Steer Left</p>
        <p>D / Right : Steer Right</p>
        <p>Space : Brake</p>
        <p>R : Reset Position</p>
        <p>C : Change Camera</p>
      </div>

      <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[100, 100, 50]}
          intensity={1}
          shadow-mapSize={[2048, 2048]}
        />
        
        <Physics broadphase="SAP" gravity={[0, -9.81, 0]}>
          {debug ? (
            <Debug>
              <Scene />
            </Debug>
          ) : (
            <Scene />
          )}
        </Physics>
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <>
      <Car position={[0, 2, 0]} />
      <Ground />
      <Obstacles />
    </>
  );
}
