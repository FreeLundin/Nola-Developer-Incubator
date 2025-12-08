# GitHub Copilot Instructions for Mardi Gras Parade Simulator

## Repository Overview

This is a 3D Mardi Gras parade simulator built with React, Three.js, and Express.js. Players catch collectibles (beads, doubloons, cups) from parade floats in an immersive browser-based experience that celebrates New Orleans culture.

## Tech Stack

### Frontend
- **React 18** with TypeScript - UI framework
- **React Three Fiber (R3F)** - React renderer for Three.js
- **React Three Drei** - Useful R3F helpers and components
- **Three.js** - WebGL 3D graphics
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Lightweight SQL ORM
- **PostgreSQL** (Neon) - Database

## Project Structure

```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── game/   # Game-specific 3D components
│   │   │   └── ui/     # UI components (buttons, dialogs, etc.)
│   │   ├── lib/
│   │   │   └── stores/ # Zustand state management stores
│   │   ├── hooks/      # Custom React hooks
│   │   └── main.tsx    # App entry point
│   └── public/         # Static assets (textures, sounds, models)
├── server/             # Backend Express.js application
│   ├── index.ts       # Server entry point
│   ├── routes.ts      # API endpoint definitions
│   ├── storage.ts     # Database operations
│   └── vite.ts        # Vite dev server integration
├── shared/            # Shared code between frontend and backend
│   └── schema.ts      # Drizzle ORM database schema
└── docs/              # Documentation
    ├── CONTRIBUTING.md
    └── DEVELOPMENT_GUIDE.md
```

## Build, Test, and Lint Commands

### Development
```bash
npm run dev        # Start development server with HMR (http://localhost:5000)
```

### Type Checking
```bash
npm run check      # Run TypeScript type checking (ALWAYS run before committing)
```

### Production Build
```bash
npm run build      # Build frontend and backend for production
npm start          # Start production server
```

### Database
```bash
npm run db:push    # Push database schema to PostgreSQL
```

## Coding Standards

### TypeScript
- **Use strict mode** - TypeScript strict mode is enabled
- **Always type your code** - Avoid `any` type, use proper TypeScript interfaces and types
- **Export shared types** - Put types used by both frontend and backend in `shared/`
- **Use interfaces for object shapes** - Prefer interfaces over type aliases for objects

### React Components
- **Functional components only** - Use React hooks, no class components
- **Props interfaces** - Always define TypeScript interfaces for component props
- **PascalCase for components** - Component names like `ParadeFloat`, `GameUI`
- **Custom hooks** - Extract reusable logic into custom hooks prefixed with `use`

### File Naming Conventions
- **Components**: PascalCase - `ParadeFloat.tsx`, `GameUI.tsx`
- **Hooks**: camelCase with `use` prefix - `useGameLoop.ts`, `useCollision.ts`
- **Utilities**: camelCase - `collision.ts`, `physics.ts`
- **Stores**: camelCase with `Store` suffix - `gameStore.ts`, `playerStore.ts`
- **API routes**: kebab-case - `api/get-profile.ts`

### Code Style
- **Indentation**: 2 spaces (configured in editor)
- **Quotes**: Single quotes preferred for strings
- **Semicolons**: Always use semicolons
- **Line length**: Aim for ~80-100 characters (not strict)
- **Naming**:
  - PascalCase: Components, classes, type interfaces
  - camelCase: Functions, variables, object properties
  - UPPER_SNAKE_CASE: Constants

### Comments
- **Explain "why" not "what"** - Comment complex logic and decisions
- **Use JSDoc** for public APIs and exported functions
- **Mark incomplete work** - Use `// TODO:` comments
- **Avoid obvious comments** - Don't comment what the code clearly shows

### React Three Fiber Patterns

#### Game Loop
Use `useFrame` for animation and game logic:
```typescript
useFrame((state, delta) => {
  // delta = time since last frame in seconds
  updatePlayerPosition(delta);
  checkCollisions();
});
```

#### 3D Components
Structure game objects as React components. This is a simplified example for illustration:
```typescript
interface FloatProps {
  position: [number, number, number];
  speed: number;
}

export function ExampleFloat({ position, speed }: FloatProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.z += speed * delta;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[2, 1, 3]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  );
}
```

**Note:** Real components like `ParadeFloat` use more complex props including `id`, `startZ`, `lane`, `color`, and `playerPosition`. See actual implementations in `client/src/components/game/` for production-ready examples.

### State Management with Zustand

Create stores in `client/src/lib/stores/` using the double function call pattern with middleware:
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface GameStore {
  score: number;
  level: number;
  addScore: (points: number) => void;
}

// Note: Use create<GameStore>()() pattern with middleware
export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set) => ({
    score: 0,
    level: 1,
    addScore: (points) => set((state) => ({ score: state.score + points })),
  }))
);
```

Usage in components:
```typescript
const score = useGameStore((state) => state.score);
const addScore = useGameStore((state) => state.addScore);
```

### Backend API Patterns

#### Route Structure
Define routes in `server/routes.ts`:
```typescript
import type { Express } from 'express';
import { storage } from './storage';

export function registerRoutes(app: Express) {
  app.get('/api/user/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });
}
```

#### Database Operations
The codebase uses an in-memory storage implementation via the `IStorage` interface:
```typescript
import { users, type User, type InsertUser } from '@shared/schema';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
```

For PostgreSQL integration with Drizzle ORM, follow this pattern:
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { users, type User } from '../shared/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function getUser(id: number): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}
```

## Common Patterns

### Collision Detection
```typescript
import { Vector3 } from 'three';

// Distance-based collision detection using THREE.Vector3
const distance = playerPosition.distanceTo(collectiblePosition);
const isCaught = distance < CATCH_RADIUS;

// Alternative: Manual distance calculation
const dx = playerPosition.x - collectiblePosition.x;
const dy = playerPosition.y - collectiblePosition.y;
const dz = playerPosition.z - collectiblePosition.z;
const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
```

### Physics Simulation
```typescript
import { Vector3 } from 'three';

// Apply gravity to objects with proper THREE.Vector3 types
const velocity = new Vector3(0, 5, 0); // Initial velocity
const position = new Vector3(0, 10, 0); // Current position
const GRAVITY = 9.81; // Gravity constant

// Update physics each frame
velocity.y -= GRAVITY * delta;
position.add(velocity.clone().multiplyScalar(delta));
```

### Texture Loading
```typescript
import { useTexture } from '@react-three/drei';

const texture = useTexture('/textures/my-texture.png');
```

## Performance Guidelines

- **Target performance**: 60 FPS on desktop, 45+ FPS on mobile
- **Optimize geometry**: Keep polygon counts reasonable (floats <10k tris, collectibles <1k tris)
- **Use instancing** for repeated objects when possible
- **Texture optimization**: Use compressed formats, max 2048x2048
- **Limit active objects**: Pool and reuse objects instead of creating/destroying
- **Disable shadows** if performance is critical
- **Use R3F's Perf component** in development to monitor FPS

## Git Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting (no logic change)
- `refactor` - Code restructuring (no behavior change)
- `perf` - Performance improvements
- `test` - Test additions or changes
- `chore` - Build process, tooling, dependencies

**Examples:**
```
feat(game): add king cake collectible
fix(collision): correct catch radius calculation
docs(readme): update installation instructions
refactor(stores): simplify game state logic
perf(rendering): reduce draw calls for better FPS
```

## Testing Guidelines

Since this is a game, most testing is manual:

1. **Start dev server**: `npm run dev`
2. **Test in browser**: Open http://localhost:5000
3. **Check gameplay**: Verify all features work correctly
4. **Test mobile**: Use DevTools device emulation
5. **Monitor performance**: Use FPS counter (Perf component in dev mode)
6. **Check console**: Ensure no errors or warnings
7. **Type check**: Run `npm run check` before committing

### Pre-Commit Checklist
- [ ] Code runs without errors (`npm run dev`)
- [ ] TypeScript compiles (`npm run check`)
- [ ] No console errors or warnings
- [ ] Game is playable and features work
- [ ] Performance is acceptable (45+ FPS)
- [ ] Code follows project style guidelines
- [ ] Commit message follows conventional format

## Environment Variables

Create `.env` in root directory:
```env
DATABASE_URL=postgresql://user:password@host/database
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_random_secret_here
```

## Important Notes

- **Always run `npm run check`** before committing to catch TypeScript errors
- **Test on both desktop and mobile** - The game supports both platforms
- **Keep changes minimal** - Make surgical, focused changes
- **Document complex logic** - Add comments for non-obvious code
- **Follow existing patterns** - Match the coding style of surrounding code
- **Update documentation** if you change public APIs or add new features

## Resources

- [CONTRIBUTING.md](../docs/CONTRIBUTING.md) - Full contribution guidelines
- [DEVELOPMENT_GUIDE.md](../docs/DEVELOPMENT_GUIDE.md) - Detailed technical documentation
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
