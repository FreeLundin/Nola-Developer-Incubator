# MGP Iteration 2

Iterative rebuild of the Mardi Gras Parade game focusing on mobile UX and Unreal integration.

Quick start (dev + MCP):

```bash
cd mgp-iteration-2
npm install
# start web dev server
npm run dev
# in a second terminal, start MCP helper
npm run mcp
```

Open http://localhost:5173 to test client. MCP runs on http://localhost:4004

What's included:
- Client: React + r3f skeleton with mobile-friendly joystick, flip/sensitivity/handedness controls, HUD.
- MCP: small Express helper exposing `/mcp/controls` and `/mcp/unreal/blueprint` for Unreal Editor integration.

Next steps: add assets, spawn systems, Unreal Editor plugin.
