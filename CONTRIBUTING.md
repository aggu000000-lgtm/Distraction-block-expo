# CONTRIBUTING — For the SWE Taking This Over

---

## Welcome

This document is written for you — the engineer who picks this up after the architecture is laid down. Everything you need to understand the project, make decisions, and ship code is in this repository.

Read these documents in order before writing a single line:

1. `VISION.md` — Why this exists. Read it once a week.
2. `ARCHITECTURE.md` — How it's structured. Know it cold.
3. `DESIGN_SYSTEM.md` — How it looks and feels. Reference constantly.
4. `FEATURES.md` — What to build. Never build what isn't here.
5. `ROADMAP.md` — When to build it. Stick to the phase system.
6. This file — How to work.

---

## The One Rule

> **Every PR must answer: "Does this make the app better for Aryan?"**

Aryan is the user described in VISION.md. If a change doesn't serve him, it doesn't ship. No exceptions for clever engineering, personal preferences, or cool tech.

---

## Getting Started

```bash
# Clone
git clone https://github.com/aggu000000-lgtm/Distraction-block-expo.git
cd Distraction-block-expo

# Install (use exact Node version)
node --version  # must be 20.x
npm install

# Start
npx expo start

# Run tests
npm test

# Type check
npm run typecheck
```

---

## Git Workflow

### Branch Naming
```
feat/   — New feature from FEATURES.md
fix/    — Bug fix (reference issue number)
chore/  — Dependency update, config change
refactor/ — Internal refactor (no behavior change)
test/   — Tests only

Examples:
feat/friction-medium-modal
fix/streak-midnight-edge-case-#23
chore/update-expo-52.1
```

### Commit Messages (Conventional Commits)
```
feat(blocking): implement medium friction modal countdown ring
fix(timer): correct elapsed time calculation after background resume
chore(deps): update reanimated to 3.16.2
test(engine): add rule stacking edge cases
refactor(store): split analytics store into events + reports
docs(architecture): add sync strategy section
```

### PR Size
- PRs should be reviewable in < 30 minutes
- If a feature takes > 3 days, split it into multiple PRs
- Each PR does one thing

### PR Template (use this every time)
```markdown
## What
[One sentence: what does this PR change?]

## Why
[Link to FEATURES.md section or GitHub Issue]

## How
[Briefly: what's the approach? Any trade-offs?]

## Testing
- [ ] Unit tests added/updated
- [ ] Manually tested on iOS
- [ ] Manually tested on Android
- [ ] Checked for 60fps (if animation involved)
- [ ] Checked with reduced motion

## Screenshots / Video
[Required for any UI change]
```

---

## Code Standards

### TypeScript
- Strict mode is non-negotiable. No `any`. No `as unknown as X`.
- Every function has explicit return types
- Types live in `src/types/`. Never inline complex types.
- Use `type` not `interface` for domain objects
- Discriminated unions for state machines (see domain.ts)

### React / React Native
- No class components
- No `useEffect` for data fetching (use store initialization instead)
- No logic in JSX — extract to hooks or helpers
- Components under 200 lines. If longer, split.
- Props destructured at top of component
- Styles always at the bottom of file, `StyleSheet.create()`

### Naming
```
Components:     PascalCase        (BlockRuleCard, TimerRing)
Hooks:          camelCase, use*   (useBlockingStatus, useTimer)
Stores:         camelCase, use*   (useBlockingStore)
Utilities:      camelCase         (formatDuration, evaluateRule)
Constants:      UPPER_SNAKE       (MAX_FRICTION_LEVEL, DEFAULT_GOAL_MINUTES)
Types:          PascalCase        (BlockRule, FocusSession)
Files:          kebab-case        (blocking-engine.ts, use-timer.ts)
Screen files:   Expo Router convention (index.tsx, [id].tsx)
```

### No Magic Numbers
```typescript
// ❌ Bad
if (secondsLeft < 30) { ... }

// ✅ Good
const BREAK_WARNING_THRESHOLD_SECONDS = 30
if (secondsLeft < BREAK_WARNING_THRESHOLD_SECONDS) { ... }
```

### Error Handling
- Never swallow errors silently
- Every `catch` block either logs + rethrows or shows user feedback
- No `console.log` in committed code (use `console.warn` or `console.error` only)

---

## Architecture Decisions (Non-Negotiable)

These are locked. Do not debate them. If you think one is wrong, open a GitHub Discussion — do not just change it.

| Decision | Rationale |
|---|---|
| Local-first data | User trust; works offline; no data breach risk |
| Zustand over Redux | Simpler; less boilerplate; equally capable |
| MMKV over AsyncStorage | 10x speed; synchronous; critical for engine |
| `src/core/` is pure TS | Testable without React; portable; clear ownership |
| No analytics SDK | User privacy; no third-party data leakage |
| Expo Managed Workflow | No native code maintenance; OTA updates |

---

## Testing Philosophy

### What to Test
- All of `src/core/` — 100% coverage target
- Store operations — test state transitions
- Utility functions — test edge cases

### What Not to Test
- Visual appearance (screenshots are enough)
- Expo SDK internals
- Navigation routing (trust Expo Router)

### Test File Location
- Unit tests: `tests/unit/[module]/[file].test.ts`
- Mirror the source structure exactly

### Running Tests
```bash
npm test              # Run all
npm test -- --watch   # Watch mode
npm test -- blocking  # Filter by name
```

---

## Design Rules (Non-Negotiable)

1. **Every color is from `tokens.ts`.** No hex strings in component files.
2. **Every spacing value is from the 4px grid.** No arbitrary numbers.
3. **Every animation runs on the UI thread.** No `setState` inside animation callbacks.
4. **Every touch target is ≥ 44pt.** Use `hitSlop` if needed.
5. **Every screen has an empty state.** Never show blank screen.

---

## What's In Scope

Build features that are in `FEATURES.md` and on the correct Phase in `ROADMAP.md`.

That's it.

---

## What's Out of Scope

Anything not in `FEATURES.md`. Read the "Non-Features" section. If someone asks for it in a PR review, link to that section.

---

## Getting Help

- Questions about the vision: read `VISION.md` again.
- Questions about a feature spec: it's in `FEATURES.md`.
- Questions about timing: it's in `ROADMAP.md`.
- Questions about component structure: it's in `ARCHITECTURE.md`.
- Questions about colors/fonts: it's in `DESIGN_SYSTEM.md`.
- Genuine ambiguity not covered by any doc: open a GitHub Discussion.

---

## Definition of Done

A feature is "done" when:

- [ ] It matches the spec in FEATURES.md
- [ ] It uses design tokens, not hardcoded values
- [ ] It has unit tests (if it contains business logic)
- [ ] It has been tested on both iOS and Android
- [ ] It has no TypeScript errors (`npm run typecheck` passes)
- [ ] It has no ESLint errors (`npm run lint` passes)
- [ ] The PR has screenshots or video
- [ ] It has been self-reviewed line-by-line before PR creation

---

## A Note on Velocity

This codebase has a 100-day roadmap. That's tight. The way to move fast here is not to skip steps — it's to not revisit decisions. The architecture docs exist so you don't have to think about structure. The design system exists so you don't have to think about colors. The feature specs exist so you don't have to think about what to build.

Your job is to execute with precision and care.

Go build something real.
