/**
 * FocusGuard Friction System
 *
 * Defines friction levels and their behavior.
 * Friction is not force — it's a moment of pause.
 */

import type { FrictionLevel } from "@/types/domain";

// ─── Friction Level Definitions ──────────────────────────────────────────────

export type FrictionConfig = {
  id: FrictionLevel;
  name: string;
  description: string;
  delaySeconds: number; // seconds before bypass is available
  canBypass: boolean;
  requiresConfirmation: boolean;
};

export const FRICTION_LEVELS: Record<FrictionLevel, FrictionConfig> = {
  soft: {
    id: "soft",
    name: "Soft Friction",
    description: "Shows a brief delay with your usage count. You can dismiss immediately.",
    delaySeconds: 1.5,
    canBypass: true,
    requiresConfirmation: false,
  },
  medium: {
    id: "medium",
    name: "Medium Friction",
    description: 'Shows "Are you sure?" with a countdown. You must confirm to continue.',
    delaySeconds: 5,
    canBypass: true,
    requiresConfirmation: true,
  },
  hard: {
    id: "hard",
    name: "Hard Friction",
    description: "Full-screen breathing exercise. 30 seconds of calm before you can proceed.",
    delaySeconds: 30,
    canBypass: true,
    requiresConfirmation: true,
  },
  locked: {
    id: "locked",
    name: "Locked",
    description: "No bypass during active focus session. Complete your session first.",
    delaySeconds: 0,
    canBypass: false,
    requiresConfirmation: false,
  },
};

/**
 * Get friction config for a level.
 */
export function getFrictionConfig(level: FrictionLevel): FrictionConfig {
  return FRICTION_LEVELS[level];
}

/**
 * Check if bypass is available for a friction level.
 */
export function canBypassFriction(level: FrictionLevel): boolean {
  return FRICTION_LEVELS[level].canBypass;
}

/**
 * Get the delay in milliseconds before bypass is available.
 */
export function getBypassDelayMs(level: FrictionLevel): number {
  return FRICTION_LEVELS[level].delaySeconds * 1000;
}

/**
 * Get a description of what happens at each friction level.
 * Used in the rule editor to explain choices.
 */
export function getFrictionDescription(level: FrictionLevel): string {
  return FRICTION_LEVELS[level].description;
}
