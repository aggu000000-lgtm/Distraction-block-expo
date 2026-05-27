<div align="center">

# FocusGuard

### The distraction blocker that respects your intelligence.

*It doesn't just block. It teaches you about yourself.*

---

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-4630EB.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)

</div>

---

## The Idea

Most distraction blockers are walls. You hit them, feel restricted, resent them, and find a way around.

FocusGuard is a mirror. It shows you, calmly and honestly, how often you reach for distraction and what you do when focus gets hard. Once you can see that pattern, you can change it.

---

## Documentation

This repository is fully documented before a single line of app code is written. That's intentional.

| Document | What It Contains |
|---|---|
| [`VISION.md`](./VISION.md) | Why this exists. The soul of the product. Start here. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Technology choices, folder structure, data model, blocking engine design |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Color system, typography, spacing, motion, component anatomy |
| [`FEATURES.md`](./FEATURES.md) | Every feature, fully spec'd, tagged by phase |
| [`ROADMAP.md`](./ROADMAP.md) | Day-by-day plan from Day 1 to Day 100 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | For the engineer building this — workflow, standards, decisions |

---

## Status

```
Phase 1: CORE        Days 01–30    [ ] In Progress
Phase 2: POLISH      Days 31–60    [ ] Planned
Phase 3: PLATFORM    Days 61–100   [ ] Planned
```

**Current:** Architecture & documentation complete. Implementation begins Day 1.

---

## Stack

- **Expo** SDK 52 (Managed)
- **Expo Router** v4 (file-based navigation)
- **TypeScript** (strict)
- **Zustand** (state)
- **JSI-SQLite** (persistence)
- **Reanimated 3 + Skia** (animations)
- **Supabase** (cloud sync, Phase 3)

---

## Philosophy

Three laws govern every decision:

**1. Friction, not force** — We don't hard-block. We add a moment of pause. In that pause, users make a choice. Over time, choices become habits.

**2. Data earns trust** — Every number shown means something real. No vanity metrics. Honest confrontation with honest data.

**3. The app should want you off your phone** — We optimize for the day you don't need this app anymore.

---

## Getting Started (Once Implementation Begins)

```bash
git clone https://github.com/aggu000000-lgtm/Distraction-block-expo.git
cd Distraction-block-expo
npm install
npx expo start
```

Requires Node 20.x and Expo Go on your device, or a simulator.

---

<div align="center">

*Read [`VISION.md`](./VISION.md) before you write a single line.*

</div>
