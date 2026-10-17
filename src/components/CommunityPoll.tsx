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

function getVoterId(): string {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

export function CommunityPoll() {
  const [forCount, setForCount] = React.useState(0);
  const [againstCount, setAgainstCount] = React.useState(0);
  const [myChoice, setMyChoice] = React.useState<Choice | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const voterId = React.useRef(getVoterId());

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

  React.useEffect(() => {
    load();
    const channel = supabase
      .channel('poll-votes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_poll_votes', filter: `poll_id=eq.${POLL_ID}` },
        () => load()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const castVote = async (choice: Choice) => {
    if (busy || myChoice === choice) return;
    setBusy(true);
    setError(null);
    try {
      const { error: upErr } = await supabase
        .from('community_poll_votes')
        .upsert(
          { poll_id: POLL_ID, choice, voter_id: voterId.current },
          { onConflict: 'poll_id,voter_id' }
        );
      if (upErr) throw upErr;
      setMyChoice(choice);
      await load();
    } catch {
      setError('Could not save your vote. Please try again.');
    } finally {
      setBusy(false);
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
        </div>
        <a
          className="joco-poll-question"
          href="/Johnston-20261103-SAMPLE-E-0001_B.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Open the sample ballot PDF"
        >
          {POLL_QUESTION}
        </a>

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
    </li>
  );
}
