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

---
