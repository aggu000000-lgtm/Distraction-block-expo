export type AppCategory = 'Social' | 'Video' | 'Chat' | 'Gaming' | 'News' | 'Shopping' | 'Other';

export type TrackedApp = {
  id: string;
  name: string;
  icon: string;
  category: AppCategory;
  isBlocked: boolean;
};

export type FrictionLevel = 'soft' | 'medium' | 'hard' | 'locked';

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RuleCondition =
  | { type: 'always' }
  | { type: 'schedule'; days: Day[]; from: string; to: string }
  | { type: 'session' };

export type BlockRule = {
  id: string;
  name: string;
  emoji: string;
  appIds: string[];
  condition: RuleCondition;
  friction: FrictionLevel;
  isActive: boolean;
  createdAt: number;
};

export type SessionModeId = 'pomodoro' | 'flow' | 'sprint' | 'custom';

export type SessionMode = {
  id: SessionModeId;
  label: string;
  emoji: string;
  description: string;
  workMinutes: number;
  breakMinutes: number;
  color: string;
};

export type SessionOutcome = 'completed' | 'abandoned' | 'ongoing';

export type FocusSession = {
  id: string;
  modeId: SessionModeId;
  plannedMinutes: number;
  startedAt: number;
  endedAt: number | null;
  outcome: SessionOutcome;
  intention: string;
  interruptionCount: number;
  reflectionScore: number | null;
};

export type UsageEventType =
  | 'open_attempt'
  | 'open_allowed'
  | 'open_blocked'
  | 'friction_bypassed';

export type UsageEvent = {
  id: string;
  appId: string;
  timestamp: number;
  type: UsageEventType;
  sessionId: string | null;
};

export type DayReport = {
  date: string;
  focusMinutes: number;
  sessionsCompleted: number;
  sessionsAbandoned: number;
  openAttempts: number;
  openBlocked: number;
  frictionBypassed: number;
  streak: number;
};

export type Achievement = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  unlockedAt: number | null;
};
