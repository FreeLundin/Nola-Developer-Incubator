# Performance & Assets Guidance

Quick notes to improve mobile performance:

- Use texture atlases for UI and small sprites to reduce draw calls.
- Prefer power-of-two textures and create lower-resolution MIP maps for mobile.
- Use compressed textures (ETC2 for Android, ASTC where supported) when packaging.
- Limit particle count on low-end devices and provide LOD fallbacks.
- Use fewer dynamic lights; bake lighting where possible for background elements.
- Consider sprite impostors or billboards for distant floats with LOD switching.

Example checklist before release:
- Create a single atlas for UI elements and joystick textures.
- Generate LODs for any 3D props and configure distance-based switching.
- Run profiling on a representative low-end device and monitor FPS & memory.
