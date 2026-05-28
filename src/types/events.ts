/**
 * FocusGuard Analytics Event Schemas
 *
 * Type definitions for all tracked events.
 * Raw events are never shown to user — always aggregated.
 */

import type { UsageEventType } from "./domain";

export type AnalyticsEvent =
  | {
      type: "session_started";
      sessionId: string;
      mode: string;
      plannedMinutes: number;
      intention: string | null;
      timestamp: number;
    }
  | {
      type: "session_ended";
      sessionId: string;
      outcome: "completed" | "abandoned";
      actualMinutes: number;
      interruptionCount: number;
      timestamp: number;
    }
  | {
      type: "app_usage";
      appId: string;
      usageType: UsageEventType;
      sessionId: string | null;
      timestamp: number;
    }
  | {
      type: "friction_shown";
      appId: string;
      frictionLevel: string;
      ruleId: string;
      timestamp: number;
    }
  | {
      type: "streak_milestone";
      days: number;
      timestamp: number;
    };
