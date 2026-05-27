import { DayReport, FocusSession, UsageEvent } from '../../types/domain';

export function aggregateDay(
  date: string,
  sessions: FocusSession[],
  events: UsageEvent[],
  streak: number,
): DayReport {
  const dayStart = new Date(date).setHours(0, 0, 0, 0);
  const dayEnd = dayStart + 86_400_000;

  const daySessions = sessions.filter(
    (s) => s.startedAt >= dayStart && s.startedAt < dayEnd,
  );
  const dayEvents = events.filter(
    (e) => e.timestamp >= dayStart && e.timestamp < dayEnd,
  );

  const focusMinutes = daySessions
    .filter((s) => s.outcome === 'completed')
    .reduce((sum, s) => sum + s.plannedMinutes, 0);

  return {
    date,
    focusMinutes,
    sessionsCompleted: daySessions.filter((s) => s.outcome === 'completed').length,
    sessionsAbandoned: daySessions.filter((s) => s.outcome === 'abandoned').length,
    openAttempts:      dayEvents.filter((e) => e.type === 'open_attempt').length,
    openBlocked:       dayEvents.filter((e) => e.type === 'open_blocked').length,
    frictionBypassed:  dayEvents.filter((e) => e.type === 'friction_bypassed').length,
    streak,
  };
}

export function generateInsights(reports: DayReport[]): string[] {
  const insights: string[] = [];
  if (reports.length < 2) return insights;

  const total = reports.reduce((s, r) => s + r.focusMinutes, 0);
  const avg = Math.round(total / reports.length);
  const best = reports.reduce((a, b) => (a.focusMinutes > b.focusMinutes ? a : b));
  const totalBlocked = reports.reduce((s, r) => s + r.openBlocked, 0);
  const totalBypassed = reports.reduce((s, r) => s + r.frictionBypassed, 0);
  const bypassRate = totalBlocked > 0
    ? Math.round((totalBypassed / totalBlocked) * 100)
    : 0;
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const bestDay = days[new Date(best.date).getDay()];

  if (avg > 0) insights.push(`You average ${avg} minutes of focus per day this week.`);
  if (best.focusMinutes > 0) insights.push(`Your best day was ${bestDay} with ${best.focusMinutes} minutes.`);
  if (totalBlocked > 0) insights.push(`FocusGuard blocked ${totalBlocked} distraction attempts this week.`);
  if (bypassRate === 0 && totalBlocked > 0) insights.push(`Zero bypasses this week. Complete self-discipline.`);
  else if (bypassRate > 0 && bypassRate < 20) insights.push(`You bypassed only ${bypassRate}% of friction moments. Solid.`);
  else if (bypassRate >= 20) insights.push(`You bypassed ${bypassRate}% of friction this week. Notice the pattern?`);

  return insights;
}
