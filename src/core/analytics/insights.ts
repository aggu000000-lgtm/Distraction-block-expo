/**
 * FocusGuard Pattern Insights
 *
 * Generates plain English observations from data.
 * Purely local, deterministic, template-based. No ML, no cloud.
 */

import type { UsageEvent, DayReport, FocusSession, TrackedApp } from "@/types/domain";
import { formatMinutes } from "@/lib/time";
import { formatNumber, pluralize } from "@/lib/format";

// ─── Insight Types ───────────────────────────────────────────────────────────

export type Insight = {
  id: string;
  text: string;
  category: "positive" | "neutral" | "actionable";
};

// ─── Insight Templates ───────────────────────────────────────────────────────

/**
 * Generate insights from weekly data.
 * Returns up to 5 insights, prioritized by relevance.
 */
export function generateInsights(
  weekReports: DayReport[],
  sessions: FocusSession[],
  events: UsageEvent[],
  trackedApps: TrackedApp[],
): Insight[] {
  const insights: Insight[] = [];

  // Focus time insight
  const totalMinutes = weekReports.reduce((sum, r) => sum + r.focusMinutes, 0);
  if (totalMinutes > 0) {
    insights.push({
      id: "weekly-focus",
      text: `You focused for ${formatMinutes(totalMinutes)} this week.`,
      category: totalMinutes > 300 ? "positive" : "neutral",
    });
  }

  // Best day insight
  const bestDay = weekReports.reduce(
    (best, r) => (r.focusMinutes > best.focusMinutes ? r : best),
    weekReports[0],
  );
  if (bestDay && bestDay.focusMinutes > 0) {
    const dayName = new Date(bestDay.date).toLocaleDateString("en-US", { weekday: "long" });
    insights.push({
      id: "best-day",
      text: `Your best day was ${dayName} with ${formatMinutes(bestDay.focusMinutes)} of focus.`,
      category: "positive",
    });
  }

  // Block attempts insight
  const totalBlocked = weekReports.reduce((sum, r) => sum + r.openBlocked, 0);
  if (totalBlocked > 0) {
    insights.push({
      id: "blocks",
      text: `You blocked distractions ${formatNumber(totalBlocked)} times this week.`,
      category: "neutral",
    });
  }

  // Bypass rate insight
  const totalBypassed = weekReports.reduce((sum, r) => sum + r.frictionBypassed, 0);
  const totalAttempts = weekReports.reduce((sum, r) => sum + r.openAttempts, 0);
  if (totalAttempts > 0) {
    const bypassRate = totalBypassed / totalAttempts;
    if (bypassRate < 0.1) {
      insights.push({
        id: "low-bypass",
        text: "You rarely bypass friction — your focus habits are strengthening.",
        category: "positive",
      });
    } else if (bypassRate > 0.5) {
      insights.push({
        id: "high-bypass",
        text: "You bypass friction often. Consider increasing friction levels on your most-used apps.",
        category: "actionable",
      });
    }
  }

  // Session completion insight
  const completedSessions = sessions.filter((s) => s.outcome === "completed");
  if (completedSessions.length > 0) {
    const avgDuration =
      completedSessions.reduce((s, sess) => s + (sess.endedAt! - sess.startedAt), 0) /
      completedSessions.length /
      60000;
    insights.push({
      id: "avg-session",
      text: `Your average session is ${formatMinutes(Math.round(avgDuration))}.`,
      category: "neutral",
    });
  }

  // Sort: positive first, then neutral, then actionable
  const priority = { positive: 0, neutral: 1, actionable: 2 };
  return insights
    .sort((a, b) => priority[a.category] - priority[b.category])
    .slice(0, 5);
}

/**
 * Get a motivational insight for the weekly review.
 */
export function getWeeklyMotivation(totalFocusMinutes: number): string {
  if (totalFocusMinutes >= 600) {
    return "Incredible week. You're building something real.";
  }
  if (totalFocusMinutes >= 300) {
    return "Solid week. Your focus is paying off.";
  }
  if (totalFocusMinutes >= 150) {
    return "Good progress. Every session counts.";
  }
  if (totalFocusMinutes > 0) {
    return "You showed up. That's what matters most.";
  }
  return "Ready for a fresh start? One session is all it takes.";
}
