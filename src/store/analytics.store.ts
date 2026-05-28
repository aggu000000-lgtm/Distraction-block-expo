/**
 * FocusGuard Analytics Store
 *
 * Manages usage events and daily reports.
 */

import { create } from "zustand";
import type { UsageEvent, DayReport } from "@/types/domain";
import { insertOne, findAll } from "@/lib/storage";
import { todayISO } from "@/lib/time";

type AnalyticsState = {
  events: UsageEvent[];
  todayReport: DayReport | null;
  weekReports: DayReport[];
  isLoading: boolean;
};

type AnalyticsActions = {
  loadEvents: () => void;
  logEvent: (event: UsageEvent) => void;
  generateTodayReport: () => void;
  loadWeekReports: () => void;
};

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  events: [],
  todayReport: null,
  weekReports: [],
  isLoading: false,

  // ─── Actions ───────────────────────────────────────────────────────────────

  loadEvents: () => {
    const events = findAll<UsageEvent>("usage_events");
    set({ events });
  },

  logEvent: (event) => {
    insertOne("usage_events", event);
    set((state) => ({ events: [...state.events, event] }));
  },

  generateTodayReport: () => {
    const { events } = get();
    const today = todayISO();
    const todayStart = new Date(today).getTime();
    const todayEnd = todayStart + 86400000;

    const todayEvents = events.filter(
      (e) => e.timestamp >= todayStart && e.timestamp < todayEnd,
    );

    const report: DayReport = {
      date: today,
      focusMinutes: 0, // Calculated from sessions
      sessionsCompleted: 0,
      sessionsAbandoned: 0,
      openAttempts: todayEvents.filter((e) => e.type === "open_attempt").length,
      openBlocked: todayEvents.filter((e) => e.type === "open_blocked").length,
      frictionBypassed: todayEvents.filter((e) => e.type === "friction_bypassed").length,
      streak: 0, // Calculated from user store
    };

    set({ todayReport: report });
  },

  loadWeekReports: () => {
    // Placeholder — will generate reports for last 7 days
    set({ weekReports: [] });
  },
}));
