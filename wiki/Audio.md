# Audio & Howler.js

This page documents the audio approach and how to use Howler.js in the project.

Why Howler.js
- Reliable mixing, autoplay unlock handling, and cross-browser behavior.

Key points
- Use `Howl` for sound sources and `Howler` global for volume/mute controls.
- Unlock pattern: call `Howler.autoUnlock = false` and call `Howler.unload()` only when appropriate. The project has `client/src/hooks/useAudio.tsx` which attempts to unlock on first user gesture.

Example usage

```ts
import { Howl } from 'howler';
const sfx = new Howl({ src: ['/sounds/collect.wav'], volume: 0.8 });
sfx.play();
```

Advanced mixing
- Use Howler groups (managing arrays of Howl objects) or track `Howler.volume()` for global control.

Troubleshooting
- If audio doesn't play on page load, ensure user gesture: call `sfx.play()` inside a click/touch handler.
- The Admin UI has an "Enable Audio" button that triggers unlocking via the `useAudio` hook.

If you want a short sample mixing demo or a small test page that validates audio playback for Playwright, I can create it under `client/public/` and link it here.

