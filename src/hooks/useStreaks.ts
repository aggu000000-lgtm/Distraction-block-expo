/**
 * FocusGuard useStreaks Hook
 *
 * Streak tracking and milestone detection.
 */

import { useMemo } from "react";
import { useUserStore } from "@/store/user.store";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export function useStreaks() {
  const { streak, recordSessionComplete, useFreeze } = useUserStore();

  const nextMilestone = useMemo(() => {
    return STREAK_MILESTONES.find((m) => m > streak.current) ?? null;
  }, [streak.current]);

  const progressToNextMilestone = useMemo(() => {
    if (!nextMilestone) return 1;
    const prevMilestone =
      STREAK_MILESTONES.filter((m) => m <= streak.current).pop() ?? 0;
    return (streak.current - prevMilestone) / (nextMilestone - prevMilestone);
  }, [streak.current, nextMilestone]);

  const isMilestoneReached = (days: number): boolean => {
    return STREAK_MILESTONES.includes(days);
  };

  return {
    current: streak.current,
    longest: streak.longest,
    freezesRemaining: streak.freezesRemaining,
    nextMilestone,
    progressToNextMilestone,
    isMilestoneReached,
    recordSessionComplete,
    useFreeze,
  };
}
