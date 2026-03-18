# Project Knowledge Base

## 1. Project Overview

- This repository is a **frontend-only Vite + React + TypeScript 3D driving game prototype**.
- The playable experience is a **single-screen delivery game**: the player drives a vehicle around a procedural city, reaches an active service zone, automatically picks up or drops off a package, and repeats the loop to increase score.
- The app appears aimed at:
  - developers experimenting with **React Three Fiber** and **Cannon physics**,
  - contributors extending a lightweight 3D gameplay prototype,
  - users playing a small browser-based demo rather than a full product.
- The codebase does **not** contain a backend, API server, database layer, router, auth system, or persistence system.
- Product naming is inconsistent across files:
  - `README.md` and `index.html`: `piko_pack`
  - `metadata.json`: `piko`
  - `package.json`: `react-example`
  - intro screen title: `Terminal Delivery`

### Main user-facing capabilities
- Drive a physics-based car, van, or truck.
- Exit the vehicle and walk around on foot.
- Pick up and deliver packages by driving through the active delivery zone.
- Toggle rendering/gameplay features such as shadows, post-processing, destructible/dynamic environment objects, traffic, weather, and satellite view.
- Switch among multiple vehicle camera modes.
- Toggle headlights and taillights.
- View HUD status, score, and a minimap.
- Use Leva for live vehicle physics tuning when developer info is enabled.

## 2. Architecture Overview

### High-level architecture
- This is a **client-side SPA with one main scene**.
- Boot sequence:
  1. `index.html` loads `/src/main.tsx`
  2. `src/main.tsx` mounts `App`
  3. `src/App.tsx` shows either the intro UI or the live 3D scene
  4. `App` mounts a React Three Fiber `Canvas` with a Cannon `Physics` world
- There is **no routing layer** and no multi-page structure.

### Main architectural layers
- **UI / overlay layer**: intro screen, HUD, settings modal, controls legend, interaction prompt.
- **Gameplay state layer**: Zustand store in `src/store.ts`.
- **3D runtime layer**: scene composition in `App.tsx` and world components under `src/components/`.
- **Physics / actor layer**:
  - `Car.tsx` for vehicle control and car camera logic
  - `Player.tsx` for walking/jumping and on-foot camera logic
  - `DeliveryZone.tsx` for mission trigger logic
- **Environment layer**: city blocks, ground, trees, rocks, props, traffic, weather.

### Key components and responsibilities
- `src/App.tsx`
  - top-level orchestration
  - branches between `intro` and `playing`
  - mounts HUD/settings/Canvas
  - configures lights, sky, post-processing, physics debug, satellite camera, dynamic shadows
- `src/store.ts`
  - central game store
  - mission state (`hasPackage`, `targetLocation`, `score`)
  - player mode (`driving` / `walking`)
  - vehicle type
  - global settings toggles
  - interaction prompt text
- `src/components/Car.tsx`
  - raycast vehicle setup
  - car chassis and wheel bodies
  - drive/brake/steer/reset logic
  - driving camera modes
  - enter/exit vehicle transition
  - headlights/taillights
  - delivery direction arrow
- `src/components/Player.tsx`
  - walking physics body
  - jump, sprint, turn-and-move behavior
  - on-foot camera follow
  - near-car enter-vehicle prompt and interaction
- `src/components/DeliveryZone.tsx`
  - active trigger zone for package pickup/dropoff
  - switches behavior based on `hasPackage`
- `src/components/DeliveryZones.tsx`
  - passive markers for all possible service points
- `src/components/HUD.tsx`
  - score/status/minimap and walking overlay
- `src/components/Settings.tsx`
  - in-game configuration modal
- `src/components/IntroScreen.tsx`
  - pre-game configuration screen and start button
- `src/components/City.tsx`
  - procedural city block generation and many environment objects
- `src/components/Chunk.tsx`
  - distance-based mounting/unmounting around the car
- `src/components/Traffic.tsx`, `Weather.tsx`
  - optional visual ambient effects

### Core data flow
1. User input is captured by `src/hooks/useControls.ts` through global keyboard listeners.
2. `Car` and `Player` each call `useControls()` and read the resulting booleans in their frame loops.
3. Zustand store holds coarse game/UI state such as score, target location, player mode, and settings.
4. Physics bodies created with `@react-three/cannon` drive runtime movement.
5. `Car` updates `globalCarPosition`, a shared mutable object used by several frame-based systems.
6. `DeliveryZone` listens for car trigger collisions and calls store actions `pickup()` or `dropoff()`.
7. HUD, prompts, minimap, camera helpers, and chunk culling react either to store state or to `globalCarPosition`.

### External dependencies and integrations
Observed core integrations:
- React + React DOM
- Vite
- Three.js
- React Three Fiber
- `@react-three/cannon`
- `@react-three/drei`
- `@react-three/postprocessing`
- Leva
- Zustand
- Tailwind CSS v4 via Vite plugin

Observed declared-but-unreferenced dependencies in repo source/config searches:
- `@google/genai`
- `better-sqlite3`
- `dotenv`
- `express`
- `lucide-react`
- `motion`
- `tsx`
- `autoprefixer`

No external web APIs, auth providers, database connections, or server endpoints were found in the source tree.

## 3. Tech Stack

### Languages
- TypeScript / TSX
- HTML
- Tailwind-driven CSS via `src/index.css`

### Frontend framework and rendering
- React `19.0.0`
- React DOM `19.0.0`
- Vite `6.2.0`
- React Three Fiber `9.5.0`
- Three.js `0.183.2`
- Drei `10.7.7`
- `@react-three/cannon` `6.6.0`
- `@react-three/postprocessing` `3.0.4`
- `leva` `0.10.1`
- Zustand `5.0.11`

### Styling
- Tailwind CSS `4.1.14`
- `@tailwindcss/vite`
- `src/index.css` only imports Tailwind; almost all styling is utility classes in JSX

### Tooling
- npm with `package-lock.json`
- TypeScript `~5.8.2`
- Vite React plugin `@vitejs/plugin-react`

### Physics and visual effects
- Cannon physics bindings via `@react-three/cannon`
- Post-processing via Bloom + Vignette
- Sky/Environment/SoftShadows from Drei

### Testing / validation tools
- No test framework found
- Current validation commands are:
  - `npm run lint` → `tsc --noEmit`
  - `npm run build` → production build

### Configuration notes
- `tsconfig.json` is relatively permissive:
  - `strict` is not enabled
  - `skipLibCheck: true`
  - `allowJs: true`
  - `allowImportingTsExtensions: true`
- Path alias:
  - TS `@/*` → `./*`
  - Vite `@` → repo root `.`
  - no actual `@/...` imports were observed in `src/`

## 4. Directory Structure

### Repository root
- `README.md`
  - minimal setup instructions only
- `index.html`
  - browser entry shell, loads `/src/main.tsx`
- `metadata.json`
  - external metadata with app name/description
- `package.json`
  - scripts and dependencies
- `package-lock.json`
  - npm lockfile
- `tsconfig.json`
  - TypeScript configuration
- `vite.config.ts`
  - Vite config, env loading, alias, HMR toggle
- `.env.example`
  - placeholder only; does not document actual observed env usage well
- `.gitignore`
  - ignores `node_modules`, `dist`, `build`, `coverage`, logs, and `.env*`
- `src/`
  - all application source code
- `node_modules/`
  - vendored dependencies, not a normal editing target

### `src/`
- `main.tsx`
  - React bootstrap
- `App.tsx`
  - top-level app and 3D scene composition
- `index.css`
  - Tailwind import only
- `store.ts`
  - Zustand state and delivery location generation
- `hooks/useControls.ts`
  - keyboard input hook
- `components/`
  - all scene, actor, UI, and environment components

### `src/components/`
Key files:
- `Car.tsx`
  - main vehicle implementation
- `Player.tsx`
  - on-foot movement/controller
- `HUD.tsx`
  - status/minimap UI
- `IntroScreen.tsx`
  - start screen and pre-game settings
- `Settings.tsx`
  - in-game settings modal
- `DeliveryZone.tsx`
  - active mission trigger
- `DeliveryZones.tsx`
  - passive location markers
- `Ground.tsx`
  - world collision plane + visible grass plane
- `City.tsx`
  - procedural city, houses, park blocks, environment objects
- `Chunk.tsx`
  - distance-based streaming helper
- `Trees.tsx`
  - outer-tree generation with physics
- `Rocks.tsx`
  - static chunked rocks
- `EnvironmentDetails.tsx`
  - decorative fences/intersection clutter/lights
- `Traffic.tsx`
  - instanced visual traffic
- `Weather.tsx`
  - instanced visual precipitation
- `Props.tsx`
  - reusable visual prop meshes
- `Mountains.tsx`, `StartingArea.tsx`, `Obstacles.tsx`
  - present in repo but not rendered in the current `Scene()`

### Naming conventions and organization patterns
- Components use `PascalCase.tsx`.
- Hooks use `camelCase`/`use...` naming.
- Most code is colocated by scene responsibility rather than by domain package.
- This is a small repo; there is no separate `lib/`, `api/`, or `services/` layer.

## 5. Key Entry Points

### Application entry points
- `index.html`
  - includes `<script type="module" src="/src/main.tsx"></script>`
- `src/main.tsx`
  - mounts `App` into `#root`
- `src/App.tsx`
  - effective runtime entry point

### Gameplay/runtime entry points
- `App()`
  - chooses between intro and gameplay states
- `Scene()` inside `App.tsx`
  - mounts all 3D scene actors and environment systems
- `Car`
  - main drivable actor and primary gameplay camera owner while driving
- `Player`
  - on-foot actor and primary camera owner while walking
- `DeliveryZone`
  - main mission trigger

### CLI commands / scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run clean`
- `npm run lint`

There is **no custom CLI application** in the repo.

### API endpoints overview
- None found.
- No Express server or HTTP handlers were present in the repository source.

### Background jobs / workers
- None found.
- No worker files, cron jobs, service workers, or queues were observed.

## 6. Core Concepts

### Domain-specific terminology
- **Delivery zone**: the currently active pickup/dropoff trigger in the world.
- **LOCATIONS**: precomputed list of all valid service/delivery points.
- **playerState**: whether the user is currently `driving` or `walking`.
- **vehicleType**: selected body/tuning preset: `car`, `van`, or `truck`.
- **cameraMode**: driving camera selection from keyboard control state.
- **destructibles**: setting that actually makes several world objects dynamic/static in physics, not just visually breakable.

### Key abstractions and shared state
- `useGameStore` in `src/store.ts`
  - authoritative store for coarse game and UI state
- `globalCarPosition`
  - mutable module-level object used for high-frequency runtime reads without store rerenders
- `CAR_SPAWN_POSITION`
  - canonical car spawn/reset position `[142, 2, 42]`
- `useControls()`
  - ephemeral keyboard state hook for both car and player logic
- `Chunk`
  - simple distance-based culling primitive keyed to `globalCarPosition`

### Important game state fields
From `GameState`:
- `status: 'intro' | 'playing'`
- `score: number`
- `hasPackage: boolean`
- `targetLocation: [number, number, number]`
- `playerState: 'driving' | 'walking'`
- `vehicleType: 'car' | 'van' | 'truck'`
- `playerPosition: [number, number, number]`
- `settings`
  - `shadows`
  - `postProcessing`
  - `destructibles`
  - `timeOfDay: 'twilight' | 'dusk'`
  - `debugPhysics`
  - `devInfo`
  - `traffic`
  - `weather`
  - `satelliteView`
- `interactPrompt: string | null`

### Mission state machine
- Initial state:
  - `hasPackage = false`
  - `targetLocation = LOCATIONS[0]`
- When the **car** collides with the active trigger and `hasPackage` is false:
  - call `pickup()`
  - set `hasPackage = true`
  - choose a new random target different from current
- When the **car** collides with the active trigger and `hasPackage` is true:
  - call `dropoff()`
  - increment `score`
  - set `hasPackage = false`
  - choose a new random target different from current

### Movement model
- **Driving**:
  - raycast vehicle with box chassis + kinematic wheel bodies
  - engine force is currently applied to all 4 wheels
  - steering applies to front 2 wheels
  - brakes apply to all 4 wheels
- **Walking**:
  - dynamic sphere collider with fixed rotation
  - keyboard turn-and-move, not strafe-based movement
  - jump uses a simple near-zero Y velocity grounded check

### Camera model
- Driving camera modes from `useControls()`:
  - `0` chase
  - `1` far
  - `2` top
  - `3` FPS/dash
- Walking camera:
  - third-person follow from behind player
- Satellite view:
  - separate top-down camera following the car position
  - enabled via store setting, not via `cameraMode`

## 7. Development Patterns

### State management approach
The repo uses a hybrid state pattern:
- **Zustand store** for coarse UI/gameplay state.
- **Mutable singleton (`globalCarPosition`)** for per-frame shared position reads.
- **Physics refs/bodies** as the true source of runtime actor transforms.
- **Local React state** for transient UI, e.g. `Settings` modal open/closed state.

Important nuance:
- `playerPosition` in the store acts mostly as a **handoff spawn position** when switching into walking mode; it is not continuously synced as the player walks.

### Input handling conventions
- `src/hooks/useControls.ts` installs global `keydown`/`keyup` listeners.
- Mappings:
  - `W` / `ArrowUp` → forward
  - `S` / `ArrowDown` → backward
  - `A` / `ArrowLeft` → left
  - `D` / `ArrowRight` → right
  - `Shift` → sprint
  - `Space` → brake/jump depending on mode
  - `R` → reset
  - `F` → interact enter/exit vehicle
  - `L` → toggle lights
  - `C` → cycle driving cameras
- `Car` and `Player` both call `useControls()`, so the app installs multiple identical key listeners instead of using a shared input provider.

### Scene and world organization
- `App.tsx` is the scene composer.
- World content is split into small component files under `src/components/`.
- `City.tsx` contains a large amount of procedural world-building logic.
- `Chunk.tsx` is used to stream distant groups in/out based on distance to the car.

### Physics vs visual object pattern
The world mixes colliding and non-colliding content:
- Physical objects include:
  - ground plane
  - car
  - player body
  - city block bases and houses
  - outer trees
  - rocks
  - active delivery trigger
  - some environment props when `destructibles` is enabled
- Visual-only objects include many decorative props from `Props.tsx`, traffic cars, weather particles, and various decorative details.

This matters when changing gameplay: some props look solid but do not block movement.

### Procedural generation patterns
- Delivery locations are generated from hardcoded grid arrays in `store.ts`.
- `City.tsx`, `Trees.tsx`, `Traffic.tsx`, and `Weather.tsx` rely on mount-time randomness via `Math.random()`.
- Toggling `settings.destructibles` remounts `City` and `Trees` because they are keyed in `Scene()`, which also re-randomizes their generated content.

### Error handling conventions
- No centralized error boundary found.
- Most logic assumes a happy path with local guards for missing refs.
- Runtime logic is mostly synchronous and frame-based.

### Logging practices
- No logging framework or notable console logging pattern was observed in `src/`.

### Styling conventions
- Tailwind utility classes inline in JSX.
- Strong monochrome terminal-like UI aesthetic:
  - `font-mono`
  - uppercase text
  - translucent black panels
  - thin white borders
- `src/index.css` contains only `@import "tailwindcss";`

### Configuration management
- Vite loads env vars with `loadEnv(mode, '.', '')`.
- Observed Vite-defined env access:
  - `process.env.API_KEY`
- Observed Vite server toggle:
  - `DISABLE_HMR` controls HMR enablement
- `.env.example` does not meaningfully document these variables.
- No `.env` consumption was found directly in `src/`.

### Authentication / authorization
- None present.

## 8. Testing Strategy

### Test organization
- No tests were found.
- No `tests/` directory, `*.test.*`, or `*.spec.*` files were observed.
- No Vitest/Jest/Playwright/Cypress/Mocha configuration files were found.

### Current validation strategy
- `npm run lint`
  - actually runs `tsc --noEmit`
  - this is type-checking, not ESLint
- `npm run build`
  - production bundle build through Vite
- `npm run preview`
  - manual smoke testing of the built app

### Mocking / stubbing
- No mocking/test helper infrastructure found.

### Test data management
- None found.

### Practical implication for future agents
When making changes, the main available validation path is:
1. run `npm run lint`
2. run `npm run build`
3. manually test in the browser with `npm run dev` or `npm run preview`

## 9. Getting Started

### Prerequisites
- Node.js compatible with the declared Vite/React/TypeScript toolchain
- npm

### Setup instructions
1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Open the app in a browser.
   - The npm script explicitly starts Vite on port `3000` and host `0.0.0.0`.

### Useful commands
- Start development server:
  - `npm run dev`
- Type-check:
  - `npm run lint`
- Build for production:
  - `npm run build`
- Preview the production build:
  - `npm run preview`
- Remove build output:
  - `npm run clean`

### Gameplay controls
- `W` / `↑` accelerate / move forward
- `S` / `↓` reverse / move backward
- `A` / `←` steer left / turn left
- `D` / `→` steer right / turn right
- `Shift` sprint on foot
- `Space` brake in vehicle / jump on foot
- `F` enter or exit vehicle
- `R` reset vehicle to `CAR_SPAWN_POSITION`
- `L` toggle vehicle lights
- `C` cycle driving camera mode

### Runtime settings available
Via intro screen and/or settings modal:
- shadows
- post-processing
- dynamic environment / destructibles
- time preset (`twilight` / `dusk`)
- developer info / Leva
- vehicle type
- physics debug
- traffic
- weather
- satellite view

### Helpful development notes
- Enable **Dev Info** to show Leva controls for live vehicle tuning.
- Enable **Physics Debug** to mount Cannon debug visuals.
- Expect `City` and `Trees` layouts to regenerate when toggling `destructibles`.

## 10. Areas of Complexity

### 1. Hybrid state ownership
- Gameplay state is split across Zustand, mutable globals, and physics refs.
- `globalCarPosition` is especially important because it drives:
  - minimap position
  - satellite camera
  - dynamic shadows
  - chunk culling
  - player enter-vehicle proximity

### 2. Distributed camera logic
- Camera behavior is not centralized.
- It is owned by:
  - `Car.tsx` while driving
  - `Player.tsx` while walking
  - `SatelliteCamera` when enabled
- Changes to camera behavior require careful coordination across these components.

### 3. Procedural world generation and remount side effects
- `City`, `Trees`, `Traffic`, and `Weather` rely on mount-time randomness.
- `destructibles` remounts major world sections through keyed components, which also changes layout.
- This means some settings are not purely cosmetic; they can materially change the world state.

### 4. Physics-to-visual mismatch in the environment
- Many decorative props are visual only even when they appear solid.
- Other objects switch between dynamic and static based on settings.
- Traffic lights animate visually but do not control traffic behavior.
- Traffic and weather are ambient only and do not interact with gameplay physics.

### 5. Input duplication
- Both `Car` and `Player` create their own `useControls()` instances and attach global listeners.
- This works, but future input changes should account for duplicated listeners and duplicated state.

### 6. Walking UX assumptions
- Walking uses keyboard turn-and-move rather than strafe or mouse look.
- HUD text says "Click to look around," but no obvious mouse-look or pointer-lock implementation was found in `src/`.
- Future UX work should reconcile the HUD copy with actual controls.

### 7. Large multi-responsibility files
- `Car.tsx`, `Player.tsx`, and especially `City.tsx` each own multiple responsibilities:
  - physics
  - rendering
  - per-frame logic
  - interaction logic
- Refactors should be careful about preserving behavior hidden in `useFrame()` loops.

### 8. Repository/tooling drift
- Project identity naming is inconsistent.
- Several dependencies appear declared but unused in the current codebase.
- `npm run lint` is type-checking only.
- No automated tests or CI pipeline exist.

## Additional Notes for Future Agents

- There was **no existing `agents.md`** in the repository root at the time of this analysis; this file was created fresh.
- `Mountains.tsx`, `StartingArea.tsx`, and `Obstacles.tsx` exist in the repo but are not part of the currently rendered scene.
- `package.json` declares backend-leaning dependencies (`express`, `better-sqlite3`) and AI-related dependency (`@google/genai`), but no corresponding source usage was found.
- The current app is best understood as a **self-contained browser gameplay prototype**, not as a full-stack application.
