import * as React from 'react';
import { supabase, type CountyChallenge, type ChallengeContribution } from '../supabaseClient';
import { JOCO_TOWNS } from '../joco';

interface Props {
  profileName: string;
}

const CHALLENGE_CATEGORIES = [
  'Community Service',
  'Environment',
  'Education',
  'Fitness',
  'Sustainability',
  'Food & Health',
  'Other',
];

const CATEGORY_ICONS: Record<string, string> = {
  'Community Service': '🤝',
  'Environment': '🌍',
  'Education': '📚',
  'Fitness': '💪',
  'Sustainability': '♻️',
  'Food & Health': '🍎',
  'Other': '🎯',
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

export default function CountyChallenge({ profileName }: Props) {
  const [challenges, setChallenges] = React.useState<CountyChallenge[]>([]);
  const [contributions, setContributions] = React.useState<ChallengeContribution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [contribFormId, setContribFormId] = React.useState<string | null>(null);

  // Contribution form state
  const [contribName, setContribName] = React.useState(profileName || '');
  const [amount, setAmount] = React.useState('1');
  const [note, setNote] = React.useState('');
  const [submittingContrib, setSubmittingContrib] = React.useState(false);
  const [justContributed, setJustContributed] = React.useState(false);

  // New challenge form state
  const [showChallengeForm, setShowChallengeForm] = React.useState(false);
  const [challengeTitle, setChallengeTitle] = React.useState('');
  const [challengeDesc, setChallengeDesc] = React.useState('');
  const [challengeCategory, setChallengeCategory] = React.useState('Community Service');
  const [challengeTarget, setChallengeTarget] = React.useState('100');
  const [challengeUnit, setChallengeUnit] = React.useState('volunteer hours');
  const [challengeSubmitter, setChallengeSubmitter] = React.useState(profileName || '');
  const [submittingChallenge, setSubmittingChallenge] = React.useState(false);
  const [challengeError, setChallengeError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      const [{ data: ch, error: cErr }, { data: contribs, error: conErr }] = await Promise.all([
        supabase.from('county_challenges').select('*').eq('active', true).order('created_at', { ascending: true }),
        supabase.from('challenge_contributions').select('*').order('created_at', { ascending: false }).limit(100),
      ]);
      if (cErr) throw cErr;
      if (conErr) throw conErr;
      const chList = (ch as CountyChallenge[]) || [];
      setChallenges(chList);
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
    if (profileName) {
      setContribName(profileName);
      setChallengeSubmitter(profileName);
    }
  }, [profileName]);

  const handleCreateChallenge = async () => {
    if (!challengeTitle.trim()) return;
    setSubmittingChallenge(true);
    setChallengeError(null);
    try {
      const newId = `community-${crypto.randomUUID()}`;
      const icon = CATEGORY_ICONS[challengeCategory] || '🎯';
      const { error: insErr } = await supabase
        .from('county_challenges')
        .insert({
          id: newId,
          title: challengeTitle.trim(),
          description: challengeDesc.trim() || 'A community-submitted challenge for Johnston County.',
          target_count: parseInt(challengeTarget) || 100,
          unit: challengeUnit.trim() || 'logs',
          icon,
          category: challengeCategory,
          active: true,
          source: 'community',
          submitted_by: challengeSubmitter.trim() || 'Neighbor',
        });
      if (insErr) throw insErr;
      setChallengeTitle('');
      setChallengeDesc('');
      setChallengeCategory('Community Service');
      setChallengeTarget('100');
      setChallengeUnit('volunteer hours');
      setShowChallengeForm(false);
      await fetchData();
      setExpandedId(newId);
    } catch {
      setChallengeError('Could not submit your challenge. Please try again.');
    } finally {
      setSubmittingChallenge(false);
    }
  };

  const handleContribute = async (challengeId: string) => {
    const amt = parseInt(amount) || 1;
    if (amt < 1 || amt > 50) return;
    setSubmittingContrib(true);
    setError(null);
    try {
      const { data, error: insErr } = await supabase
        .from('challenge_contributions')
        .insert({
          challenge_id: challengeId,
          contributor_name: contribName.trim() || 'Neighbor',
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
      setContribFormId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit your contribution. Please try again.');
    } finally {
      setSubmittingContrib(false);
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

  const seededChallenge = challenges.find(c => c.source === 'seeded') || challenges[0] || null;
  const communityChallenges = challenges.filter(c => c !== seededChallenge);

  const renderChallengeCard = (ch: CountyChallenge, alwaysExpanded: boolean, isMain: boolean) => {
    const chContribs = contributions.filter(c => c.challenge_id === ch.id);
    const totalContributed = chContribs.reduce((s, c) => s + c.amount, 0);
    const progressPct = Math.min(100, (totalContributed / ch.target_count) * 100);
    const isComplete = totalContributed >= ch.target_count;
    const isExpanded = alwaysExpanded || expandedId === ch.id;
    const isContribFormOpen = contribFormId === ch.id;

    return (
      <div
        key={ch.id}
        className={`county-challenge-card ${isComplete ? 'complete' : ''} ${justContributed && isExpanded ? 'just-contributed' : ''}`}
      >
        <div
          className="county-challenge-header"
          onClick={() => !alwaysExpanded && setExpandedId(isExpanded ? null : ch.id)}
          role={alwaysExpanded ? undefined : 'button'}
          tabIndex={alwaysExpanded ? undefined : 0}
          onKeyDown={e => { if (!alwaysExpanded && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setExpandedId(isExpanded ? null : ch.id); } }}
        >
          <span className="county-challenge-icon">{ch.icon}</span>
          <div className="county-challenge-title-area">
            <span className="county-challenge-eyebrow">County Challenge · District 13{ch.source === 'community' ? ' · Community-Submitted' : ''}</span>
            <h3>{ch.title}</h3>
          </div>
          {isComplete && <span className="county-challenge-complete-badge">🎉 Goal reached!</span>}
          {!alwaysExpanded && <span className="county-challenge-chevron">{isExpanded ? '▾' : '▸'}</span>}
        </div>

        {isExpanded && (
          <>
            <p className="county-challenge-desc">{ch.description}</p>

            {ch.source === 'community' && ch.submitted_by && (
              <p className="joco-challenge-submitted-by">Proposed by {ch.submitted_by}</p>
            )}

            <div className="county-challenge-progress-section">
              <div className="county-challenge-progress-bar">
                <div className="county-challenge-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="county-challenge-progress-stats">
                <span className="county-challenge-count">{totalContributed.toLocaleString()} / {ch.target_count.toLocaleString()} {ch.unit}</span>
                <span className="county-challenge-pct">{Math.round(progressPct)}%</span>
              </div>
            </div>

            <p className="county-challenge-towns">Serving neighbors in {JOCO_TOWNS.join(', ')} and all of Johnston County.</p>

            {error && <p className="county-challenge-error">{error}</p>}

            {/* Submit Your Hours button — reveals the contribution form */}
            {!isContribFormOpen ? (
              <button
                className="btn-primary county-challenge-cta"
                onClick={() => setContribFormId(ch.id)}
              >
                {isComplete ? '➕ Log more hours anyway' : '📝 Submit Your Hours'}
              </button>
            ) : (
              <div className="county-challenge-form">
                <div className="county-challenge-form-row">
                  <div className="county-challenge-field">
                    <label className="field-label">Your name</label>
                    <input
                      className="text-input"
                      placeholder="How you'll be credited"
                      value={contribName}
                      onChange={e => setContribName(e.target.value)}
                    />
                  </div>
                  <div className="county-challenge-field county-challenge-field-amount">
                    <label className="field-label">{ch.unit}</label>
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
                  <button
                    className="btn-primary"
                    disabled={submittingContrib || parseInt(amount) < 1}
                    onClick={() => handleContribute(ch.id)}
                  >
                    {submittingContrib ? 'Submitting…' : 'Add to county total'}
                  </button>
                  <button
                    className="toggle-add county-challenge-cancel"
                    onClick={() => { setContribFormId(null); setNote(''); setAmount('1'); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {chContribs.length > 0 && (
              <div className="county-challenge-feed">
                <h4 className="county-challenge-feed-title">Recent contributions</h4>
                {chContribs.slice(0, 8).map(c => (
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

            {/* Submit a Challenge button — only in the main card, after recent contributions */}
            {isMain && !showChallengeForm && (
              <div className="county-challenge-submit-area">
                <button
                  className="joco-challenge-submit-btn"
                  onClick={() => setShowChallengeForm(true)}
                >
                  <span className="joco-challenge-submit-icon">🎯</span>
                  <span>Submit a Challenge</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="county-challenge-section">
      {/* Main challenge card (always expanded) */}
      {seededChallenge && renderChallengeCard(seededChallenge, true, true)}

      {/* New challenge form */}
      {showChallengeForm && (
        <div className="county-challenge-card joco-challenge-form-card">
          <h3 className="joco-challenge-form-title">🎯 Propose a County Challenge</h3>
          <p className="county-challenge-desc">Suggest a community-wide goal for Johnston County. Anyone can contribute once it's live.</p>

          <div className="county-challenge-form">
            <label className="field-label">Challenge title</label>
            <input
              className="text-input"
              placeholder="e.g. Clean up the Neuse River — 200 bags of trash"
              value={challengeTitle}
              onChange={e => setChallengeTitle(e.target.value)}
              maxLength={120}
            />

            <label className="field-label">What is the challenge?</label>
            <textarea
              className="text-area"
              placeholder="Describe what people should do and why it matters to Johnston County..."
              value={challengeDesc}
              onChange={e => setChallengeDesc(e.target.value)}
              rows={3}
              maxLength={400}
            />

            <div className="county-challenge-form-row">
              <div className="county-challenge-field">
                <label className="field-label">Category</label>
                <select
                  className="select-input"
                  value={challengeCategory}
                  onChange={e => setChallengeCategory(e.target.value)}
                >
                  {CHALLENGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="county-challenge-field county-challenge-field-amount">
                <label className="field-label">Target count</label>
                <input
                  className="text-input"
                  type="number"
                  min="1"
                  max="99999"
                  value={challengeTarget}
                  onChange={e => setChallengeTarget(e.target.value)}
                />
              </div>
            </div>

            <div className="county-challenge-form-row">
              <div className="county-challenge-field">
                <label className="field-label">Unit (e.g. hours, bags, books)</label>
                <input
                  className="text-input"
                  placeholder="volunteer hours"
                  value={challengeUnit}
                  onChange={e => setChallengeUnit(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div className="county-challenge-field">
                <label className="field-label">Your name</label>
                <input
                  className="text-input"
                  placeholder="How you'll be credited"
                  value={challengeSubmitter}
                  onChange={e => setChallengeSubmitter(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>

            {challengeError && <p className="county-challenge-error">{challengeError}</p>}

            <div className="county-challenge-form-actions">
              <button
                className="btn-primary"
                disabled={submittingChallenge || !challengeTitle.trim()}
                onClick={handleCreateChallenge}
              >
                {submittingChallenge ? 'Submitting…' : 'Publish Challenge'}
              </button>
              <button
                className="toggle-add county-challenge-cancel"
                onClick={() => { setShowChallengeForm(false); setChallengeError(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community-submitted challenge cards */}
      {communityChallenges.map(ch => renderChallengeCard(ch, false, false))}

      {/* Empty state when no challenges exist at all */}
      {!seededChallenge && !showChallengeForm && (
        <div className="county-challenge-card">
          <div className="county-challenge-header">
            <span className="county-challenge-icon">🎯</span>
            <div className="county-challenge-title-area">
              <span className="county-challenge-eyebrow">County Challenge · District 13</span>
              <h3>No active challenges yet</h3>
            </div>
          </div>
          <p className="county-challenge-desc">Be the first to propose a community challenge for Johnston County!</p>
          <button className="btn-primary county-challenge-cta" onClick={() => setShowChallengeForm(true)}>
            🎯 Submit a Challenge
          </button>
        </div>
      )}
    </div>
  );
}
