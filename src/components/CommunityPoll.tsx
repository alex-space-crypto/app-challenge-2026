import * as React from 'react';
import { supabase } from '../supabaseClient';

const POLL_ID = 'tax-cap-3-5';
const VOTER_KEY = 'joco-poll-voter-id';

const POLL_QUESTION =
  'Keep the NC state income tax rate from being raised higher than 3.5%';

type Choice = 'for' | 'against';

interface VoteRow {
  choice: Choice;
  voter_id: string;
}

interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  submitted_by: string;
  votes_for: number;
  votes_against: number;
  created_at: string;
}

const ISSUE_CATEGORIES = [
  'Infrastructure',
  'Education',
  'Public Safety',
  'Health',
  'Environment',
  'Housing',
  'Other',
];

function getVoterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
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

export function CommunityPoll() {
  const [forCount, setForCount] = React.useState(0);
  const [againstCount, setAgainstCount] = React.useState(0);
  const [myChoice, setMyChoice] = React.useState<Choice | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const voterId = React.useRef(getVoterId());

  // Community-submitted issues
  const [issues, setIssues] = React.useState<CommunityIssue[]>([]);
  const [showIssueForm, setShowIssueForm] = React.useState(false);
  const [issueTitle, setIssueTitle] = React.useState('');
  const [issueDesc, setIssueDesc] = React.useState('');
  const [issueCategory, setIssueCategory] = React.useState('Infrastructure');
  const [issueSubmitter, setIssueSubmitter] = React.useState('');
  const [issueSubmitting, setIssueSubmitting] = React.useState(false);
  const [issueError, setIssueError] = React.useState<string | null>(null);
  const [issueVotes, setIssueVotes] = React.useState<Record<string, Choice | null>>({});
  const [voteBusy, setVoteBusy] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const { data, error: e } = await supabase
        .from('community_poll_votes')
        .select('choice, voter_id')
        .eq('poll_id', POLL_ID);
      if (e) throw e;
      const rows = (data || []) as VoteRow[];
      setForCount(rows.filter(r => r.choice === 'for').length);
      setAgainstCount(rows.filter(r => r.choice === 'against').length);
      const mine = rows.find(r => r.voter_id === voterId.current);
      setMyChoice(mine ? mine.choice : null);
      setError(null);
    } catch {
      setError('Could not load poll results.');
    }
  }, []);

  const loadIssues = React.useCallback(async () => {
    try {
      const { data, error: e } = await supabase
        .from('community_poll_issues')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);
      if (e) throw e;
      setIssues((data as CommunityIssue[]) || []);

      const { data: voteData } = await supabase
        .from('community_poll_issue_votes')
        .select('issue_id, choice, voter_id')
        .in('issue_id', ((data as CommunityIssue[]) || []).map(i => i.id));
      const myVotes: Record<string, Choice | null> = {};
      for (const v of (voteData || []) as { issue_id: string; choice: Choice; voter_id: string }[]) {
        if (v.voter_id === voterId.current) {
          myVotes[v.issue_id] = v.choice;
        }
      }
      setIssueVotes(myVotes);
    } catch {
      // silent — issues are secondary
    }
  }, []);

  React.useEffect(() => {
    load();
    loadIssues();
    // Unique channel name per mount avoids collisions when the component
    // remounts (e.g. React Strict Mode in dev), which previously left a
    // stale subscription that swallowed vote-change events.
    const channel = supabase
      .channel(`poll-votes-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_poll_votes', filter: `poll_id=eq.${POLL_ID}` },
        () => load()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_poll_issue_votes' },
        () => loadIssues()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_poll_issues' },
        () => loadIssues()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, loadIssues]);

  const castVote = async (choice: Choice) => {
    if (busy || myChoice === choice) return;
    setBusy(true);
    setError(null);
    const prevChoice = myChoice;
    // Optimistic update so the tally moves instantly, even before the
    // server round-trip and realtime broadcast resolve.
    setMyChoice(choice);
    setForCount(c => c + (choice === 'for' ? 1 : 0) - (prevChoice === 'for' ? 1 : 0));
    setAgainstCount(c => c + (choice === 'against' ? 1 : 0) - (prevChoice === 'against' ? 1 : 0));
    try {
      const { error: upErr } = await supabase
        .from('community_poll_votes')
        .upsert(
          { poll_id: POLL_ID, choice, voter_id: voterId.current },
          { onConflict: 'poll_id,voter_id' }
        );
      if (upErr) throw upErr;
      // Reload the authoritative counts from the server.
      await load();
    } catch {
      // Revert the optimistic update on failure.
      setMyChoice(prevChoice);
      setForCount(c => c - (choice === 'for' ? 1 : 0) + (prevChoice === 'for' ? 1 : 0));
      setAgainstCount(c => c - (choice === 'against' ? 1 : 0) + (prevChoice === 'against' ? 1 : 0));
      setError('Could not save your vote. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitIssue = async () => {
    if (!issueTitle.trim()) return;
    setIssueSubmitting(true);
    setIssueError(null);
    try {
      const { error: insErr } = await supabase
        .from('community_poll_issues')
        .insert({
          title: issueTitle.trim(),
          description: issueDesc.trim(),
          category: issueCategory,
          submitted_by: issueSubmitter.trim() || 'Neighbor',
          voter_id: voterId.current,
          status: 'active',
        });
      if (insErr) throw insErr;
      setIssueTitle('');
      setIssueDesc('');
      setIssueCategory('Infrastructure');
      setIssueSubmitter('');
      setShowIssueForm(false);
      await loadIssues();
    } catch {
      setIssueError('Could not submit your issue. Please try again.');
    } finally {
      setIssueSubmitting(false);
    }
  };

  const castIssueVote = async (issue: CommunityIssue, choice: Choice) => {
    const current = issueVotes[issue.id];
    if (voteBusy === issue.id || current === choice) return;
    setVoteBusy(issue.id);
    try {
      const { error: upErr } = await supabase
        .from('community_poll_issue_votes')
        .upsert(
          { issue_id: issue.id, choice, voter_id: voterId.current },
          { onConflict: 'issue_id,voter_id' }
        );
      if (upErr) throw upErr;

      // Recalculate counts
      const { data: allVotes } = await supabase
        .from('community_poll_issue_votes')
        .select('choice')
        .eq('issue_id', issue.id);
      const votes = (allVotes || []) as { choice: Choice }[];
      const newFor = votes.filter(v => v.choice === 'for').length;
      const newAgainst = votes.filter(v => v.choice === 'against').length;

      await supabase
        .from('community_poll_issues')
        .update({ votes_for: newFor, votes_against: newAgainst })
        .eq('id', issue.id);

      setIssues(prev =>
        prev.map(i =>
          i.id === issue.id
            ? { ...i, votes_for: newFor, votes_against: newAgainst }
            : i
        )
      );
      setIssueVotes(prev => ({ ...prev, [issue.id]: choice }));
    } catch {
      // silent
    } finally {
      setVoteBusy(null);
    }
  };

  const total = forCount + againstCount;
  const forPct = total > 0 ? (forCount / total) * 100 : 0;
  const againstPct = total > 0 ? (againstCount / total) * 100 : 0;

  return (
    <li className="joco-update-item">
      <div className="joco-poll">
        <div className="joco-poll-header">
          <span className="joco-update-icon">🗳️</span>
          <span className="joco-poll-title">Community Poll</span>
          <a
            className="joco-poll-question"
            href="https://www.johnstonnc.gov/joconcelections/content.cfm?pageid=220"
            target="_blank"
            rel="noopener noreferrer"
            title="Sample Ballots for November 3, 2026 General Election | Johnston County Board of Elections"
          >
            {POLL_QUESTION}
          </a>
        </div>

        <div className="joco-poll-buttons">
          <button
            className={`joco-poll-btn for ${myChoice === 'for' ? 'selected' : ''}`}
            onClick={() => castVote('for')}
            disabled={busy}
          >
            <span className="joco-poll-btn-icon">👍</span>
            <span className="joco-poll-btn-label">For</span>
          </button>
          <button
            className={`joco-poll-btn against ${myChoice === 'against' ? 'selected' : ''}`}
            onClick={() => castVote('against')}
            disabled={busy}
          >
            <span className="joco-poll-btn-icon">👎</span>
            <span className="joco-poll-btn-label">Against</span>
          </button>
        </div>

        <div className="joco-poll-progress">
          <div className="joco-poll-bar">
            <div className="joco-poll-fill for" style={{ width: `${forPct}%` }} />
            <div className="joco-poll-fill against" style={{ width: `${againstPct}%` }} />
          </div>
          <div className="joco-poll-counts">
            <span className="joco-poll-count for">
              <span className="joco-poll-count-num">{forCount}</span> For
            </span>
            <span className="joco-poll-total">{total} total votes</span>
            <span className="joco-poll-count against">
              <span className="joco-poll-count-num">{againstCount}</span> Against
            </span>
          </div>
        </div>

        {myChoice && !error && (
          <p className="joco-poll-voted-note">
            You voted <strong>{myChoice}</strong>. Tap the other option to change your vote.
          </p>
        )}
        {error && <p className="joco-poll-error">{error}</p>}
      </div>

      {/* ===== Community Issue Submission ===== */}
      <div className="joco-issue-divider" />
      <div className="joco-issue-section">
        <div className="joco-issue-header">
          <span className="joco-issue-header-icon">📢</span>
          <span className="joco-issue-header-text">
            Have an issue you care about? Submit it as a poll so the community can vote and push for change.
          </span>
        </div>

        {!showIssueForm ? (
          <button
            className="joco-issue-submit-btn"
            onClick={() => setShowIssueForm(true)}
          >
            <span className="joco-issue-submit-icon">✊</span>
            <span>Submit an Issue</span>
          </button>
        ) : (
          <div className="joco-issue-form">
            <input
              className="text-input joco-issue-input"
              placeholder="Your issue as a question (e.g. 'Add sidewalks on Highway 42')"
              value={issueTitle}
              onChange={e => setIssueTitle(e.target.value)}
              maxLength={140}
            />
            <textarea
              className="text-area joco-issue-textarea"
              placeholder="Explain why this matters to our community..."
              value={issueDesc}
              onChange={e => setIssueDesc(e.target.value)}
              rows={2}
              maxLength={300}
            />
            <div className="joco-issue-form-row">
              <select
                className="select-input joco-issue-select"
                value={issueCategory}
                onChange={e => setIssueCategory(e.target.value)}
              >
                {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                className="text-input joco-issue-input"
                placeholder="Your name (optional)"
                value={issueSubmitter}
                onChange={e => setIssueSubmitter(e.target.value)}
                maxLength={50}
              />
            </div>
            {issueError && <p className="joco-poll-error">{issueError}</p>}
            <div className="joco-issue-form-actions">
              <button
                className="btn-primary joco-issue-submit-confirm"
                disabled={issueSubmitting || !issueTitle.trim()}
                onClick={submitIssue}
              >
                {issueSubmitting ? 'Submitting…' : 'Submit Issue'}
              </button>
              <button
                className="toggle-add joco-issue-cancel"
                onClick={() => { setShowIssueForm(false); setIssueError(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <div className="joco-issue-list">
            {issues.map(issue => {
              const issueTotal = issue.votes_for + issue.votes_against;
              const issueForPct = issueTotal > 0 ? (issue.votes_for / issueTotal) * 100 : 0;
              const issueAgainstPct = issueTotal > 0 ? (issue.votes_against / issueTotal) * 100 : 0;
              const myIssueVote = issueVotes[issue.id] || null;

              return (
                <div key={issue.id} className="joco-issue-card">
                  <div className="joco-issue-card-header">
                    <span className="joco-issue-category-tag">{issue.category}</span>
                    <span className="joco-issue-time">{timeAgo(issue.created_at)}</span>
                  </div>
                  <p className="joco-issue-card-title">{issue.title}</p>
                  {issue.description && (
                    <p className="joco-issue-card-desc">{issue.description}</p>
                  )}
                  <p className="joco-issue-card-by">Submitted by {issue.submitted_by}</p>

                  <div className="joco-poll-buttons">
                    <button
                      className={`joco-poll-btn for ${myIssueVote === 'for' ? 'selected' : ''}`}
                      onClick={() => castIssueVote(issue, 'for')}
                      disabled={voteBusy === issue.id}
                    >
                      <span className="joco-poll-btn-icon">👍</span>
                      <span className="joco-poll-btn-label">For ({issue.votes_for})</span>
                    </button>
                    <button
                      className={`joco-poll-btn against ${myIssueVote === 'against' ? 'selected' : ''}`}
                      onClick={() => castIssueVote(issue, 'against')}
                      disabled={voteBusy === issue.id}
                    >
                      <span className="joco-poll-btn-icon">👎</span>
                      <span className="joco-poll-btn-label">Against ({issue.votes_against})</span>
                    </button>
                  </div>

                  {issueTotal > 0 && (
                    <div className="joco-poll-progress">
                      <div className="joco-poll-bar">
                        <div className="joco-poll-fill for" style={{ width: `${issueForPct}%` }} />
                        <div className="joco-poll-fill against" style={{ width: `${issueAgainstPct}%` }} />
                      </div>
                      <div className="joco-poll-counts">
                        <span className="joco-poll-count for">
                          <span className="joco-poll-count-num">{issue.votes_for}</span> For
                        </span>
                        <span className="joco-poll-total">{issueTotal} votes</span>
                        <span className="joco-poll-count against">
                          <span className="joco-poll-count-num">{issue.votes_against}</span> Against
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
}
