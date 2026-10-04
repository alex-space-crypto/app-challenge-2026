import * as React from 'react';
import type { Habit, Topic } from '../types';
import { calcStreak, verifiedLogCount, isVerifiedToday, isLoggedToday } from '../habitUtils';
import { getSuggestions, type HabitSuggestion } from '../suggestions';

interface Props {
  habits: Habit[];
  topics: Topic[];
  selectedTopic: string | null;
  onSelectTopic: (id: string) => void;
  onAddTopic: (name: string, icon: string, color: string) => void;
  onAddHabit: (name: string, desc: string, goalCount: number, lat: number, lng: number, locName: string, address: string, isPrivate: boolean) => void;
  onLogHabit: (id: string, verifiedBy: string, verifiedWhere: string, note: string, logDate: string, logTime: string) => void;
  onDeleteHabit: (id: string) => void;
  onTogglePrivate: (id: string) => void;
  onFocusLocation: (lat: number, lng: number) => void;
  profileName: string;
}

function formatTimestamp(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

const EMOJI_CHOICES = ['🌱','📚','🧹','🚶','💧','🍎','♻️','🥗','🧘','🌙','🦷','🐶','🧺','📝','🎵','🎨','💰','🌳','🐝','🤝','☀️','🧴','🍳'];

export default function TrackerTab({ habits, topics, selectedTopic, onSelectTopic, onAddTopic, onAddHabit, onLogHabit, onDeleteHabit, onTogglePrivate, onFocusLocation, profileName }: Props) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [goal, setGoal] = React.useState('5');
  const [locName, setLocName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);

  const [showNewTopic, setShowNewTopic] = React.useState(false);
  const [newTopicName, setNewTopicName] = React.useState('');
  const [newTopicIcon, setNewTopicIcon] = React.useState('📝');
  const [newTopicColor, setNewTopicColor] = React.useState('#4a90d9');

  const [privateSuggestions, setPrivateSuggestions] = React.useState<Set<number>>(new Set());
  const [verifyHabitId, setVerifyHabitId] = React.useState<string | null>(null);
  const [verifiedBy, setVerifiedBy] = React.useState('');
  const [verifiedWhere, setVerifiedWhere] = React.useState('');
  const [verifyNote, setVerifyNote] = React.useState('');
  const [verifyDate, setVerifyDate] = React.useState('');
  const [verifyTime, setVerifyTime] = React.useState('');
  const [showHistoryFor, setShowHistoryFor] = React.useState<string | null>(null);

  const topic = topics.find(t => t.id === selectedTopic) || null;
  const suggestions: HabitSuggestion[] = React.useMemo(() => getSuggestions(topic), [topic]);

  const resetForm = () => {
    setName(''); setDesc(''); setGoal('5'); setLocName(''); setAddress(''); setIsPrivate(false);
  };

  const resetVerifyForm = () => {
    setVerifiedBy(''); setVerifiedWhere(''); setVerifyNote(''); setVerifyDate(''); setVerifyTime('');
  };

  const handleAdd = () => {
    const lat = 35.7 + (Math.random() - 0.5) * 0.3;
    const lng = -78.6 + (Math.random() - 0.5) * 0.3;
    onAddHabit(name.trim(), desc.trim(), parseInt(goal) || 1, lat, lng, locName.trim() || name.trim(), address.trim(), isPrivate);
    resetForm();
    setShowForm(false);
  };

  const toggleSuggestionPrivate = (i: number) => {
    setPrivateSuggestions(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleSuggestionPick = (s: HabitSuggestion, i: number) => {
    const isPrivate = privateSuggestions.has(i);
    const lat = s.location?.lat ?? 35.7 + (Math.random() - 0.5) * 0.3;
    const lng = s.location?.lng ?? -78.6 + (Math.random() - 0.5) * 0.3;
    onAddHabit(s.name, s.description, s.goalCount, lat, lng, s.location?.name ?? s.name, s.location?.address ?? '', isPrivate);
    setShowSuggestions(false);
  };

  const handleAddClick = () => {
    const next = !showAdd;
    setShowAdd(next);
    if (!next) {
      setShowForm(false);
      setShowSuggestions(false);
    } else if (topic) {
      setShowSuggestions(true);
      setShowForm(false);
    } else {
      setShowForm(false);
      setShowSuggestions(false);
    }
  };

  const handlePickTopic = (id: string) => {
    onSelectTopic(id);
    setShowForm(false);
    setShowSuggestions(true);
  };

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) return;
    const id = 't' + Date.now();
    onAddTopic(newTopicName.trim(), newTopicIcon, newTopicColor);
    onSelectTopic(id);
    setNewTopicName('');
    setNewTopicIcon('📝');
    setNewTopicColor('#4a90d9');
    setShowNewTopic(false);
    setShowForm(false);
    setShowSuggestions(true);
  };

  const isSelfVerification = profileName.trim().length > 0 &&
    verifiedBy.trim().toLowerCase() === profileName.trim().toLowerCase();

  const handleVerifyClick = (habitId: string, habitLocName: string) => {
    if (verifyHabitId === habitId) {
      setVerifyHabitId(null);
      resetVerifyForm();
    } else {
      setVerifyHabitId(habitId);
      setVerifiedBy('');
      setVerifiedWhere(habitLocName || '');
      setVerifyNote('');
      setVerifyDate(todayDate());
      setVerifyTime(nowTime());
    }
  };

  const handleVerifySubmit = () => {
    if (!verifyHabitId || !verifiedBy.trim()) return;
    onLogHabit(verifyHabitId, verifiedBy, verifiedWhere, verifyNote, verifyDate, verifyTime);
    setVerifyHabitId(null);
    resetVerifyForm();
  };

  const previewTimestamp = () => {
    const dateStr = verifyDate || todayDate();
    const timeStr = verifyTime || nowTime();
    try {
      return formatTimestamp(new Date(`${dateStr}T${timeStr}:00`).toISOString());
    } catch {
      return formatTimestamp(new Date().toISOString());
    }
  };

  return (
    <div className="tab-panel">
      <p className="tab-intro">Log your goals and tap the map icon to see where each one is. Each log requires verification — who confirmed it, where, and when — so every record is honest and traceable.</p>

      <button className="toggle-add" onClick={handleAddClick}>
        {showAdd ? '− Cancel' : '+ Start a New Goal'}
      </button>

      {showAdd && (
        <div className="add-flow-panel">
          <div className="add-flow-step">
            <span className="add-flow-step-num">1</span>
            <span className="add-flow-step-label">Choose a pathway</span>
          </div>
          <div className="topic-picker-grid">
            {topics.map(t => (
              <button
                key={t.id}
                className={`topic-card compact ${selectedTopic === t.id ? 'selected' : ''}`}
                onClick={() => handlePickTopic(t.id)}
                style={selectedTopic === t.id ? { borderColor: t.color, boxShadow: `0 0 0 2px ${t.color}44` } : undefined}
              >
                <span className="topic-icon" style={{ background: `${t.color}33` }}>{t.icon}</span>
                <span className="topic-name">{t.name}</span>
                {selectedTopic === t.id && <span className="topic-check">✓</span>}
              </button>
            ))}
            <button
              className={`topic-card compact add-topic-card ${showNewTopic ? 'active' : ''}`}
              onClick={() => setShowNewTopic(s => !s)}
            >
              <span className="topic-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>+</span>
              <span className="topic-name">Create your own pathway</span>
            </button>
          </div>

          {showNewTopic && (
            <div className="add-form new-topic-form">
              <label className="field-label">Pathway name</label>
              <input
                className="text-input"
                placeholder="e.g. Gardening, Pet Care"
                value={newTopicName}
                onChange={e => setNewTopicName(e.target.value)}
              />
              <div className="picker-label">Pick an icon</div>
              <div className="emoji-row">
                {EMOJI_CHOICES.map(e => (
                  <button
                    key={e}
                    className={`emoji-pick ${newTopicIcon === e ? 'active' : ''}`}
                    onClick={() => setNewTopicIcon(e)}
                  >{e}</button>
                ))}
              </div>
              <div className="picker-label">Pick a color</div>
              <div className="color-row">
                {['#3ba55d','#4a90d9','#d98a3b','#e74c3c','#1abc9c','#f39c12','#34495e'].map(c => (
                  <button
                    key={c}
                    className={`color-pick ${newTopicColor === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setNewTopicColor(c)}
                  />
                ))}
              </div>
              <button
                className="btn-primary"
                disabled={!newTopicName.trim()}
                onClick={handleCreateTopic}
              >Create & Select Pathway</button>
            </div>
          )}

          {topic && (
            <div className="selected-topic-banner" style={{ borderColor: topic.color, boxShadow: `0 0 0 2px ${topic.color}33` }}>
              <span className="selected-topic-icon" style={{ background: `${topic.color}33` }}>{topic.icon}</span>
              <div className="selected-topic-text">
                <span className="selected-topic-label">Selected pathway</span>
                <span className="selected-topic-name">{topic.name}</span>
              </div>
              <button className="link-action" onClick={() => { setShowSuggestions(false); setShowForm(true); }}>Change</button>
            </div>
          )}

          <div className={`add-flow-step ${!topic ? 'dimmed' : ''}`}>
            <span className="add-flow-step-num">2</span>
            <span className="add-flow-step-label">{topic ? 'Pick a goal or write your own' : 'Pick a pathway first to continue'}</span>
          </div>

          {showSuggestions && topic && suggestions.length > 0 && (
            <div className="suggestions-panel">
              <h3 className="suggestions-title">{topic.icon} {topic.name} goal ideas</h3>
              <p className="suggestions-subtitle">Tap one to add it instantly, or scroll down to write your own.</p>
              <div className="suggestions-list">
                {suggestions.map((s, i) => {
                  const isPrivate = privateSuggestions.has(i);
                  return (
                    <div key={i} className={`suggestion-card ${isPrivate ? 'private-on' : ''}`}>
                      <div className="suggestion-card-main">
                        <h4>{s.name}</h4>
                        <p>{s.description}</p>
                        {s.location && <span className="suggestion-loc">📍 {s.location.name}</span>}
                        {isPrivate && <span className="suggestion-private-tag">🔒 Location hidden from map</span>}
                      </div>
                      <div className="suggestion-card-side">
                        <span className="suggestion-goal">{s.goalCount}×</span>
                        <button
                          className={`privacy-alert-btn ${isPrivate ? 'active' : ''}`}
                          title={isPrivate ? 'Location hidden — click to show' : 'Hide location from map'}
                          onClick={() => toggleSuggestionPrivate(i)}
                        >
                          {isPrivate ? '🔒' : '📍'}
                        </button>
                        <button className="suggestion-add" title="Add this habit" onClick={() => handleSuggestionPick(s, i)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="write-own-btn" onClick={() => { setShowSuggestions(false); setShowForm(true); }}>
                Write my own goal instead →
              </button>
            </div>
          )}

          {showForm && (
            <div className="add-form">
              <label className="field-label">Goal name</label>
              <input className="text-input" placeholder="e.g. Walk the Neuse River Greenway" value={name} onChange={e => setName(e.target.value)} />

              <label className="field-label">What's involved?</label>
              <input className="text-input" placeholder="e.g. Walk, run, or bike the trail" value={desc} onChange={e => setDesc(e.target.value)} />

              <label className="field-label">Goal — how many times to complete this habit?</label>
              <input className="text-input" placeholder="e.g. 10" value={goal} onChange={e => setGoal(e.target.value)} />
              <p className="field-hint">This is your target number of verified logs to complete this goal and earn its badge. Default is 5.</p>

              <label className="field-label">Location name</label>
              <input className="text-input" placeholder="e.g. Neuse River Trailhead" value={locName} onChange={e => setLocName(e.target.value)} />

              <label className="field-label">Address <span className="field-optional">(optional)</span></label>
              <input className="text-input" placeholder="e.g. 14254 Riverwood Dr, Raleigh NC" value={address} onChange={e => setAddress(e.target.value)} />

              <label className="privacy-toggle-row">
                <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                <span className="privacy-toggle-text">
                  <span className="privacy-toggle-title">🔒 Private location</span>
                  <span className="privacy-toggle-desc">Hide this goal's marker on the map. Use for goals at home or other private places.</span>
                </span>
              </label>
              <button className="btn-primary" disabled={!name.trim()} onClick={handleAdd}>Add Goal</button>
            </div>
          )}
        </div>
      )}

      <div className="habit-list">
        {habits.map(h => {
          const streak = calcStreak(h);
          const vCount = verifiedLogCount(h);
          const pct = Math.min(100, (vCount / h.goalCount) * 100);
          const alreadyLogged = isLoggedToday(h);
          const alreadyVerified = isVerifiedToday(h);
          const showVerifyForm = verifyHabitId === h.id;
          const showHistory = showHistoryFor === h.id;
          const sortedLogs = [...h.logs].sort((a, b) => b.date.localeCompare(a.date));

          return (
            <div key={h.id} className="habit-card">
              <div className="habit-header">
                <h4>{h.name}{h.isPrivate && <span className="private-badge" title="Private — hidden from map"> 🔒</span>}</h4>
                <div className="habit-actions">
                  {h.location && !h.isPrivate && (
                    <button className="icon-btn map-icon-btn" title="Show on map" onClick={() => onFocusLocation(h.location!.lat, h.location!.lng)}>🗺️</button>
                  )}
                  {h.location && (
                    <button
                      className={`icon-btn privacy-toggle-btn ${h.isPrivate ? 'active' : ''}`}
                      title={h.isPrivate ? 'Show location on map' : 'Hide location from map'}
                      onClick={() => onTogglePrivate(h.id)}
                    >{h.isPrivate ? '🔒' : '📍'}</button>
                  )}
                  <button className="icon-btn delete-icon-btn" title="Delete" onClick={() => onDeleteHabit(h.id)}>🗑️</button>
                </div>
              </div>
              {h.description && <p className="habit-desc">{h.description}</p>}
              {h.location && (
                <p className="habit-location">
                  {h.isPrivate ? '🔒' : '📍'} {h.location.name}{h.location.address ? ` — ${h.location.address}` : ''}
                  {h.isPrivate && <span className="private-note"> (hidden from map)</span>}
                </p>
              )}
              <div className="habit-progress-row">
                <span className="habit-count">{vCount} / {h.goalCount}</span>
                {streak > 0 && <span className="habit-streak">🔥 {streak} day streak</span>}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>

              {alreadyVerified ? (
                <div className="verified-today-badge">✓ Verified today</div>
              ) : (
                <button
                  className={showVerifyForm ? 'btn-log-cancel' : 'btn-log'}
                  onClick={() => handleVerifyClick(h.id, h.location?.name || '')}
                >
                  {showVerifyForm ? '− Cancel' : '+ Log & Verify'}
                </button>
              )}

              {showVerifyForm && (
                <div className="verify-form">
                  <div className="verify-form-header">
                    <span className="verify-shield">🛡️</span>
                    <span className="verify-form-title">Verification Required</span>
                  </div>
                  <p className="verify-form-intro">This safeguard ensures each log is honest and traceable. Enter who confirmed the habit, where and when it happened, and an optional note.</p>

                  <div className="verify-datetime-row">
                    <div className="verify-datetime-field">
                      <label className="verify-label">Date <span className="verify-required">*</span></label>
                      <input
                        type="date"
                        className="text-input"
                        value={verifyDate}
                        onChange={e => setVerifyDate(e.target.value)}
                      />
                    </div>
                    <div className="verify-datetime-field">
                      <label className="verify-label">Time <span className="verify-required">*</span></label>
                      <input
                        type="time"
                        className="text-input"
                        value={verifyTime}
                        onChange={e => setVerifyTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="verify-label">Verified by <span className="verify-required">*</span></label>
                  <input
                    className="text-input"
                    placeholder="Name of person confirming (e.g. Mom, Coach Smith)"
                    value={verifiedBy}
                    onChange={e => setVerifiedBy(e.target.value)}
                  />
                  {isSelfVerification && (
                    <p className="verify-warning">
                      ⚠️ You can't verify yourself. Ask a parent, teacher, or friend to confirm your activity.
                    </p>
                  )}
                  <label className="verify-label">Where</label>
                  <input
                    className="text-input"
                    placeholder="Where it happened (e.g. Neuse River Greenway, home)"
                    value={verifiedWhere}
                    onChange={e => setVerifiedWhere(e.target.value)}
                  />
                  <label className="verify-label">Note (optional)</label>
                  <textarea
                    className="text-input verify-note-input"
                    placeholder="Any extra details (e.g. walked 2 miles, finished chapter 5)"
                    value={verifyNote}
                    onChange={e => setVerifyNote(e.target.value)}
                    rows={2}
                  />
                  <div className="verify-timestamp-note">
                    Will be recorded as {previewTimestamp()}
                  </div>
                  <button
                    className="btn-primary verify-submit-btn"
                    disabled={!verifiedBy.trim() || !verifyDate || !verifyTime || isSelfVerification}
                    onClick={handleVerifySubmit}
                  >
                    ✓ Verify & Log
                  </button>
                </div>
              )}

              {h.logs.length > 0 && (
                <button
                  className="link-action verify-history-toggle"
                  onClick={() => setShowHistoryFor(showHistory ? null : h.id)}
                >
                  {showHistory ? 'Hide' : 'Show'} log history ({h.logs.length})
                </button>
              )}

              {showHistory && sortedLogs.length > 0 && (
                <div className="log-history">
                  {sortedLogs.map((log, i) => (
                    <div key={i} className={`log-entry ${log.verified ? 'verified' : 'unverified'}`}>
                      <div className="log-entry-date">
                        {log.verified ? '✓' : '○'} {log.date}
                      </div>
                      {log.verified && (
                        <div className="log-entry-details">
                          <span className="log-detail-row">👤 {log.verifiedBy}</span>
                          {log.verifiedWhere && <span className="log-detail-row">📍 {log.verifiedWhere}</span>}
                          <span className="log-detail-row">🕐 {formatTimestamp(log.verifiedAt)}</span>
                          {log.note && <span className="log-detail-row log-note">📝 {log.note}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
