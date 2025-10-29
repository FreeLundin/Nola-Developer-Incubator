# Mardi Gras Parade Simulator

## Overview

This is a 3D Mardi Gras parade catching game built with React Three Fiber. Players navigate through a parade scene to catch collectibles (beads, doubloons, and cups) thrown from parade floats. The game features progressive difficulty across levels, combo scoring mechanics, and festive fireworks celebrations.

The application uses a full-stack TypeScript architecture with Express backend, React frontend, and PostgreSQL database support via Drizzle ORM.

## Recent Changes

**October 29, 2025 - Game Rebranding & Donation Buttons**
- Renamed game from "Krew of Boo Parade" to "Mardi Gras Parade Simulator"
- Updated all references from Halloween theme to Mardi Gras theme
- Added two donation buttons in bottom-right corner during gameplay:
  - "Support Development" (pink-red gradient) - Opens Replit referral link in new tab
  - "Donate via Chime" (green-emerald gradient) - Copies $nolaDevelopmentIncubator to clipboard with toast notification
- Chime button provides instructions for Chime Pay Anyone transfers
- Both buttons styled with yellow border matching game theme

**October 29, 2025 - Random Wandering NPCs & Obstacles with Level Scaling**
- Aggressive NPCs now wander randomly around catching area instead of patrolling
- NPCs pick random targets every 2-5 seconds within bounds (-6.5 to 6.5 x, -15 to 15 z)
- When player hits an NPC, it chases for exactly 5 seconds (speed: 3.5 units/sec)
- Chasing NPCs turn red for visual feedback, still slower than player (5 units/sec)
- If NPC catches player, player loses 1 point and combo is broken
- 1-second cooldown between collisions prevents rapid damage
- **Level-based scaling**: NPCs increase with difficulty (Level 1: 2 NPCs, Level 2: 3 NPCs, etc.)
- Obstacles converted to sphere shapes (matching competitor bot style)
- Obstacles wander randomly like NPCs, breaking combos on collision
- **Obstacle scaling**: 2 + level count (Level 1: 3 obstacles, Level 2: 4 obstacles, etc.)
- All entities spawn at random positions each level for variety

**October 29, 2025 - Float Collision & Inactivity Timeout**
- Players are eliminated if hit by parade floats
- Collision detection checks player distance from floats every 100ms
- Float collision zone: 2.5 units width × 3 units length
- When hit, triggers eliminatePlayer action ending the level
- Game automatically ends if player stops moving for 30 seconds
- Inactivity timer resets whenever player moves (keyboard, touch, or mouse input)
- Only active during "playing" phase (not during tutorial or win screens)
- Triggers endGameDueToInactivity action which sets phase to "won"
- Prevents players from leaving game idle indefinitely

**October 29, 2025 - Non-Intrusive Monetization Features**
- Implemented rewarded video ad system (optional, player-initiated)
- Three ad reward types: continue playing, bonus time (+5 floats), power-up boost (both power-ups)
- Each ad view rewards 10 coins plus the specific benefit
- Players can decline ads and continue normally - completely optional
- Created cosmetic character customization with 6 skins (default, golden, rainbow, ghost, king, jester)
- Skins are purely cosmetic - no gameplay advantages
- Coin earning system: 1 coin per catch, bonus coins for combos (≥3x gives extra coins)
- Cosmetic shop accessible via button in game UI during play
- Skin prices: golden (100), rainbow (150), ghost (200), king (250), jester (200)
- Ad reward offer appears on WinScreen between levels as optional bonus
- Player component updated to display equipped skin colors
- AdRewardScreen shows clear benefits before player commits to watching
- CosmeticShop shows all skins with purchase/equip functionality

**October 29, 2025 - Float-Based Timer System & Gameplay Refinements**
- Implemented float-based timer: levels end when all floats pass, not when score target is reached
- Score is now purely informational - tracks player performance but doesn't control level progression
- Dynamic float generation: Level 1 has 10 floats, Level 2 has 20 floats, increasing by 10 each level
- Floats spaced 10 units apart starting at Z=-30, each float calls `markFloatPassed()` when reaching Z>20
- Disabled mouse click controls automatically on mobile/tablet devices (useIsMobile hook)
- Repositioned obstacles to Z: -16 to -19 (behind main catchable area) for strategic gameplay
- Added deep throw mechanic: 25% of throws use Z direction -1.2 to -1.7, landing in dense obstacle zone
- Removed score-based phase transitions from `addCatch` and `incrementMisses` functions
- Float counting system tracks `totalFloats` and `floatsPassed` to determine level completion
- Players must navigate entire parade duration (all floats) to advance levels

**October 29, 2025 - Moving Obstacles**
- Added 4 moving obstacles that patrol back and forth across the street
- Obstacles include trash cans (rotating boxes) and barriers (orange cylinders)
- Each obstacle has unique speed (1.5-3 units/sec) and starting position/direction
- Obstacles bounce at street boundaries (±6 units) and patrol continuously
- Collision detection breaks player's combo chain as difficulty penalty
- Obstacle types: trash (gray rotating boxes) and barriers (red cylinders)

**October 29, 2025 - Bot Coordination & Anti-Clustering System**
- Implemented shared claim coordination system in Zustand store to prevent bots from clustering
- Added hash-based per-bot-per-collectible preference scoring for unique target selection
- Bots now claim targets via shared `botClaims` map (prevents multiple bots targeting same item)
- Stale claim reclaiming: claims expire after 2 seconds, allowing other bots to reclaim abandoned items
- Bots always pursue their claimed target (removed distance gate to prevent claim-holding while wandering)
- Spread bots across street with unique X and Z starting positions for better initial distribution
- Bot spawning: bot-1 (-5.5, -13), bot-2 (5, -10), bot-3 (-2, -7), bot-4 (3, -12), bot-5 (-4, -9), bot-6 (1, -8)

**October 29, 2025 - Strategic Gameplay & Parade Route Redesign**
- Added trajectory hints: pulsing target markers show where each throw will land before it hits the ground
- Implemented 5-second ground despawn: uncollected items disappear after sitting on ground for 5 seconds
- Redesigned street as proper parade route: narrower street (14 units) with yellow center line, curbs, and gray sidewalks
- Moved parade to one side: all floats now travel on right side of street for authentic parade experience
- Created competitor bots: 6 AI characters that actively compete for catches, adding challenge and urgency
- Bots use smart pathfinding: chase low-altitude collectibles with unique preferences per bot-item pair
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