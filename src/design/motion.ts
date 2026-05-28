/**
 * FocusGuard Motion System
 *
 * Animation is not decoration. It is communication.
 * All animations run on the UI thread via Reanimated.
 */

import type { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

// ─── Spring Presets ──────────────────────────────────────────────────────────

export const spring = {
  /** Button press — snappy, responsive */
  snappy: { damping: 20, stiffness: 300 } satisfies WithSpringConfig,
  /** Modal entrance — smooth, controlled */
  smooth: { damping: 18, stiffness: 180 } satisfies WithSpringConfig,
  /** Achievement pop — bouncy, celebratory */
  bouncy: { damping: 12, stiffness: 200 } satisfies WithSpringConfig,
  /** Fade/slide — gentle, subtle */
  gentle: { damping: 25, stiffness: 120 } satisfies WithSpringConfig,
} as const;

// ─── Duration Presets ────────────────────────────────────────────────────────

export const duration = {
  /** Haptic response, color change */
  instant: 100,
  /** Button feedback, tab switch */
  fast: 200,
  /** Modal open, card expand */
  normal: 300,
  /** Screen transition, progress fill */
  slow: 500,
  /** Streak milestone, completion */
  dramatic: 800,
} as const;

// ─── Stagger ─────────────────────────────────────────────────────────────────

export const stagger = {
  /** List item stagger delay */
  list: 40,
  /** Card stagger delay */
  card: 40,
  /** Chart bar stagger delay */
  chart: 60,
} as const;

// ─── Easing Curves ───────────────────────────────────────────────────────────

export const easing = {
  /** Standard ease-out for most transitions */
  standard: [0.25, 0.1, 0.25, 1],
  /** Decelerate for entering elements */
  decelerate: [0, 0, 0.2, 1],
  /** Accelerate for exiting elements */
  accelerate: [0.4, 0, 1, 1],
} as const;
