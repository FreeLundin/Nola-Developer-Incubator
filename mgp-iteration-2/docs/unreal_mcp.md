# Unreal 5.7 MCP Integration Strategy

This document describes a minimal approach to connect the MGP Iteration 2 web/IDE workflow to Unreal Engine 5.7 for rapid prototyping and feature parity.

Goals:
- Allow designers to edit input presets (handedness, flip, sensitivity) in the web IDE and push them to Unreal.
- Provide a JSON-based mapping that an Unreal Editor plugin or Python script can consume to generate Blueprint events and variables.
- Offer a small local MCP server (`/mcp`) that Unreal can poll or call to retrieve latest presets.

Approach:
1. MCP server (this repo): exposes `/mcp/controls` and `/mcp/unreal/blueprint`.
2. Unreal Editor plugin (recommendation): a small Editor utility (Python or C++) that polls `/mcp/controls` and updates project config or creates a blueprint asset.
3. Blueprint mapping: the web IDE posts `{ name, mapping }` to `/mcp/unreal/blueprint` with keys like `OnSetFlip`, `OnSetSensitivity` and values describing variable assignments. The editor plugin should translate this to nodes.

Practical steps for Unreal 5.7:
- Implement an Editor Utility Widget (C++ or Python) that does HTTP GET to `http://localhost:4004/mcp/controls`.
- When new presets are detected, update `Input.ini` or create a Blueprint containing variable defaults matching the mapping.
- For runtime hot-reload in a running PIE session, the plugin can broadcast events via the Editor Scripting API.

Notes:
- This MCP is intentionally minimal and designed for local development. For production, secure the endpoints and add authentication.
- For large asset sync (textures/models), use an asset bundling pipeline or the Unreal Editor's source control integration to pull files.
