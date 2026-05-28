/**
 * FocusGuard Domain Types
 *
 * Core data model types. Every entity has an immutable id and timestamps.
 * Use discriminated unions for state machines.
 */

// ─── App Registry ────────────────────────────────────────────────────────────

export type AppCategory =
  | "social"
  | "entertainment"
  | "news"
  | "shopping"
  | "gaming"
  | "messaging"
  | "productivity"
  | "other";

export type TrackedApp = {
  id: string;
  name: string;
  bundleId: string; // e.g. "com.instagram.app"
  category: AppCategory;
  icon: string; // emoji fallback (Phase 1), native icon (Phase 3)
  isTracked: boolean; // user opted to track this
};

// ─── Block Rules ─────────────────────────────────────────────────────────────

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type RuleCondition =
  | { type: "always" }
  | { type: "schedule"; days: Day[]; from: string; to: string }
  | { type: "session" } // active only during a focus session
  | { type: "streak_guard" }; // activates automatically if streak is at risk

export type FrictionLevel = "soft" | "medium" | "hard" | "locked";

export type BlockRule = {
  id: string;
  name: string;
  apps: string[]; // App IDs
  condition: RuleCondition;
  friction: FrictionLevel;
  isActive: boolean;
  createdAt: number;
};

// ─── Focus Sessions ──────────────────────────────────────────────────────────

export type SessionModeId = "pomodoro" | "flow" | "sprint" | "custom";

export type SessionMode = {
  id: SessionModeId;
  workMinutes: number;
  breakMinutes: number;
  cycles: number;
};

export type SessionOutcome = "completed" | "abandoned" | "ongoing";

export type FocusSession = {
  id: string;
  mode: SessionMode;
  plannedMinutes: number;
  startedAt: number;
  endedAt: number | null;
  outcome: SessionOutcome;
  interruptionCount: number; // times user tried to open blocked app
  intention: string | null; // "What am I working on?"
  reflection: number | null; // 1-5 star rating after completion
};

// ─── Usage Events ────────────────────────────────────────────────────────────

export type UsageEventType =
  | "open_attempt"
  | "open_allowed"
  | "open_blocked"
  | "friction_bypassed";

export type UsageEvent = {
  id: string;
  appId: string;
  timestamp: number;
  type: UsageEventType;
  sessionId: string | null;
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export type DayReport = {
  date: string; // ISO date "2026-05-27"
  focusMinutes: number;
  sessionsCompleted: number;
  sessionsAbandoned: number;
  openAttempts: number; // total opens of tracked apps
  openBlocked: number; // blocked by a rule
  frictionBypassed: number; // user clicked "show anyway"
  streak: number;
};

// ─── User Preferences ───────────────────────────────────────────────────────

export type UserPreferences = {
  dailyFocusGoalMinutes: number; // default: 60
  defaultSessionMode: SessionModeId;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  autoStartBreak: boolean;
  pinLockEnabled: boolean;
  pin: string | null;
  onboardingCompleted: boolean;
};

// ─── Streak ──────────────────────────────────────────────────────────────────

export type StreakData = {
  current: number;
  longest: number;
  freezesRemaining: number; // 2 per month
  lastSessionDate: string | null; // ISO date
};
