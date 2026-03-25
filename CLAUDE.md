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

**Stack:** React 19, TypeScript (strict), Three.js via @react-three/fiber, Zustand for state, Vite for bundling.

**Physics Visualizer** — an interactive app for simulating and rendering 2-body physics (gravity, Coulomb's law) in 3D.

### Key Layers

- **`src/engine/`** — Pure physics simulation, no React. `SimulationEngine` runs a fixed 1ms timestep accumulator (max 16 substeps/frame) using velocity Verlet integration. Force functions in `forces/` use softening to avoid singularities.

- **`src/store/`** — Two Zustand stores: `useSimulationStore` (bodies, time, playback, engine instance) and `useUIStore` (active visualizer, display toggles).

- **`src/visualizers/`** — Pluggable visualizer registry. Each visualizer (`gravity/`, `coulomb/`) exports a `VisualizerConfig` with its force function, default bodies, presets, scene component, controls component, and potential energy calculator. New physics simulations are added by creating a new config and registering it.

- **`src/components/three/`** — Reusable 3D components (`Body3D`, `TrailLine`, `ForceArrow`, `GridFloor`, etc.) rendered inside a React-Three-Fiber `Canvas`.

- **`src/hooks/`** — `useSimulationLoop` drives physics via `useFrame`; `useAdaptiveCamera` manages camera behavior.

### Data Flow

`useSimulationLoop` (in Canvas `useFrame`) → `SimulationEngine.step()` → force computation → Verlet integration → store update → Three.js meshes sync positions from store each frame.

### Visualizer Registry Pattern

To add a new visualizer: create a folder under `src/visualizers/`, implement `VisualizerConfig` (force function, scene component, controls component, presets), and register it in `src/visualizers/registry.ts`. The UI (sidebar selector, viewport scene) adapts automatically.
