import * as React from 'react';
import { supabase } from '../supabaseClient';

interface AwardNomination {
  id: string;
  nominee_name: string;
  award_type: string;
  reason: string;
  nominated_by: string;
  status: string;
  created_at: string;
}

const AWARD_TYPES = [
  'Month of Service',
  'Community Hero',
  'Volunteer of the Month',
  'Youth Leader',
  'Senior Champion',
  'Neighborhood Helper',
  'Other',
];

const AWARD_ICONS: Record<string, string> = {
  'Month of Service': '🏆',
  'Community Hero': '🦸',
  'Volunteer of the Month': '🤝',
  'Youth Leader': '🌱',
  'Senior Champion': '🌟',
  'Neighborhood Helper': '💛',
  'Other': '🎖️',
};

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

export default function CountyAwards({ profileName }: { profileName: string }) {
  const [nominations, setNominations] = React.useState<AwardNomination[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [nominee, setNominee] = React.useState('');
  const [awardType, setAwardType] = React.useState('Month of Service');
  const [reason, setReason] = React.useState('');
  const [nominator, setNominator] = React.useState(profileName || '');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNominations = React.useCallback(async () => {
    try {
      const { data, error: qErr } = await supabase
        .from('award_nominations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (qErr) throw qErr;
      setNominations((data as AwardNomination[]) || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  React.useEffect(() => {
    if (profileName) setNominator(profileName);
  }, [profileName]);

  const handleSubmit = async () => {
    if (!nominee.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: insErr } = await supabase
        .from('award_nominations')
        .insert({
          nominee_name: nominee.trim(),
          award_type: awardType,
          reason: reason.trim(),
          nominated_by: nominator.trim() || 'Neighbor',
          status: 'pending',
        });
      if (insErr) throw insErr;
      setNominee('');
      setReason('');
      setAwardType('Month of Service');
      setShowForm(false);
      await fetchNominations();
    } catch {
      setError('Could not submit your nomination. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const recognizedNominations = nominations.filter(n => n.status === 'recognized');
  const pendingNominations = nominations.filter(n => n.status === 'pending');

  return (
    <div className="county-awards-card">
      <div className="county-awards-header">
        <span className="county-awards-icon">🏆</span>
        <div className="county-awards-title-area">
          <span className="county-awards-eyebrow">County Recognition · District 13</span>
          <h3>Community Awards &amp; Recognition</h3>
          <p className="county-awards-subtitle">
            Know a neighbor who goes above and beyond? Nominate them for a county award. From Month of Service to Community Hero — let's recognize the people who make Johnston County thrive.
          </p>
        </div>
      </div>

      {!showForm ? (
        <button className="btn-primary county-awards-cta" onClick={() => setShowForm(true)}>
          <span>🏅 Nominate a Neighbor</span>
        </button>
      ) : (
        <div className="county-awards-form">
          <div className="county-awards-form-row">
            <div className="county-challenge-field">
              <label className="field-label">Who are you nominating?</label>
              <input
                className="text-input"
                placeholder="Neighbor's name"
                value={nominee}
                onChange={e => setNominee(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="county-challenge-field">
              <label className="field-label">Award type</label>
              <select
                className="select-input"
                value={awardType}
                onChange={e => setAwardType(e.target.value)}
              >
                {AWARD_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <label className="field-label">Why do they deserve this award?</label>
          <textarea
            className="text-area"
            placeholder="Tell us what they've done for the community — volunteer work, helping neighbors, leadership..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            maxLength={400}
          />
          <div className="county-challenge-field" style={{ maxWidth: '240px' }}>
            <label className="field-label">Your name</label>
            <input
              className="text-input"
              placeholder="How you'll be credited"
              value={nominator}
              onChange={e => setNominator(e.target.value)}
              maxLength={50}
            />
          </div>
          {error && <p className="county-challenge-error">{error}</p>}
          <div className="county-challenge-form-actions">
            <button
              className="btn-primary"
              disabled={submitting || !nominee.trim()}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting…' : 'Submit Nomination'}
            </button>
            <button
              className="toggle-add county-challenge-cancel"
              onClick={() => { setShowForm(false); setError(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {recognizedNominations.length > 0 && (
        <div className="county-awards-recognized">
          <h4 className="county-awards-section-title">🏅 Recognized Award Recipients</h4>
          {recognizedNominations.map(n => (
            <div key={n.id} className="county-awards-recipient-card">
              <span className="county-awards-recipient-icon">
                {AWARD_ICONS[n.award_type] || '🎖️'}
              </span>
              <div className="county-awards-recipient-body">
                <span className="county-awards-recipient-name">{n.nominee_name}</span>
                <span className="county-awards-recipient-award">{n.award_type}</span>
                {n.reason && <p className="county-awards-recipient-reason">{n.reason}</p>}
                <span className="county-awards-recipient-meta">
                  Nominated by {n.nominated_by} · {timeAgo(n.created_at)}
                </span>
              </div>
              <span className="county-awards-recognized-badge">Recognized</span>
            </div>
          ))}
        </div>
      )}

      {!loading && pendingNominations.length > 0 && (
        <div className="county-awards-pending">
          <h4 className="county-awards-section-title">📋 Pending Nominations</h4>
          {pendingNominations.map(n => (
            <div key={n.id} className="county-awards-pending-item">
              <span className="county-awards-pending-icon">
                {AWARD_ICONS[n.award_type] || '🎖️'}
              </span>
              <div className="county-awards-pending-body">
                <span className="county-awards-pending-name">{n.nominee_name}</span>
                <span className="county-awards-pending-award">{n.award_type}</span>
                {n.reason && <p className="county-awards-pending-reason">{n.reason}</p>}
                <span className="county-awards-pending-meta">
                  Nominated by {n.nominated_by} · {timeAgo(n.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="county-challenge-card loading">
          <div className="county-challenge-pulse" />
          <p className="county-challenge-loading-text">Loading award nominations…</p>
        </div>
      )}

      {!loading && nominations.length === 0 && !showForm && (
        <p className="help-board-empty">
          No nominations yet — be the first to recognize a neighbor who makes our community better!
        </p>
      )}
    </div>
  );
}
