/**
 * FocusGuard Session Store
 *
 * Manages focus sessions and timer state.
 */

import { create } from "zustand";
import type { FocusSession, SessionMode, SessionModeId } from "@/types/domain";
import { insertOne, findAll } from "@/lib/storage";

// ─── Session Mode Presets ────────────────────────────────────────────────────

export const SESSION_MODES: Record<SessionModeId, SessionMode> = {
  pomodoro: { id: "pomodoro", workMinutes: 25, breakMinutes: 5, cycles: 4 },
  flow: { id: "flow", workMinutes: 0, breakMinutes: 0, cycles: 1 },
  sprint: { id: "sprint", workMinutes: 15, breakMinutes: 0, cycles: 1 },
  custom: { id: "custom", workMinutes: 30, breakMinutes: 5, cycles: 1 },
};

// ─── State ───────────────────────────────────────────────────────────────────

type SessionState = {
  // Current session
  currentSession: FocusSession | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;

  // History
  sessions: FocusSession[];
  isLoading: boolean;
};

type SessionActions = {
  // Session lifecycle
  startSession: (mode: SessionMode, intention?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  abandonSession: () => void;
  tick: () => void;

  // History
  loadSessions: () => void;
  addIntention: (intention: string) => void;
  addReflection: (rating: number) => void;
};

export const useSessionStore = create<SessionState & SessionActions>((set, get) => ({
  // ─── State ─────────────────────────────────────────────────────────────────
  currentSession: null,
  isRunning: false,
  isPaused: false,
  elapsedSeconds: 0,
  sessions: [],
  isLoading: false,

  // ─── Actions ───────────────────────────────────────────────────────────────

  startSession: (mode, intention) => {
    const session: FocusSession = {
      id: `session_${Date.now()}`,
      mode,
      plannedMinutes: mode.workMinutes,
      startedAt: Date.now(),
      endedAt: null,
      outcome: "ongoing",
      interruptionCount: 0,
      intention: intention ?? null,
      reflection: null,
    };

    insertOne("focus_sessions", session);
    set({
      currentSession: session,
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
    });
  },

  pauseSession: () => {
    set({ isPaused: true });
  },

  resumeSession: () => {
    set({ isPaused: false });
  },

  completeSession: () => {
    const { currentSession, elapsedSeconds } = get();
    if (!currentSession) return;

    const completed: FocusSession = {
      ...currentSession,
      endedAt: Date.now(),
      outcome: "completed",
    };

    insertOne("focus_sessions", completed);
    set((state) => ({
      currentSession: null,
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      sessions: [completed, ...state.sessions],
    }));
  },

  abandonSession: () => {
    const { currentSession } = get();
    if (!currentSession) return;

    const abandoned: FocusSession = {
      ...currentSession,
      endedAt: Date.now(),
      outcome: "abandoned",
    };

    insertOne("focus_sessions", abandoned);
    set((state) => ({
      currentSession: null,
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      sessions: [abandoned, ...state.sessions],
    }));
  },

  tick: () => {
    const { isRunning, isPaused } = get();
    if (!isRunning || isPaused) return;
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
  },

  loadSessions: () => {
    set({ isLoading: true });
    const sessions = findAll<FocusSession>("focus_sessions");
    set({ sessions, isLoading: false });
  },

  addIntention: (intention) => {
    const { currentSession } = get();
    if (!currentSession) return;
    set({ currentSession: { ...currentSession, intention } });
  },

  addReflection: (rating) => {
    const { currentSession } = get();
    if (!currentSession) return;
    set({ currentSession: { ...currentSession, reflection: rating } });
  },
}));
