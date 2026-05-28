/**
 * FocusGuard useInsights Hook
 *
 * Generates insights from analytics data.
 */

import { useMemo } from "react";
import { useAnalyticsStore } from "@/store/analytics.store";
import { useSessionStore } from "@/store/session.store";
import { useBlockingStore } from "@/store/blocking.store";
import { generateInsights, type Insight } from "@/core/analytics/insights";

export function useInsights() {
  const { events, weekReports } = useAnalyticsStore();
  const { sessions } = useSessionStore();
  const { apps } = useBlockingStore();

  const insights: Insight[] = useMemo(
    () => generateInsights(weekReports, sessions, events, apps),
    [weekReports, sessions, events, apps],
  );

  return {
    insights,
    hasInsights: insights.length > 0,
  };
}
