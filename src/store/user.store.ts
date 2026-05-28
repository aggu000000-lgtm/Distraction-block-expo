/**
 * FocusGuard User Store
 *
 * Manages user preferences and streak data.
 */

import { create } from "zustand";
import type { UserPreferences, StreakData, SessionModeId } from "@/types/domain";
import { kvGet, kvSet } from "@/lib/storage";
import { todayISO } from "@/lib/time";

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_PREFERENCES: UserPreferences = {
  dailyFocusGoalMinutes: 60,
  defaultSessionMode: "pomodoro",
  hapticEnabled: true,
  soundEnabled: true,
  autoStartBreak: true,
  pinLockEnabled: false,
  pin: null,
  onboardingCompleted: false,
};

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  freezesRemaining: 2,
  lastSessionDate: null,
};

// ─── KV Keys ─────────────────────────────────────────────────────────────────

const PREFS_KEY = "user_preferences";
const STREAK_KEY = "streak_data";

// ─── State ───────────────────────────────────────────────────────────────────

type UserState = {
  preferences: UserPreferences;
  streak: StreakData;
  isLoading: boolean;
};

type UserActions = {
  loadPreferences: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;

  loadStreak: () => void;
  recordSessionComplete: () => void;
  useFreeze: () => void;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  preferences: DEFAULT_PREFERENCES,
  streak: DEFAULT_STREAK,
  isLoading: false,

  // ─── Preferences Actions ───────────────────────────────────────────────────

  loadPreferences: () => {
    const prefs = kvGet<UserPreferences>(PREFS_KEY) ?? DEFAULT_PREFERENCES;
    set({ preferences: prefs });
  },

  updatePreferences: (prefs) => {
    const { preferences } = get();
    const updated = { ...preferences, ...prefs };
    kvSet(PREFS_KEY, updated);
    set({ preferences: updated });
  },

  completeOnboarding: () => {
    const { preferences } = get();
    const updated = { ...preferences, onboardingCompleted: true };
    kvSet(PREFS_KEY, updated);
    set({ preferences: updated });
  },

  // ─── Streak Actions ────────────────────────────────────────────────────────

  loadStreak: () => {
    const streak = kvGet<StreakData>(STREAK_KEY) ?? DEFAULT_STREAK;
    set({ streak });
  },

  recordSessionComplete: () => {
    const { streak } = get();
    const today = todayISO();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak: StreakData;

    if (streak.lastSessionDate === today) {
      // Already recorded today — no change
      return;
    } else if (streak.lastSessionDate === yesterday) {
      // Consecutive day — increment streak
      newStreak = {
        current: streak.current + 1,
        longest: Math.max(streak.longest, streak.current + 1),
        freezesRemaining: streak.freezesRemaining,
        lastSessionDate: today,
      };
    } else if (streak.lastSessionDate === null) {
      // First session ever
      newStreak = {
        current: 1,
        longest: 1,
        freezesRemaining: 2,
        lastSessionDate: today,
      };
    } else {
      // Streak broken — reset
      newStreak = {
        current: 1,
        longest: streak.longest,
        freezesRemaining: streak.freezesRemaining,
        lastSessionDate: today,
      };
    }

    kvSet(STREAK_KEY, newStreak);
    set({ streak: newStreak });
  },

  useFreeze: () => {
    const { streak } = get();
    if (streak.freezesRemaining <= 0) return;

    const today = todayISO();
    const updated: StreakData = {
      ...streak,
      freezesRemaining: streak.freezesRemaining - 1,
      lastSessionDate: today,
    };

    kvSet(STREAK_KEY, updated);
    set({ streak: updated });
  },
}));
