import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

export type BlockedApp = {
  id: string;
  name: string;
  icon: string;
  category: string;
  isBlocked: boolean;
  dailyLimitMinutes?: number;
};

export type BlockRule = {
  id: string;
  name: string;
  apps: string[];
  schedule?: {
    days: number[];
    startTime: string;
    endTime: string;
  };
  isActive: boolean;
};

export type FocusSession = {
  id: string;
  startedAt: number;
  durationMinutes: number;
  completed: boolean;
  type: 'pomodoro' | 'custom' | 'flow';
};

export type StatsDay = {
  date: string;
  focusMinutes: number;
  blockedAttempts: number;
  sessionsCompleted: number;
};

export type AppState = {
  blockedApps: BlockedApp[];
  blockRules: BlockRule[];
  sessions: FocusSession[];
  stats: StatsDay[];
  focusStreak: number;
  isBlockingActive: boolean;
  currentSession: FocusSession | null;
};

const STORAGE_KEY = '@focusguard_state';

const DEFAULT_APPS: BlockedApp[] = [
  { id: '1', name: 'Instagram', icon: '📷', category: 'Social', isBlocked: true },
  { id: '2', name: 'TikTok', icon: '🎵', category: 'Social', isBlocked: true },
  { id: '3', name: 'YouTube', icon: '▶️', category: 'Video', isBlocked: false },
  { id: '4', name: 'Twitter / X', icon: '🐦', category: 'Social', isBlocked: true },
  { id: '5', name: 'Reddit', icon: '🤖', category: 'Social', isBlocked: false },
  { id: '6', name: 'Facebook', icon: '📘', category: 'Social', isBlocked: false },
  { id: '7', name: 'Netflix', icon: '🎬', category: 'Video', isBlocked: false },
  { id: '8', name: 'Snapchat', icon: '👻', category: 'Social', isBlocked: false },
  { id: '9', name: 'Discord', icon: '💬', category: 'Chat', isBlocked: false },
  { id: '10', name: 'WhatsApp', icon: '💬', category: 'Chat', isBlocked: false },
  { id: '11', name: 'Twitch', icon: '🎮', category: 'Video', isBlocked: false },
  { id: '12', name: 'LinkedIn', icon: '💼', category: 'Social', isBlocked: false },
];

const INITIAL_STATE: AppState = {
  blockedApps: DEFAULT_APPS,
  blockRules: [
    {
      id: 'r1',
      name: 'Deep Work Hours',
      apps: ['1', '2', '4'],
      schedule: { days: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' },
      isActive: true,
    },
  ],
  sessions: [],
  stats: [
    { date: '2026-05-21', focusMinutes: 45, blockedAttempts: 12, sessionsCompleted: 2 },
    { date: '2026-05-22', focusMinutes: 90, blockedAttempts: 7, sessionsCompleted: 3 },
    { date: '2026-05-23', focusMinutes: 25, blockedAttempts: 21, sessionsCompleted: 1 },
    { date: '2026-05-24', focusMinutes: 120, blockedAttempts: 4, sessionsCompleted: 4 },
    { date: '2026-05-25', focusMinutes: 75, blockedAttempts: 9, sessionsCompleted: 3 },
    { date: '2026-05-26', focusMinutes: 105, blockedAttempts: 6, sessionsCompleted: 4 },
    { date: '2026-05-27', focusMinutes: 60, blockedAttempts: 3, sessionsCompleted: 2 },
  ],
  focusStreak: 5,
  isBlockingActive: true,
  currentSession: null,
};

export function useStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setState(JSON.parse(raw));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((next: AppState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleApp = useCallback((id: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        blockedApps: prev.blockedApps.map((a) =>
          a.id === id ? { ...a, isBlocked: !a.isBlocked } : a
        ),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleBlocking = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, isBlockingActive: !prev.isBlockingActive };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addApp = useCallback((app: Omit<BlockedApp, 'id'>) => {
    setState((prev) => {
      const next = {
        ...prev,
        blockedApps: [...prev.blockedApps, { ...app, id: Date.now().toString() }],
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeApp = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, blockedApps: prev.blockedApps.filter((a) => a.id !== id) };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const startSession = useCallback((durationMinutes: number, type: FocusSession['type']) => {
    const session: FocusSession = {
      id: Date.now().toString(),
      startedAt: Date.now(),
      durationMinutes,
      completed: false,
      type,
    };
    setState((prev) => {
      const next = { ...prev, currentSession: session };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return session;
  }, []);

  const completeSession = useCallback(() => {
    setState((prev) => {
      if (!prev.currentSession) return prev;
      const today = new Date().toISOString().split('T')[0];
      const existingIdx = prev.stats.findIndex((s) => s.date === today);
      const newStats = [...prev.stats];
      if (existingIdx >= 0) {
        newStats[existingIdx] = {
          ...newStats[existingIdx],
          focusMinutes: newStats[existingIdx].focusMinutes + prev.currentSession.durationMinutes,
          sessionsCompleted: newStats[existingIdx].sessionsCompleted + 1,
        };
      } else {
        newStats.push({
          date: today,
          focusMinutes: prev.currentSession.durationMinutes,
          blockedAttempts: 0,
          sessionsCompleted: 1,
        });
      }
      const next = {
        ...prev,
        sessions: [...prev.sessions, { ...prev.currentSession, completed: true }],
        currentSession: null,
        stats: newStats,
        focusStreak: prev.focusStreak + 1,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const cancelSession = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, currentSession: null };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleRule = useCallback((id: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        blockRules: prev.blockRules.map((r) =>
          r.id === id ? { ...r, isActive: !r.isActive } : r
        ),
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    state,
    loaded,
    toggleApp,
    toggleBlocking,
    addApp,
    removeApp,
    startSession,
    completeSession,
    cancelSession,
    toggleRule,
  };
}
