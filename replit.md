# Krew of Boo Parade Game

## Overview

This is a 3D Mardi Gras parade catching game built with React Three Fiber. Players navigate through a parade scene to catch collectibles (beads, doubloons, and cups) thrown from parade floats. The game features progressive difficulty across levels, combo scoring mechanics, and festive fireworks celebrations.

The application uses a full-stack TypeScript architecture with Express backend, React frontend, and PostgreSQL database support via Drizzle ORM.

## Recent Changes

**October 29, 2025 - Strategic Gameplay & Parade Route Redesign**
- Added trajectory hints: pulsing target markers show where each throw will land before it hits the ground
- Implemented 5-second ground despawn: uncollected items disappear after sitting on ground for 5 seconds
- Redesigned street as proper parade route: narrower street (14 units) with yellow center line, curbs, and gray sidewalks
- Moved parade to one side: all floats now travel on right side of street for authentic parade experience
- Created competitor bots: 4 AI characters that actively compete for catches, adding challenge and urgency
- Bots use smart pathfinding: chase nearest low-altitude collectibles and wander when idle
- Updated player boundaries: constrained to street width (-6.5 to 6.5) to stay on parade route
- Fixed collectible position tracking: store updates each frame so bots can chase live targets

**October 28, 2025 - Gameplay Enhancements & Performance Optimizations**
- Added power-up system: Speed Boost (1.5x movement for 5s) and Double Points (2x scoring for 8s)
- Implemented power-up UI indicators with smooth countdown timers and progress bars
- Created special King Cake collectible (rare item worth 5 bonus points, 10% spawn chance)
- Added visual click feedback with animated ripple markers showing where clicks land
- Implemented bouncing physics for collectibles (single bounce with 40% energy retention)
- Added combo timer visual meter showing time remaining to maintain combo chain
- Optimized rendering: reduced polygon counts across all geometries (spheres 12→8 segments, cylinders 12→8, wheels 12→8)
- Reduced particle effects from 20 to 12 particles per catch for better performance
- Fixed power-up state persistence bug in resetGame (now properly clears active power-ups)
- Optimized Player shadow to use ref-based updates instead of re-rendering
- Enhanced parade floats to throw varied items (75% regular, 15% power-ups, 10% King Cake)
- Created Obstacle component (trash cans and barriers) ready for integration

**October 28, 2025 - Camera Lock & Festive Fireworks**
- Removed camera toggle controls (locked to third-person view per user preference)
- Added festive fireworks sound effects on level completion (3 celebratory bursts)
- Play fireworks sounds when achieving 3x combo or higher
- Updated tutorial and hints to remove camera switching instructions

**October 28, 2025 - iPad/Tablet Controls & Tutorial Enhancement**
- Fixed tablet detection to properly identify iPads (including iPad Pro) via touch capability detection
- Enhanced touch controls with larger, more visible joystick (140px) and catch button (132px)
- Added dedicated catch button for tablets with visual feedback and proper touch handling
- Updated tutorial to show platform-specific controls (PC keyboard vs tablet touch)
- Improved in-game hints to mention catch button for tablet users
- Items now require minimum height (0.5 units) to be catchable, preventing ground pickups
- Added variable throw arcs (40% easy, 40% medium, 20% hard) for better gameplay variety

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, bundled using Vite

**3D Rendering**: 
- React Three Fiber (@react-three/fiber) for Three.js integration
- React Three Drei (@react-three/drei) for helpful 3D utilities
- React Three Postprocessing for visual effects
- GLSL shader support via vite-plugin-glsl

**UI Components**: 
- Radix UI primitives for accessible component foundation
- Tailwind CSS for styling with custom design tokens
- Shadcn/ui component patterns
- Framer Motion for animations
- React Confetti for celebration effects

**State Management**:
- Zustand stores with selector subscriptions for game state (`useParadeGame`)
- Separate audio state management (`useAudio`)
- React Query (@tanstack/react-query) for server state (configured but not actively used)

**Game Architecture**:
- Component-based game entities (Player, ParadeFloat, Collectible, Environment)
- Physics simulation with custom gravity and velocity calculations
- Collision detection using distance-based calculations
- Touch controls optimized for tablets/iPads with on-screen joystick and catch button
- Keyboard controls using React Three Drei's KeyboardControls
- Smart device detection (touch capability + screen size) to support all tablets including iPad Pro
- Interactive tutorial system with platform-specific control instructions

**Routing**: No client-side routing implemented (single-page application)

### Backend Architecture

**Server**: Express.js with TypeScript

**Architecture Pattern**: Simple RESTful API structure
- Routes defined in `server/routes.ts`
- Storage abstraction layer (`IStorage` interface) in `server/storage.ts`
- In-memory storage implementation (`MemStorage`) as default
- Designed to be swapped with database implementation

**Development Setup**:
- Vite dev server integrated via middleware in development
- Server-side rendering preparation for production builds
- Hot module replacement (HMR) support
- Custom logging middleware for API requests

**Build Process**:
- Frontend: Vite bundler outputs to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Separate type checking via TypeScript compiler

### Data Storage

**ORM**: Drizzle ORM with PostgreSQL dialect

**Database Provider**: Neon serverless PostgreSQL (@neondatabase/serverless)

**Schema Design** (`shared/schema.ts`):
- Users table with username/password authentication structure
- Zod schema validation integration for type-safe inserts
- Shared types between frontend and backend

**Migration Strategy**: 
- Drizzle Kit for schema migrations
- Push-based deployment (`db:push` script)
- Migration files stored in `./migrations` directory

**Current State**: Database schema defined but storage layer using in-memory implementation. The application is designed to easily swap to database-backed storage by implementing the `IStorage` interface with Drizzle queries.

### External Dependencies

**Database**:
- PostgreSQL (Neon serverless) - connection via `DATABASE_URL` environment variable
- Drizzle ORM for database operations and schema management

**Build Tools**:
- Vite for frontend bundling and development server
- esbuild for backend compilation
- TypeScript for type checking across full stack
- PostCSS with Tailwind CSS for styling

**UI Libraries**:
- Radix UI component primitives (30+ components)
- Lucide React for icons
- Class Variance Authority for component variants
- CLSX and Tailwind Merge for className utilities

**3D Graphics**:
- Three.js (via React Three Fiber)
- GLSL shader support for custom materials

**Audio**: HTML5 Audio API (no external audio library)

**Forms & Validation**:
- React Hook Form for form state
- Zod for schema validation

**Utilities**:
- date-fns for date manipulation
- nanoid for unique ID generation

**Development**:
- tsx for TypeScript execution in development
- Replit-specific plugins for error overlays