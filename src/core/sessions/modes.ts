import { SessionMode } from '../../types/domain';
import { C } from '../../design/tokens';

export const SESSION_MODES: SessionMode[] = [
  {
    id: 'pomodoro',
    label: 'Pomodoro',
    emoji: '🍅',
    description: '25 min focus, 5 min break. Classic, proven, effective.',
    workMinutes: 25,
    breakMinutes: 5,
    color: C.alert,
  },
  {
    id: 'flow',
    label: 'Flow State',
    emoji: '🌊',
    description: '90 min deep work. No clock watching. Just presence.',
    workMinutes: 90,
    breakMinutes: 15,
    color: C.nebula,
  },
  {
    id: 'sprint',
    label: 'Sprint',
    emoji: '⚡',
    description: '15 min of pure intensity. One task, zero excuses.',
    workMinutes: 15,
    breakMinutes: 0,
    color: C.amber,
  },
  {
    id: 'custom',
    label: 'Custom',
    emoji: '🎯',
    description: 'You define it. Make it yours.',
    workMinutes: 45,
    breakMinutes: 10,
    color: C.pulse,
  },
];

export const getModeById = (id: string): SessionMode =>
  SESSION_MODES.find((m) => m.id === id) ?? SESSION_MODES[0];
