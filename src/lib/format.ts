/**
 * FocusGuard Formatting Utilities
 *
 * Pure number/string formatters. No side effects.
 */

/**
 * Format a number with commas
 * e.g., 1234 → "1,234"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Format a percentage
 * e.g., 0.743 → "74%"
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Ordinal suffix for a number
 * e.g., 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th"
 */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Pluralize a word based on count
 * e.g., pluralize(1, "session") → "1 session"
 * e.g., pluralize(5, "session") → "5 sessions"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${formatNumber(count)} ${word}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Format a star rating to emoji string
 * e.g., 3 → "★★★☆☆"
 */
export function formatStars(rating: number, max = 5): string {
  return "★".repeat(rating) + "☆".repeat(max - rating);
}
