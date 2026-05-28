/**
 * Rules Evaluation Unit Tests
 */

import { describe, it, expect } from "vitest";
import { evaluateCondition, describeCondition } from "@/core/blocking/rules";
import type { RuleCondition } from "@/types/domain";

describe("evaluateCondition", () => {
  it("should always return true for 'always' condition", () => {
    const condition: RuleCondition = { type: "always" };
    expect(evaluateCondition(condition, false, 0)).toBe(true);
    expect(evaluateCondition(condition, true, 0)).toBe(true);
    expect(evaluateCondition(condition, false, 5)).toBe(true);
  });

  it("should return true for 'session' condition when in session", () => {
    const condition: RuleCondition = { type: "session" };
    expect(evaluateCondition(condition, true, 0)).toBe(true);
  });

  it("should return false for 'session' condition when not in session", () => {
    const condition: RuleCondition = { type: "session" };
    expect(evaluateCondition(condition, false, 0)).toBe(false);
  });

  it("should return true for 'streak_guard' when streak > 0 and not in session", () => {
    const condition: RuleCondition = { type: "streak_guard" };
    expect(evaluateCondition(condition, false, 5)).toBe(true);
  });

  it("should return false for 'streak_guard' when streak is 0", () => {
    const condition: RuleCondition = { type: "streak_guard" };
    expect(evaluateCondition(condition, false, 0)).toBe(false);
  });

  it("should return false for 'streak_guard' when in session", () => {
    const condition: RuleCondition = { type: "streak_guard" };
    expect(evaluateCondition(condition, true, 5)).toBe(false);
  });
});

describe("describeCondition", () => {
  it("should describe always condition", () => {
    expect(describeCondition({ type: "always" })).toBe("Always active");
  });

  it("should describe session condition", () => {
    expect(describeCondition({ type: "session" })).toBe("During focus sessions");
  });

  it("should describe streak guard condition", () => {
    expect(describeCondition({ type: "streak_guard" })).toBe("When streak is at risk");
  });

  it("should describe schedule condition", () => {
    const condition: RuleCondition = {
      type: "schedule",
      days: ["mon", "tue", "wed", "thu", "fri"],
      from: "09:00",
      to: "17:00",
    };
    const result = describeCondition(condition);
    expect(result).toContain("MON");
    expect(result).toContain("09:00");
    expect(result).toContain("17:00");
  });
});
