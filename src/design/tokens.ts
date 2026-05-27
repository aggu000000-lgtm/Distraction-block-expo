// FocusGuard Design Tokens — single source of truth
// Every color, size, spacing used in the app comes from here.

export const C = {
  // ── Backgrounds ──────────────────────────────────────────
  void:        '#080811',   // deepest background
  abyss:       '#0d0d1c',   // screen background
  depth:       '#111122',   // primary card background
  surface:     '#18182e',   // elevated card / input
  rim:         '#22223a',   // border, divider
  fog:         '#2e2e4e',   // muted placeholder bg

  // ── Accent ───────────────────────────────────────────────
  nebula:      '#6c63ff',   // primary violet
  nebulaDim:   '#6c63ff22',
  nebulaGlow:  '#6c63ff55',
  nebulaBright:'#8a82ff',

  // ── Semantic ─────────────────────────────────────────────
  pulse:       '#00e5a0',   // success / active / streak
  pulseDim:    '#00e5a018',
  pulseGlow:   '#00e5a044',

  alert:       '#ff5c5c',   // danger / blocked
  alertDim:    '#ff5c5c18',

  amber:       '#ffb547',   // warning / in-progress
  amberDim:    '#ffb54718',

  // ── Text ─────────────────────────────────────────────────
  frost:       '#e8e8ff',   // primary text
  mist:        '#8888aa',   // secondary text
  shadow:      '#44446a',   // muted / disabled
} as const;

export const R = {
  xs:   6,
  sm:   10,
  md:   16,
  lg:   22,
  xl:   32,
  full: 9999,
} as const;

export const S = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const;

export const F = {
  xs:      11,
  sm:      13,
  md:      15,
  lg:      17,
  xl:      20,
  xxl:     26,
  xxxl:    36,
  display: 48,
} as const;

export const W = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
  black:     '900' as const,
} as const;
