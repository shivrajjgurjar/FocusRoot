import { FocusSession, UserStats, ChartDataPoint, SessionStatus, TimeRange } from '../types';

const STORAGE_KEY_SESSIONS = 'focus_forest_sessions';

export const saveSession = (session: FocusSession): void => {
  const existing = getSessions();
  const updated = [...existing, session];
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
};

export const getSessions = (): FocusSession[] => {
  const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
};

export const calculateStats = (): UserStats => {
  const sessions = getSessions();
  const completed = sessions.filter(s => s.status === SessionStatus.COMPLETED);
  const failed = sessions.filter(s => s.status === SessionStatus.FAILED);
  const totalMinutes = completed.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  return { totalMinutes, sessionsCompleted: completed.length, sessionsFailed: failed.length, treesGrown: completed.length };
};

export const getChartData = (sessions: FocusSession[], range: TimeRange): ChartDataPoint[] => {
  const activityMap: Record<string, number> = {};
  const completedSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED && s.endTime);

  if (range === 'WEEK' || range === 'MONTH') {
    const days = range === 'WEEK' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activityMap[d.toISOString().split('T')[0]] = 0;
    }
    completedSessions.forEach(session => {
      const dateStr = new Date(session.endTime!).toISOString().split('T')[0];
      if (activityMap[dateStr] !== undefined) activityMap[dateStr] += session.durationMinutes;
    });
    return Object.keys(activityMap).sort().map(date => ({ label: date, value: activityMap[date], fullDate: date }));
  } 
  
  if (range === 'LIFETIME') {
    const now = new Date();
    activityMap[`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`] = 0;
    completedSessions.forEach(session => {
      const d = new Date(session.endTime!);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      activityMap[key] = (activityMap[key] || 0) + session.durationMinutes;
    });
    return Object.keys(activityMap).sort().map(key => ({ label: key, value: activityMap[key], fullDate: key }));
  }
  return [];
};

