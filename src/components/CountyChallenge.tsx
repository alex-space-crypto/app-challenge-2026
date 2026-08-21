import * as React from 'react';
import { supabase, type CountyChallenge, type ChallengeContribution } from '../supabaseClient';
import { JOCO_TOWNS } from '../joco';

interface Props {
  profileName: string;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function CountyChallenge({ profileName }: Props) {
  const [challenge, setChallenge] = React.useState<CountyChallenge | null>(null);
  const [contributions, setContributions] = React.useState<ChallengeContribution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState(profileName || '');
  const [amount, setAmount] = React.useState('1');
  const [note, setNote] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [justContributed, setJustContributed] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const [{ data: challenges, error: cErr }, { data: contribs, error: conErr }] = await Promise.all([
        supabase.from('county_challenges').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
        supabase.from('challenge_contributions').select('*').order('created_at', { ascending: false }).limit(50),
      ]);
      if (cErr) throw cErr;
      if (conErr) throw conErr;
      setChallenge(challenges && challenges.length > 0 ? challenges[0] as CountyChallenge : null);
      setContributions((contribs as ChallengeContribution[]) || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load the county challenge.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    if (profileName) setName(profileName);
  }, [profileName]);

  const totalContributed = contributions.reduce((s, c) => s + c.amount, 0);
  const progressPct = challenge ? Math.min(100, (totalContributed / challenge.target_count) * 100) : 0;
  const isComplete = challenge ? totalContributed >= challenge.target_count : false;

  const handleSubmit = async () => {
    if (!challenge) return;
    const amt = parseInt(amount) || 1;
    if (amt < 1 || amt > 50) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: insErr } = await supabase
        .from('challenge_contributions')
        .insert({
          challenge_id: challenge.id,
          contributor_name: name.trim() || 'Neighbor',
          amount: amt,
          note: note.trim(),
        })
        .select()
        .single();
      if (insErr) throw insErr;
      setContributions(prev => [data as ChallengeContribution, ...prev]);
      setJustContributed(true);
      setTimeout(() => setJustContributed(false), 2500);
      setNote('');
      setAmount('1');
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit your contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="county-challenge-card loading">
        <div className="county-challenge-pulse" />
        <p className="county-challenge-loading-text">Loading the Johnston County challenge…</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className={`county-challenge-card ${isComplete ? 'complete' : ''} ${justContributed ? 'just-contributed' : ''}`}>
      <div className="county-challenge-header">
        <span className="county-challenge-icon">{challenge.icon}</span>
        <div className="county-challenge-title-area">
          <span className="county-challenge-eyebrow">County Challenge · District 13</span>
          <h3>{challenge.title}</h3>
        </div>
        {isComplete && <span className="county-challenge-complete-badge">🎉 Goal reached!</span>}
      </div>

      <p className="county-challenge-desc">{challenge.description}</p>

      <div className="county-challenge-progress-section">
        <div className="county-challenge-progress-bar">
          <div className="county-challenge-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="county-challenge-progress-stats">
          <span className="county-challenge-count">{totalContributed.toLocaleString()} / {challenge.target_count.toLocaleString()} {challenge.unit}</span>
          <span className="county-challenge-pct">{Math.round(progressPct)}%</span>
        </div>
      </div>

      <p className="county-challenge-towns">Serving neighbors in {JOCO_TOWNS.join(', ')} and all of Johnston County.</p>

      {error && <p className="county-challenge-error">{error}</p>}

      {!showForm ? (
        <button className="btn-primary county-challenge-cta" onClick={() => setShowForm(true)}>
          {isComplete ? '➕ Log more hours anyway' : '➕ Log my contribution'}
        </button>
      ) : (
        <div className="county-challenge-form">
          <div className="county-challenge-form-row">
            <div className="county-challenge-field">
              <label className="field-label">Your name</label>
              <input
                className="text-input"
                placeholder="How you'll be credited"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="county-challenge-field county-challenge-field-amount">
              <label className="field-label">Hours / units</label>
              <input
                className="text-input"
                type="number"
                min="1"
                max="50"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
          <label className="field-label">What did you do? (optional)</label>
          <input
            className="text-input"
            placeholder="e.g. Walked dogs at the Johnston County Animal Shelter"
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={120}
          />
          <div className="county-challenge-form-actions">
            <button className="btn-primary" disabled={submitting || parseInt(amount) < 1} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : 'Add to county total'}
            </button>
            <button className="toggle-add county-challenge-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {contributions.length > 0 && (
        <div className="county-challenge-feed">
          <h4 className="county-challenge-feed-title">Recent contributions</h4>
          {contributions.slice(0, 8).map(c => (
            <div key={c.id} className="county-challenge-feed-item">
              <span className="county-challenge-feed-avatar">{c.contributor_name.charAt(0).toUpperCase()}</span>
              <div className="county-challenge-feed-body">
                <span className="county-challenge-feed-name">{c.contributor_name}</span>
                {c.note && <span className="county-challenge-feed-note"> — {c.note}</span>}
                <span className="county-challenge-feed-time"> · {timeAgo(c.created_at)}</span>
              </div>
              <span className="county-challenge-feed-amount">+{c.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
