/**
 * FocusGuard Typography System
 *
 * Font: Geist (variable) for UI, Geist Mono for numbers/timers
 * Fallback: System default (San Francisco / Roboto)
 */

import { Platform, type TextStyle } from "react-native";

// ─── Font Families ───────────────────────────────────────────────────────────

export const fontFamily = {
  regular: Platform.select({
    ios: "Geist",
    android: "Geist",
    default: "System",
  }),
  mono: Platform.select({
    ios: "Geist Mono",
    android: "Geist Mono",
    default: "monospace",
  }),
} as const;

// ─── Typography Scale ────────────────────────────────────────────────────────

type TypographyStyle = Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight" | "letterScale">;

export const typography = {
  /** 40px / 800 / 44px — Timer display, hero numbers */
  display: {
    fontSize: 40,
    fontWeight: "800" as const,
    lineHeight: 44,
  },
  /** 28px / 800 / 32px — Screen titles */
  h1: {
    fontSize: 28,
    fontWeight: "800" as const,
    lineHeight: 32,
  },
  /** 22px / 700 / 28px — Section headers */
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  /** 18px / 700 / 24px — Card titles */
  h3: {
    fontSize: 18,
    fontWeight: "700" as const,
    lineHeight: 24,
  },
  /** 15px / 400 / 22px — Body copy, descriptions */
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  /** 13px / 600 / 18px — Labels, badges, metadata */
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    lineHeight: 18,
  },
  /** 11px / 500 / 14px — Fine print, timestamps */
  caption: {
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 14,
  },
  /** 48px / 700 / 52px — Countdown timer */
  "mono-xl": {
    fontSize: 48,
    fontWeight: "700" as const,
    lineHeight: 52,
    fontVariant: ["tabular-nums"] as TextStyle["fontVariant"],
  },
  /** 24px / 600 / 28px — Elapsed time, small counters */
  "mono-lg": {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 28,
    fontVariant: ["tabular-nums"] as TextStyle["fontVariant"],
  },
} as const;

export type TypographyScale = keyof typeof typography;

// ─── Helper: Get full text style for a scale ─────────────────────────────────

export function getTextStyle(
  scale: TypographyScale,
  color: string,
  familyOverride?: "regular" | "mono",
): TextStyle {
  const style = typography[scale];
  const family = familyOverride ?? (scale.startsWith("mono") ? "mono" : "regular");

  return {
    ...style,
    color,
    fontFamily: fontFamily[family],
  };
}
