# ARCHITECTURE — The Engineering Blueprint

---

## Guiding Principle

> **The architecture must be so clean that any mid-level developer can pick up any file, understand its purpose in 30 seconds, and know exactly where to add the next feature.**

No clever abstractions for their own sake. No over-engineering. No premature optimization. Every layer exists because it solves a real problem — not to look impressive.

---

## Technology Stack

### Runtime
| Layer | Choice | Rationale |
|---|---|---|
| Framework | Expo SDK 52 (managed) | Zero native config, OTA updates, fastest iteration |
| Language | TypeScript (strict) | No `any`, no escape hatches |
| Navigation | Expo Router v4 | File-based, typed routes, deep linking for free |
| Styling | React Native StyleSheet | No abstraction layer on top of RN; raw, predictable |

### State & Data
| Layer | Choice | Rationale |
|---|---|---|
| Client State | Zustand | 8KB, no boilerplate, works outside React |
| Persistence | MMKV via expo-community | 10x faster than AsyncStorage; synchronous reads |
| Remote Sync | Supabase (Phase 3+) | Postgres + Auth + Realtime; open source |
| Caching | TanStack Query (Phase 3+) | Server state separate from client state |

### UI
| Layer | Choice | Rationale |
|---|---|---|
| Animations | Reanimated 3 + Skia | Runs on UI thread; 60/120fps guaranteed |
| Gestures | Gesture Handler v2 | Pairs with Reanimated; native feel |
| Icons | Lucide React Native | Consistent 24px grid; tree-shakeable |
| Gradients | Expo Linear Gradient | Native gradient, no SVG overhead |
| Haptics | Expo Haptics | Tactile feedback on every meaningful interaction |

### Testing
| Layer | Choice | Rationale |
|---|---|---|
| Unit | Vitest | Fast, ESM-native |
| Components | React Native Testing Library | Tests behavior not implementation |
| E2E | Maestro | YAML-based, runs on device, CI-friendly |

---

## Folder Architecture

```
focusguard/
│
├── app/                          # Expo Router screens (file = route)
│   ├── (auth)/                   # Unauthenticated flow
│   │   ├── welcome.tsx
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx       # Step progress layout
│   │   │   ├── habits.tsx        # Step 1: What do you struggle with?
│   │   │   ├── goals.tsx         # Step 2: What are you trying to protect?
│   │   │   └── schedule.tsx      # Step 3: When do you want to focus?
│   │   └── signin.tsx
│   │
│   ├── (app)/                    # Authenticated app shell
│   │   ├── _layout.tsx           # Root tab navigator
│   │   ├── home/
│   │   │   └── index.tsx         # Dashboard
│   │   ├── sessions/
│   │   │   ├── index.tsx         # Session history
│   │   │   └── active.tsx        # Running session (fullscreen)
│   │   ├── shield/
│   │   │   ├── index.tsx         # Block list overview
│   │   │   ├── apps.tsx          # Individual app toggles
│   │   │   └── rules/
│   │   │       ├── index.tsx     # Rule list
│   │   │       └── [id].tsx      # Rule editor
│   │   ├── insights/
│   │   │   └── index.tsx         # Stats + analytics
│   │   └── profile/
│   │       └── index.tsx         # Settings, account
│   │
│   ├── modals/
│   │   ├── break.tsx             # Break time modal
│   │   ├── temptation.tsx        # "Are you sure?" friction modal
│   │   └── milestone.tsx         # Streak/achievement modal
│   │
│   └── _layout.tsx               # Root layout (font load, providers)
│
├── src/
│   ├── core/                     # Business logic — zero React
│   │   ├── blocking/
│   │   │   ├── engine.ts         # The blocking decision engine
│   │   │   ├── rules.ts          # Rule evaluation (schedule, override)
│   │   │   └── friction.ts       # Friction levels & escalation
│   │   ├── sessions/
│   │   │   ├── timer.ts          # Pure timer logic (no side effects)
│   │   │   └── modes.ts          # Session mode definitions
│   │   ├── analytics/
│   │   │   ├── aggregator.ts     # Roll up raw events → stats
│   │   │   └── insights.ts       # Pattern detection, language generation
│   │   └── notifications/
│   │       └── scheduler.ts      # Local notification scheduling
│   │
│   ├── store/                    # Zustand stores (one per domain)
│   │   ├── blocking.store.ts
│   │   ├── session.store.ts
│   │   ├── analytics.store.ts
│   │   └── user.store.ts
│   │
│   ├── hooks/                    # React hooks (compose core + store)
│   │   ├── useTimer.ts
│   │   ├── useBlockingStatus.ts
│   │   ├── useInsights.ts
│   │   └── useStreaks.ts
│   │
│   ├── ui/                       # Reusable, dumb UI components
│   │   ├── primitives/           # Button, Text, Card, Badge, Divider
│   │   ├── charts/               # BarChart, RingChart, Sparkline
│   │   ├── animations/           # Lottie wrappers, animated primitives
│   │   └── layouts/              # SafeArea, KeyboardAware, ScrollFade
│   │
│   ├── design/                   # Design tokens (single source of truth)
│   │   ├── tokens.ts             # Colors, radii, spacing, typography
│   │   ├── typography.ts         # Font scale & line height system
│   │   └── motion.ts             # Easing curves, durations
│   │
│   ├── lib/                      # Pure utility functions
│   │   ├── time.ts               # Date/duration helpers
│   │   ├── format.ts             # Number/string formatters
│   │   └── storage.ts            # MMKV wrapper with typed keys
│   │
│   └── types/                    # Shared TypeScript types
│       ├── domain.ts             # BlockedApp, Session, Rule, etc.
│       ├── events.ts             # Analytics event schemas
│       └── api.ts                # Supabase response shapes
│
├── assets/
│   ├── fonts/                    # Self-hosted: Geist, Geist Mono
│   ├── animations/               # Lottie JSON files
│   └── images/
│
├── docs/                         # You are here
├── tests/
│   ├── unit/
│   └── e2e/
│
├── app.json
├── app.config.ts                 # Dynamic config (env-aware)
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

---

## Data Model

```typescript
// Every entity has an immutable id and timestamps
// Use discriminated unions for state machines

type App = {
  id: string
  name: string
  bundleId: string           // e.g. "com.instagram.app"
  category: AppCategory      // 'social' | 'entertainment' | 'news' | ...
  icon: string               // emoji fallback (Phase 1), native icon (Phase 3)
  isTracked: boolean         // user opted to track this
}

type BlockRule = {
  id: string
  name: string
  apps: string[]             // App IDs
  condition: RuleCondition   // when does this rule activate?
  friction: FrictionLevel    // 'soft' | 'medium' | 'hard' | 'locked'
  isActive: boolean
  createdAt: number
}

type RuleCondition =
  | { type: 'always' }
  | { type: 'schedule'; days: Day[]; from: string; to: string }
  | { type: 'session' }      // active only during a focus session
  | { type: 'streak_guard' } // activates automatically if streak is at risk

type FocusSession = {
  id: string
  mode: SessionMode
  plannedMinutes: number
  startedAt: number
  endedAt: number | null
  outcome: 'completed' | 'abandoned' | 'ongoing'
  interruptionCount: number  // times user tried to open blocked app
}

type SessionMode = {
  id: 'pomodoro' | 'flow' | 'sprint' | 'custom'
  workMinutes: number
  breakMinutes: number
  cycles: number
}

type UsageEvent = {
  id: string
  appId: string
  timestamp: number
  type: 'open_attempt' | 'open_allowed' | 'open_blocked' | 'friction_bypassed'
  sessionId: string | null
}

// The thing the user actually cares about
type DayReport = {
  date: string               // ISO date "2026-05-27"
  focusMinutes: number
  sessionsCompleted: number
  sessionAbandoned: number
  openAttempts: number       // total opens of tracked apps
  openBlocked: number        // blocked by a rule
  frictionBypassed: number   // user clicked "show anyway"
  streak: number
}
```

---

## The Blocking Engine

This is the core. Everything else is UI around it.

```
User opens app
       ↓
  Is app tracked?  → No → Allow (transparent)
       ↓ Yes
  Is any rule active for this app right now?  → No → Allow + log UsageEvent
       ↓ Yes
  What is the friction level?
       ↓
  'soft'   → Show 1-second delay + app usage count overlay → Allow
  'medium' → Show "Are you sure?" modal with 5s countdown → User must confirm
  'hard'   → Show full-screen breathing exercise (30s) → Then allow
  'locked' → Block completely. No bypass during active session.
       ↓
  Log everything: UsageEvent { type: 'open_blocked' | 'friction_bypassed' }
```

The engine runs decisions synchronously in < 1ms. No async, no network, no excuses.

---

## State Flow

```
MMKV (persisted) → Zustand store → React hooks → Components
                                       ↑
                              Pure core logic
                         (engine.ts, timer.ts, etc.)
```

All business logic lives in `src/core/`. Stores consume it. Hooks compose it. Components render it. Tests test `src/core/` in isolation — no mocking React, no mocking navigation.

---

## Performance Budget

| Metric | Target |
|---|---|
| Cold start (JS bundle) | < 1.5s |
| Tab switch | < 16ms (one frame) |
| Timer accuracy | ±50ms over 90 minutes |
| Animation fps | 60fps on low-end Android |
| Bundle size (initial) | < 2MB JS |

---

## Security Posture

- No app usage data ever leaves the device in Phase 1 & 2
- When sync is added (Phase 3): end-to-end encrypted before upload
- No analytics SDK (no Mixpanel, no Amplitude) — ever
- No ads — ever
- Open source roadmap: publish `src/core/` as standalone npm package
