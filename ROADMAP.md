# ROADMAP — Day 1 to Day 100

---

## Overview

```
Phase 1: CORE        Days 01–30    Build something real. Ship something honest.
Phase 2: POLISH      Days 31–60    Make it feel inevitable. Remove every rough edge.
Phase 3: PLATFORM    Days 61–100   Make it scale. Make it last.
```

---

## Phase 1 — CORE (Days 1–30)
### *"Build the skeleton. Make it breathe."*

The goal of Phase 1 is a working app that a real user can install, configure in under 3 minutes, and use daily. No animations needed. No cloud. No polish. Just truth.

---

### Week 1 — Foundation (Days 1–7)

**Day 1** — Project scaffolding
- Initialize Expo project with TypeScript
- Configure Expo Router v4
- Set up ESLint + Prettier with strict rules
- Configure absolute imports (`@/`)
- Set up folder structure exactly as per ARCHITECTURE.md
- Initialize Zustand + MMKV
- Install all Phase 1 dependencies
- First commit: "init: project foundation"

**Day 2** — Design tokens
- Implement `src/design/tokens.ts` with complete color system
- Implement `src/design/typography.ts`
- Implement `src/design/motion.ts` (presets only, no usage yet)
- Create primitive components: `Text`, `View` wrappers with token support
- Build `Button` primitive (primary, secondary, destructive variants)
- Build `Card` primitive

**Day 3** — Data layer
- Define all domain types in `src/types/domain.ts`
- Implement MMKV storage wrapper (`src/lib/storage.ts`)
- Implement blocking store (`src/store/blocking.store.ts`)
- Seed default app list (40 apps across categories)
- Write unit tests for store operations (add, remove, toggle)

**Day 4** — Blocking engine core
- Implement `src/core/blocking/engine.ts`
- Implement `src/core/blocking/rules.ts` — rule evaluation
- Rule evaluation must handle: always-on, schedule, session-only
- Write comprehensive unit tests (edge cases: midnight crossover, rule stacking)
- Benchmark: engine decision in < 1ms confirmed

**Day 5** — Navigation shell
- Root `_layout.tsx` with font loading (Geist)
- Tab navigator with 5 tabs (home, sessions, shield, insights, profile)
- Static screen placeholders for all tabs
- Onboarding stack (not yet functional)
- Deep link scheme configured in app.config.ts

**Day 6** — Onboarding (Step 1 & 2)
- Welcome screen (static, beautiful)
- Step 1: App selection grid (multi-select, emoji icons)
- Step 2: Goal selection (single-select cards)
- Progress indicator between steps
- Data flows into blocking store on completion

**Day 7** — Onboarding (Step 3 + completion)
- Step 3: Schedule picker (visual time block selector)
- Converts selection into first BlockRule
- Completion screen → transitions to main app
- First-run flag stored; onboarding never shows again
- Internal review: does the 3-minute onboarding target hold?

---

### Week 2 — Shield Module (Days 8–14)

**Day 8** — Shield tab: App list
- FlatList of all tracked apps
- Per-app toggle (blocks/unblocks)
- Category filter chips
- Search bar
- Empty state

**Day 9** — Shield tab: Rule list
- List of all BlockRules
- Per-rule enable/disable toggle
- Shows: name, schedule, app count, friction level
- "Add Rule" → stub (tomorrow)

**Day 10** — Rule Editor
- Create/edit rule: name input
- App multi-selector (reuse from onboarding)
- Condition picker: always / schedule / session-only
- Time/day picker for schedule condition
- Friction level selector (4 levels with descriptions)
- Save → updates store, dismiss modal

**Day 11** — Soft Friction modal
- Intercept pattern: user taps blocked app → shows overlay
- App usage count pulled from analytics store
- "Open Anyway" (tracks friction_bypassed event) vs. "Stay Focused"
- 1.5s delay before Open Anyway is tappable
- Log UsageEvent in both paths

**Day 12** — Medium & Hard Friction
- Medium: countdown ring + stats overlay
- Hard: full-screen breathing guide (4-7-8 pattern)
- 30s minimum for Hard before bypass available
- Locked: no bypass, session info shown
- All friction levels connected to rule engine output

**Day 13** — Quick Shield
- Home screen master toggle
- Shield status card (active/inactive)
- Disabling shield: 3-second press-and-hold gesture
- Visual feedback during hold: circular fill indicator
- PIN lock option (basic 4-digit implementation)

**Day 14** — Shield polish + testing
- End-to-end test of full blocking flow
- Fix edge cases in rule evaluation
- Performance test: 50 rules, 40 apps, schedule evaluation
- Code review: blocking module complete

---

### Week 3 — Sessions Module (Days 15–21)

**Day 15** — Session modes definition
- Implement `src/core/sessions/modes.ts`
- Define: Pomodoro, Flow, Sprint, Custom
- Default config per mode
- Persistence: last-used mode remembered

**Day 16** — Timer core
- Implement `src/core/sessions/timer.ts`
- Pure class: start, pause, resume, stop, tick
- Accurate to ±50ms over 90 minutes
- Handles background (when app backgrounded, calculate elapsed on resume)
- Unit tests: accuracy over 25min, background resume

**Day 17** — Session setup screen
- Mode selector (card grid)
- Duration customizer
- Intention input (optional text field)
- Start Session → creates session, navigates to active screen

**Day 18** — Active session screen
- Full-screen immersive design
- Countdown timer (large, centered)
- Progress ring (simple arc for now; Skia in P2)
- Pause / Stop controls
- Intention displayed
- Session-locked apps shown at bottom

**Day 19** — Session completion + break
- Completion screen: time focused, blocks prevented
- Reflection prompt (star rating)
- Break screen: countdown, suggestions
- Break completion → next Pomodoro cycle or session end

**Day 20** — Session store + history
- `src/store/session.store.ts`
- Persist all sessions with full data
- Session history list screen (simple list for now)
- Stats: total sessions, total focus time (running totals)

**Day 21** — Sessions polish + testing
- Abandonment flow (2-step confirm)
- Background timer notification (tray notification with time remaining)
- Edge case: session running while rule schedule changes
- Code review: sessions module complete

---

### Week 4 — Insights + Home (Days 22–28)

**Day 22** — Analytics store + event logging
- `src/store/analytics.store.ts`
- Log all UsageEvents (open_attempt, open_blocked, friction_bypassed)
- DayReport aggregator (`src/core/analytics/aggregator.ts`)
- Generate today's report on demand

**Day 23** — Home dashboard (data-driven)
- Focus ring widget (today's focus / goal)
- Shield status widget
- Streak counter widget
- Today's blocks counter
- Recent session summary
- All wired to real stores

**Day 24** — Streak system
- Streak logic: increment if ≥1 session completed today
- Streak freeze: 2 per month, UI to use a freeze
- Streak stored in user store, persisted
- Streak milestones: array of thresholds + modal trigger

**Day 25** — Insights screen (basic)
- 7-day bar chart: focus minutes
- 7-day bar chart: blocked attempts
- Best day highlight
- Total focus this week vs. last week

**Day 26** — Pattern insights engine
- `src/core/analytics/insights.ts`
- 10 insight templates with data-driven values
- Insights generated weekly (or on demand)
- Display on insights screen below charts

**Day 27** — Settings screen
- All P1 settings (see FEATURES.md §6)
- Shield settings
- Session defaults
- Notification preferences
- Focus goal

**Day 28** — Notifications (local)
- Implement `src/core/notifications/scheduler.ts`
- Session reminder (daily at user time)
- Streak danger alert (8pm check)
- Milestone notifications (streak milestones)
- Respect quiet hours

---

### Week 4 Wrap-Up (Days 29–30)

**Day 29** — Integration testing
- Full user journey: onboard → configure → session → insights → next day
- Fix regressions from integration
- Performance audit: no dropped frames on mid-range Android

**Day 30** — Phase 1 Checkpoint
- Internal build deployed to TestFlight / APK
- 5 real users (friends/family) given access
- Document all bugs in GitHub Issues
- Write Phase 2 scope adjustments based on feedback
- Update README with setup instructions

**Phase 1 Exit Criteria:**
- [ ] User can onboard in < 3 minutes
- [ ] Blocking rules work correctly for all 4 friction levels
- [ ] Focus timer runs accurately in foreground and background
- [ ] Home dashboard shows real data
- [ ] Streak tracks correctly across days
- [ ] App does not crash in 30-minute smoke test

---

## Phase 2 — POLISH (Days 31–60)
### *"Remove every excuse not to love it."*

Phase 2 is about closing the gap between "it works" and "it feels right." Every interaction should feel intentional. Every screen should feel considered. Nothing is left unfinished.

---

### Sprint 5: Animation & Motion (Days 31–37)

**Day 31** — Reanimated + Skia setup
- Install and configure Reanimated 3
- Install React Native Skia
- Create animation utility hooks

**Day 32** — Timer ring (Skia)
- Replace simple arc with Skia-rendered progress ring
- Smooth per-second arc update (no layout recalculation)
- Color animates as session progresses
- Glow effect at ring tip

**Day 33** — Home dashboard animations
- Card enter: fade + slide up, staggered
- Focus ring: fills from 0 on load (animated)
- Streak counter: count-up number animation
- Blocked count: odometer roll-up

**Day 34** — Friction modal animations
- Background blur on modal open
- Modal slides up with spring
- Countdown ring fills with pressure animation
- "Open Anyway" button de-grays with spring bounce

**Day 35** — Session completion animation
- Lottie completion burst (or Skia confetti)
- Ring flashes Pulse green, then dissolves
- Stats slide up one by one (staggered)

**Day 36** — List animations
- FlatList items fade-slide in staggered on mount
- Delete: slide left + height collapse
- Toggle: spring scale on thumb, track color spring

**Day 37** — Motion audit
- Check every screen for unintentional jank
- Verify all animations respect `useReducedMotion()`
- Profile on low-end Android device (confirm 60fps)

---

### Sprint 6: Friction System Upgrade (Days 38–42)

**Day 38** — Breathing exercise (Hard friction)
- Skia-animated breathing guide (expanding/contracting circle)
- 4-7-8 breath pattern with text instructions
- Haptic on inhale/exhale cues
- 30s minimum enforced

**Day 39** — Friction bypass tracking
- "Bypass rate" metric added to analytics
- Insight: "You bypassed friction 8 times this week, down from 14"
- After 3 bypasses in a session: elevate friction level automatically

**Day 40** — Locked mode UX
- "I choose distraction" type-to-unlock
- Keyboard appears, typed text shows placeholder "Type to unlock..."
- After typing: app opens, event logged, mild animation (not celebratory)

**Day 41** — Streak Guard automation
- Auto-elevates rules at 8pm if no session today
- Notification sent (one, non-nagging)
- Visual indicator on home: "Streak Guard Active"

**Day 42** — Allowlist override
- 10-minute emergency bypass flow
- Confirmation: "This will be logged in your weekly review"
- Countdown visible on home during override window

---

### Sprint 7: Insights Upgrade (Days 43–49)

**Day 43** — App-level analytics
- Per-app open attempts, blocked count, bypass count
- Sorted list: most-reached-for to least
- Trend indicator (↑↓ vs. last week)

**Day 44** — Weekly Review screen
- Dedicated "This Week" view
- Summary card (focus hours, sessions, best day)
- App breakdown
- Week-over-week comparison
- Motivational insight (generated, non-generic)

**Day 45** — Pattern detection engine
- Time-of-day bucketing: morning / afternoon / evening
- Day-of-week bucketing
- Generate: "Your focus peaks on Tuesday mornings"
- Generate: "You open Instagram most in the hour after lunch"

**Day 46** — Intention analytics
- Tag sessions by intention text (keyword extraction)
- "Sessions tagged 'thesis' average 47 minutes"
- Most common intentions list

**Day 47** — Insight copy system
- 30 insight templates, all data-driven
- Tone: calm, honest, never nagging, never cheerleader
- A/B test: two copy variants per insight (store which user sees)
- Select which insight to show based on data availability

**Day 48** — Charts upgrade
- Sparkline charts (mini 7-day trends) on home dashboard widgets
- Horizontal bar chart for app breakdown
- All charts use Skia (smooth, no React re-renders)

**Day 49** — Analytics code review
- Verify: no personally identifiable data in events
- Verify: all events have correct timestamps
- Test: DayReport generation at midnight edge case

---

### Sprint 8: UX Refinement (Days 50–56)

**Day 50** — Onboarding upgrade
- Animate between steps (slide transition)
- Better visual for time block picker
- Add "skip" option with sensible defaults
- Test: 3-minute completion target verified with new users

**Day 51** — Session history screen
- Beautiful timeline view (not just a list)
- Group by week
- Filter UI (mode, outcome, date range)
- Tap to expand: full session detail with intention and interruptions

**Day 52** — Home screen reorder `[P2 stretch]`
- Drag to reorder dashboard widgets
- Widget visibility toggles in settings

**Day 53** — Profile / Account screen
- App version, build number
- Streak info
- Focus score (running total)
- Streak freeze balance
- Data export
- Clear all data (with 3-step confirmation)

**Day 54** — Haptic system audit
- Every meaningful interaction has correct haptic weight
- Light: toggles, scrolling list selection
- Medium: session start/stop, modal confirm
- Heavy: streak milestone, session completion, deletion
- Remove any haptic that feels gratuitous

**Day 55** — Empty states
- Every list/screen with a potential empty state gets designed treatment
- No "No data found" text — tell the user what to do
- Example: empty block list → "Add your first app to block →"

**Day 56** — Error states + loading
- Loading skeleton screens (not spinners) for every data-driven screen
- Error boundary wrapping all tab screens
- Graceful fallback: if store fails to hydrate, show empty state (not crash)

---

### Sprint 9: Phase 2 Wrap-Up (Days 57–60)

**Day 57** — Accessibility audit
- All touch targets ≥ 44pt
- VoiceOver test: timer screen, home, block list
- Color contrast check for all text/background combos
- `useReducedMotion()` verified on all animated screens

**Day 58** — Performance audit
- Bundle size check (target: < 2MB initial)
- Cold start profiling (target: < 1.5s)
- Memory profiling: 30-minute session with background/foreground cycling
- FlatList perf: 100-item block list, no jank

**Day 59** — Phase 2 TestFlight / APK build
- Version 0.2.0 build
- 20 beta users
- Structured feedback form
- Bug triage

**Day 60** — Phase 2 Checkpoint
- Bugs from beta fixed
- Phase 3 scope confirmed
- Architecture review: anything needing refactor before scale?

**Phase 2 Exit Criteria:**
- [ ] Every animation runs at 60fps on a 2020 Android device
- [ ] Friction system fully functional (all 4 levels)
- [ ] Insights show real patterns from real data
- [ ] App passes WCAG AA accessibility checks
- [ ] Zero crashes in 1-hour stress test

---

## Phase 3 — PLATFORM (Days 61–100)
### *"Build it to last. Build it to share."*

Phase 3 makes the app production-ready: cloud sync, app store release, and the features that make users stay for months, not days.

---

### Sprint 10: Cloud Foundation (Days 61–68)

**Day 61** — Supabase setup
- Project created, schema designed
- Auth: Apple Sign In + Google Sign In
- Tables: users, sessions, usage_events, block_rules
- Row-level security: users only access their own data

**Day 62** — Auth flow
- Sign in with Apple
- Sign in with Google
- Anonymous local-first option (no account required)
- Auth state in user store
- Graceful unauthenticated experience (full local functionality)

**Day 63** — Data sync architecture
- Sync strategy: local-first, optimistic updates, background sync
- Conflict resolution: last-write-wins with device timestamps
- Sync queue: stores pending writes in MMKV, flushes when online
- Never block UI on sync

**Day 64-65** — Sync implementation
- Session sync (upload completed sessions)
- Analytics event sync (batched, not real-time)
- Block rules sync (merge across devices)
- Test: offline for 3 days → come online → data consistent

**Day 66** — Multi-device support
- Install on second device, sign in
- Rules and sessions sync within 5 seconds
- Conflict scenario test: create same rule on 2 devices offline

**Day 67** — Privacy architecture
- Audit all data fields sent to Supabase
- Intention text: encrypted client-side before upload
- Usage events: anonymized (no app names, only category codes)
- Privacy policy draft

**Day 68** — Cloud stability testing
- Network failure scenarios
- Supabase downtime scenario (app works fully offline)
- Sync performance: 1000 events batch upload

---

### Sprint 11: Focus Score + Achievements (Days 69–74)

**Day 69** — Focus Score algorithm
- Inputs: completion rate, bypass rate, streak, session length consistency
- 0–100 score, weekly granularity
- Score history (trend over months)
- Score breakdown explanation screen

**Day 70** — Achievement system
- 8 achievements defined (see FEATURES.md)
- Achievement store: tracks unlock state
- Unlock detection on: session complete, daily check, weekly report
- Unlocked achievements stored; shown in profile

**Day 71** — Achievement modal
- Full-screen celebration (Skia particle burst)
- Achievement name, icon, description
- "Share" button (generates image)
- Dismissed → stored as seen

**Day 72** — Weekly Review v2
- Focus Score included
- Achievement unlocked this week section
- "vs. your best week" comparison
- Gentle next-week suggestion: "Try completing 5 sessions this week"

**Day 73** — Streak system upgrade
- Streak freeze: UI to spend a freeze (costs 1 of 2 monthly)
- Freeze visually shown on streak display
- Re-earn freeze: complete a 7-day streak

**Day 74** — Milestone celebrations
- 7, 14, 30, 60, 100 day streak modals
- 10h, 25h, 50h, 100h focus hour modals
- Each modal unique (different animation, copy)

---

### Sprint 12: Share & Export (Days 75–80)

**Day 75** — Share card generation
- React Native Skia renders a share card image
- Card shows: streak, weekly focus hours, a motivational line
- Dark card with violet accent — looks good on any social background
- Exports to camera roll or share sheet

**Day 76** — Session summary card
- After session completion: shareable card option
- Shows: session duration, mode, intention (if written), date
- "My 90-minute Flow State" — designed to be shared without cringe

**Day 77** — Data export
- Export as JSON: all sessions, all usage events, all rules
- Export as CSV: daily reports (compatible with spreadsheets)
- Email to self option

**Day 78** — App Store assets
- Screenshots: 6 screens, all pixel-perfect with real data
- App Preview video: 30-second demo
- App icon: final version (not emoji placeholder)
- Store description copy

**Day 79** — Marketing page
- Single-page site (GitHub Pages or Vercel)
- Above fold: the one sentence value prop + app store link
- Below: 3 feature highlights with screen grabs
- No mailing list, no sign-up — just download

**Day 80** — Press kit
- Icon in all sizes
- Screenshots in all device sizes
- One paragraph about the app
- Contact email

---

### Sprint 13: App Store Launch (Days 81–88)

**Day 81** — iOS submission
- EAS Build for production
- App Store Connect metadata complete
- Submit for review

**Day 82** — Android submission
- EAS Build for Android
- Google Play metadata complete
- Submit for review

**Day 83–84** — Review period (waiting)
- Document all open issues
- Monitor crash reports (Sentry, if installed)
- Prepare launch announcement

**Day 85** — Launch day
- App Store approved (typically D+3 to D+5)
- Google Play approved
- Post to: HN (Show HN), Reddit r/productivity, r/apps
- Post to personal network

**Day 86–88** — Launch week
- Monitor reviews
- Respond to every 1-star and 5-star review personally
- Bug fix release if any critical issues
- Track: downloads, D1 retention, D7 retention

---

### Sprint 14: Stability + Iteration (Days 89–100)

**Day 89–91** — Bug fixes from launch
- Prioritize: crash > UX bug > visual bug
- Release 1.0.1 patch

**Day 92–93** — First feature iteration
- Based on most-requested user feedback
- Implement 1–2 small improvements only
- Do not start large features yet

**Day 94–95** — Performance hardening
- Analyze: where do users drop off?
- Analyze: which screens have lowest retention?
- Fix 1 UX friction point identified from data

**Day 96–97** — v1.1 planning
- Review all GitHub Issues
- Prioritize by user impact / effort
- Write specs for top 3 issues
- Assign to roadmap

**Day 98** — Retrospective
- What was built vs. planned?
- What took 3x longer than expected?
- What was cut that mattered?
- Document learnings in `RETROSPECTIVE.md`

**Day 99** — Architecture review
- Any tech debt accumulated?
- Any module that needs refactor before v1.1?
- Dependencies audit: any outdated/vulnerable?

**Day 100** — Handoff document
- `CONTRIBUTING.md` complete
- All modules documented
- Known issues documented
- v1.1 scope finalized
- Ship `RETROSPECTIVE.md` to repo

---

## Milestone Summary

| Milestone | Day | What It Means |
|---|---|---|
| Foundation | D7 | Project runs, navigation works, design tokens in place |
| Alpha | D14 | Blocking engine functional, onboarding done |
| Beta 0.1 | D30 | Full Phase 1 — all core features working |
| Beta 0.2 | D60 | All animations, polish, friction system complete |
| RC 1.0 | D80 | Cloud sync, achievements, share — store-ready |
| Launch | D85 | App Store + Google Play live |
| v1.0 Stable | D100 | Bug-free, documented, ready for team hand-off |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Expo SDK breaking change | Medium | High | Pin exact SDK version; update intentionally |
| App Store rejection | Low | High | Follow guidelines strictly; review checklist before submit |
| Reanimated Android perf issues | Medium | Medium | Test on Android from Day 31; have StyleSheet fallback ready |
| Scope creep in Phase 2 | High | Medium | Every feature must be in FEATURES.md to be built |
| Sync conflict bugs | Medium | High | Write conflict tests before sync code |
| User data privacy incident | Low | Critical | Local-first until encryption is confirmed working |
