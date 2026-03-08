import { useEffect, useState } from 'react';

export function useControls() {
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false,
    lights: false,
    interact: false,
    cameraMode: 0, // 0: Chase, 1: Far, 2: Top, 3: FPS
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls((c) => ({ ...c, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setControls((c) => ({ ...c, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setControls((c) => ({ ...c, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setControls((c) => ({ ...c, right: true }));
          break;
        case ' ':
          setControls((c) => ({ ...c, brake: true }));
          break;
        case 'r':
          setControls((c) => ({ ...c, reset: true }));
          break;
        case 'f':
          if (!e.repeat) {
            setControls((c) => ({ ...c, interact: true }));
          }
          break;
        case 'l':
          if (!e.repeat) {
            setControls((c) => ({ ...c, lights: !c.lights }));
          }
          break;
        case 'c':
          if (!e.repeat) {
            setControls((c) => ({ ...c, cameraMode: (c.cameraMode + 1) % 4 }));
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls((c) => ({ ...c, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setControls((c) => ({ ...c, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setControls((c) => ({ ...c, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setControls((c) => ({ ...c, right: false }));
          break;
        case ' ':
          setControls((c) => ({ ...c, brake: false }));
          break;
        case 'r':
          setControls((c) => ({ ...c, reset: false }));
          break;
        case 'f':
          setControls((c) => ({ ...c, interact: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
}
