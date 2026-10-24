import * as React from 'react';
import type { Badge, Habit } from '../types';
import { calcStreak, goalHits, topicsUsed, totalGoalHits, verifiedLogCount } from '../habitUtils';
import { getBadgeReward } from '../rewards';
import { CORE_VALUES } from '../joco';

const BADGE_EMOJIS = ['🌾','🏆','🔥','🎯','⭐','🌟','🎖️','🏅','🐝','🌳','📚','♻️','🚶','💧','🧹','🎨','💎','🦋','🌻','🌈','🌊','🗺️','🥾','🤝'];
const TIER_INFO: Record<Badge['tier'], { label: string; color: string; glow: string }> = {
  bronze: { label: 'Bronze', color: '#cd7f32', glow: 'rgba(205,127,50,0.3)' },
  silver: { label: 'Silver', color: '#c0c0c0', glow: 'rgba(192,192,192,0.3)' },
  gold: { label: 'Gold', color: '#ffd700', glow: 'rgba(255,215,0,0.3)' },
  platinum: { label: 'Platinum', color: '#e5e4e2', glow: 'rgba(229,228,226,0.4)' },
};
const TIER_ORDER: Badge['tier'][] = ['platinum', 'gold', 'silver', 'bronze'];

interface Props {
  badges: Badge[];
  habits: Habit[];
  level: number;
  onAddBadge: (name: string, emoji: string, description: string) => void;
  onDeleteBadge: (id: string) => void;
  onRewardEarned?: (badgeName: string, rewardTitle: string) => void;
}

export default function BadgesTab({ badges, habits, level, onAddBadge, onDeleteBadge, onRewardEarned }: Props) {
  const prevEarnedRef = React.useRef<Set<string>>(new Set());
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('🎖️');
  const [desc, setDesc] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'earned' | 'locked'>('all');
  const [showCreate, setShowCreate] = React.useState(false);
  const [view, setView] = React.useState<'grid' | 'map'>('grid');
  const [highlightId, setHighlightId] = React.useState<string | null>(null);
  const [selectedMapBadge, setSelectedMapBadge] = React.useState<Badge | null>(null);
  const prevBadgeCount = React.useRef(badges.length);

  const earnedSet = React.useMemo(() => {
    const earned = new Set<string>();
    const allStreaks = habits.map(calcStreak);
    const maxStreak = Math.max(0, ...allStreaks);
    const totalHits = totalGoalHits(habits);
    const totalLogs = habits.reduce((s, h) => s + verifiedLogCount(h), 0);
    const topicCount = topicsUsed(habits);

    habits.forEach(h => {
      const streak = calcStreak(h);
      const hits = goalHits(h);
      const name = h.name.toLowerCase();
      if (name.includes('recyc') && streak >= 7) earned.add('b1');
      if ((name.includes('eco') || name.includes('green') || name.includes('compost') || name.includes('recyc')) && hits >= 20) earned.add('b2');
      if ((name.includes('eco') || name.includes('green') || name.includes('compost') || name.includes('recyc')) && totalLogs >= 14) earned.add('b3');
      if (name.includes('read') && streak >= 5) earned.add('b4');
      if (name.includes('read') && hits >= 15) earned.add('b5');
      if ((name.includes('chore') || name.includes('clean')) && streak >= 7) earned.add('b6');
      if ((name.includes('chore') || name.includes('clean')) && hits >= 10) earned.add('b7');
      if ((name.includes('walk') || name.includes('step') || name.includes('hike')) && hits >= 10) earned.add('b8');
      if ((name.includes('walk') || name.includes('step') || name.includes('hike')) && hits >= 30) earned.add('b9');
      if ((name.includes('walk') || name.includes('step')) && streak >= 5) earned.add('b10');
      if ((name.includes('water') || name.includes('hydrat')) && streak >= 10) earned.add('b11');
      if ((name.includes('volunteer') || name.includes('community') || name.includes('service') || name.includes('help')) && hits >= 5) earned.add('b12');
    });
    if (level >= 5) earned.add('b13');
    if (maxStreak >= 3) earned.add('b14');
    if (totalHits >= 25) earned.add('b15');
    if (topicCount >= 3) earned.add('b16');
    return earned;
  }, [habits, level]);

  // Detect newly added badge and highlight it
  React.useEffect(() => {
    if (badges.length > prevBadgeCount.current) {
      const newest = badges
        .filter(b => b.custom)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];
      if (newest) {
        setHighlightId(newest.id);
        setView('grid');
        setTimeout(() => setHighlightId(null), 5000);
      }
    }
    prevBadgeCount.current = badges.length;
  }, [badges]);

  // Detect newly earned standard badges (via habit progress) and fire reward
  React.useEffect(() => {
    const currentEarned = new Set<string>();
    badges.forEach(b => {
      if (earnedSet.has(b.id)) currentEarned.add(b.id);
    });
    if (prevEarnedRef.current.size > 0) {
      currentEarned.forEach(id => {
        if (!prevEarnedRef.current.has(id)) {
          const badge = badges.find(b => b.id === id);
          if (badge && onRewardEarned) {
            const reward = getBadgeReward(badge);
            onRewardEarned(badge.name, reward.title);
          }
        }
      });
    }
    prevEarnedRef.current = currentEarned;
  }, [earnedSet, badges, onRewardEarned]);

  const isEarned = (b: Badge) => earnedSet.has(b.id);
  const earnedCount = badges.filter(isEarned).length;

  const matchesSearch = (b: Badge) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase());

  let filtered = badges.filter(matchesSearch);
  if (filter === 'earned') filtered = filtered.filter(isEarned);
  if (filter === 'locked') filtered = filtered.filter(b => !isEarned(b));

  const tierOrderMap = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
  filtered.sort((a, b) => {
    const ae = isEarned(a), be = isEarned(b);
    if (ae !== be) return ae ? -1 : 1;
    return tierOrderMap[a.tier] - tierOrderMap[b.tier];
  });

  // Group badges by tier for map view
  const byTier = TIER_ORDER.map(tier => ({
    tier,
    items: badges.filter(b => b.tier === tier),
  })).filter(g => g.items.length > 0);

  const handleCreate = () => {
    onAddBadge(name.trim(), emoji, desc.trim());
    setName(''); setDesc(''); setShowCreate(false);
  };

  const findBadgeInGrid = (id: string) => {
    setView('grid');
    setHighlightId(id);
    setTimeout(() => {
      const el = document.querySelector(`[data-badge-id="${id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    setTimeout(() => setHighlightId(null), 5000);
  };

  return (
    <div className="tab-panel">
      <div className="badge-hero">
        <div className="badge-hero-circle">
          <span className="badge-hero-num">{earnedCount}</span>
          <span className="badge-hero-label">earned</span>
        </div>
        <div className="badge-hero-text">
          <h2>JoCo District 13 Badges</h2>
          <p>{earnedCount} of {badges.length} badges unlocked. Keep logging goals to earn them all!</p>
        </div>
      </div>

      <div className="joco-values-strip">
        {CORE_VALUES.map(v => (
          <div key={v.title} className="joco-value-chip">
            <span className="joco-value-chip-icon">{v.icon}</span>
            <span className="joco-value-chip-title">{v.title}</span>
          </div>
        ))}
      </div>

      <div className="badge-toolbar">
        <div className="view-toggle">
          <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <span className="view-icon">▦</span> Grid
          </button>
          <button className={`view-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
            <span className="view-icon">🗺️</span> Map
          </button>
        </div>
      </div>

      <div className="badge-filters">
        <input
          className="text-input search-input"
          placeholder="Search badges by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-pills">
          {(['all','earned','locked'] as const).map(f => (
            <button
              key={f}
              className={`filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f === 'all' ? `All (${badges.length})` : f === 'earned' ? `Earned (${earnedCount})` : `Locked (${badges.length - earnedCount})`}</button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="badge-grid">
          {filtered.map(b => {
            const earned = isEarned(b);
            const tier = TIER_INFO[b.tier];
            const highlighted = highlightId === b.id;
            return (
              <div
                key={b.id}
                data-badge-id={b.id}
                className={`badge-card ${earned ? 'earned' : 'locked'} ${highlighted ? 'highlighted' : ''}`}
                style={earned ? { borderColor: tier.color, boxShadow: `0 0 12px ${tier.glow}` } : undefined}
              >
                <div className="badge-emoji" style={earned ? { background: `${tier.color}22` } : undefined}>{b.emoji}</div>
                <div className="badge-body">
                  <h4>{b.name}{b.custom && <span className="custom-star"> ★</span>}</h4>
                  <p>{b.description}</p>
                  <div className="badge-footer">
                    <span className="tier-tag" style={{ color: earned ? tier.color : undefined, borderColor: earned ? tier.color : undefined }}>
                      {tier.label}
                    </span>
                    <span className={`badge-status ${earned ? 'earned' : ''}`}>
                      {earned ? '✓ Earned' : 'Locked'}
                    </span>
                  </div>
                  {earned && (() => {
                    const reward = getBadgeReward(b);
                    return (
                      <div className="badge-reward" style={{ borderColor: `${tier.color}55` }}>
                        <span className="reward-icon">{reward.icon}</span>
                        <div className="reward-text">
                          <span className="reward-label">Reward unlocked</span>
                          <span className="reward-title">{reward.title}</span>
                          <span className="reward-desc">{reward.description}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                {b.custom && (
                  <button className="link-danger badge-delete" onClick={() => onDeleteBadge(b.id)}>×</button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="badge-map">
          {byTier.map(({ tier, items }) => {
            const info = TIER_INFO[tier];
            const tierEarned = items.filter(isEarned).length;
            return (
              <div key={tier} className="map-tier-row">
                <div className="map-tier-label" style={{ color: info.color }}>
                  <span className="map-tier-name">{info.label}</span>
                  <span className="map-tier-count">{tierEarned}/{items.length}</span>
                </div>
                <div className="map-tier-track">
                  {items.map((b, i) => {
                    const earned = isEarned(b);
                    const highlighted = highlightId === b.id;
                    const selected = selectedMapBadge?.id === b.id;
                    const dimmed = search && !matchesSearch(b);
                    return (
                      <div key={b.id} className="map-node-wrap">
                        {i > 0 && <div className={`map-connector ${earned ? 'lit' : ''}`} style={earned ? { background: info.color } : undefined} />}
                        <button
                          className={`map-node ${earned ? 'earned' : 'locked'} ${highlighted ? 'highlighted' : ''} ${selected ? 'selected' : ''} ${dimmed ? 'dimmed' : ''}`}
                          style={earned ? { borderColor: info.color, boxShadow: `0 0 14px ${info.glow}` } : undefined}
                          onClick={() => setSelectedMapBadge(selected ? null : b)}
                          title={b.name}
                        >
                          <span className="map-node-emoji">{b.emoji}</span>
                          {b.custom && <span className="map-custom-dot" />}
                          {highlighted && <span className="map-pulse" style={{ borderColor: info.color }} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {selectedMapBadge && (
            <div className="map-detail">
              <div className="map-detail-emoji">{selectedMapBadge.emoji}</div>
              <div className="map-detail-body">
                <h4>
                  {selectedMapBadge.name}
                  {selectedMapBadge.custom && <span className="custom-star"> ★ Custom</span>}
                </h4>
                <p>{selectedMapBadge.description}</p>
                {isEarned(selectedMapBadge) && (() => {
                  const reward = getBadgeReward(selectedMapBadge);
                  return (
                    <div className="badge-reward" style={{ borderColor: `${TIER_INFO[selectedMapBadge.tier].color}55`, marginTop: '0.6rem' }}>
                      <span className="reward-icon">{reward.icon}</span>
                      <div className="reward-text">
                        <span className="reward-label">Reward unlocked</span>
                        <span className="reward-title">{reward.title}</span>
                        <span className="reward-desc">{reward.description}</span>
                      </div>
                    </div>
                  );
                })()}
                <div className="map-detail-footer">
                  <span className="tier-tag" style={{ color: TIER_INFO[selectedMapBadge.tier].color, borderColor: TIER_INFO[selectedMapBadge.tier].color }}>
                    {TIER_INFO[selectedMapBadge.tier].label}
                  </span>
                  <span className={`badge-status ${isEarned(selectedMapBadge) ? 'earned' : ''}`}>
                    {isEarned(selectedMapBadge) ? '✓ Earned' : 'Locked'}
                  </span>
                  <button className="link-action" onClick={() => findBadgeInGrid(selectedMapBadge.id)}>
                    Jump to badge in grid →
                  </button>
                  {selectedMapBadge.custom && (
                    <button className="link-danger" onClick={() => { onDeleteBadge(selectedMapBadge.id); setSelectedMapBadge(null); }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <button className="map-detail-close" onClick={() => setSelectedMapBadge(null)}>×</button>
            </div>
          )}

          <div className="map-legend">
            <span className="map-legend-item"><span className="map-legend-dot earned-dot" /> Earned</span>
            <span className="map-legend-item"><span className="map-legend-dot locked-dot" /> Locked</span>
            <span className="map-legend-item"><span className="map-legend-dot custom-dot" /> ★ Your custom badge</span>
            <span className="map-legend-item">Tap any badge for details</span>
          </div>
        </div>
      )}

      {filtered.length === 0 && view === 'grid' && (
        <p className="empty-state">No badges match your search.</p>
      )}

      <div className="add-block">
        <button className="toggle-add" onClick={() => setShowCreate(s => !s)}>
          {showCreate ? '− Cancel' : '+ Create a Custom Badge'}
        </button>
        {showCreate && (
          <div className="add-form">
            <h3>Design Your Own Badge</h3>
            <p className="tab-intro">Design a personal milestone badge. It starts locked — earn it by hitting the matching goal streaks!</p>
            <input
              className="text-input"
              placeholder="Badge name (e.g. Garden Master of Benson)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="text-input"
              placeholder="What did you do to earn it?"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <div className="picker-label">Pick an emoji</div>
            <div className="emoji-row">
              {BADGE_EMOJIS.map(e => (
                <button
                  key={e}
                  className={`emoji-pick ${emoji === e ? 'active' : ''}`}
                  onClick={() => setEmoji(e)}
                >{e}</button>
              ))}
            </div>
            <button
              className="btn-primary"
              disabled={!name.trim() || !desc.trim()}
              onClick={handleCreate}
            >Create Badge</button>
          </div>
        )}
      </div>
    </div>
  );
}
