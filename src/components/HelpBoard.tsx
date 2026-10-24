import * as React from 'react';
import { supabase, type HelpRequest, type VolunteerSignup } from '../supabaseClient';
import { JOCO_TOWNS } from '../joco';

const CATEGORIES = [
  'Community Events',
  'Food & Supplies',
  'Transportation',
  'Shelter',
  'Volunteers Needed',
  'Other',
];

const HELP_ROLES = [
  'Run games',
  'Guide families along Main Street',
  'Staff the petting zoo',
  'Hand out candy in Town Square',
  'Wherever is needed most',
];

const TIME_SLOTS = [
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
];

const URGENCY_LABELS: Record<string, string> = {
  low: 'Low priority',
  medium: 'Medium',
  high: 'High priority',
};

const URGENCY_COLORS: Record<string, string> = {
  low: 'var(--success)',
  medium: 'var(--accent)',
  high: 'var(--error)',
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

export default function HelpBoard({ profileName }: { profileName: string }) {
  const [requests, setRequests] = React.useState<HelpRequest[]>([]);
  const [signups, setSignups] = React.useState<VolunteerSignup[]>([]);
  const [expandedSignupReq, setExpandedSignupReq] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'request' | 'offer'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [name, setName] = React.useState(profileName || '');
  const [type, setType] = React.useState<'request' | 'offer'>('request');
  const [category, setCategory] = React.useState('Community Events');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [urgency, setUrgency] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [volunteersTarget, setVolunteersTarget] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [volunteerFormReq, setVolunteerFormReq] = React.useState<string | null>(null);
  const [volName, setVolName] = React.useState(profileName || '');
  const [volShiftStart, setVolShiftStart] = React.useState('');
  const [volShiftEnd, setVolShiftEnd] = React.useState('');
  const [volContactPhone, setVolContactPhone] = React.useState('');
  const [volHelpRole, setVolHelpRole] = React.useState(HELP_ROLES[0]);
  const [volSubmitting, setVolSubmitting] = React.useState(false);
  const [volError, setVolError] = React.useState<string | null>(null);
  const [showAllRequests, setShowAllRequests] = React.useState(false);

  const fetchRequests = React.useCallback(async () => {
    try {
      const [reqRes, signupRes] = await Promise.all([
        supabase
          .from('help_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('volunteer_signups')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200),
      ]);
      if (reqRes.error) throw reqRes.error;
      if (signupRes.error) throw signupRes.error;
      setRequests((reqRes.data as HelpRequest[]) || []);
      setSignups((signupRes.data as VolunteerSignup[]) || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load the help board.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  React.useEffect(() => {
    if (profileName) {
      setName(profileName);
      setVolName(profileName);
    }
  }, [profileName]);

  const toggleStatus = async (req: HelpRequest) => {
    const newStatus = req.status === 'open' ? 'fulfilled' : 'open';
    setRequests(prev =>
      prev.map(r => (r.id === req.id ? { ...r, status: newStatus } : r)),
    );
    try {
      const { error: updErr } = await supabase
        .from('help_requests')
        .update({ status: newStatus })
        .eq('id', req.id);
      if (updErr) throw updErr;
    } catch {
      setRequests(prev =>
        prev.map(r => (r.id === req.id ? { ...r, status: req.status } : r)),
      );
    }
  };

  const submitVolunteerSignup = async (req: HelpRequest) => {
    if (!volName.trim() || !volHelpRole.trim()) {
      setVolError('Please enter your name and pick what you want to help with.');
      return;
    }
    setVolSubmitting(true);
    setVolError(null);
    const current = req.volunteers_count || 0;
    const target = req.volunteers_target || 0;
    if (current >= target) {
      setVolError('Volunteer goal has already been reached.');
      setVolSubmitting(false);
      return;
    }
    const newCount = current + 1;
    setRequests(prev =>
      prev.map(r => (r.id === req.id ? { ...r, volunteers_count: newCount } : r)),
    );
    try {
      const { data: signupData, error: signupErr } = await supabase
        .from('volunteer_signups')
        .insert({
          request_id: req.id,
          volunteer_name: volName.trim(),
          hours: volHours.trim() ? parseFloat(volHours) : null,
          what_done: volWhatDone.trim(),
          verified_by: volVerifiedBy.trim() || null,
        })
        .select()
        .single();
      if (signupErr) throw signupErr;
      if (signupData) {
        setSignups(prev => [signupData as VolunteerSignup, ...prev]);
      }
      const { error: updErr } = await supabase
        .from('help_requests')
        .update({ volunteers_count: newCount })
        .eq('id', req.id);
      if (updErr) throw updErr;
      setVolunteerFormReq(null);
      setVolShiftStart('');
      setVolShiftEnd('');
      setVolContactPhone('');
      setVolHelpRole(HELP_ROLES[0]);
    } catch {
      setRequests(prev =>
        prev.map(r => (r.id === req.id ? { ...r, volunteers_count: current } : r)),
      );
      setVolError('Could not submit your hours. Please try again.');
    } finally {
      setVolSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: insErr } = await supabase
        .from('help_requests')
        .insert({
          type,
          category,
          title: title.trim(),
          description: description.trim(),
          contact_name: name.trim() || 'Neighbor',
          location: location.trim(),
          urgency,
          status: 'open',
          ...(volunteersTarget.trim() ? { volunteers_target: parseInt(volunteersTarget) || null } : {}),
        })
        .select()
        .single();
      if (insErr) throw insErr;
      setRequests(prev => [data as HelpRequest, ...prev]);
      setShowForm(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setUrgency('medium');
      setVolunteersTarget('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    const aPinned = a.title.startsWith('Trick-or-Treat Main Street') ? 1 : 0;
    const bPinned = b.title.startsWith('Trick-or-Treat Main Street') ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return 0;
  });

  const openCount = requests.filter(r => r.status === 'open' && r.type === 'request').length;
  const offerCount = requests.filter(r => r.status === 'open' && r.type === 'offer').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;

  return (
    <div className="help-board-card">
      <div className="help-board-header">
        <span className="help-board-icon">🆘</span>
        <div className="help-board-title-area">
          <span className="help-board-eyebrow">County Help Board · District 13</span>
          <h3>Neighbors Helping Neighbors</h3>
          <p className="help-board-subtitle">
            Post a request for help or offer to help a neighbor. From community events to everyday needs — we rise together.
          </p>
        </div>
      </div>

      <div className="help-board-stats">
        <span className="help-stat help-stat-request">{openCount} open requests</span>
        <span className="help-stat help-stat-offer">{offerCount} offers</span>
        <span className="help-stat help-stat-fulfilled">{fulfilledCount} fulfilled</span>
      </div>

      <div className="help-board-filters">
        <div className="help-filter-group">
          <button className={`help-filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`help-filter-chip ${filter === 'request' ? 'active' : ''}`} onClick={() => setFilter('request')}>Requests</button>
          <button className={`help-filter-chip ${filter === 'offer' ? 'active' : ''}`} onClick={() => setFilter('offer')}>Offers</button>
        </div>
        <select
          className="select-input help-filter-category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="county-challenge-card loading">
          <div className="county-challenge-pulse" />
          <p className="county-challenge-loading-text">Loading the help board…</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="help-board-empty">No posts match your filters yet.</p>
      ) : (
        <div className="help-board-list">
          {(showAllRequests ? filtered : filtered.slice(0, 1)).map(r => (
            <div
              key={r.id}
              className={`help-request-item ${r.status === 'fulfilled' ? 'fulfilled' : ''}`}
            >
              <div className="help-request-header">
                <span className={`help-request-type-badge ${r.type}`}>
                  {r.type === 'request' ? '🆘 Request' : '🤝 Offer'}
                </span>
                <span className="help-request-category">{r.category}</span>
                {r.status === 'open' && (
                  <span
                    className="help-request-urgency"
                    style={{ color: URGENCY_COLORS[r.urgency] }}
                  >
                    {URGENCY_LABELS[r.urgency]}
                  </span>
                )}
                {r.status === 'fulfilled' && (
                  <span className="help-request-fulfilled-badge">✓ Fulfilled</span>
                )}
              </div>
              <h4 className="help-request-title">
                {r.title.startsWith('Trick-or-Treat Main Street') ? (
                  <a
                    href="https://www.downtownclayton.org/962/Main-Street-Trick-or-Treat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="help-request-title-link"
                  >
                    {r.title}
                  </a>
                ) : (
                  r.title
                )}
              </h4>
              {r.description && <p className="help-request-desc">{r.description}</p>}
              <div className="help-request-meta">
                <span className="help-request-author">
                  <span className="county-challenge-feed-avatar">
                    {r.contact_name.charAt(0).toUpperCase()}
                  </span>
                  {r.contact_name}
                </span>
                {r.location && <span className="help-request-loc">📍 {r.location}</span>}
                <span className="help-request-time"> · {timeAgo(r.created_at)}</span>
              </div>

              {r.volunteers_target && r.volunteers_target > 0 && r.status === 'open' && (
                <div className="volunteer-progress-section">
                  <div className="volunteer-progress-bar">
                    <div
                      className="volunteer-progress-fill"
                      style={{ width: `${Math.min(100, ((r.volunteers_count || 0) / r.volunteers_target) * 100)}%` }}
                    />
                  </div>
                  <div className="volunteer-progress-stats">
                    <span className="volunteer-progress-count">
                      {r.volunteers_count || 0} / {r.volunteers_target} volunteers
                    </span>
                    <span className="volunteer-progress-pct">
                      {Math.round(((r.volunteers_count || 0) / r.volunteers_target) * 100)}%
                    </span>
                  </div>
                  {(r.volunteers_count || 0) < r.volunteers_target ? (
                    volunteerFormReq === r.id ? (
                      <div className="volunteer-signup-form">
                        <label className="field-label">Your name</label>
                        <input
                          className="text-input"
                          placeholder="Your name"
                          value={volName}
                          onChange={e => setVolName(e.target.value)}
                          maxLength={80}
                        />
                        <div className="county-challenge-form-row">
                          <div className="county-challenge-field" style={{ maxWidth: '160px' }}>
                            <label className="field-label">Available from</label>
                            <select
                              className="select-input"
                              value={volShiftStart}
                              onChange={e => setVolShiftStart(e.target.value)}
                            >
                              <option value="">Pick a time</option>
                              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="county-challenge-field" style={{ maxWidth: '160px' }}>
                            <label className="field-label">Available until</label>
                            <select
                              className="select-input"
                              value={volShiftEnd}
                              onChange={e => setVolShiftEnd(e.target.value)}
                            >
                              <option value="">Pick a time</option>
                              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <label className="field-label">Contact (phone number)</label>
                        <input
                          className="text-input"
                          type="tel"
                          placeholder="(919) 555-0123"
                          value={volContactPhone}
                          onChange={e => setVolContactPhone(e.target.value)}
                          maxLength={20}
                        />
                        <label className="field-label">What do you want to help with?</label>
                        <select
                          className="select-input"
                          value={volHelpRole}
                          onChange={e => setVolHelpRole(e.target.value)}
                        >
                          {HELP_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {volError && <p className="county-challenge-error">{volError}</p>}
                        <div className="county-challenge-form-actions">
                          <button
                            className="btn-primary"
                            disabled={volSubmitting}
                            onClick={() => submitVolunteerSignup(r)}
                          >
                            {volSubmitting ? 'Submitting…' : 'Sign up to volunteer'}
                          </button>
                          <button
                            className="toggle-add county-challenge-cancel"
                            onClick={() => { setVolunteerFormReq(null); setVolError(null); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn-primary volunteer-signup-btn"
                        onClick={() => {
                          setVolunteerFormReq(r.id);
                          setVolName(profileName || '');
                          setVolError(null);
                        }}
                      >
                        ✋ I'll volunteer
                      </button>
                    )
                  ) : (
                    <span className="volunteer-complete-badge">🎉 Volunteer goal reached!</span>
                  )}

                  {(() => {
                    const reqSignups = signups.filter(s => s.request_id === r.id);
                    if (reqSignups.length === 0) return null;
                    const showAll = expandedSignupReq === r.id;
                    const visible = showAll ? reqSignups : reqSignups.slice(0, 1);
                    return (
                      <div className="county-challenge-feed volunteer-signup-feed">
                        <h4 className="county-challenge-feed-title">Recent volunteers</h4>
                        {visible.map(s => (
                          <div key={s.id} className="county-challenge-feed-item">
                            <span className="county-challenge-feed-avatar">
                              {(s.volunteer_name || '?').charAt(0).toUpperCase()}
                            </span>
                            <div className="county-challenge-feed-body">
                              <span className="county-challenge-feed-name">{s.volunteer_name || 'Neighbor'}</span>
                              <span className="county-challenge-feed-time"> · {timeAgo(s.created_at)}</span>
                              {s.help_role && (
                                <span className="county-challenge-feed-detail">{s.help_role}</span>
                              )}
                              {((s.shift_start && s.shift_end) || s.contact_phone) && (
                                <span className="county-challenge-feed-meta">
                                  {s.shift_start && s.shift_end && `${s.shift_start} – ${s.shift_end}`}
                                  {s.shift_start && s.shift_end && s.contact_phone && ' · '}
                                  {s.contact_phone && `📞 ${s.contact_phone}`}
                                </span>
                              )}
                            </div>
                            <span className="county-challenge-feed-amount">✋</span>
                          </div>
                        ))}
                        {reqSignups.length > 1 && (
                          <button
                            className="county-challenge-feed-toggle"
                            onClick={() => setExpandedSignupReq(showAll ? null : r.id)}
                          >
                            {showAll ? 'Show less' : `See all ${reqSignups.length} volunteers`}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              <button
                className="help-request-toggle-btn"
                onClick={() => toggleStatus(r)}
              >
                {r.status === 'open' ? 'Mark as fulfilled' : 'Reopen'}
              </button>
            </div>
          ))}
          {filtered.length > 1 && (
            <button
              className="county-challenge-feed-toggle"
              style={{ margin: '0.75rem auto 0' }}
              onClick={() => setShowAllRequests(s => !s)}
            >
              {showAllRequests ? 'Show less' : `Show all ${filtered.length} posts`}
            </button>
          )}
        </div>
      )}

      {!showForm ? (
        <button className="btn-primary help-board-cta" onClick={() => setShowForm(true)}>
          {filter === 'offer' ? '➕ Post an offer to help' : '➕ Ask for help'}
        </button>
      ) : (
        <div className="help-board-form">
          <div className="help-board-form-type">
            <button
              className={`help-type-toggle ${type === 'request' ? 'active' : ''}`}
              onClick={() => setType('request')}
            >I need help</button>
            <button
              className={`help-type-toggle ${type === 'offer' ? 'active' : ''}`}
              onClick={() => setType('offer')}
            >I can help</button>
          </div>

          <div className="county-challenge-form-row">
            <div className="county-challenge-field">
              <label className="field-label">Your name</label>
              <input
                className="text-input"
                placeholder="How neighbors can reach you"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="county-challenge-field" style={{ maxWidth: '140px' }}>
              <label className="field-label">Urgency</label>
              <select
                className="select-input"
                value={urgency}
                onChange={e => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="county-challenge-form-row">
            <div className="county-challenge-field">
              <label className="field-label">Category</label>
              <select
                className="select-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="county-challenge-field">
              <label className="field-label">Location (optional)</label>
              <input
                className="text-input"
                placeholder="Town or area, e.g. Clayton"
                value={location}
                onChange={e => setLocation(e.target.value)}
                maxLength={80}
              />
            </div>
          </div>

          <label className="field-label">Title</label>
          <input
            className="text-input"
            placeholder={type === 'request' ? 'e.g. Need help clearing fallen branches' : 'e.g. Can deliver supplies to Benson'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
          />

          <label className="field-label">Details</label>
          <textarea
            className="text-area"
            placeholder={type === 'request'
              ? 'Describe what you need, how many people, and any other relevant info...'
              : 'Describe what you can offer, when you are available, and areas you can reach...'}
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
          />

          <div className="county-challenge-field" style={{ maxWidth: '200px' }}>
            <label className="field-label">Volunteers needed (optional)</label>
            <input
              className="text-input"
              type="number"
              min="1"
              max="999"
              placeholder="e.g. 50"
              value={volunteersTarget}
              onChange={e => setVolunteersTarget(e.target.value)}
            />
          </div>

          {error && <p className="county-challenge-error">{error}</p>}

          <div className="county-challenge-form-actions">
            <button
              className="btn-primary"
              disabled={submitting || !title.trim()}
              onClick={handleSubmit}
            >
              {submitting ? 'Posting…' : 'Post to help board'}
            </button>
            <button className="toggle-add county-challenge-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <p className="county-challenge-towns" style={{ marginTop: '1rem' }}>
        Serving neighbors in {JOCO_TOWNS.join(', ')} and all of Johnston County.
      </p>
    </div>
  );
}
