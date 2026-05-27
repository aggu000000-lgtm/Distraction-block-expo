import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TrackedApp, BlockRule, FocusSession,
  UsageEvent, DayReport, Achievement,
  SessionModeId,
} from '../types/domain';
import { evaluateBlock, BlockDecision } from '../core/blocking/engine';
import { aggregateDay } from '../core/analytics/aggregator';

// ─── Seed data ───────────────────────────────────────────

const DEFAULT_APPS: TrackedApp[] = [
  { id: 'instagram', name: 'Instagram',   icon: '📸', category: 'Social',   isBlocked: true  },
  { id: 'tiktok',    name: 'TikTok',      icon: '🎵', category: 'Social',   isBlocked: true  },
  { id: 'twitter',   name: 'Twitter / X', icon: '𝕏',  category: 'Social',   isBlocked: true  },
  { id: 'youtube',   name: 'YouTube',     icon: '▶️', category: 'Video',    isBlocked: false },
  { id: 'reddit',    name: 'Reddit',      icon: '🤖', category: 'Social',   isBlocked: false },
  { id: 'facebook',  name: 'Facebook',    icon: '📘', category: 'Social',   isBlocked: false },
  { id: 'netflix',   name: 'Netflix',     icon: '🎬', category: 'Video',    isBlocked: false },
  { id: 'snapchat',  name: 'Snapchat',    icon: '👻', category: 'Social',   isBlocked: false },
  { id: 'discord',   name: 'Discord',     icon: '💬', category: 'Chat',     isBlocked: false },
  { id: 'whatsapp',  name: 'WhatsApp',    icon: '📱', category: 'Chat',     isBlocked: false },
  { id: 'twitch',    name: 'Twitch',      icon: '🎮', category: 'Gaming',   isBlocked: false },
  { id: 'linkedin',  name: 'LinkedIn',    icon: '💼', category: 'Social',   isBlocked: false },
  { id: 'amazon',    name: 'Amazon',      icon: '📦', category: 'Shopping', isBlocked: false },
  { id: 'telegram',  name: 'Telegram',    icon: '✈️', category: 'Chat',     isBlocked: false },
  { id: 'news',      name: 'News Apps',   icon: '📰', category: 'News',     isBlocked: false },
  { id: 'pinterest', name: 'Pinterest',   icon: '📌', category: 'Social',   isBlocked: false },
];

const DEFAULT_RULES: BlockRule[] = [
  {
    id: 'r-deep-work',
    name: 'Deep Work Hours',
    emoji: '🧠',
    appIds: ['instagram', 'tiktok', 'twitter', 'reddit'],
    condition: { type: 'schedule', days: [1, 2, 3, 4, 5], from: '09:00', to: '17:00' },
    friction: 'medium',
    isActive: true,
    createdAt: Date.now(),
  },
  {
    id: 'r-session',
    name: 'During Sessions',
    emoji: '🔒',
    appIds: ['instagram', 'tiktok', 'twitter', 'youtube', 'reddit', 'netflix', 'twitch'],
    condition: { type: 'session' },
    friction: 'locked',
    isActive: true,
    createdAt: Date.now(),
  },
];

const now = Date.now();
const DAY = 86_400_000;

const SEED_SESSIONS: FocusSession[] = [
  { id: 's1', modeId: 'pomodoro', plannedMinutes: 25, startedAt: now-DAY*6, endedAt: now-DAY*6+25*60000, outcome: 'completed', intention: 'Read chapter 4',        interruptionCount: 2, reflectionScore: 4 },
  { id: 's2', modeId: 'flow',     plannedMinutes: 90, startedAt: now-DAY*5, endedAt: now-DAY*5+90*60000, outcome: 'completed', intention: 'Build login flow',      interruptionCount: 0, reflectionScore: 5 },
  { id: 's3', modeId: 'sprint',   plannedMinutes: 15, startedAt: now-DAY*4, endedAt: now-DAY*4+15*60000, outcome: 'completed', intention: 'Reply emails',          interruptionCount: 1, reflectionScore: 3 },
  { id: 's4', modeId: 'pomodoro', plannedMinutes: 25, startedAt: now-DAY*4+7200000, endedAt: now-DAY*4+7200000+12*60000, outcome: 'abandoned', intention: 'Design mockups', interruptionCount: 5, reflectionScore: null },
  { id: 's5', modeId: 'flow',     plannedMinutes: 90, startedAt: now-DAY*3, endedAt: now-DAY*3+90*60000, outcome: 'completed', intention: 'Architecture doc',     interruptionCount: 1, reflectionScore: 5 },
  { id: 's6', modeId: 'pomodoro', plannedMinutes: 25, startedAt: now-DAY*2, endedAt: now-DAY*2+25*60000, outcome: 'completed', intention: 'Unit tests',            interruptionCount: 0, reflectionScore: 4 },
  { id: 's7', modeId: 'pomodoro', plannedMinutes: 25, startedAt: now-DAY*2+3600000, endedAt: now-DAY*2+3600000+25*60000, outcome: 'completed', intention: 'Unit tests cont.', interruptionCount: 2, reflectionScore: 4 },
  { id: 's8', modeId: 'custom',   plannedMinutes: 45, startedAt: now-DAY*1, endedAt: now-DAY*1+45*60000, outcome: 'completed', intention: 'Zustand deep dive',    interruptionCount: 0, reflectionScore: 5 },
];

const SEED_EVENTS: UsageEvent[] = [
  { id: 'e1',  appId: 'instagram', timestamp: now-DAY*6,        type: 'open_blocked',       sessionId: null },
  { id: 'e2',  appId: 'tiktok',    timestamp: now-DAY*6+3600000,type: 'open_blocked',       sessionId: null },
  { id: 'e3',  appId: 'instagram', timestamp: now-DAY*5,        type: 'open_blocked',       sessionId: 's2' },
  { id: 'e4',  appId: 'twitter',   timestamp: now-DAY*5+1800000,type: 'friction_bypassed',  sessionId: null },
  { id: 'e5',  appId: 'instagram', timestamp: now-DAY*4,        type: 'open_blocked',       sessionId: null },
  { id: 'e6',  appId: 'tiktok',    timestamp: now-DAY*4+3600000,type: 'open_blocked',       sessionId: null },
  { id: 'e7',  appId: 'reddit',    timestamp: now-DAY*3,        type: 'open_blocked',       sessionId: 's5' },
  { id: 'e8',  appId: 'instagram', timestamp: now-DAY*2,        type: 'open_blocked',       sessionId: 's6' },
  { id: 'e9',  appId: 'instagram', timestamp: now-DAY*1,        type: 'open_blocked',       sessionId: null },
  { id: 'e10', appId: 'tiktok',    timestamp: now-DAY*1+1800000,type: 'open_blocked',       sessionId: null },
  { id: 'e11', appId: 'twitter',   timestamp: now-DAY*1+3600000,type: 'open_blocked',       sessionId: null },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', label: 'First Brick',    description: 'Complete your first session.',   emoji: '🧱', unlockedAt: now-DAY*6 },
  { id: 'streak_7',      label: 'Committed',      description: '7-day focus streak.',            emoji: '🔥', unlockedAt: null },
  { id: 'streak_30',     label: 'Month of Focus', description: '30-day streak.',                 emoji: '📅', unlockedAt: null },
  { id: 'hours_10',      label: '10 Hours',       description: '10 total hours of focus.',       emoji: '⏱️',unlockedAt: now-DAY*3 },
  { id: 'ironwall',      label: 'Ironwall',       description: 'Zero bypasses for a full week.', emoji: '🛡️',unlockedAt: null },
  { id: 'flow_master',   label: 'Flow Master',    description: 'Complete 10 Flow sessions.',     emoji: '🌊', unlockedAt: null },
  { id: 'hours_100',     label: '100 Hours',      description: '100 total focus hours.',         emoji: '💯', unlockedAt: null },
  { id: 'streak_100',    label: 'The Long Game',  description: '100-day streak.',                emoji: '🏆', unlockedAt: null },
];

function buildReports(sessions: FocusSession[], events: UsageEvent[], streak: number): DayReport[] {
  const reports: DayReport[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY);
    const date = d.toISOString().split('T')[0];
    reports.push(aggregateDay(date, sessions, events, Math.max(streak - i, 0)));
  }
  return reports;
}

// ─── Store ───────────────────────────────────────────────

type AppStore = {
  hasOnboarded: boolean;
  apps: TrackedApp[];
  rules: BlockRule[];
  sessions: FocusSession[];
  events: UsageEvent[];
  reports: DayReport[];
  achievements: Achievement[];
  streak: number;
  focusGoalMinutes: number;
  isShieldActive: boolean;
  activeSession: FocusSession | null;
  frictionModalApp: string | null;
  frictionDecision: BlockDecision | null;

  completeOnboarding: () => void;
  toggleApp: (id: string) => void;
  addApp: (app: Omit<TrackedApp, 'id'>) => void;
  removeApp: (id: string) => void;
  toggleRule: (id: string) => void;
  toggleShield: () => void;
  startSession: (modeId: SessionModeId, minutes: number, intention: string) => void;
  completeSession: (score: number) => void;
  abandonSession: () => void;
  checkBlock: (appId: string) => void;
  dismissFriction: (bypassed: boolean) => void;
  rebuildReports: () => void;
};

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      apps: DEFAULT_APPS,
      rules: DEFAULT_RULES,
      sessions: SEED_SESSIONS,
      events: SEED_EVENTS,
      reports: buildReports(SEED_SESSIONS, SEED_EVENTS, 5),
      achievements: ACHIEVEMENTS,
      streak: 5,
      focusGoalMinutes: 60,
      isShieldActive: true,
      activeSession: null,
      frictionModalApp: null,
      frictionDecision: null,

      completeOnboarding: () => set({ hasOnboarded: true }),

      toggleApp: (id) =>
        set((s) => ({ apps: s.apps.map((a) => a.id === id ? { ...a, isBlocked: !a.isBlocked } : a) })),

      addApp: (app) =>
        set((s) => ({ apps: [...s.apps, { ...app, id: `app-${Date.now()}` }] })),

      removeApp: (id) =>
        set((s) => ({ apps: s.apps.filter((a) => a.id !== id) })),

      toggleRule: (id) =>
        set((s) => ({ rules: s.rules.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r) })),

      toggleShield: () => set((s) => ({ isShieldActive: !s.isShieldActive })),

      startSession: (modeId, minutes, intention) => {
        const session: FocusSession = {
          id: `s-${Date.now()}`,
          modeId, plannedMinutes: minutes,
          startedAt: Date.now(), endedAt: null,
          outcome: 'ongoing', intention,
          interruptionCount: 0, reflectionScore: null,
        };
        set({ activeSession: session });
      },

      completeSession: (score) => {
        const { activeSession, sessions, streak } = get();
        if (!activeSession) return;
        const completed: FocusSession = {
          ...activeSession, endedAt: Date.now(),
          outcome: 'completed', reflectionScore: score,
        };
        const newSessions = [...sessions, completed];
        const newStreak = streak + 1;
        set({ activeSession: null, sessions: newSessions, streak: newStreak });
        get().rebuildReports();
      },

      abandonSession: () => {
        const { activeSession, sessions } = get();
        if (!activeSession) return;
        const abandoned: FocusSession = {
          ...activeSession, endedAt: Date.now(), outcome: 'abandoned',
        };
        set({ activeSession: null, sessions: [...sessions, abandoned] });
        get().rebuildReports();
      },

      checkBlock: (appId) => {
        const { rules, isShieldActive, activeSession } = get();
        if (!isShieldActive) return;
        const decision = evaluateBlock(appId, rules, !!activeSession);
        if (decision.blocked) {
          const event: UsageEvent = {
            id: `ev-${Date.now()}`, appId,
            timestamp: Date.now(), type: 'open_blocked',
            sessionId: activeSession?.id ?? null,
          };
          set((s) => ({
            frictionModalApp: appId,
            frictionDecision: decision,
            events: [...s.events, event],
          }));
        }
      },

      dismissFriction: (bypassed) => {
        const { frictionModalApp, activeSession } = get();
        if (bypassed && frictionModalApp) {
          const event: UsageEvent = {
            id: `ev-${Date.now()}`, appId: frictionModalApp,
            timestamp: Date.now(), type: 'friction_bypassed',
            sessionId: activeSession?.id ?? null,
          };
          set((s) => ({ events: [...s.events, event] }));
        }
        set({ frictionModalApp: null, frictionDecision: null });
      },

      rebuildReports: () => {
        const { sessions, events, streak } = get();
        set({ reports: buildReports(sessions, events, streak) });
      },
    }),
    {
      name: 'focusguard-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        apps: s.apps,
        rules: s.rules,
        sessions: s.sessions,
        events: s.events,
        reports: s.reports,
        achievements: s.achievements,
        streak: s.streak,
        focusGoalMinutes: s.focusGoalMinutes,
        isShieldActive: s.isShieldActive,
      }),
    },
  ),
);
