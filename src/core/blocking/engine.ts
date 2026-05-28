/**
 * FocusGuard Blocking Engine
 *
 * The core. Runs decisions synchronously in < 1ms.
 * No async, no network, no excuses.
 */

import type { BlockRule, FrictionLevel, TrackedApp, RuleCondition } from "@/types/domain";
import { evaluateCondition } from "./rules";

// ─── Decision Types ──────────────────────────────────────────────────────────

export type BlockingDecision =
  | { action: "allow" }
  | { action: "friction"; level: FrictionLevel; rule: BlockRule };

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Evaluate whether an app should be blocked right now.
 *
 * Decision flow:
 * 1. Is app tracked? → No → Allow
 * 2. Is any rule active for this app right now? → No → Allow
 * 3. What is the highest friction level? → Return friction decision
 */
export function evaluateBlocking(
  appId: string,
  trackedApps: TrackedApp[],
  rules: BlockRule[],
  isInSession: boolean,
  currentStreak: number,
): BlockingDecision {
  // Step 1: Is app tracked?
  const app = trackedApps.find((a) => a.id === appId);
  if (!app || !app.isTracked) {
    return { action: "allow" };
  }

  // Step 2: Find all active rules that apply to this app
  const applicableRules = rules.filter(
    (rule) => rule.isActive && rule.apps.includes(appId),
  );

  if (applicableRules.length === 0) {
    return { action: "allow" };
  }

  // Step 3: Filter to rules whose conditions are currently met
  const activeRules = applicableRules.filter((rule) =>
    evaluateCondition(rule.condition, isInSession, currentStreak),
  );

  if (activeRules.length === 0) {
    return { action: "allow" };
  }

  // Step 4: Highest friction wins
  const highestFrictionRule = getHighestFrictionRule(activeRules);

  return {
    action: "friction",
    level: highestFrictionRule.friction,
    rule: highestFrictionRule,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FRICTION_ORDER: Record<FrictionLevel, number> = {
  soft: 1,
  medium: 2,
  hard: 3,
  locked: 4,
};

/**
 * Find the rule with the highest friction level.
 * If tied, returns the first one found.
 */
function getHighestFrictionRule(rules: BlockRule[]): BlockRule {
  return rules.reduce((highest, current) =>
    FRICTION_ORDER[current.friction] > FRICTION_ORDER[highest.friction] ? current : highest,
  );
}
