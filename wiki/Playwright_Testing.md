# Playwright Testing Guide

This page describes how to run the Playwright tests and how the CI automation should validate audio and bot presence.

Local run

```powershell
# Install if needed
npm install
# Run tests
npm run test:playwright
```

What tests should check (recommendations)
- Game loads and main canvas initializes
- Bots are present in HUD and their display names update when config changes
- Audio unlock: click Start/Enable Audio button then confirm That audio is playing (test can check for AudioContext resumed state or that Howler reported a playing event)

CI notes
- Use a headless browser with audio mocking or a proper headless audio environment (Playwright has ways to mock audio output). The workflow should start the dev server (e.g., `npm run dev`) in the background, wait for the port, then run tests.
- Attach logs and artifacts to the workflow for debugging.

If you'd like, I can add a sample Playwright test that:
- Starts the dev server under pm2 (or simple `npm run dev` in background),
- Opens http://localhost:5000,
- Clicks the enable audio button,
- Asserts that an element with the bot HUD contains at least one active bot name.

I can also add a GitHub Actions workflow template to this branch if you want.

