import * as React from 'react';
import type { Habit } from '../types';

interface Props {
  habits: Habit[];
  onLogHabit: (id: string) => void;
  onFocusLocation: (lat: number, lng: number) => void;
}

export default function HabitsTab({ habits, onLogHabit, onFocusLocation }: Props) {
  return (
    <div className="tab-panel">
      <p className="tab-intro">Your active goals and progress. Tap the map icon to find where to go.</p>
      <div className="habit-list">
        {habits.map(h => (
          <div key={h.id} className="habit-card">
            <h4>{h.name}</h4>
            {h.location && <p className="habit-location">📍 {h.location.name}</p>}
            <div className="habit-quick-row">
              <span>{h.logs.length} / {h.goalCount}</span>
              <div className="habit-quick-actions">
                {h.location && <button className="icon-btn" onClick={() => onFocusLocation(h.location!.lat, h.location!.lng)}>🗺️</button>}
                <button className="btn-log" onClick={() => onLogHabit(h.id)}>+ Log</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
