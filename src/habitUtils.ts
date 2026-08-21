import type { Habit, HabitLog } from './types';

export function verifiedLogs(habit: Habit): HabitLog[] {
  return habit.logs.filter(l => l.verified);
}

export function verifiedLogCount(habit: Habit): number {
  return verifiedLogs(habit).length;
}

export function logDates(habit: Habit): string[] {
  return verifiedLogs(habit).map(l => l.date).sort();
}

export function calcStreak(habit: Habit): number {
  const dates = logDates(habit);
  if (dates.length === 0) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dates[dates.length - 1] !== today && dates[dates.length - 1] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const prev = new Date(dates[i - 1] + 'T00:00:00');
    const curr = new Date(dates[i] + 'T00:00:00');
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function goalHits(habit: Habit): number {
  return verifiedLogCount(habit);
}

export function totalGoalHits(habits: Habit[]): number {
  return habits.reduce((s, h) => s + verifiedLogCount(h), 0);
}

export function totalVerifiedLogs(habits: Habit[]): number {
  return habits.reduce((s, h) => s + verifiedLogCount(h), 0);
}

export function topicsUsed(habits: Habit[]): number {
  return new Set(habits.map(h => h.name.toLowerCase())).size;
}

export function isLoggedToday(habit: Habit): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return habit.logs.some(l => l.date === today);
}

export function isVerifiedToday(habit: Habit): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return habit.logs.some(l => l.date === today && l.verified);
}
