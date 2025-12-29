# 💻 Development Guide

This guide provides technical details for developers working on the Mardi Gras Parade Simulator.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Environment](#development-environment)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js 18+**
   - Download: [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm or pnpm**
   - Included with Node.js
   - Verify: `npm --version`

3. **Git**
   - Download: [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

### Recommended Tools

- **VS Code** - Code editor with excellent TypeScript support
  - Extensions: ESLint, Prettier, TypeScript, Tailwind CSS IntelliSense
- **PostgreSQL** - For local database development
  - Or use Neon serverless (recommended)

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FreeLundin/Nola-Developer-Incubator.git
cd Nola-Developer-Incubator
```

### 2. Install Dependencies

```bash
npm install
```

This installs all frontend and backend dependencies defined in `package.json`.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (use Neon for serverless PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# Server
PORT=5000
NODE_ENV=development

# Optional: Session secret
SESSION_SECRET=your_random_secret_here
```

### 4. Database Setup

Push the schema to your database:

```bash
npm run db:push
```

This uses Drizzle Kit to sync the schema defined in `shared/schema.ts` to your PostgreSQL database.

### 5. Start Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000`. The page will automatically reload when you make changes.

---

## Development Environment

### Development Server

The dev server is powered by Vite and provides:
- ⚡ Fast Hot Module Replacement (HMR)
- 🔍 TypeScript type checking
- 📦 Automatic bundling
- 🔄 Backend auto-restart with tsx

### How to launch in your browser (quick)

Use one of the recommended flows below depending on whether you want a local editable instance or a public shareable link.

- Local (developer):

```powershell
npm ci
npm run dev
# Open http://localhost:5000
```

- Public (shareable): publish the built frontend (`dist/public`) to GitHub Pages (workflow `.github/workflows/deploy-gh-pages.yml`) or run the local `deploy:gh-pages` script. Example public URL for this repo:

```
https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/
```

- If the public page appears blank, use the debug page to bypass cached index:

```
https://Nola-Developer-Incubator.github.io/MardiGrasParadeGame/debug.html
```

> Note: Vercel-related guides and legacy CI have been archived to `archive/legacy-hosting/` and are no longer part of the recommended workflow for this repository.

### File Structure

```
src/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── game/     # Game-specific components
│   │   │   └── ui/       # UI components (buttons, dialogs, etc.)
│   │   ├── lib/
│   │   │   └── stores/   # Zustand state stores
│   │   ├── hooks/        # Custom React hooks
│   │   ├── main.tsx      # App entry point
│   │   └── index.css     # Global styles
│   └── public/           # Static assets
│       ├── textures/     # 3D textures
│       └── sounds/       # Audio files
│
├── server/               # Backend code
│   ├── index.ts         # Express server setup
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database interface
│   └── vite.ts          # Vite integration
│
└── shared/              # Shared code
    └── schema.ts        # Database schema (Drizzle)
```

### Key Technologies

#### Frontend
- **React Three Fiber (R3F)** - React renderer for Three.js
  - `<Canvas>` - WebGL context wrapper
  - `useFrame` - Animation loop hook
  - `useThree` - Access Three.js internals
- **React Three Drei** - Helpful R3F utilities
  - `<OrbitControls>` - Camera controls
  - `<Text>` - 3D text rendering
  - `<useTexture>` - Texture loading
- **Zustand** - State management
  - Lightweight alternative to Redux
  - Simple hooks-based API
- **TailwindCSS** - Utility-first styling

#### Backend
- **Express.js** - Web framework
  - RESTful API endpoints
  - Middleware support
- **Drizzle ORM** - TypeScript ORM
  - Type-safe queries
  - SQL-like syntax
  - PostgreSQL support

---

## Project Architecture

### Game Loop

The game uses React Three Fiber's `useFrame` hook for the main game loop:

```typescript
// In a game component
useFrame((state, delta) => {
  // Update game state each frame
  // delta = time since last frame (in seconds)
  
  updatePlayerPosition(delta);
  updateFloats(delta);
  checkCollisions();
  updatePhysics(delta);
});
```

### State Management

The game state is managed with Zustand:

```typescript
// stores/gameStore.ts
interface GameStore {
  // State
  score: number;
  level: number;
  combo: number;
  
  // Actions
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // ...state and actions
}));
```

Usage in components:

```typescript
function GameUI() {
  const score = useGameStore((state) => state.score);
  const addScore = useGameStore((state) => state.addScore);
  
  return <div>Score: {score}</div>;
}
```

### 3D Components

Game objects are React components:

```typescript
function ParadeFloat({ position, speed }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    // Animate the float
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

### Physics & Collision Detection

The game uses custom physics and distance-based collision detection:

```typescript
// Check if player is within catch radius of collectible
function checkCollision(player, collectible) {
  const distance = player.position.distanceTo(collectible.position);
  return distance < CATCH_RADIUS;
}

// Apply gravity to collectibles
function applyGravity(collectible, delta) {
  collectible.velocity.y -= GRAVITY * delta;
  collectible.position.add(collectible.velocity.multiplyScalar(delta));
}
```

### API Integration

The backend provides REST endpoints for persistence:

```typescript
// server/routes.ts
app.get('/api/profile/:id', async (req, res) => {
  const profile = await storage.getProfile(req.params.id);
  res.json(profile);
});

app.post('/api/save', async (req, res) => {
  await storage.saveGame(req.body);
  res.json({ success: true });
});
```

Frontend usage:

```typescript
// In a component
async function saveProgress() {
  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameState)
  });
  
  if (response.ok) {
    console.log('Game saved!');
  }
}
```

---

## Coding Standards

### TypeScript

- **Use strict mode** - Enabled in `tsconfig.json`
- **Type everything** - Avoid `any` type
- **Use interfaces for objects** - Prefer interfaces over types for object shapes
- **Export types** - Share types between frontend and backend via `shared/`

Example:

```typescript
// Good
interface Player {
  position: Vector3;
  velocity: Vector3;
  color: CollectibleColor;
  score: number;
}

function updatePlayer(player: Player, delta: number): void {
  // Implementation
}

// Avoid
function updatePlayer(player: any, delta: any) {
  // Implementation
}
```

### React Components

- **Functional components** - Use hooks, avoid class components
- **Descriptive names** - PascalCase for components
- **Props interfaces** - Define types for all props
- **Custom hooks** - Extract reusable logic

Example:

```typescript
interface FloatProps {
  position: [number, number, number];
  speed: number;
  onPass?: () => void;
}

export function ParadeFloat({ position, speed, onPass }: FloatProps) {
  // Component implementation
}
```

### File Organization

- **One component per file** - Easier to find and maintain
- **Index files** - Use `index.ts` to re-export from directories
- **Naming conventions**:
  - Components: `ParadeFloat.tsx`
  - Hooks: `useGameLoop.ts`
  - Utilities: `collision.ts`
  - Stores: `gameStore.ts`

### Comments

- **Document complex logic** - Explain "why", not "what"
- **JSDoc for public APIs** - Helps with autocomplete
- **TODO comments** - Mark unfinished work

Example:

```typescript
/**
 * Calculates the trajectory for throwing collectibles from floats.
 * Uses a parabolic arc to simulate realistic throwing physics.
 * 
 * @param startPos - Starting position of the throw
 * @param targetPos - Approximate target position
 * @param throwForce - Force of the throw (0-1)
 * @returns Initial velocity vector
 */
function calculateThrowTrajectory(
  startPos: Vector3,
  targetPos: Vector3,
  throwForce: number
): Vector3 {
  // Implementation
}
```

---

## Testing

### Manual Testing

Since this is a game, most testing is done manually:

1. **Start the dev server** - `npm run dev`
2. **Open browser** - http://localhost:5000
3. **Test gameplay** - Check all features work correctly
4. **Test on mobile** - Use device emulation in DevTools
5. **Check performance** - Use FPS counter (Perf component in dev mode)

### Testing Checklist

Before committing changes, verify:

- [ ] Game loads without errors
- [ ] Player movement works (WASD, click-to-move, touch)
- [ ] Collectibles can be caught
- [ ] Score increments correctly
- [ ] Combos work as expected
- [ ] Level progression functions
- [ ] UI displays correctly
- [ ] Audio plays when expected
- [ ] No console errors
- [ ] Performance is acceptable (45+ FPS)

### Type Checking

Run TypeScript compiler to check for type errors:

```bash
npm run check
```

Fix any type errors before committing.

### Performance Profiling

Use the built-in performance monitor:

```typescript
// In game scene
import { Perf } from 'r3f-perf';

<Canvas>
  {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
  {/* Rest of scene */}
</Canvas>
```

---

## Building for Production

### Build Process

```bash
# Build both frontend and backend
npm run build
```

This:
1. Runs Vite to bundle the frontend → `dist/public/`
2. Runs esbuild to bundle the backend → `dist/index.js`

### Testing Production Build

```bash
# Start production server
npm start
```

Test thoroughly in production mode before deployment.

### Deployment

The project is designed for deployment to platforms like:

- **GitHub Pages** - Frontend hosting (static)
- **Railway** - Backend hosting
- **Render** - Full-stack hosting
- **Neon** - PostgreSQL database

Deployment steps vary by platform. Generally:

1. **Build the project** - `npm run build`
2. **Set environment variables** - Configure `DATABASE_URL`, etc.
3. **Deploy** - Follow platform-specific instructions
4. **Verify** - Test the deployed application

---

## Troubleshooting

### Common Issues

#### Dev server won't start

**Issue**: Port 5000 already in use

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `.env`:
```env
PORT=3000
```

#### Database connection fails

**Issue**: Can't connect to PostgreSQL

**Solution**:
1. Verify `DATABASE_URL` in `.env` is correct
2. Check database is running (if local)
3. For Neon, check connection string format:
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```
4. Run `npm run db:push` to initialize schema

#### TypeScript errors

**Issue**: Type errors in imported Three.js types

**Solution**:
```bash
# Reinstall @types packages
npm install --save-dev @types/three @types/react @types/node
```

#### 3D scene is black

**Issue**: No lighting in scene

**Solution**: Add lights to the scene:
```typescript
<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
  {/* Rest of scene */}
</Canvas>
```

#### Performance is slow

**Issue**: Low FPS, laggy gameplay

**Solutions**:
1. **Reduce object count** - Limit floats, collectibles, NPCs
2. **Optimize geometry** - Use simpler meshes
3. **Reduce particles** - Lower particle counts
4. **Disable shadows** - Remove `castShadow` and `receiveShadow`
5. **Use texture atlases** - Combine multiple textures
6. **Enable instancing** - For repeated objects

#### Build fails

**Issue**: Build errors during `npm run build`

**Solutions**:
1. **Clear cache**:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```
2. **Check for type errors**: `npm run check`
3. **Update dependencies**: `npm update`

---

## Development Tips

### Hot Reload

The dev server supports hot module replacement (HMR). Most changes apply instantly without full page reload.

**Note**: Some changes require full reload:
- New files added
- `vite.config.ts` changes
- `tsconfig.json` changes

### Debugging

#### Browser DevTools

- **Console** - View logs, errors, warnings
- **Network** - Monitor API requests
- **Performance** - Profile rendering and scripts
- **Sources** - Set breakpoints, step through code

#### React DevTools

Install [React Developer Tools](https://react.dev/learn/react-developer-tools) extension to:
- Inspect component tree
- View props and state
- Profile component renders

#### Three.js Debugging

```typescript
// Log Three.js objects
console.log(scene.children); // View all objects in scene

// Debug helpers
import { useHelper } from '@react-three/drei';
import { BoxHelper } from 'three';

function DebugBox({ meshRef }) {
  useHelper(meshRef, BoxHelper, 'red');
  return null;
}
```

### Git Workflow

1. **Pull latest changes** - `git pull origin main`
2. **Create feature branch** - `git checkout -b feature/my-feature`
3. **Make changes** - Edit code
4. **Test thoroughly** - Follow testing checklist
5. **Commit** - `git commit -m "feat: add new feature"`
6. **Push** - `git push origin feature/my-feature`
7. **Open PR** - Create pull request on GitHub

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions or changes
- `chore` - Build process or tooling changes

Examples:
```bash
git commit -m "feat(game): add king cake collectible"
git commit -m "fix(collision): correct catch radius calculation"
git commit -m "docs(readme): update installation instructions"
```

---

## Additional Resources

### Learning
- **React Three Fiber** - [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- **Three.js** - [threejs.org/docs](https://threejs.org/docs)
- **Drizzle ORM** - [orm.drizzle.team](https://orm.drizzle.team)
- **TypeScript** - [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### Community
- **React Three Fiber Discord** - [discord.gg/poimandres](https://discord.gg/poimandres)
- **Three.js Forum** - [discourse.threejs.org](https://discourse.threejs.org)

### Tools
- **Three.js Editor** - [threejs.org/editor](https://threejs.org/editor/) - Visual scene editor
- **glTF Viewer** - [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/) - Preview 3D models
- **Blender** - [blender.org](https://www.blender.org/) - Free 3D modeling software

---

## Next Steps

Now that you understand the development environment:

1. **Explore the codebase** - Familiarize yourself with the structure
2. **Make a small change** - Start with something simple
3. **Read [CONTRIBUTING.md](CONTRIBUTING.md)** - Learn how to contribute
4. **Join the community** - Ask questions, share ideas
5. **Have fun!** - Enjoy building and improving the simulator

---

**Questions?** Open an issue on GitHub or check existing discussions.

**Happy coding!** 🎉
