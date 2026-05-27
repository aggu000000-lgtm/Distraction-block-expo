# FEATURES — The Complete Product Specification

---

## Feature Tiers

Every feature is tagged with a phase:

- `[P1]` — Phase 1: Core (Days 1–30). App is usable and valuable.
- `[P2]` — Phase 2: Polish (Days 31–60). App is delightful and differentiated.
- `[P3]` — Phase 3: Platform (Days 61–100). App is scalable and complete.

---

## Module 1: The Shield (Blocking Engine)

### 1.1 App Registry `[P1]`
- Pre-populated list of 40+ most common distraction apps (social, entertainment, news, shopping)
- Each app has: name, category, icon, bundle ID (for future native integration)
- User can add custom entries with a name + emoji
- User can remove any app from the registry
- Apps marked as "tracked" appear in insights even if not blocked

### 1.2 Per-App Toggle `[P1]`
- One-tap block/unblock any tracked app
- Visual state: blocked (red badge + lock icon), unblocked (neutral)
- Instant feedback: haptic + animation on toggle

### 1.3 Block Rules Engine `[P1]`
- Create named rules (e.g., "Deep Work", "Morning Routine", "Night Mode")
- Each rule contains:
  - Which apps it applies to (multi-select)
  - When it activates: always / schedule / session-only
  - Friction level: soft / medium / hard / locked
- Rules stack: an app can be in multiple rules; highest friction wins
- Rules evaluate in < 1ms with no async calls

### 1.4 Schedule-Based Rules `[P1]`
- Define active days (Mon–Sun, any combination)
- Define time window (HH:MM from – to)
- Multiple time windows per rule (e.g., 09:00–12:00 AND 14:00–17:00)
- Rules auto-activate and auto-deactivate without user action

### 1.5 Friction Levels `[P2]`

**Soft Friction**
- Opens a 1.5-second delay before the app would open
- Overlay shows: "You've opened [App] 14 times today"
- Dismiss immediately or wait

**Medium Friction**
- Full modal: "Still want to open [App]?"
- Shows last-opened time, today's count, session status
- 5-second countdown before "Open Anyway" becomes tappable
- "Stay focused" button (primary action) dismisses modal

**Hard Friction**
- Full-screen breathing exercise (4–7–8 breath pattern)
- 30-second minimum before bypass available
- Shows what the user is working on (current session goal)
- "Open Anyway" available after 30s (tracked as friction_bypassed)

**Locked**
- No bypass possible during active focus session
- Shows session remaining time
- "This app is locked until your session ends"
- Emergency unlock requires typing "I choose distraction" (deliberate friction)

### 1.6 Quick Shield `[P1]`
- One-tap "Enable Shield" from home screen
- Activates all currently-configured rules immediately
- Disabling requires: 3-second hold OR typing a PIN (configurable)
- Visual indicator on home screen always shows shield status

### 1.7 Streak Guard `[P2]`
- Detects if user's streak is at risk (hasn't had a session today by 8pm)
- Automatically elevates all active rules to "medium" friction for the evening
- Sends one notification: "Your streak is at risk. 3 hours left to protect it."

### 1.8 Allowlist Override `[P2]`
- User can create an "emergency bypass" that allows 10 minutes of access
- Bypass is tracked, logged, and appears in weekly review
- After 3 emergency bypasses in a week, the app surfaces a gentle insight

---

## Module 2: Focus Sessions

### 2.1 Session Modes `[P1]`

**Pomodoro**
- 25 min work / 5 min break
- 4 cycles → 1 long break (20 min)
- Customizable: work 10–60 min, break 1–30 min

**Flow State**
- No fixed duration
- Timer counts up, not down
- Sessions can be marked complete manually
- Recommended for creative/deep work

**Sprint**
- 15 min, no break
- Designed for "I have 15 minutes before my next meeting"
- Auto-completes, no extension option

**Custom**
- User defines duration (1–180 min)
- User defines if break is included
- Saved as a named preset for reuse

### 2.2 Session Setup `[P1]`
- Before starting, user optionally writes an intention: "What am I working on?"
- Intention is stored with session and shown in insights
- Estimated completion time shown ("Ends at 3:45 PM")

### 2.3 Active Session Screen `[P2]`
- Full-screen, immersive design
- Large countdown ring (Skia-rendered, butter smooth)
- Current intention displayed
- Ambient background: very slowly shifting dark gradient
- Minimal controls: pause, stop (with confirmation), add time (+5m)
- Bottom: "Apps blocked during this session" — small icons
- Notification in system tray: timer + app name

### 2.4 Break Screen `[P2]`
- Separate visual mode (different color — Amber)
- Counts down break time
- Suggestions: "Stand up", "Look at something 20 feet away", "Drink water"
- During break: social apps automatically unblocked (if rule allows)
- 30-second warning before break ends: gentle notification

### 2.5 Session Completion `[P2]`
- Full-screen celebration animation (Lottie or Skia)
- Shows: time focused, interruptions blocked, streak status
- Prompt: "Quick reflection — how was your focus?" (1–5 stars + optional note)
- Share button: generates a beautiful card image (Phase 3)

### 2.6 Session Abandonment `[P1]`
- Must confirm abandonment (2-step: tap stop → confirm)
- Abandoned sessions are tracked separately in analytics
- Insight: "You abandon sessions most often on Tuesday afternoons"

### 2.7 Session History `[P2]`
- Chronological list of all sessions
- Each entry: mode, duration, outcome, intention, interruption count
- Filter by: date range, mode, outcome
- Tap to expand full session detail

---

## Module 3: Insights & Analytics

### 3.1 Usage Tracking `[P1]`
- Every open attempt of a tracked app is logged (UsageEvent)
- Events stored locally: appId, timestamp, type, sessionId
- Raw events never shown to user — always aggregated

### 3.2 Daily Report `[P1]`
- Generated daily at midnight (or on next app open)
- Contains: DayReport (see Architecture doc)
- Stored as immutable record — never recalculated after generation

### 3.3 Home Dashboard `[P1]`
Widgets (reorderable in P3):
- **Focus Ring**: today's focus time as % of daily goal
- **Shield Status**: active/inactive, apps blocked, rules active
- **Streak Counter**: days in a row with ≥1 completed session
- **Today's Blocks**: how many times apps were blocked today
- **Recent Session**: last session summary

### 3.4 Weekly Insights Screen `[P2]`
- 7-day bar chart: focus minutes per day
- 7-day bar chart: block attempts per day
- Best day highlight
- Worst day highlight with possible reason ("On Mondays, your average is 23% lower")
- Week-over-week comparison badge

### 3.5 Pattern Insights `[P2]`
Plain English observations generated from data:
- "You focus best between 10am and 12pm"
- "Instagram is your most-reached-for app when a session ends"
- "Your flow sessions last 45% longer than your pomodoros"
- "You've blocked distractions 847 times this month"
- "You bypass friction most often on Sunday evenings"

Algorithm: purely local, deterministic, template-based. No ML, no cloud.

### 3.6 App Usage Breakdown `[P2]`
- Per-app stats: total open attempts, blocked count, bypass count
- Trend: up/down vs. last week
- "Most reached for during sessions" ranking

### 3.7 Streak System `[P1]`
- Streak increments if user completes at least 1 session per day
- Streak shown prominently on home (fire emoji + number)
- Streak freeze mechanic: 2 freezes per month (protect streak on busy days)
- Milestones: 3, 7, 14, 30, 60, 100 days → modal celebration

### 3.8 Focus Score `[P3]`
- 0–100 score, calculated weekly
- Inputs: sessions completed, bypass rate, streak, abandonment rate
- Not shown daily (too gameable) — revealed in weekly summary
- "Your Focus Score: 74 (+8 from last week)"

---

## Module 4: Onboarding

### 4.1 Welcome Screen `[P1]`
- App name + one-sentence value proposition
- No signup required (local-first, Phase 1)
- "Get Started" — begins onboarding flow

### 4.2 Onboarding Flow (3 Steps) `[P1]`

**Step 1 — What drains you?**
Multi-select grid of apps/categories:
"Select the apps that steal your focus"
→ Configures initial block list

**Step 2 — What are you protecting?**
Single-select:
- Deep work / studying
- Creative projects  
- Time with family
- Physical health
- Sleep
- General wellbeing

→ Configures daily focus goal (minutes) and streak motivation copy

**Step 3 — When do you want to focus?**
Visual schedule picker:
- Drag to select time blocks on a weekly calendar
→ Creates first schedule-based rule: "Work Hours"

### 4.3 First Session Prompt `[P1]`
- Immediately after onboarding: "Start your first session now"
- Pre-fills 25-minute Pomodoro
- Completion triggers milestone modal: "Day 1 streak started 🔥"

---

## Module 5: Notifications

### 5.1 Session Reminders `[P1]`
- Daily notification at user-configured time: "Time to focus. Start a session."
- Configurable: on/off, time, days

### 5.2 Streak Danger Alert `[P2]`
- One notification per day if no session completed by 8pm
- Copy rotates from a list of 20 non-nagging variants

### 5.3 Milestone Notifications `[P2]`
- Streak milestones: 7, 14, 30 days
- Total focus hours milestones: 10h, 25h, 50h, 100h

### 5.4 Weekly Review `[P2]`
- Sunday 8pm: "Your week in focus — tap to see"
- Opens directly to weekly insights screen

### 5.5 No-Spam Guarantee `[P1]`
- Maximum 2 notifications per day, always
- No promotional notifications, ever
- All categories independently toggleable in settings

---

## Module 6: Settings

### 6.1 Shield Settings `[P1]`
- Master toggle: blocking on/off
- Strict mode: cannot disable during session
- PIN lock for disabling (optional)

### 6.2 Session Defaults `[P1]`
- Default mode
- Default duration
- Auto-start break (on/off)
- Sound on completion (on/off)
- Haptic feedback (on/off)

### 6.3 Notification Preferences `[P1]`
- Per-category toggles
- Quiet hours (no notifications between X and Y)

### 6.4 Focus Goal `[P1]`
- Daily focus goal in minutes (default: 60)
- Used in home dashboard ring

### 6.5 Data Management `[P2]`
- Export all data as JSON
- Clear all data (with confirmation flow)
- What data is stored (transparency screen)

### 6.6 Appearance `[P2]`
- Theme: Auto / Dark / Amoled (true black)
- Accent color: 6 options (default: Nebula violet)
- Reduce motion toggle

### 6.7 Account (Phase 3) `[P3]`
- Sign in with Apple / Google
- Cloud sync across devices
- Share anonymous stats with community

---

## Module 7: Achievements `[P3]`

Not a gamification layer. An acknowledgment layer.

Achievements are unlocked quietly, revealed in a weekly report, not pushed as notifications.

```
"First Brick"      — Complete your first session
"Committed"        — 7-day streak
"Month of Focus"   — 30-day streak
"100 Hours"        — 100 total focus hours
"Ironwall"         — 0 friction bypasses for a full week
"Flow Master"      — Complete 10 Flow State sessions
"Night Owl Fixed"  — Complete 5 sessions before 9am
"The Long Game"    — 100-day streak
```

---

## Non-Features (Things We Will Never Build)

- Social feed / public leaderboard
- "Focus with friends" multiplayer sessions
- Gamified coins / points / shop
- AI coaching chatbot
- News feed of productivity tips
- Widget that shows your data publicly
- Any feature that requires an internet connection in Phase 1 or 2

These are not on the roadmap. They are explicitly out of scope. If any future contributor proposes them, this document is the answer.
