# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript compile + Vite production build
npm run lint       # ESLint across the project
npm run preview    # Preview production build locally
```

No test framework is configured.

## Architecture

**Stack:** React 19, TypeScript (strict), Three.js via @react-three/fiber + @react-three/drei, Zustand for state, Leva for UI controls, Vite for bundling.

**Physics Visualizer** — an interactive app for simulating and rendering physics interactions (gravity, Coulomb, Lorentz force, Ampère/Biot-Savart currents) in 3D. Keyboard shortcuts: Space = play/pause, R = reset.

### Key Layers

- **`src/engine/`** — Pure physics simulation, no React. `SimulationEngine` runs a fixed 1ms timestep accumulator (max 16 substeps/frame) using velocity Verlet integration. Force functions in `forces/` use softening to avoid singularities.

- **`src/store/`** — Two Zustand stores: `useSimulationStore` (bodies, time, playback, engine instance) and `useUIStore` (active visualizer, display toggles).

- **`src/visualizers/`** — Pluggable visualizer registry. Four visualizers: `gravity/`, `coulomb/`, `lorentz/`, `currents/`. Each exports a `VisualizerConfig` with its force function, default bodies, presets, scene component, controls component, and potential energy calculator. Each visualizer folder follows the convention: `*Visualizer.tsx` (scene), `*Controls.tsx` (Leva-based UI), `*Defaults.ts` (body factory), `*Presets.ts` (named initial conditions).

- **`src/components/three/`** — Reusable 3D components (`Body3D`, `TrailLine`, `ForceArrow`, `GridFloor`, etc.) rendered inside a React-Three-Fiber `Canvas`.

- **`src/hooks/`** — `useSimulationLoop` drives physics via `useFrame`; `useAdaptiveCamera` manages camera behavior.

### Data Flow

`useSimulationLoop` (in Canvas `useFrame`) → `SimulationEngine.step()` → force computation → Verlet integration → store update → Three.js meshes sync positions from store each frame.

### Visualizer Registry Pattern

To add a new visualizer: create a folder under `src/visualizers/`, implement `VisualizerConfig` (defined in `src/types/visualizer.ts` — includes `id`, `name`, `forceFunction`, `defaultBodies`, `presets`, `SceneComponent`, `ControlsComponent`, `computePotentialEnergy`, `softening`), and register it in `src/visualizers/registry.ts`. The UI (sidebar selector, viewport scene) adapts automatically.

### Important Implementation Details

- Three.js `Vector3` objects are mutated in-place during physics steps for performance — avoid creating new vectors in hot paths.
- Force functions are pure: `(bodies, softening) => forces[]`. They also compute potential energy via a separate export.
- TypeScript strict mode is enforced with `noUnusedLocals` and `noUnusedParameters`.
