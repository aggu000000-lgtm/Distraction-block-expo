/**
 * Time Utilities Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  formatTimer,
  formatMinutes,
  isTimeBetween,
} from "@/lib/time";

describe("formatTimer", () => {
  it("should format zero seconds", () => {
    expect(formatTimer(0)).toBe("00:00");
  });

  it("should format seconds only", () => {
    expect(formatTimer(45)).toBe("00:45");
  });

  it("should format minutes and seconds", () => {
    expect(formatTimer(125)).toBe("02:05");
  });

  it("should format large values", () => {
    expect(formatTimer(3661)).toBe("61:01");
  });
});

describe("formatMinutes", () => {
  it("should format minutes only", () => {
    expect(formatMinutes(45)).toBe("45m");
  });

  it("should format hours only", () => {
    expect(formatMinutes(120)).toBe("2h");
  });

  it("should format hours and minutes", () => {
    expect(formatMinutes(90)).toBe("1h 30m");
  });

  it("should handle zero", () => {
    expect(formatMinutes(0)).toBe("0m");
  });
});

describe("isTimeBetween", () => {
  it("should return true for time within same-day range", () => {
    expect(isTimeBetween("10:00", "09:00", "17:00")).toBe(true);
  });

  it("should return false for time outside same-day range", () => {
    expect(isTimeBetween("18:00", "09:00", "17:00")).toBe(false);
  });

  it("should return true for time at start of range", () => {
    expect(isTimeBetween("09:00", "09:00", "17:00")).toBe(true);
  });

  it("should return true for time at end of range", () => {
    expect(isTimeBetween("17:00", "09:00", "17:00")).toBe(true);
  });

  it("should handle midnight crossover", () => {
    expect(isTimeBetween("23:00", "22:00", "06:00")).toBe(true);
    expect(isTimeBetween("03:00", "22:00", "06:00")).toBe(true);
    expect(isTimeBetween("12:00", "22:00", "06:00")).toBe(false);
  });
});
