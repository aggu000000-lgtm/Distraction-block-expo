// The Blocking Engine — pure logic, no React, no async, < 1ms.
import { BlockRule, FrictionLevel, RuleCondition, Day } from '../../types/domain';

function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getCurrentDay(): Day {
  return new Date().getDay() as Day;
}

function timeInRange(from: string, to: string, current: string): boolean {
  if (from <= to) return current >= from && current < to;
  return current >= from || current < to;
}

function isConditionActive(condition: RuleCondition, isSessionRunning: boolean): boolean {
  switch (condition.type) {
    case 'always': return true;
    case 'session': return isSessionRunning;
    case 'schedule':
      if (!condition.days.includes(getCurrentDay())) return false;
      return timeInRange(condition.from, condition.to, getCurrentTimeString());
    default: return false;
  }
}

export type BlockDecision =
  | { blocked: false }
  | { blocked: true; friction: FrictionLevel; ruleName: string };

const FRICTION_RANK: Record<FrictionLevel, number> = {
  soft: 1, medium: 2, hard: 3, locked: 4,
};

export function evaluateBlock(
  appId: string,
  rules: BlockRule[],
  isSessionRunning: boolean,
): BlockDecision {
  let highestFriction: FrictionLevel | null = null;
  let triggeringRuleName = '';

  for (const rule of rules) {
    if (!rule.isActive) continue;
    if (!rule.appIds.includes(appId)) continue;
    if (!isConditionActive(rule.condition, isSessionRunning)) continue;
    if (
      highestFriction === null ||
      FRICTION_RANK[rule.friction] > FRICTION_RANK[highestFriction]
    ) {
      highestFriction = rule.friction;
      triggeringRuleName = rule.name;
    }
  }

  if (highestFriction === null) return { blocked: false };
  return { blocked: true, friction: highestFriction, ruleName: triggeringRuleName };
}
