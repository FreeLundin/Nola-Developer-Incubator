# Client Setup - Mardi Gras Parade Game (Web Version)

This directory contains the React/Three.js frontend for the Mardi Gras Parade Game.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

From the **project root** directory:

```bash
# Install all dependencies (includes client, server, and shared)
npm install
```

### Development

```bash
# Start the development server (from project root)
npm run dev

# The game will be available at http://localhost:5000
```

The development server includes:
- ⚡ **Hot Module Replacement (HMR)** - Changes reflect instantly
- 🔄 **Fast Refresh** - React components update without losing state
- 🐛 **Source Maps** - Easy debugging in browser DevTools
- 🎨 **PostCSS/Tailwind** - Automatic style processing

## 📁 Project Structure

```
client/
├── index.html          # HTML entry point
├── public/             # Static assets
│   ├── sounds/         # Audio files (.mp3, .ogg, .wav)
│   └── textures/       # Image files and textures
├── src/
│   ├── main.tsx        # Application entry point
│   ├── App.tsx         # Root component
│   ├── index.css       # Global styles
│   ├── components/     # Reusable React components
│   │   ├── game/       # Game-specific components (3D objects, UI)
│   │   └── ui/         # UI components (buttons, dialogs, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and state management
│   │   └── stores/     # Zustand state stores
│   └── pages/          # Page components
└── README.md           # This file
```

## 🛠️ Key Technologies

- **React 18.3** - UI framework
- **Three.js** - 3D graphics engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

## 🎮 Game Features

### Core Gameplay
- **3D Environment** - Rendered using Three.js/WebGL
- **Physics-Based Catching** - Realistic projectile motion
- **Combo System** - Chain catches for bonus points
- **Color Matching** - Catch your assigned color for multipliers
- **Power-Ups** - Speed boosts and point multipliers

### Controls
- **Desktop**: WASD or Arrow Keys + Mouse
- **Mobile**: Touch controls with virtual joystick
- **Click-to-Move**: Click anywhere to move player

## 🔧 Development Tips

### Running the Dev Server

The application runs on port 5000 (via Express backend):
- Backend API: `http://localhost:5000/api/*`
- Frontend: `http://localhost:5000/*`

**Architecture Note**: Vite runs in middleware mode and is proxied through the Express server. This means:
- You always access the app at `http://localhost:5000`
- Vite's internal port (5173) is not directly accessible
- Hot Module Replacement (HMR) works seamlessly through the Express proxy
- Both frontend and backend are served from a single port

### Path Aliases

Two path aliases are configured for easier imports:

```typescript
// Import from client/src/
import { Component } from '@/components/Component';

// Import from shared/
import { schema } from '@shared/schema';
```

### Adding New Assets

**Static Files** (images, audio, models):
- Place in `client/public/`
- Reference with absolute paths: `/textures/image.png`

**Imported Assets** (processed by Vite):
- Place in `client/src/assets/`
- Import in code: `import image from './assets/image.png'`

### Environment Variables

Create a `.env` file in the project root:

```env
# Example environment variables
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🏗️ Build for Production

```bash
# From project root
npm run build

# Output will be in dist/public/
# Includes minified JS, CSS, and optimized assets
```

To test the production build locally:
```bash
npm run start
# Open http://localhost:5000
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is already in use, the server will automatically try another port.

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Type check without building
npm run check
```

### Browser Compatibility Issues

Modern browsers are targeted (ESNext). Supported browsers include:
- Chrome 91+
- Firefox 90+
- Safari 14+
- Edge 91+

For older browser support, you can update the `build.target` in `vite.config.ts`:
```typescript
// In vite.config.ts
export default defineConfig({
  // ... other config
  build: {
    // ... other build options
    target: 'es2015',  // Change from 'esnext' for wider compatibility
  },
});
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

See the main [README.md](../README.md) for contribution guidelines.

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details.
