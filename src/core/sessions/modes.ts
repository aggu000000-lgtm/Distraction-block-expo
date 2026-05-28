/**
 * FocusGuard Session Modes
 *
 * Defines session mode presets and configuration.
 */

import type { SessionMode, SessionModeId } from "@/types/domain";

// ─── Mode Presets ────────────────────────────────────────────────────────────

export const SESSION_MODES: Record<SessionModeId, SessionMode> = {
  /** 25 min work / 5 min break, 4 cycles */
  pomodoro: {
    id: "pomodoro",
    workMinutes: 25,
    breakMinutes: 5,
    cycles: 4,
  },

  /** No fixed duration, count up */
  flow: {
    id: "flow",
    workMinutes: 0,
    breakMinutes: 0,
    cycles: 1,
  },

  /** 15 min, no break, no extension */
  sprint: {
    id: "sprint",
    workMinutes: 15,
    breakMinutes: 0,
    cycles: 1,
  },

  /** User-defined */
  custom: {
    id: "custom",
    workMinutes: 30,
    breakMinutes: 5,
    cycles: 1,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get a session mode by ID with optional overrides.
 */
export function getSessionMode(
  id: SessionModeId,
  overrides?: Partial<SessionMode>,
): SessionMode {
  const base = SESSION_MODES[id];
  return { ...base, ...overrides };
}

/**
 * Get the target seconds for a session mode.
 * Returns null for flow mode (count up).
 */
export function getTargetSeconds(mode: SessionMode): number | null {
  if (mode.id === "flow") return null;
  return mode.workMinutes * 60;
}

/**
 * Get the break duration in seconds for a session mode.
 */
export function getBreakSeconds(mode: SessionMode): number {
  return mode.breakMinutes * 60;
}

/**
 * Check if a session mode supports extensions (add time).
 */
export function canExtendSession(mode: SessionMode): boolean {
  return mode.id !== "sprint";
}

/**
 * Get the estimated end time for a session.
 * Returns a formatted time string (e.g., "3:45 PM").
 */
export function getEstimatedEndTime(mode: SessionMode): string | null {
  if (mode.id === "flow") return null;

  const now = new Date();
  const endTime = new Date(now.getTime() + mode.workMinutes * 60 * 1000);

  return endTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get a human-readable description of the session mode.
 */
export function describeMode(mode: SessionMode): string {
  switch (mode.id) {
    case "pomodoro":
      return `${mode.workMinutes}m work / ${mode.breakMinutes}m break × ${mode.cycles}`;
    case "flow":
      return "No time limit — end when you're ready";
    case "sprint":
      return `${mode.workMinutes}m — quick and focused`;
    case "custom":
      return `${mode.workMinutes}m work${mode.breakMinutes > 0 ? ` / ${mode.breakMinutes}m break` : ""}`;
  }
}
