/**
 * Blocking Engine Unit Tests
 */

import { describe, it, expect } from "vitest";
import { evaluateBlocking } from "@/core/blocking/engine";
import type { BlockRule, TrackedApp } from "@/types/domain";

describe("evaluateBlocking", () => {
  const trackedApp: TrackedApp = {
    id: "instagram",
    name: "Instagram",
    bundleId: "com.instagram.app",
    category: "social",
    icon: "📸",
    isTracked: true,
  };

  const untrackedApp: TrackedApp = {
    id: "notes",
    name: "Notes",
    bundleId: "com.apple.mobilenotes",
    category: "productivity",
    icon: "📝",
    isTracked: false,
  };

  const alwaysRule: BlockRule = {
    id: "rule-1",
    name: "Always Block",
    apps: ["instagram"],
    condition: { type: "always" },
    friction: "medium",
    isActive: true,
    createdAt: Date.now(),
  };

  const inactiveRule: BlockRule = {
    id: "rule-2",
    name: "Inactive Rule",
    apps: ["instagram"],
    condition: { type: "always" },
    friction: "hard",
    isActive: false,
    createdAt: Date.now(),
  };

  it("should allow untracked apps", () => {
    const result = evaluateBlocking("notes", [untrackedApp], [alwaysRule], false, 0);
    expect(result).toEqual({ action: "allow" });
  });

  it("should allow tracked apps with no rules", () => {
    const result = evaluateBlocking("instagram", [trackedApp], [], false, 0);
    expect(result).toEqual({ action: "allow" });
  });

  it("should allow tracked apps with inactive rules", () => {
    const result = evaluateBlocking("instagram", [trackedApp], [inactiveRule], false, 0);
    expect(result).toEqual({ action: "allow" });
  });

  it("should block tracked app with active always rule", () => {
    const result = evaluateBlocking("instagram", [trackedApp], [alwaysRule], false, 0);
    expect(result).toEqual({
      action: "friction",
      level: "medium",
      rule: alwaysRule,
    });
  });

  it("should return highest friction when multiple rules apply", () => {
    const hardRule: BlockRule = {
      id: "rule-3",
      name: "Hard Rule",
      apps: ["instagram"],
      condition: { type: "always" },
      friction: "hard",
      isActive: true,
      createdAt: Date.now(),
    };

    const result = evaluateBlocking(
      "instagram",
      [trackedApp],
      [alwaysRule, hardRule],
      false,
      0,
    );

    expect(result).toEqual({
      action: "friction",
      level: "hard",
      rule: hardRule,
    });
  });

  it("should allow app not covered by any rule", () => {
    const result = evaluateBlocking("twitter", [trackedApp], [alwaysRule], false, 0);
    expect(result).toEqual({ action: "allow" });
  });

  it("should allow app not in tracked list", () => {
    const result = evaluateBlocking("unknown-app", [], [alwaysRule], false, 0);
    expect(result).toEqual({ action: "allow" });
  });
});
