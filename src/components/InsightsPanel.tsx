import * as React from 'react';
import type { Habit } from '../types';
import { verifiedLogs, verifiedLogCount, calcStreak } from '../habitUtils';

interface Props {
  habits: Habit[];
  level: number;
}

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' })[0];
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00').getDay();
  return d === 0 || d === 6;
}

export default function InsightsPanel({ habits, level }: Props) {

  const allLogs = habits.flatMap(h => verifiedLogs(h));
  const totalLogs = allLogs.length;
  const totalGoals = habits.reduce((s, h) => s + verifiedLogCount(h), 0);
  const completedGoals = habits.filter(h => verifiedLogCount(h) >= h.goalCount).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, calcStreak(h)), 0);

  // Heatmap data: last 12 weeks (84 days)
  const heatmapDays = getLastNDays(84);
  const logCountByDate = new Map<string, number>();
  for (const log of allLogs) {
    logCountByDate.set(log.date, (logCountByDate.get(log.date) || 0) + 1);
  }

  // Weekly bars: last 8 weeks
  const weeklyData: { weekLabel: string; count: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(Date.now() - w * 7 * 86400000);
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const dayStr = new Date(weekStart.getTime() + d * 86400000).toISOString().slice(0, 10);
      count += logCountByDate.get(dayStr) || 0;
    }
    weeklyData.push({
      weekLabel: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    });
  }
  const maxWeekly = Math.max(1, ...weeklyData.map(w => w.count));

  // Top goals by activity
  const topHabits = [...habits]
    .map(h => ({ name: h.name, count: verifiedLogCount(h), goalCount: h.goalCount }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Activity level labels for heatmap
  function heatLevel(count: number): number {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  }

  const heatColors = [
    'rgba(100,150,220,0.12)',
    'rgba(59,130,246,0.35)',
    'rgba(59,130,246,0.55)',
    'rgba(59,165,89,0.7)',
    'rgba(59,165,89,0.95)',
  ];

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>📊 Your Progress Insights</h3>
      </div>

      <div className="insights-stats-row">
        <div className="insight-stat-card">
          <span className="insight-stat-num">{totalLogs}</span>
          <span className="insight-stat-label">total logs</span>
        </div>
        <div className="insight-stat-card">
          <span className="insight-stat-num">{completedGoals}</span>
          <span className="insight-stat-label">goals completed</span>
        </div>
        <div className="insight-stat-card">
          <span className="insight-stat-num">{bestStreak}</span>
          <span className="insight-stat-label">best streak (days)</span>
        </div>
        <div className="insight-stat-card">
          <span className="insight-stat-num">Lv {level}</span>
          <span className="insight-stat-label">current level</span>
        </div>
      </div>

      {totalLogs === 0 ? (
        <p className="empty-state">No verified logs yet. Log a goal to start seeing your insights here!</p>
      ) : (
        <>
          {/* Heatmap */}
          <div className="insights-section">
            <h4 className="insights-section-title">Activity heatmap — last 12 weeks</h4>
            <p className="insights-section-sub">Each square is a day. Greener = more goals logged.</p>
            <div className="heatmap-grid">
              {heatmapDays.map((day, i) => {
                const count = logCountByDate.get(day) || 0;
                const level = heatLevel(count);
                return (
                  <div
                    key={i}
                    className={`heatmap-cell ${isWeekend(day) ? 'weekend' : ''}`}
                    style={{ background: heatColors[level] }}
                    title={`${day}: ${count} log${count === 1 ? '' : 's'}`}
                  />
                );
              })}
            </div>
            <div className="heatmap-legend">
              <span className="heatmap-legend-label">Less</span>
              {heatColors.map((c, i) => (
                <div key={i} className="heatmap-cell" style={{ background: c }} />
              ))}
              <span className="heatmap-legend-label">More</span>
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className="insights-section">
            <h4 className="insights-section-title">Weekly activity — last 8 weeks</h4>
            <div className="weekly-chart">
              {weeklyData.map((w, i) => (
                <div key={i} className="weekly-bar-col">
                  <div className="weekly-bar-track">
                    <div
                      className="weekly-bar-fill"
                      style={{ height: `${(w.count / maxWeekly) * 100}%` }}
                      title={`${w.count} logs`}
                    />
                    {w.count > 0 && <span className="weekly-bar-count">{w.count}</span>}
                  </div>
                  <span className="weekly-bar-label">{w.weekLabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top goals */}
          {topHabits.length > 0 && topHabits[0].count > 0 && (
            <div className="insights-section">
              <h4 className="insights-section-title">Top goals by activity</h4>
              <div className="top-goals-list">
                {topHabits.filter(h => h.count > 0).map((h, i) => (
                  <div key={i} className="top-goal-row">
                    <span className="top-goal-rank">#{i + 1}</span>
                    <span className="top-goal-name">{h.name}</span>
                    <div className="top-goal-progress">
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(100, (h.count / h.goalCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="top-goal-count">{h.count}/{h.goalCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
