/**
 * FocusGuard Analytics Aggregator
 *
 * Rolls up raw events → stats.
 * Pure functions, no side effects.
 */

import type { UsageEvent, DayReport, FocusSession } from "@/types/domain";
import { todayISO } from "@/lib/time";

/**
 * Generate a DayReport from raw events and sessions for a given date.
 */
export function aggregateDayReport(
  date: string,
  events: UsageEvent[],
  sessions: FocusSession[],
  currentStreak: number,
): DayReport {
  const dayStart = new Date(date).getTime();
  const dayEnd = dayStart + 86400000;

  const dayEvents = events.filter(
    (e) => e.timestamp >= dayStart && e.timestamp < dayEnd,
  );

  const daySessions = sessions.filter(
    (s) => s.startedAt >= dayStart && s.startedAt < dayEnd,
  );

  const completedSessions = daySessions.filter((s) => s.outcome === "completed");
  const abandonedSessions = daySessions.filter((s) => s.outcome === "abandoned");

  const focusMinutes = completedSessions.reduce(
    (total, s) => total + Math.floor((s.endedAt! - s.startedAt) / 60000),
    0,
  );

  return {
    date,
    focusMinutes,
    sessionsCompleted: completedSessions.length,
    sessionsAbandoned: abandonedSessions.length,
    openAttempts: dayEvents.filter((e) => e.type === "open_attempt").length,
    openBlocked: dayEvents.filter((e) => e.type === "open_blocked").length,
    frictionBypassed: dayEvents.filter((e) => e.type === "friction_bypassed").length,
    streak: currentStreak,
  };
}

/**
 * Calculate total focus minutes from a list of sessions.
 */
export function totalFocusMinutes(sessions: FocusSession[]): number {
  return sessions
    .filter((s) => s.outcome === "completed" && s.endedAt)
    .reduce((total, s) => total + Math.floor((s.endedAt! - s.startedAt) / 60000), 0);
}

/**
 * Calculate session completion rate.
 */
export function completionRate(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 0;
  const completed = sessions.filter((s) => s.outcome === "completed").length;
  return completed / sessions.length;
}

/**
 * Get the most common usage event type for a given app.
 */
export function getMostCommonEvent(
  appId: string,
  events: UsageEvent[],
): UsageEvent["type"] | null {
  const appEvents = events.filter((e) => e.appId === appId);
  if (appEvents.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const event of appEvents) {
    counts[event.type] = (counts[event.type] || 0) + 1;
  }

  return Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as UsageEvent["type"];
}
