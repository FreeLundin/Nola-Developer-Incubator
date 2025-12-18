# NDI_MardiGrasParade

## Overview

NDI_MardiGrasParade is a 3D catching game built with React Three Fiber, where players collect items thrown from parade floats. The game features progressive difficulty, combo scoring, and festive celebrations. It uses a full-stack TypeScript architecture with an Express backend, React frontend, and is designed to integrate with a PostgreSQL database via Drizzle ORM. The project aims to provide an engaging and visually rich Mardi Gras experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Frameworks**: React with TypeScript, Vite for bundling.
**3D Rendering**: React Three Fiber, React Three Drei, React Three Postprocessing, GLSL shaders.
**UI Components**: Radix UI, Tailwind CSS, Shadcn/ui, Framer Motion, React Confetti.
**State Management**: Zustand for game state, React Query for server state (configured).
**Game Architecture**: Component-based entities, custom physics, distance-based collision detection, optimized touch/keyboard controls, interactive tutorial with platform-specific instructions.

### Backend Architecture

**Server**: Express.js with TypeScript, RESTful API.
**Storage**: Abstracted `IStorage` interface with in-memory implementation, designed for easy swap to database.
**Development**: Vite integration for dev server, esbuild for backend compilation, HMR support.

### Data Storage

**ORM**: Drizzle ORM with PostgreSQL dialect, targeting Neon serverless PostgreSQL.
**Schema**: Defined in `shared/schema.ts` (Users table), Zod validation.
**Migration**: Drizzle Kit for schema migrations.

### System Design Choices

- **Target Audience**: Ages 10-80 with casual, accessible difficulty curve.
- **Difficulty Scaling**: Gentle early levels (L1: 0 NPCs, 1 obstacle, 2 bots; L2-3: 1 NPC, 2 obstacles), gradual ramp after level 3 via centralized getNPCCount/getObstacleCount functions.
- **Pacing**: Level 1 at 3.5s throw interval, constant 2 units/sec float speed through L3, gentle progression thereafter.
- **Visuals**: Extensive 3D scene lighting (Mardi Gras tri-colors), atmospheric effects, gradient sky, street decorations, glowing collectible trails, emissive materials on floats/collectibles.
- **UI/HUD**: Simplified for clarity - clean black backgrounds with simple borders, high-contrast text, essential information only (level, score, coins, power-ups), no glassmorphism or decorative effects.
- **Tutorial**: Simplified 3-step first-level tutorial (How to Play, Controls, Tips) - concise and clear for better accessibility.
- **Monetization**: Optional rewarded video ads (continue, bonus time, power-ups) and cosmetic character customization (6 skins) purchased with in-game coins.
- **Gameplay Mechanics**: Float-based timer (levels end when all floats pass), dynamic float generation, random wandering NPCs and obstacles with level-based scaling, float collision elimination, inactivity timeout.
- **Strategic Gameplay**: Trajectory hints, 5-second ground despawn for uncollected items, redesigned narrower street with parade route on one side, competitor bots with shared claim coordination and smart pathfinding.
- **Power-ups**: Speed Boost and Double Points with UI indicators, rare King Cake collectible.
- **Physics**: Bouncing physics for collectibles, combo timer visual meter.
- **Performance**: Optimized geometry, reduced particle effects.
- **Controls**: Locked third-person camera, platform-specific controls (keyboard/mouse for PC, optional on-screen joystick for tablets/phones), auto-catch when close to items, dynamic throw arcs.
  - **Joystick Controls**: Optional toggleable on-screen joystick for mobile/tablet devices. Settings accessible via gear icon in GameUI (mobile only). Preference persists in localStorage. When enabled, joystick appears in bottom-left during gameplay with purple/orange styling. Click-to-move automatically disabled when joystick is active.
- **Audio**: Festive fireworks sounds for level completion and high combos.

## External Dependencies

**Database**:
- PostgreSQL (Neon serverless)
- Drizzle ORM

**Build Tools**:
- Vite
- esbuild
- TypeScript
- PostCSS, Tailwind CSS

**UI Libraries**:
- Radix UI
- Lucide React
- Class Variance Authority
- CLSX, Tailwind Merge

**3D Graphics**:
- Three.js (via React Three Fiber)

**Audio**:
- HTML5 Audio API

**Forms & Validation**:
- React Hook Form
- Zod

**Utilities**:
- date-fns
- nanoid

**Development**:
- tsx
- Replit-specific plugins