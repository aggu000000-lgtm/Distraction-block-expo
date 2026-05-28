/**
 * Format Utilities Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercent,
  ordinal,
  pluralize,
  truncate,
  formatStars,
} from "@/lib/format";

describe("formatNumber", () => {
  it("should format small numbers", () => {
    expect(formatNumber(42)).toBe("42");
  });

  it("should format thousands with commas", () => {
    expect(formatNumber(1234)).toBe("1,234");
  });

  it("should format large numbers", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("should handle zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  it("should format 0%", () => {
    expect(formatPercent(0)).toBe("0%");
  });

  it("should format 100%", () => {
    expect(formatPercent(1)).toBe("100%");
  });

  it("should format decimal percentages", () => {
    expect(formatPercent(0.743)).toBe("74%");
  });

  it("should format with decimals", () => {
    expect(formatPercent(0.743, 1)).toBe("74.3%");
  });
});

describe("ordinal", () => {
  it("should add st suffix", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(21)).toBe("21st");
  });

  it("should add nd suffix", () => {
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(22)).toBe("22nd");
  });

  it("should add rd suffix", () => {
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(23)).toBe("23rd");
  });

  it("should add th suffix", () => {
    expect(ordinal(4)).toBe("4th");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(12)).toBe("12th");
    expect(ordinal(13)).toBe("13th");
  });
});

describe("pluralize", () => {
  it("should use singular for 1", () => {
    expect(pluralize(1, "session")).toBe("1 session");
  });

  it("should use plural for other counts", () => {
    expect(pluralize(0, "session")).toBe("0 sessions");
    expect(pluralize(5, "session")).toBe("5 sessions");
  });

  it("should use custom plural", () => {
    expect(pluralize(2, "entry", "entries")).toBe("2 entries");
  });
});

describe("truncate", () => {
  it("should not truncate short text", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate long text", () => {
    expect(truncate("hello world", 5)).toBe("hell…");
  });

  it("should handle exact length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("formatStars", () => {
  it("should format 0 stars", () => {
    expect(formatStars(0)).toBe("☆☆☆☆☆");
  });

  it("should format full stars", () => {
    expect(formatStars(5)).toBe("★★★★★");
  });

  it("should format partial stars", () => {
    expect(formatStars(3)).toBe("★★★☆☆");
  });
});
