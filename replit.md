# Krew of Boo Parade Game

## Overview

This is a 3D Mardi Gras parade catching game built with React Three Fiber. Players navigate through a parade scene to catch collectibles (beads, doubloons, and cups) thrown from parade floats. The game features progressive difficulty across levels, combo scoring mechanics, and both first-person and third-person camera modes.

The application uses a full-stack TypeScript architecture with Express backend, React frontend, and PostgreSQL database support via Drizzle ORM.

## Recent Changes

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