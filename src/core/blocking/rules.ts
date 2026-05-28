/**
 * FocusGuard Rule Evaluation
 *
 * Pure functions for evaluating block rule conditions.
 * No side effects, no async.
 */

import type { RuleCondition, Day } from "@/types/domain";
import { getDayOfWeek, isTimeBetween, currentTimeHHMM } from "@/lib/time";

/**
 * Evaluate whether a rule condition is currently active.
 */
export function evaluateCondition(
  condition: RuleCondition,
  isInSession: boolean,
  currentStreak: number,
): boolean {
  switch (condition.type) {
    case "always":
      return true;

    case "schedule":
      return evaluateScheduleCondition(condition.days, condition.from, condition.to);

    case "session":
      return isInSession;

    case "streak_guard":
      // Streak guard activates when streak is at risk
      // (simplified: active when not in session and streak > 0)
      return !isInSession && currentStreak > 0;
  }
}

/**
 * Evaluate a schedule condition.
 * Returns true if current day and time match the schedule.
 */
function evaluateScheduleCondition(days: Day[], from: string, to: string): boolean {
  const today = getDayOfWeek(new Date()) as Day;

  if (!days.includes(today)) {
    return false;
  }

  const now = currentTimeHHMM();
  return isTimeBetween(now, from, to);
}

/**
 * Check if a rule is currently active (day + time).
 * Does not check session or streak conditions.
 */
export function isRuleCurrentlyActive(condition: RuleCondition): boolean {
  switch (condition.type) {
    case "always":
      return true;

    case "schedule":
      return evaluateScheduleCondition(condition.days, condition.from, condition.to);

    case "session":
    case "streak_guard":
      // These are context-dependent — can't evaluate without context
      return false;
  }
}

/**
 * Get a human-readable description of a rule condition.
 */
export function describeCondition(condition: RuleCondition): string {
  switch (condition.type) {
    case "always":
      return "Always active";

    case "schedule": {
      const dayStr = condition.days.join(", ").toUpperCase();
      return `${dayStr} ${condition.from}–${condition.to}`;
    }

    case "session":
      return "During focus sessions";

    case "streak_guard":
      return "When streak is at risk";
  }
}
