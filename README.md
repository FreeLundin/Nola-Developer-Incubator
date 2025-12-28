## Project Plan (Updated 2025-12-28)

### 1. Gameplay Experience & UX
- Notify players when additional obstacles (red balls) and aggressive point-stealing NPCs (white squares) are added.
- Refine joystick UI for simplicity and intuitiveness on both mobile and desktop.
- Separate competitor catch area from joystick on mobile to avoid control conflicts.
- Add clear visual indicator showing the number of floats left.
- Improve hint timing, especially for mobile players.
- Patch inconsistent audio toggle behavior.

### 2. Metrics & Analytics (Backend)
- Track unique player sessions and total player counts (using Firebase, Supabase, or SQLite with free-tier API).
- Record session length to determine average play time.
- Log key gameplay events (level completion, rewards, NPC interactions).
- Display leaderboards for weekly/monthly scores and personal bests.
- Add daily/weekly challenge system and track completion.
- Create a basic admin dashboard (active users, funnel analysis, challenge stats).

### 3. Feature Enhancements
- Increase float spawn rates on early levels, add reward for clearing first 3 levels.
- Add helper bot that appears on combo or purchase.
- Redesign floats for more variety and reduce screen clutter.
- Add haptic and/or audio alerts for major events.
- Enable cloud save for player progress and achievements.
- Public sharing options for high scores/achievements.

### 4. Playtesting & Iteration
- Internal and external playtesting of new features and fixes.
- Continuous backlog refinement from feedback.
- Prioritize polish and fixes before public updates.

### 5. Free Backend Features to Improve Playability
- Player progress & rewards persistence with a free-tier backend.
- Dynamic leaderboards and personal best tracking.
- Daily & weekly in-game challenges.
- Cloud save (cross-device resume).
- Analytics on session count, length, challenge usage, retention, platform breakdown.
- Social score/achievement sharing (simple webhook or API).

---

Thank you all for your feedback and suggestions. This plan compiles the most-requested priorities and documents our path forward for upcoming sprints and updates.
