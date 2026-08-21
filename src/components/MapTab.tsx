import * as React from 'react';
import type { Habit } from '../types';
import { verifiedLogCount } from '../habitUtils';
import { LOCAL_PLACES } from '../joco';

const CATEGORY_ORDER = [
  'Trail', 'Greenway', 'Park', 'Nature', 'Historic',
  'Library', 'Museum', 'Community', 'Service', 'Recycling', 'Market',
];

const CATEGORY_ICONS: Record<string, string> = {
  Trail: '🥾',
  Greenway: '🚶',
  Park: '🌳',
  Nature: '🌲',
  Historic: '🏛️',
  Library: '📚',
  Museum: '🎨',
  Community: '🤝',
  Service: '❤️',
  Recycling: '♻️',
  Market: '🥕',
};

interface Props {
  habits: Habit[];
  onFocusLocation: (lat: number, lng: number) => void;
}

export default function MapTab({ habits, onFocusLocation }: Props) {
  const habitsWithLocations = habits.filter(h => h.location && !h.isPrivate);
  const [showExplore, setShowExplore] = React.useState(false);
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(new Set());

  const grouped = React.useMemo(() => {
    const map: Record<string, typeof LOCAL_PLACES> = {};
    for (const p of LOCAL_PLACES) {
      if (!map[p.type]) map[p.type] = [];
      map[p.type].push(p);
    }
    return map;
  }, []);

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  return (
    <div className="tab-panel">
      <p className="tab-intro">See all your goals on one map. Tap a card to fly there.</p>

      <div className="joco-landmarks-section">
        <button
          className={`joco-explore-toggle ${showExplore ? 'open' : ''}`}
          onClick={() => setShowExplore(s => !s)}
        >
          <span className="joco-explore-title">🗺️ Explore Johnston County</span>
          <span className="joco-explore-subtitle">Local places where habits happen — from Smithfield to Clayton to Selma and beyond.</span>
          <span className="joco-explore-chevron">{showExplore ? '▲' : '▼'}</span>
        </button>

        {showExplore && (
          <div className="joco-explore-body">
            <p className="joco-explore-hint">Tap a category to see places.</p>
            {sortedCategories.map(cat => {
              const places = grouped[cat];
              const isOpen = openCategories.has(cat);
              return (
                <div key={cat} className="joco-category-block">
                  <button
                    className={`joco-category-header ${isOpen ? 'open' : ''}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    <span className="joco-category-icon">{CATEGORY_ICONS[cat] ?? '📍'}</span>
                    <span className="joco-category-name">{cat === 'Trail' ? 'Trails' : cat === 'Greenway' ? 'Greenways' : cat + 's'}</span>
                    <span className="joco-category-count">{places.length}</span>
                    <span className="joco-category-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="joco-landmarks-grid">
                      {places.map(p => (
                        <a key={p.name} className="joco-landmark-card" href={p.url} target="_blank" rel="noopener noreferrer">
                          <span className="joco-landmark-name">{p.name}</span>
                          <p className="joco-landmark-blurb">{p.blurb}</p>
                          <span className="joco-landmark-link">Visit website →</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="map-cards">
        {habitsWithLocations.map(h => {
          const pct = Math.min(100, (verifiedLogCount(h) / h.goalCount) * 100);
          return (
            <button key={h.id} className="map-card" onClick={() => onFocusLocation(h.location!.lat, h.location!.lng)}>
              <div className="map-card-emoji">📍</div>
              <div className="map-card-body">
                <h4>{h.name}</h4>
                <p>{h.location!.name}</p>
                <div className="map-card-progress">
                  <div className="progress-track thin">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span>{verifiedLogCount(h)}/{h.goalCount}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
