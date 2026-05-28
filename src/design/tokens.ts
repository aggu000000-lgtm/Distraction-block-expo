/**
 * FocusGuard Design Tokens
 *
 * Single source of truth for all colors, spacing, radii, and shadows.
 * Import from here — never hardcode values in components.
 */

// ─── Color Palette ──────────────────────────────────────────────────────────

export const colors = {
  // Base backgrounds
  void: "#080811", // True background (deepest)
  abyss: "#0d0d1c", // Screen background
  depth: "#111122", // Card background (primary)
  surface: "#18182e", // Card background (elevated)
  rim: "#22223a", // Border, divider
  fog: "#2e2e4e", // Muted border, placeholder bg

  // Accent: Nebula (violet-purple)
  nebula: "#6c63ff", // Primary accent
  nebulaGlow: "#6c63ff22", // Accent background wash
  nebulaBright: "#8a82ff", // Accent hover / active

  // Status: Pulse (electric green)
  pulse: "#00e5a0", // Success / active / streak
  pulseSoft: "#00e5a015", // Success background wash

  // Status: Alert (red)
  alert: "#ff5c5c", // Danger / blocked
  alertSoft: "#ff5c5c15", // Danger background wash

  // Status: Amber (warning)
  amber: "#ffb547", // Warning / in-progress
  amberSoft: "#ffb54715", // Warning background wash

  // Text hierarchy
  frost: "#e8e8ff", // Primary text (cool white)
  mist: "#8888aa", // Secondary text
  shadow: "#44446a", // Muted / disabled text
} as const;

// ─── Spacing (4px base unit) ─────────────────────────────────────────────────

export const spacing = {
  xs: 4, // Tight inline gaps (icon + label)
  sm: 8, // Compact internal padding
  md: 16, // Standard padding, gap between cards
  lg: 24, // Section separation
  xl: 32, // Large section gaps
  "2xl": 48, // Screen-level breathing room
  "3xl": 64, // Hero section padding
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const radii = {
  none: 0, // Data tables, full-bleed images
  xs: 6, // Chips, pills, small badges
  sm: 10, // Compact cards
  md: 16, // Standard cards, buttons
  lg: 22, // Large cards, modals
  xl: 32, // Floating panels, sheets
  full: 9999, // Toggle switches, avatar circles
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  sm: {
    shadowColor: colors.void,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.void,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.void,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  }),
} as const;

// ─── Semantic Color Mappings ─────────────────────────────────────────────────

export const semantic = {
  // Interactive states
  primaryButton: colors.nebula,
  primaryButtonText: colors.frost,
  secondaryButton: "transparent",
  secondaryButtonText: colors.mist,
  destructiveButton: colors.alertSoft,
  destructiveButtonText: colors.alert,

  // Status
  blocking: colors.alert,
  sessionActive: colors.pulse,
  idle: colors.nebula,
  streakAlive: colors.amber,
  streakDanger: colors.alert,

  // Surfaces
  screenBg: colors.abyss,
  cardBg: colors.depth,
  cardBgElevated: colors.surface,
  border: colors.rim,
  borderMuted: colors.fog,
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiiToken = keyof typeof radii;
