/**
 * FocusGuard Time Utilities
 *
 * Pure date/duration helpers. No side effects.
 */

// ─── Duration Formatting ─────────────────────────────────────────────────────

/**
 * Format seconds to "MM:SS" string
 */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Format minutes to human-readable string
 * e.g., 90 → "1h 30m", 45 → "45m", 120 → "2h"
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Format a timestamp to relative time
 * e.g., "2 minutes ago", "1 hour ago", "yesterday"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays}d ago`;
}

// ─── Date Helpers ────────────────────────────────────────────────────────────

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get day of week from a date
 */
export function getDayOfWeek(date: Date): string {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return days[date.getDay()];
}

/**
 * Check if a time string (HH:MM) is between from and to
 * Handles midnight crossover (e.g., 22:00 to 06:00)
 */
export function isTimeBetween(time: string, from: string, to: string): boolean {
  const toMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const t = toMinutes(time);
  const fromMin = toMinutes(from);
  const toMin = toMinutes(to);

  if (fromMin <= toMin) {
    // Same day range (e.g., 09:00 to 17:00)
    return t >= fromMin && t <= toMin;
  } else {
    // Midnight crossover (e.g., 22:00 to 06:00)
    return t >= fromMin || t <= toMin;
  }
}

/**
 * Get current time as HH:MM string
 */
export function currentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
