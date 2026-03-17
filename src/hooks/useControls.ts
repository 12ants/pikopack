import { useEffect, useRef } from 'react';

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
  lights: boolean;
  interact: boolean;
  cameraMode: number;
  sprint: boolean;
}

// Returns a stable ref whose .current always holds the live control state.
// Reading controls.forward inside useFrame never reads a stale closure value.
export function useControls(): Controls {
  const controls = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false,
    lights: false,
    interact: false,
    cameraMode: 0,
    sprint: false,
  });

  useEffect(() => {
    const c = controls.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':    c.forward = true; break;
        case 's':
        case 'arrowdown':  c.backward = true; break;
        case 'a':
        case 'arrowleft':  c.left = true; break;
        case 'd':
        case 'arrowright': c.right = true; break;
        case 'shift':      c.sprint = true; break;
        case ' ':          c.brake = true; break;
        case 'r':          c.reset = true; break;
        case 'f':
          if (!e.repeat) c.interact = true;
          break;
        case 'l':
          if (!e.repeat) c.lights = !c.lights;
          break;
        case 'c':
          if (!e.repeat) c.cameraMode = (c.cameraMode + 1) % 4;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':    c.forward = false; break;
        case 's':
        case 'arrowdown':  c.backward = false; break;
        case 'a':
        case 'arrowleft':  c.left = false; break;
        case 'd':
        case 'arrowright': c.right = false; break;
        case 'shift':      c.sprint = false; break;
        case ' ':          c.brake = false; break;
        case 'r':          c.reset = false; break;
        case 'f':          c.interact = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls.current;
}
