import { create } from 'zustand';

export const LOCATIONS: [number, number, number][] = [];
// Parking lot: road junction at the city grid center-left, flat asphalt, clear of buildings
export const CAR_SPAWN_POSITION: [number, number, number] = [-40, 1, -40];

// Intersections
const intersections = [-120, -40, 40, 120];
for (const x of intersections) {
  for (const z of intersections) {
    LOCATIONS.push([x, 0, z]);
  }
}

// Mid-roads
const blockCenters = [-160, -80, 0, 80, 160];
for (const x of blockCenters) {
  for (const z of intersections) {
    LOCATIONS.push([x, 0, z]);
  }
}
for (const x of intersections) {
  for (const z of blockCenters) {
    LOCATIONS.push([x, 0, z]);
  }
}

export const globalCarPosition = {
  x: CAR_SPAWN_POSITION[0],
  y: CAR_SPAWN_POSITION[1],
  z: CAR_SPAWN_POSITION[2]
};

interface GameState {
  status: 'intro' | 'playing';
  score: number;
  hasPackage: boolean;
  targetLocation: [number, number, number];
  playerState: 'driving' | 'walking';
  vehicleType: 'car' | 'van' | 'truck';
  playerPosition: [number, number, number];
  settings: {
    shadows: boolean;
    postProcessing: boolean;
    destructibles: boolean;
    timeOfDay: 'twilight' | 'dusk';
    debugPhysics: boolean;
    devInfo: boolean;
    traffic: boolean;
    weather: boolean;
    satelliteView: boolean;
  };
  startGame: () => void;
  pickup: () => void;
  dropoff: () => void;
  updateSetting: (key: keyof GameState['settings'], value: any) => void;
  setPlayerState: (state: 'driving' | 'walking') => void;
  setVehicleType: (type: 'car' | 'van' | 'truck') => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  interactPrompt: string | null;
  setInteractPrompt: (prompt: string | null) => void;
}

const getRandomLocation = (current: [number, number, number]) => {
  const available = LOCATIONS.filter(l => l[0] !== current[0] || l[2] !== current[2]);
  return available[Math.floor(Math.random() * available.length)];
};

export const useGameStore = create<GameState>((set, get) => ({
  status: 'intro',
  score: 0,
  hasPackage: false,
  targetLocation: LOCATIONS[0],
  playerState: 'driving',
  vehicleType: 'car',
  playerPosition: CAR_SPAWN_POSITION,
  settings: {
    shadows: true,
    postProcessing: true,
    destructibles: true,
    timeOfDay: 'twilight',
    debugPhysics: false,
    devInfo: false,
    traffic: false,
    weather: false,
    satelliteView: false,
  },
  startGame: () => set({ status: 'playing' }),
  pickup: () => {
    if (!get().hasPackage) {
      set({ hasPackage: true, targetLocation: getRandomLocation(get().targetLocation) });
    }
  },
  dropoff: () => {
    if (get().hasPackage) {
      set(state => ({ score: state.score + 1, hasPackage: false, targetLocation: getRandomLocation(state.targetLocation) }));
    }
  },
  updateSetting: (key, value) => set(state => ({ settings: { ...state.settings, [key]: value } })),
  setPlayerState: (state) => set({ playerState: state }),
  setVehicleType: (type) => set({ vehicleType: type }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  interactPrompt: null,
  setInteractPrompt: (prompt) => set({ interactPrompt: prompt }),
}));
